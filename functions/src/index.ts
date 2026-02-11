import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const FREE_DAILY_LIMIT = 5;

//eslint-disable-next-line
interface DailyCount {
  date: string;
  count: number;
}

/** Get today's date in IST (UTC+5:30) as YYYY-MM-DD */
function getTodayIST(): string {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

/**
 * Callable Cloud Function: proxies Gemini API requests.
 *
 * - Validates Firebase Auth token (automatic with onCall)
 * - Enforces server-side daily message limit for free users
 * - Keeps the Gemini API key on the server only
 */
export const callGemini = onCall(
  { secrets: [geminiApiKey], region: "asia-south1" },
  async (request) => {
    // 1. Auth check — onCall provides request.auth automatically
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }

    const uid = request.auth.uid;
    const { contents, systemInstruction, safetySettings } = request.data;

    if (!contents || !Array.isArray(contents)) {
      throw new HttpsError("invalid-argument", "Missing contents array.");
    }

    // 2. Server-side rate limiting for free users
    const userDoc = getFirestore().collection("users").doc(uid);
    const userSnap = await userDoc.get();
    const userData = userSnap.data() ?? {};

    const isPremium =
      userData.subscriptionTier === "premium" || userData.isPremium === true;

    let todayCount = 0;

    if (!isPremium) {
      const daily: DailyCount = userData.dailyMessageCount ?? {
        date: getTodayIST(),
        count: 0,
      };

      // Reset if it's a new day
      todayCount = daily.date === getTodayIST() ? daily.count : 0;

      if (todayCount >= FREE_DAILY_LIMIT) {
        throw new HttpsError(
          "resource-exhausted",
          "Daily message limit reached."
        );
      }
    }

    // 3. Proxy to Gemini
    const apiKey = geminiApiKey.value();
    const url = `${GEMINI_URL}?key=${apiKey}`;

    const body: Record<string, unknown> = { contents };
    if (systemInstruction) {
      body.systemInstruction = systemInstruction;
    }
    if (safetySettings) {
      body.safetySettings = safetySettings;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message =
        errorData.error?.message ?? `Gemini API error: ${response.status}`;
      throw new HttpsError("internal", message);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // 4. Increment count only after successful Gemini response
    if (!isPremium) {
      await userDoc.set(
        {
          dailyMessageCount: {
            date: getTodayIST(),
            count: todayCount + 1,
          },
        },
        { merge: true }
      );
    }

    return { message: text };
  }
);

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https';

initializeApp();

const geminiApiKey = defineSecret('GEMINI_API_KEY');
const revenueCatWebhookSecret = defineSecret('REVENUECAT_WEBHOOK_SECRET');

const GEMINI_MODEL = 'gemini-2.5-flash';
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
  { secrets: [geminiApiKey], region: 'asia-south1' },
  async (request) => {
    // 1. Auth check — onCall provides request.auth automatically
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'You must be signed in.');
    }

    const uid = request.auth.uid;
    const { contents, systemInstruction, safetySettings } = request.data;

    if (!contents || !Array.isArray(contents)) {
      throw new HttpsError('invalid-argument', 'Missing contents array.');
    }

    // 2. Server-side rate limiting for free users
    const userDoc = getFirestore().collection('users').doc(uid);
    const userSnap = await userDoc.get();
    const userData = userSnap.data() ?? {};

    const isPremium = userData.subscriptionTier === 'premium' || userData.isPremium === true;

    let todayCount = 0;

    if (!isPremium) {
      const daily: DailyCount = userData.dailyMessageCount ?? {
        date: getTodayIST(),
        count: 0,
      };

      // Reset if it's a new day
      todayCount = daily.date === getTodayIST() ? daily.count : 0;

      if (todayCount >= FREE_DAILY_LIMIT) {
        throw new HttpsError('resource-exhausted', 'Daily message limit reached.');
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.error?.message ?? `Gemini API error: ${response.status}`;
      throw new HttpsError('internal', message);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

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

/** Events that mean the user has an active premium subscription */
const PREMIUM_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'SUBSCRIPTION_EXTENDED',
]);

/** Events that mean the user no longer has premium */
const FREE_EVENTS = new Set(['EXPIRATION', 'CANCELLATION', 'BILLING_ISSUE']);

/**
 * HTTP Cloud Function: receives RevenueCat webhook events.
 *
 * - Verifies the authorization header matches our secret
 * - Updates isPremium and subscriptionTier in Firestore
 * - Only Cloud Functions (admin SDK) can write these fields
 */
export const revenueCatWebhook = onRequest(
  { secrets: [revenueCatWebhookSecret], region: 'asia-south1' },
  async (req, res) => {
    // Only accept POST
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed');
      return;
    }

    // Verify authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${revenueCatWebhookSecret.value()}`) {
      res.status(401).send('Unauthorized');
      return;
    }

    const event = req.body?.event;
    if (!event) {
      res.status(400).send('Missing event');
      return;
    }

    const eventType: string = event.type;
    const appUserId: string | undefined = event.app_user_id;

    if (!appUserId || appUserId.startsWith('$RCAnonymousID:')) {
      // Skip anonymous users — can't map to Firestore doc
      res.status(200).send('OK');
      return;
    }

    const userDoc = getFirestore().collection('users').doc(appUserId);

    if (PREMIUM_EVENTS.has(eventType)) {
      await userDoc.set({ isPremium: true, subscriptionTier: 'premium' }, { merge: true });
    } else if (FREE_EVENTS.has(eventType)) {
      await userDoc.set({ isPremium: false, subscriptionTier: 'free' }, { merge: true });
    }

    res.status(200).send('OK');
  }
);

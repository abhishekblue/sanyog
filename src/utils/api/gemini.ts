import functions from '@react-native-firebase/functions';

import { IGeminiRequestBody, IGeminiResponse } from '../api.types';

const callable = functions().httpsCallable('callGemini');

export async function callGemini(body: IGeminiRequestBody): Promise<IGeminiResponse> {
  try {
    const result = await callable({
      contents: body.contents,
      systemInstruction: body.systemInstruction,
    });

    const data = result.data as { message: string };
    return {
      candidates: [
        {
          content: {
            parts: [{ text: data.message }],
            role: 'model',
          },
        },
      ],
    };
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    return {
      error: {
        message: firebaseError.message || 'Cloud Function error',
        code: firebaseError.code === 'functions/resource-exhausted' ? 429 : 500,
      },
    };
  }
}

import Constants from 'expo-constants';

import { IGeminiRequestBody, IGeminiResponse } from '../api.types';

const MODEL = 'gemini-2.5-flash';

function getApiKey(): string {
  return Constants.expoConfig?.extra?.geminiApiKey || '';
}

function getApiUrl(apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
}

export { getApiKey, getApiUrl };

export async function callGemini(body: IGeminiRequestBody): Promise<IGeminiResponse> {
  const apiKey = getApiKey();

  const response = await fetch(getApiUrl(apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      error: {
        message: errorData.error?.message || `API error: ${response.status}`,
        code: response.status,
      },
    };
  }

  return response.json();
}

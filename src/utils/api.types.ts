import { IBasicInfo, IChatMessage, IPriorityProfile } from './storage.types';

/** Context passed to the AI coach for personalized responses */
export interface ICoachContext {
  basicInfo: IBasicInfo | null;
  priorityProfile: IPriorityProfile | null;
  language: 'en' | 'hi';
}

/** Request payload for chat API */
export interface IChatRequest {
  messages: IChatMessage[];
  context: ICoachContext;
}

export type ChatErrorType = 'rateLimit' | 'network' | 'server' | 'blocked';

/** Response from chat API */
export interface IChatResponse {
  message: string;
  error?: string;
  errorType?: ChatErrorType;
}

/** Gemini API message part */
export interface IGeminiPart {
  text: string;
}

/** Gemini API message content */
export interface IGeminiContent {
  role: 'user' | 'model';
  parts: IGeminiPart[];
}

/** Gemini API safety setting */
export type GeminiHarmCategory =
  | 'HARM_CATEGORY_HARASSMENT'
  | 'HARM_CATEGORY_HATE_SPEECH'
  | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
  | 'HARM_CATEGORY_DANGEROUS_CONTENT';

export type GeminiBlockThreshold =
  | 'BLOCK_NONE'
  | 'BLOCK_LOW_AND_ABOVE'
  | 'BLOCK_MEDIUM_AND_ABOVE'
  | 'BLOCK_ONLY_HIGH';

export interface IGeminiSafetySetting {
  category: GeminiHarmCategory;
  threshold: GeminiBlockThreshold;
}

/** Gemini API request body */
export interface IGeminiRequestBody {
  contents: IGeminiContent[];
  systemInstruction: {
    parts: IGeminiPart[];
  };
  safetySettings?: IGeminiSafetySetting[];
}

/** Gemini API response candidate */
export interface IGeminiCandidate {
  content: {
    parts: IGeminiPart[];
    role: string;
  };
}

/** Gemini API response */
export interface IGeminiResponse {
  candidates?: IGeminiCandidate[];
  error?: { message: string; code: number };
}

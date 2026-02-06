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

/** Response from chat API */
export interface IChatResponse {
  message: string;
  error?: string;
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

/** Gemini API request body */
export interface IGeminiRequestBody {
  contents: IGeminiContent[];
  systemInstruction: {
    parts: IGeminiPart[];
  };
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

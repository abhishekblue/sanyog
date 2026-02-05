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

/** Claude API message format */
export interface IClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Claude API request body */
export interface IClaudeRequestBody {
  model: string;
  max_tokens: number;
  system: string;
  messages: IClaudeMessage[];
}

/** Claude API response */
export interface IClaudeResponse {
  content: { type: string; text: string }[];
  error?: { message: string };
}

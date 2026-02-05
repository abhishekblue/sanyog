import { Language } from '../locales';

/** User's basic info from onboarding */
export interface IBasicInfo {
  gender: 'male' | 'female';
  ageRange: '23-25' | '26-28' | '29-32' | '33-35' | '35+';
  isFirstMeeting: boolean;
  timeline: 'thisWeek' | 'withinMonth' | 'exploring';
}

/** User's answers for assessment - keyed by question ID */
export interface IAssessmentAnswers {
  [questionId: string]: 'A' | 'B' | 'C' | 'D';
}

/** Priority level for each dimension */
export type PriorityLevel = 'high' | 'medium' | 'flexible';

/** User's priority profile after assessment */
export interface IPriorityProfile {
  family: PriorityLevel;
  career: PriorityLevel;
  finances: PriorityLevel;
  lifestyle: PriorityLevel;
  values: PriorityLevel;
}

/** Chat message in AI Coach */
export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/** All storage data structure */
export interface IStorageData {
  language: Language;
  basicInfo: IBasicInfo | null;
  assessmentAnswers: IAssessmentAnswers;
  priorityProfile: IPriorityProfile | null;
  assessmentComplete: boolean;
  savedGuide: string[];
  chatHistory: IChatMessage[];
  isPremium: boolean;
}

/** Storage key names */
export type StorageKey = keyof IStorageData;

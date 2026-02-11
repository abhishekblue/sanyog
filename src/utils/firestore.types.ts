import { SubscriptionTier } from '../services/subscription/subscription.types';

import {
  IAssessmentAnswers,
  IBasicInfo,
  IChatMessage,
  IPriorityProfile,
  IStorageData,
} from './storage.types';

/** Type of the Firestore storage object */
export interface IFirestoreStorage {
  getLanguage: () => Promise<IStorageData['language']>;
  setLanguage: (value: IStorageData['language']) => Promise<void>;
  getBasicInfo: () => Promise<IBasicInfo | null>;
  setBasicInfo: (value: IBasicInfo | null) => Promise<void>;
  getAssessmentAnswers: () => Promise<IAssessmentAnswers>;
  setAssessmentAnswers: (value: IAssessmentAnswers) => Promise<void>;
  getPriorityProfile: () => Promise<IPriorityProfile | null>;
  setPriorityProfile: (value: IPriorityProfile | null) => Promise<void>;
  getAssessmentComplete: () => Promise<boolean>;
  setAssessmentComplete: (value: boolean) => Promise<void>;
  getSavedGuide: () => Promise<string[]>;
  setSavedGuide: (value: string[]) => Promise<void>;
  getChatHistory: () => Promise<IChatMessage[]>;
  setChatHistory: (value: IChatMessage[]) => Promise<void>;
  getIsPremium: () => Promise<boolean>;
  setIsPremium: (value: boolean) => Promise<void>;
  getSubscriptionTier: () => Promise<SubscriptionTier>;
  setSubscriptionTier: (value: SubscriptionTier) => Promise<void>;
  getGuideSummary: () => Promise<string | null>;
  setGuideSummary: (value: string | null) => Promise<void>;
  getRetakeCount: () => Promise<number>;
  setRetakeCount: (value: number) => Promise<void>;
  canSendMessage: () => Promise<boolean>;
  getRemainingMessages: () => Promise<number>;
  incrementDailyMessageCount: () => Promise<void>;
  clearAll: () => Promise<void>;
  clearAssessment: () => Promise<void>;
}

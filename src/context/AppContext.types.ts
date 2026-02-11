import { Language } from '../locales';
import { SubscriptionTier } from '../services/subscription/subscription.types';
import { ITranslator } from '../utils/i18n.types';
import {
  IAssessmentAnswers,
  IBasicInfo,
  IChatMessage,
  IPriorityProfile,
} from '../utils/storage.types';

import { IAppActions } from './actions/app.actions';
import { IChatActions } from './actions/chat.actions';
import { IProfileActions } from './actions/profile.actions';
import { ISubscriptionActions } from './actions/subscription.actions';

export interface IAppState
  extends IAppActions, IChatActions, IProfileActions, ISubscriptionActions {
  isLoading: boolean;
  language: Language;
  translator: ITranslator;
  basicInfo: IBasicInfo | null;
  assessmentAnswers: IAssessmentAnswers;
  assessmentComplete: boolean;
  priorityProfile: IPriorityProfile | null;
  chatHistory: IChatMessage[];
  isPremium: boolean;
  subscriptionTier: SubscriptionTier;
  guideSummary: string | null;
  retakeCount: number;
  canSendMessage: () => Promise<boolean>;
  getRemainingMessages: () => Promise<number>;
  incrementDailyMessageCount: () => Promise<void>;
}

export interface IAppProviderProps {
  children: React.ReactNode;
}

/**
 * Global app state context
 * Manages language, user info, assessment data, and priority profile
 * Action logic lives in context/actions/
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Language } from '../locales';
import { createTranslator } from '../utils/i18n';
import { ITranslator } from '../utils/i18n.types';
import { storage } from '../utils/storage';
import {
  IAssessmentAnswers,
  IBasicInfo,
  IChatMessage,
  IPriorityProfile,
} from '../utils/storage.types';

import { createAppActions, IAppActions } from './actions/app.actions';
import { createChatActions, IChatActions } from './actions/chat.actions';
import { createProfileActions, IProfileActions } from './actions/profile.actions';

/** App context state */
interface IAppState extends IAppActions, IChatActions, IProfileActions {
  isLoading: boolean;
  language: Language;
  translator: ITranslator;
  basicInfo: IBasicInfo | null;
  assessmentAnswers: IAssessmentAnswers;
  assessmentComplete: boolean;
  priorityProfile: IPriorityProfile | null;
  chatHistory: IChatMessage[];
  isPremium: boolean;
  guideSummary: string | null;
  retakeCount: number;
}

const AppContext = createContext<IAppState | undefined>(undefined);

interface IAppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: IAppProviderProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>('en');
  const [basicInfo, setBasicInfoState] = useState<IBasicInfo | null>(null);
  const [assessmentAnswers, setAssessmentAnswersState] = useState<IAssessmentAnswers>({});
  const [assessmentComplete, setAssessmentCompleteState] = useState(false);
  const [priorityProfile, setPriorityProfileState] = useState<IPriorityProfile | null>(null);
  const [chatHistory, setChatHistoryState] = useState<IChatMessage[]>([]);
  const [isPremium, setIsPremiumState] = useState(false);
  const [guideSummary, setGuideSummaryState] = useState<string | null>(null);
  const [retakeCount, setRetakeCountState] = useState(0);

  const translator = createTranslator(language);

  // Load data from storage on mount
  useEffect(() => {
    async function loadData(): Promise<void> {
      try {
        const [
          storedLanguage,
          storedBasicInfo,
          storedAnswers,
          storedComplete,
          storedProfile,
          storedChat,
          storedPremium,
          storedSummary,
          storedRetakeCount,
        ] = await Promise.all([
          storage.getLanguage(),
          storage.getBasicInfo(),
          storage.getAssessmentAnswers(),
          storage.getAssessmentComplete(),
          storage.getPriorityProfile(),
          storage.getChatHistory(),
          storage.getIsPremium(),
          storage.getGuideSummary(),
          storage.getRetakeCount(),
        ]);

        setLanguageState(storedLanguage);
        setBasicInfoState(storedBasicInfo);
        setAssessmentAnswersState(storedAnswers);
        setAssessmentCompleteState(storedComplete);
        setPriorityProfileState(storedProfile);
        setChatHistoryState(storedChat);
        setIsPremiumState(storedPremium);
        setGuideSummaryState(storedSummary);
        setRetakeCountState(storedRetakeCount);
      } catch (error) {
        console.error('Error loading app data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Create actions (memoized to avoid recreating on every render)
  const appActions = useMemo(
    () =>
      createAppActions({
        setLanguageState,
        setBasicInfoState,
        setAssessmentAnswersState,
        setAssessmentCompleteState,
        setPriorityProfileState,
        setChatHistoryState,
        setGuideSummaryState,
      }),
    []
  );

  const chatActions = useMemo(
    () => createChatActions({ setChatHistoryState, setGuideSummaryState }),
    []
  );

  const profileActions = useMemo(
    () =>
      createProfileActions({
        setBasicInfoState,
        setAssessmentAnswersState,
        setAssessmentCompleteState,
        setPriorityProfileState,
        setRetakeCountState,
      }),
    []
  );

  const value: IAppState = {
    isLoading,
    language,
    translator,
    basicInfo,
    assessmentAnswers,
    assessmentComplete,
    priorityProfile,
    chatHistory,
    isPremium,
    guideSummary,
    retakeCount,
    ...appActions,
    ...chatActions,
    ...profileActions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to access app context
 * @throws Error if used outside AppProvider
 */
export function useApp(): IAppState {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
}

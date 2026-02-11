/**
 * Global app state context
 * Manages language, user info, assessment data, and priority profile
 * Uses Firestore for persistence when user is authenticated
 * Action logic lives in context/actions/
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Language } from '../locales';
import { createFirestoreStorage, loadAllUserData } from '../utils/firestore';
import { IFirestoreStorage } from '../utils/firestore.types';
import { createTranslator } from '../utils/i18n';
import { ITranslator } from '../utils/i18n.types';
import {
  IAssessmentAnswers,
  IBasicInfo,
  IChatMessage,
  IPriorityProfile,
} from '../utils/storage.types';

import { createAppActions, IAppActions } from './actions/app.actions';
import { createChatActions, IChatActions } from './actions/chat.actions';
import { createProfileActions, IProfileActions } from './actions/profile.actions';
import { useAuth } from './AuthContext';

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
  canSendMessage: () => Promise<boolean>;
  getRemainingMessages: () => Promise<number>;
  incrementDailyMessageCount: () => Promise<void>;
}

const AppContext = createContext<IAppState | undefined>(undefined);

interface IAppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: IAppProviderProps): React.JSX.Element {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

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

  // Create Firestore storage instance tied to the user
  const firestoreStorage: IFirestoreStorage | null = useMemo(
    () => (uid ? createFirestoreStorage(uid) : null),
    [uid]
  );

  // Load data from Firestore when user logs in
  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      return;
    }

    async function loadData(): Promise<void> {
      setIsLoading(true);
      try {
        const data = await loadAllUserData(uid as string);

        setLanguageState(data.language);
        setBasicInfoState(data.basicInfo);
        setAssessmentAnswersState(data.assessmentAnswers);
        setAssessmentCompleteState(data.assessmentComplete);
        setPriorityProfileState(data.priorityProfile);
        setChatHistoryState(data.chatHistory);
        setIsPremiumState(data.isPremium);
        setGuideSummaryState(data.guideSummary);
        setRetakeCountState(data.retakeCount);
      } catch (error) {
        console.error('Error loading app data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [uid]);

  // Create actions (memoized, pass Firestore storage)
  const appActions = useMemo(
    () =>
      createAppActions(
        {
          setLanguageState,
          setBasicInfoState,
          setAssessmentAnswersState,
          setAssessmentCompleteState,
          setPriorityProfileState,
          setChatHistoryState,
          setGuideSummaryState,
        },
        firestoreStorage
      ),
    [firestoreStorage]
  );

  const chatActions = useMemo(
    () => createChatActions({ setChatHistoryState, setGuideSummaryState }, firestoreStorage),
    [firestoreStorage]
  );

  const profileActions = useMemo(
    () =>
      createProfileActions(
        {
          setBasicInfoState,
          setAssessmentAnswersState,
          setAssessmentCompleteState,
          setPriorityProfileState,
          setRetakeCountState,
        },
        firestoreStorage
      ),
    [firestoreStorage]
  );

  // Daily message limit functions
  const canSendMessage = useMemo(
    () => (firestoreStorage ? firestoreStorage.canSendMessage : async () => true),
    [firestoreStorage]
  );

  const getRemainingMessages = useMemo(
    () => (firestoreStorage ? firestoreStorage.getRemainingMessages : async () => 7),
    [firestoreStorage]
  );

  const incrementDailyMessageCount = useMemo(
    () => (firestoreStorage ? firestoreStorage.incrementDailyMessageCount : async () => {}),
    [firestoreStorage]
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
    canSendMessage,
    getRemainingMessages,
    incrementDailyMessageCount,
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

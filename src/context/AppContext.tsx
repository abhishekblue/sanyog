/**
 * Global app state context
 * Manages language, user info, assessment data, and priority profile
 * Uses Firestore for persistence when user is authenticated
 * Action logic lives in context/actions/
 */

import auth from '@react-native-firebase/auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Language } from '../locales';
import { initializeSubscriptions } from '../services/subscription/subscription';
import { SubscriptionTier } from '../services/subscription/subscription.types';
import { checkAndExecuteDeletion } from '../utils/account-deletion';
import { createFirestoreStorage, loadAllUserData } from '../utils/firestore';
import { IFirestoreStorage } from '../utils/firestore.types';
import { createTranslator } from '../utils/i18n';
import { requestNotificationPermission } from '../utils/permissions';
import {
  IAssessmentAnswers,
  IBasicInfo,
  IChatMessage,
  IPriorityProfile,
} from '../utils/storage.types';

import { createAppActions } from './actions/app.actions';
import { createChatActions } from './actions/chat.actions';
import { createProfileActions } from './actions/profile.actions';
import { createSubscriptionActions } from './actions/subscription.actions';
import { IAppProviderProps, IAppState } from './AppContext.types';
import { useAuth } from './AuthContext';

const AppContext = createContext<IAppState | undefined>(undefined);

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
  const [subscriptionTier, setSubscriptionTierState] = useState<SubscriptionTier>('free');
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
        // Check if account was scheduled for deletion
        const shouldDelete = await checkAndExecuteDeletion(uid as string);
        if (shouldDelete) {
          // Grace period expired — Firestore doc already deleted, now delete Auth + sign out
          await auth().currentUser?.delete();
          await auth().signOut();
          return;
        }

        const data = await loadAllUserData(uid as string);

        setLanguageState(data.language);
        setBasicInfoState(data.basicInfo);
        setAssessmentAnswersState(data.assessmentAnswers);
        setAssessmentCompleteState(data.assessmentComplete);
        setPriorityProfileState(data.priorityProfile);
        setChatHistoryState(data.chatHistory);
        setIsPremiumState(data.isPremium);
        setSubscriptionTierState(data.subscriptionTier);
        setGuideSummaryState(data.guideSummary);
        setRetakeCountState(data.retakeCount);
        await initializeSubscriptions(uid as string);
        requestNotificationPermission();
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

  const subscriptionActions = useMemo(
    () =>
      createSubscriptionActions(
        { setSubscriptionTierState, setIsPremiumState },
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
    () => (firestoreStorage ? firestoreStorage.getRemainingMessages : async () => 5),
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
    subscriptionTier,
    guideSummary,
    retakeCount,
    canSendMessage,
    getRemainingMessages,
    incrementDailyMessageCount,
    ...appActions,
    ...chatActions,
    ...profileActions,
    ...subscriptionActions,
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

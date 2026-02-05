/**
 * Global app state context
 * Manages language, user info, assessment data, and priority profile
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

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

/** App context state */
interface IAppState {
  // Loading state
  isLoading: boolean;

  // Language
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  translator: ITranslator;

  // Basic info
  basicInfo: IBasicInfo | null;
  setBasicInfo: (info: IBasicInfo) => Promise<void>;

  // Assessment
  assessmentAnswers: IAssessmentAnswers;
  setAssessmentAnswer: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => Promise<void>;
  assessmentComplete: boolean;
  setAssessmentComplete: (complete: boolean) => Promise<void>;

  // Priority profile
  priorityProfile: IPriorityProfile | null;
  setPriorityProfile: (profile: IPriorityProfile) => Promise<void>;

  // Chat history
  chatHistory: IChatMessage[];
  addChatMessage: (message: IChatMessage) => Promise<void>;
  clearChatHistory: () => Promise<void>;

  // Premium status
  isPremium: boolean;

  // Reset functions
  clearAllData: () => Promise<void>;
  clearAssessmentData: () => Promise<void>;
}

/** Create context with undefined default */
const AppContext = createContext<IAppState | undefined>(undefined);

/** Props for AppProvider */
interface IAppProviderProps {
  children: React.ReactNode;
}

/**
 * App context provider
 * Wraps the app and provides global state
 */
export function AppProvider({ children }: IAppProviderProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>('en');
  const [basicInfo, setBasicInfoState] = useState<IBasicInfo | null>(null);
  const [assessmentAnswers, setAssessmentAnswersState] = useState<IAssessmentAnswers>({});
  const [assessmentComplete, setAssessmentCompleteState] = useState(false);
  const [priorityProfile, setPriorityProfileState] = useState<IPriorityProfile | null>(null);
  const [chatHistory, setChatHistoryState] = useState<IChatMessage[]>([]);
  const [isPremium, setIsPremiumState] = useState(false);

  // Create translator based on current language
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
        ] = await Promise.all([
          storage.getLanguage(),
          storage.getBasicInfo(),
          storage.getAssessmentAnswers(),
          storage.getAssessmentComplete(),
          storage.getPriorityProfile(),
          storage.getChatHistory(),
          storage.getIsPremium(),
        ]);

        setLanguageState(storedLanguage);
        setBasicInfoState(storedBasicInfo);
        setAssessmentAnswersState(storedAnswers);
        setAssessmentCompleteState(storedComplete);
        setPriorityProfileState(storedProfile);
        setChatHistoryState(storedChat);
        setIsPremiumState(storedPremium);
      } catch (error) {
        console.error('Error loading app data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // State setters with persistence
  const setLanguage = async (lang: Language): Promise<void> => {
    setLanguageState(lang);
    await storage.setLanguage(lang);
  };

  const setBasicInfo = async (info: IBasicInfo): Promise<void> => {
    setBasicInfoState(info);
    await storage.setBasicInfo(info);
  };

  const setAssessmentAnswer = async (
    questionId: string,
    answer: 'A' | 'B' | 'C' | 'D'
  ): Promise<void> => {
    const newAnswers = { ...assessmentAnswers, [questionId]: answer };
    setAssessmentAnswersState(newAnswers);
    await storage.setAssessmentAnswers(newAnswers);
  };

  const setAssessmentComplete = async (complete: boolean): Promise<void> => {
    setAssessmentCompleteState(complete);
    await storage.setAssessmentComplete(complete);
  };

  const setPriorityProfile = async (profile: IPriorityProfile): Promise<void> => {
    setPriorityProfileState(profile);
    await storage.setPriorityProfile(profile);
  };

  const addChatMessage = async (message: IChatMessage): Promise<void> => {
    const newHistory = [...chatHistory, message];
    setChatHistoryState(newHistory);
    await storage.setChatHistory(newHistory);
  };

  const clearChatHistory = async (): Promise<void> => {
    setChatHistoryState([]);
    await storage.setChatHistory([]);
  };

  const clearAllData = async (): Promise<void> => {
    await storage.clearAll();
    setLanguageState('en');
    setBasicInfoState(null);
    setAssessmentAnswersState({});
    setAssessmentCompleteState(false);
    setPriorityProfileState(null);
    setChatHistoryState([]);
    setIsPremiumState(false);
  };

  const clearAssessmentData = async (): Promise<void> => {
    await storage.clearAssessment();
    setAssessmentAnswersState({});
    setAssessmentCompleteState(false);
    setPriorityProfileState(null);
  };

  const value: IAppState = {
    isLoading,
    language,
    setLanguage,
    translator,
    basicInfo,
    setBasicInfo,
    assessmentAnswers,
    setAssessmentAnswer,
    assessmentComplete,
    setAssessmentComplete,
    priorityProfile,
    setPriorityProfile,
    chatHistory,
    addChatMessage,
    clearChatHistory,
    isPremium,
    clearAllData,
    clearAssessmentData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to access app context
 * @returns App context state
 * @throws Error if used outside AppProvider
 */
export function useApp(): IAppState {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
}

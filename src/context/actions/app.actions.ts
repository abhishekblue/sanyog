import { Language } from '../../locales';
import { IFirestoreStorage } from '../../utils/firestore.types';
import {
  IAssessmentAnswers,
  IBasicInfo,
  IChatMessage,
  IPriorityProfile,
} from '../../utils/storage.types';

interface IAppSetters {
  setLanguageState: (lang: Language) => void;
  setBasicInfoState: (info: IBasicInfo | null) => void;
  setAssessmentAnswersState: (answers: IAssessmentAnswers) => void;
  setAssessmentCompleteState: (complete: boolean) => void;
  setPriorityProfileState: (profile: IPriorityProfile | null) => void;
  setChatHistoryState: (history: IChatMessage[]) => void;
  setGuideSummaryState: (summary: string | null) => void;
}

export interface IAppActions {
  setLanguage: (lang: Language) => Promise<void>;
  clearAllData: () => Promise<void>;
  clearAssessmentData: () => Promise<void>;
}

export function createAppActions(
  setters: IAppSetters,
  store: IFirestoreStorage | null
): IAppActions {
  const setLanguage = async (lang: Language): Promise<void> => {
    setters.setLanguageState(lang);
    await store?.setLanguage(lang);
  };

  const clearAllData = async (): Promise<void> => {
    await store?.clearAll();
    setters.setLanguageState('en');
    setters.setBasicInfoState(null);
    setters.setAssessmentAnswersState({});
    setters.setAssessmentCompleteState(false);
    setters.setPriorityProfileState(null);
    setters.setChatHistoryState([]);
    setters.setGuideSummaryState(null);
  };

  const clearAssessmentData = async (): Promise<void> => {
    await store?.clearAssessment();
    setters.setAssessmentAnswersState({});
    setters.setAssessmentCompleteState(false);
    setters.setPriorityProfileState(null);
    setters.setGuideSummaryState(null);
  };

  return { setLanguage, clearAllData, clearAssessmentData };
}

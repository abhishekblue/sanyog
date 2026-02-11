/**
 * Firestore service layer
 * All user data is stored in a single document: users/\{uid\}
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { IFirestoreStorage } from './firestore.types';
import {
  IAssessmentAnswers,
  IBasicInfo,
  IChatMessage,
  IDailyCount,
  IPriorityProfile,
  IStorageData,
  StorageKey,
} from './storage.types';

/** Default values for a new user document */
const DEFAULTS: IStorageData = {
  language: 'en',
  basicInfo: null,
  assessmentAnswers: {},
  priorityProfile: null,
  assessmentComplete: false,
  savedGuide: [],
  chatHistory: [],
  isPremium: false,
  guideSummary: null,
  retakeCount: 0,
};

/** Reference to a user's document */
function userDoc(uid: string): FirebaseFirestoreTypes.DocumentReference {
  return firestore().collection('users').doc(uid);
}

/** Get a single field from the user's document */
async function getField<K extends StorageKey>(uid: string, key: K): Promise<IStorageData[K]> {
  try {
    const doc = await userDoc(uid).get();
    if (!doc.exists) {
      return DEFAULTS[key];
    }
    const data = doc.data();
    if (data && key in data) {
      return data[key] as IStorageData[K];
    }
    return DEFAULTS[key];
  } catch (error) {
    console.error(`Firestore getField(${key}):`, error);
    return DEFAULTS[key];
  }
}

/** Set a single field on the user's document (merge) */
async function setField<K extends StorageKey>(
  uid: string,
  key: K,
  value: IStorageData[K]
): Promise<void> {
  try {
    await userDoc(uid).set({ [key]: value }, { merge: true });
  } catch (error) {
    console.error(`Firestore setField(${key}):`, error);
  }
}

/** Load all user data at once (for initial app load) */
export async function loadAllUserData(uid: string): Promise<IStorageData> {
  try {
    const doc = await userDoc(uid).get();
    if (!doc.exists) {
      return { ...DEFAULTS };
    }
    const data = doc.data() ?? {};

    // Cache daily count from Firestore → AsyncStorage
    if (data.dailyMessageCount) {
      const dc = data.dailyMessageCount as IDailyCount;
      if (dc.date === getTodayIST()) {
        await cacheDailyCount(dc);
      }
    }

    return {
      language: data.language ?? DEFAULTS.language,
      basicInfo: data.basicInfo ?? DEFAULTS.basicInfo,
      assessmentAnswers: data.assessmentAnswers ?? DEFAULTS.assessmentAnswers,
      priorityProfile: data.priorityProfile ?? DEFAULTS.priorityProfile,
      assessmentComplete: data.assessmentComplete ?? DEFAULTS.assessmentComplete,
      savedGuide: data.savedGuide ?? DEFAULTS.savedGuide,
      chatHistory: data.chatHistory ?? DEFAULTS.chatHistory,
      isPremium: data.isPremium ?? DEFAULTS.isPremium,
      guideSummary: data.guideSummary ?? DEFAULTS.guideSummary,
      retakeCount: data.retakeCount ?? DEFAULTS.retakeCount,
    };
  } catch (error) {
    console.error('Firestore loadAllUserData:', error);
    return { ...DEFAULTS };
  }
}

/** Daily message count helpers */
const DAILY_COUNT_CACHE_KEY = '@samvaad_dailyMessageCount';

function getTodayIST(): string {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

/** Read daily count from AsyncStorage (local, no network) */
async function getCachedDailyCount(): Promise<IDailyCount> {
  try {
    const raw = await AsyncStorage.getItem(DAILY_COUNT_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as IDailyCount;
      if (parsed.date === getTodayIST()) return parsed;
    }
  } catch {
    // ignore
  }
  return { date: getTodayIST(), count: 0 };
}

/** Write daily count to AsyncStorage cache */
async function cacheDailyCount(daily: IDailyCount): Promise<void> {
  try {
    await AsyncStorage.setItem(DAILY_COUNT_CACHE_KEY, JSON.stringify(daily));
  } catch {
    // ignore
  }
}

/** Firestore storage — mirrors the old AsyncStorage API */
export function createFirestoreStorage(uid: string): IFirestoreStorage {
  return {
    getLanguage: () => getField(uid, 'language'),
    setLanguage: (value: IStorageData['language']) => setField(uid, 'language', value),

    getBasicInfo: () => getField(uid, 'basicInfo') as Promise<IBasicInfo | null>,
    setBasicInfo: (value: IBasicInfo | null) => setField(uid, 'basicInfo', value),

    getAssessmentAnswers: () => getField(uid, 'assessmentAnswers') as Promise<IAssessmentAnswers>,
    setAssessmentAnswers: (value: IAssessmentAnswers) => setField(uid, 'assessmentAnswers', value),

    getPriorityProfile: () => getField(uid, 'priorityProfile') as Promise<IPriorityProfile | null>,
    setPriorityProfile: (value: IPriorityProfile | null) => setField(uid, 'priorityProfile', value),

    getAssessmentComplete: () => getField(uid, 'assessmentComplete') as Promise<boolean>,
    setAssessmentComplete: (value: boolean) => setField(uid, 'assessmentComplete', value),

    getSavedGuide: () => getField(uid, 'savedGuide') as Promise<string[]>,
    setSavedGuide: (value: string[]) => setField(uid, 'savedGuide', value),

    getChatHistory: () => getField(uid, 'chatHistory') as Promise<IChatMessage[]>,
    setChatHistory: (value: IChatMessage[]) => setField(uid, 'chatHistory', value),

    getIsPremium: () => getField(uid, 'isPremium') as Promise<boolean>,
    setIsPremium: (value: boolean) => setField(uid, 'isPremium', value),

    getGuideSummary: () => getField(uid, 'guideSummary') as Promise<string | null>,
    setGuideSummary: (value: string | null) => setField(uid, 'guideSummary', value),

    getRetakeCount: () => getField(uid, 'retakeCount') as Promise<number>,
    setRetakeCount: (value: number) => setField(uid, 'retakeCount', value),

    canSendMessage: async (): Promise<boolean> => {
      const daily = await getCachedDailyCount();
      return daily.count < 7;
    },

    getRemainingMessages: async (): Promise<number> => {
      const daily = await getCachedDailyCount();
      return Math.max(0, 7 - daily.count);
    },

    incrementDailyMessageCount: async (): Promise<void> => {
      const daily = await getCachedDailyCount();
      const updated: IDailyCount = {
        date: getTodayIST(),
        count: daily.count + 1,
      };
      await cacheDailyCount(updated);
      try {
        await userDoc(uid).set({ dailyMessageCount: updated }, { merge: true });
      } catch (error) {
        console.error('Firestore incrementDailyMessageCount:', error);
      }
    },

    clearAll: async (): Promise<void> => {
      try {
        const preserved = {
          retakeCount: ((await getField(uid, 'retakeCount')) as number) ?? 0,
          isPremium: ((await getField(uid, 'isPremium')) as boolean) ?? false,
        };
        await userDoc(uid).set({
          ...DEFAULTS,
          ...preserved,
        });
      } catch (error) {
        console.error('Firestore clearAll:', error);
      }
    },

    clearAssessment: async (): Promise<void> => {
      try {
        await userDoc(uid).set(
          {
            assessmentAnswers: DEFAULTS.assessmentAnswers,
            priorityProfile: DEFAULTS.priorityProfile,
            assessmentComplete: DEFAULTS.assessmentComplete,
            savedGuide: DEFAULTS.savedGuide,
            guideSummary: DEFAULTS.guideSummary,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Firestore clearAssessment:', error);
      }
    },
  };
}

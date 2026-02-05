import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  IAssessmentAnswers,
  IBasicInfo,
  IChatMessage,
  IPriorityProfile,
  IStorageData,
  StorageKey,
} from './storage.types';

/** Prefix for all storage keys */
const STORAGE_PREFIX = '@samvaad_';

/** Storage keys with prefix */
const KEYS: Record<StorageKey, string> = {
  language: `${STORAGE_PREFIX}language`,
  basicInfo: `${STORAGE_PREFIX}basicInfo`,
  assessmentAnswers: `${STORAGE_PREFIX}assessmentAnswers`,
  priorityProfile: `${STORAGE_PREFIX}priorityProfile`,
  assessmentComplete: `${STORAGE_PREFIX}assessmentComplete`,
  savedGuide: `${STORAGE_PREFIX}savedGuide`,
  chatHistory: `${STORAGE_PREFIX}chatHistory`,
  isPremium: `${STORAGE_PREFIX}isPremium`,
};

/** Default values for storage */
const DEFAULTS: IStorageData = {
  language: 'en',
  basicInfo: null,
  assessmentAnswers: {},
  priorityProfile: null,
  assessmentComplete: false,
  savedGuide: [],
  chatHistory: [],
  isPremium: false,
};

/**
 * Get a value from storage
 * @param key - Storage key
 * @returns The stored value or default
 */
export async function getStorageItem<K extends StorageKey>(
  key: K
): Promise<IStorageData[K]> {
  try {
    const value = await AsyncStorage.getItem(KEYS[key]);
    if (value === null) {
      return DEFAULTS[key];
    }
    return JSON.parse(value) as IStorageData[K];
  } catch {
    return DEFAULTS[key];
  }
}

/**
 * Set a value in storage
 * @param key - Storage key
 * @param value - Value to store
 */
export async function setStorageItem<K extends StorageKey>(
  key: K,
  value: IStorageData[K]
): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS[key], JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

/** Specific getters for type safety */
export const storage = {
  getLanguage: (): Promise<IStorageData['language']> => getStorageItem('language'),
  setLanguage: (value: IStorageData['language']): Promise<void> => setStorageItem('language', value),

  getBasicInfo: (): Promise<IBasicInfo | null> => getStorageItem('basicInfo'),
  setBasicInfo: (value: IBasicInfo | null): Promise<void> => setStorageItem('basicInfo', value),

  getAssessmentAnswers: (): Promise<IAssessmentAnswers> => getStorageItem('assessmentAnswers'),
  setAssessmentAnswers: (value: IAssessmentAnswers): Promise<void> =>
    setStorageItem('assessmentAnswers', value),

  getPriorityProfile: (): Promise<IPriorityProfile | null> => getStorageItem('priorityProfile'),
  setPriorityProfile: (value: IPriorityProfile | null): Promise<void> =>
    setStorageItem('priorityProfile', value),

  getAssessmentComplete: (): Promise<boolean> => getStorageItem('assessmentComplete'),
  setAssessmentComplete: (value: boolean): Promise<void> =>
    setStorageItem('assessmentComplete', value),

  getSavedGuide: (): Promise<string[]> => getStorageItem('savedGuide'),
  setSavedGuide: (value: string[]): Promise<void> => setStorageItem('savedGuide', value),

  getChatHistory: (): Promise<IChatMessage[]> => getStorageItem('chatHistory'),
  setChatHistory: (value: IChatMessage[]): Promise<void> => setStorageItem('chatHistory', value),

  getIsPremium: (): Promise<boolean> => getStorageItem('isPremium'),
  setIsPremium: (value: boolean): Promise<void> => setStorageItem('isPremium', value),

  /**
   * Clear all app data (reset to defaults)
   */
  clearAll: async (): Promise<void> => {
    try {
      const keys = Object.values(KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  /**
   * Clear assessment data only (for retake)
   */
  clearAssessment: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        KEYS.assessmentAnswers,
        KEYS.priorityProfile,
        KEYS.assessmentComplete,
        KEYS.savedGuide,
      ]);
    } catch (error) {
      console.error('Error clearing assessment:', error);
    }
  },
};

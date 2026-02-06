import AsyncStorage from '@react-native-async-storage/async-storage';

import { storage } from './storage';
import { IAssessmentAnswers } from './storage.types';
import { mockBasicInfo } from './test.fixtures';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  multiRemove: jest.fn(),
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('storage.getLanguage / setLanguage', () => {
  it('returns default "en" when nothing stored', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    const result = await storage.getLanguage();
    expect(result).toBe('en');
  });

  it('returns stored language', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify('hi'));
    const result = await storage.getLanguage();
    expect(result).toBe('hi');
  });

  it('saves language correctly', async () => {
    await storage.setLanguage('hi');
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@samvaad_language',
      JSON.stringify('hi')
    );
  });

  it('returns default on AsyncStorage error', async () => {
    mockedAsyncStorage.getItem.mockRejectedValue(new Error('storage error'));
    const result = await storage.getLanguage();
    expect(result).toBe('en');
  });
});

describe('storage.getBasicInfo / setBasicInfo', () => {
  const mockInfo = mockBasicInfo;

  it('returns null when nothing stored', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    const result = await storage.getBasicInfo();
    expect(result).toBeNull();
  });

  it('returns stored basic info', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockInfo));
    const result = await storage.getBasicInfo();
    expect(result).toEqual(mockInfo);
  });

  it('saves basic info correctly', async () => {
    await storage.setBasicInfo(mockInfo);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@samvaad_basicInfo',
      JSON.stringify(mockInfo)
    );
  });
});

describe('storage.getAssessmentAnswers / setAssessmentAnswers', () => {
  it('returns empty object when nothing stored', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    const result = await storage.getAssessmentAnswers();
    expect(result).toEqual({});
  });

  it('returns stored answers', async () => {
    const answers: IAssessmentAnswers = { family_01: 'A', career_01: 'B' };
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(answers));
    const result = await storage.getAssessmentAnswers();
    expect(result).toEqual(answers);
  });

  it('saves answers correctly', async () => {
    const answers: IAssessmentAnswers = { family_01: 'A' };
    await storage.setAssessmentAnswers(answers);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@samvaad_assessmentAnswers',
      JSON.stringify(answers)
    );
  });
});

describe('storage.getAssessmentComplete / setAssessmentComplete', () => {
  it('returns false when nothing stored', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    const result = await storage.getAssessmentComplete();
    expect(result).toBe(false);
  });

  it('returns true when stored as true', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(true));
    const result = await storage.getAssessmentComplete();
    expect(result).toBe(true);
  });

  it('saves assessment complete correctly', async () => {
    await storage.setAssessmentComplete(true);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@samvaad_assessmentComplete',
      JSON.stringify(true)
    );
  });
});

describe('storage.getPriorityProfile / setPriorityProfile', () => {
  const mockProfile = {
    family: 'high' as const,
    career: 'medium' as const,
    finances: 'flexible' as const,
    lifestyle: 'high' as const,
    values: 'medium' as const,
  };

  it('returns null when nothing stored', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    const result = await storage.getPriorityProfile();
    expect(result).toBeNull();
  });

  it('returns stored profile', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockProfile));
    const result = await storage.getPriorityProfile();
    expect(result).toEqual(mockProfile);
  });

  it('saves profile correctly', async () => {
    await storage.setPriorityProfile(mockProfile);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@samvaad_priorityProfile',
      JSON.stringify(mockProfile)
    );
  });
});

describe('storage.getChatHistory / setChatHistory', () => {
  const mockMessages = [
    { id: '1', role: 'user' as const, content: 'Hello', timestamp: 1000 },
    { id: '2', role: 'assistant' as const, content: 'Hi there!', timestamp: 1001 },
  ];

  it('returns empty array when nothing stored', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    const result = await storage.getChatHistory();
    expect(result).toEqual([]);
  });

  it('returns stored chat history', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockMessages));
    const result = await storage.getChatHistory();
    expect(result).toEqual(mockMessages);
  });

  it('saves chat history correctly', async () => {
    await storage.setChatHistory(mockMessages);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@samvaad_chatHistory',
      JSON.stringify(mockMessages)
    );
  });
});

describe('storage.getIsPremium / setIsPremium', () => {
  it('returns false when nothing stored', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    const result = await storage.getIsPremium();
    expect(result).toBe(false);
  });

  it('returns true when stored as true', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(true));
    const result = await storage.getIsPremium();
    expect(result).toBe(true);
  });

  it('saves premium status correctly', async () => {
    await storage.setIsPremium(true);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@samvaad_isPremium',
      JSON.stringify(true)
    );
  });
});

describe('storage.clearAll', () => {
  it('removes all storage keys', async () => {
    mockedAsyncStorage.multiRemove.mockResolvedValue(undefined);
    await storage.clearAll();

    expect(mockedAsyncStorage.multiRemove).toHaveBeenCalledTimes(1);
    const removedKeys = mockedAsyncStorage.multiRemove.mock.calls[0][0];
    expect(removedKeys).toContain('@samvaad_language');
    expect(removedKeys).toContain('@samvaad_basicInfo');
    expect(removedKeys).toContain('@samvaad_assessmentAnswers');
    expect(removedKeys).toContain('@samvaad_priorityProfile');
    expect(removedKeys).toContain('@samvaad_assessmentComplete');
    expect(removedKeys).toContain('@samvaad_chatHistory');
    expect(removedKeys).toContain('@samvaad_isPremium');
  });

  it('handles error gracefully', async () => {
    mockedAsyncStorage.multiRemove.mockRejectedValue(new Error('clear error'));
    // Should not throw
    await expect(storage.clearAll()).resolves.toBeUndefined();
  });
});

describe('storage.clearAssessment', () => {
  it('removes only assessment-related keys', async () => {
    mockedAsyncStorage.multiRemove.mockResolvedValue(undefined);
    await storage.clearAssessment();

    expect(mockedAsyncStorage.multiRemove).toHaveBeenCalledTimes(1);
    const removedKeys = mockedAsyncStorage.multiRemove.mock.calls[0][0];
    expect(removedKeys).toContain('@samvaad_assessmentAnswers');
    expect(removedKeys).toContain('@samvaad_priorityProfile');
    expect(removedKeys).toContain('@samvaad_assessmentComplete');
    expect(removedKeys).toContain('@samvaad_savedGuide');
    expect(removedKeys).not.toContain('@samvaad_language');
    expect(removedKeys).not.toContain('@samvaad_basicInfo');
    expect(removedKeys).not.toContain('@samvaad_chatHistory');
  });

  it('handles error gracefully', async () => {
    mockedAsyncStorage.multiRemove.mockRejectedValue(new Error('clear error'));
    await expect(storage.clearAssessment()).resolves.toBeUndefined();
  });
});

describe('storage.getSavedGuide / setSavedGuide', () => {
  it('returns empty array when nothing stored', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    const result = await storage.getSavedGuide();
    expect(result).toEqual([]);
  });

  it('returns stored guide ids', async () => {
    const guideIds = ['q1', 'q2', 'q3'];
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(guideIds));
    const result = await storage.getSavedGuide();
    expect(result).toEqual(guideIds);
  });

  it('saves guide ids correctly', async () => {
    const guideIds = ['q1', 'q2'];
    await storage.setSavedGuide(guideIds);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@samvaad_savedGuide',
      JSON.stringify(guideIds)
    );
  });
});

describe('storage round-trip', () => {
  it('set then get returns same value for language', async () => {
    await storage.setLanguage('hi');
    const savedValue = JSON.parse(mockedAsyncStorage.setItem.mock.calls[0][1]);
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedValue));
    const result = await storage.getLanguage();
    expect(result).toBe('hi');
  });

  it('set then get returns same value for basicInfo', async () => {
    await storage.setBasicInfo(mockBasicInfo);
    const savedValue = JSON.parse(mockedAsyncStorage.setItem.mock.calls[0][1]);
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedValue));
    const result = await storage.getBasicInfo();
    expect(result).toEqual(mockBasicInfo);
  });

  it('set then get returns same value for boolean', async () => {
    await storage.setAssessmentComplete(true);
    const savedValue = JSON.parse(mockedAsyncStorage.setItem.mock.calls[0][1]);
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedValue));
    const result = await storage.getAssessmentComplete();
    expect(result).toBe(true);
  });
});

describe('storage clearAll then get', () => {
  it('returns defaults after clearAll', async () => {
    mockedAsyncStorage.multiRemove.mockResolvedValue(undefined);
    await storage.clearAll();

    // After clearing, getItem returns null => defaults
    mockedAsyncStorage.getItem.mockResolvedValue(null);

    expect(await storage.getLanguage()).toBe('en');
    expect(await storage.getBasicInfo()).toBeNull();
    expect(await storage.getAssessmentAnswers()).toEqual({});
    expect(await storage.getAssessmentComplete()).toBe(false);
    expect(await storage.getPriorityProfile()).toBeNull();
    expect(await storage.getChatHistory()).toEqual([]);
    expect(await storage.getIsPremium()).toBe(false);
    expect(await storage.getSavedGuide()).toEqual([]);
  });
});

describe('storage error handling', () => {
  it('returns default on getItem parse error', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue('invalid-json{{{');
    const result = await storage.getLanguage();
    expect(result).toBe('en');
  });

  it('does not throw on setItem error', async () => {
    mockedAsyncStorage.setItem.mockRejectedValue(new Error('write error'));
    await expect(storage.setLanguage('hi')).resolves.toBeUndefined();
  });
});

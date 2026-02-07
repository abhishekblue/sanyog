import { Dispatch, SetStateAction } from 'react';

import { storage } from '../../utils/storage';
import { IAssessmentAnswers, IBasicInfo, IPriorityProfile } from '../../utils/storage.types';

interface IProfileSetters {
  setBasicInfoState: (info: IBasicInfo | null) => void;
  setAssessmentAnswersState: Dispatch<SetStateAction<IAssessmentAnswers>>;
  setAssessmentCompleteState: (complete: boolean) => void;
  setPriorityProfileState: (profile: IPriorityProfile | null) => void;
  setRetakeCountState: Dispatch<SetStateAction<number>>;
}

export interface IProfileActions {
  setBasicInfo: (info: IBasicInfo) => Promise<void>;
  setAssessmentAnswer: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => Promise<void>;
  setAssessmentComplete: (complete: boolean) => Promise<void>;
  setPriorityProfile: (profile: IPriorityProfile) => Promise<void>;
  incrementRetakeCount: () => Promise<void>;
}

export function createProfileActions(setters: IProfileSetters): IProfileActions {
  const setBasicInfo = async (info: IBasicInfo): Promise<void> => {
    setters.setBasicInfoState(info);
    await storage.setBasicInfo(info);
  };

  const setAssessmentAnswer = async (
    questionId: string,
    answer: 'A' | 'B' | 'C' | 'D'
  ): Promise<void> => {
    let newAnswers: IAssessmentAnswers = {};
    setters.setAssessmentAnswersState((prev) => {
      newAnswers = { ...prev, [questionId]: answer };
      return newAnswers;
    });
    await storage.setAssessmentAnswers(newAnswers);
  };

  const setAssessmentComplete = async (complete: boolean): Promise<void> => {
    setters.setAssessmentCompleteState(complete);
    await storage.setAssessmentComplete(complete);
  };

  const setPriorityProfile = async (profile: IPriorityProfile): Promise<void> => {
    setters.setPriorityProfileState(profile);
    await storage.setPriorityProfile(profile);
  };

  const incrementRetakeCount = async (): Promise<void> => {
    let newCount = 0;
    setters.setRetakeCountState((prev) => {
      newCount = prev + 1;
      return newCount;
    });
    await storage.setRetakeCount(newCount);
  };

  return {
    setBasicInfo,
    setAssessmentAnswer,
    setAssessmentComplete,
    setPriorityProfile,
    incrementRetakeCount,
  };
}

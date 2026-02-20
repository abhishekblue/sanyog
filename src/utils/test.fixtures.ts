import { IBasicInfo, IPriorityProfile } from './storage.types';

export const mockBasicInfo: IBasicInfo = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  gender: 'female',
  ageRange: '26-28',
  isFirstMeeting: true,
  timeline: 'thisWeek',
};

export const mockPriorityProfile: IPriorityProfile = {
  family: 'high',
  career: 'medium',
  finances: 'flexible',
  lifestyle: 'high',
  values: 'medium',
  intimacy: 'flexible',
};

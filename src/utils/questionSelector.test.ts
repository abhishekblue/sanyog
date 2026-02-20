import { selectQuestionsByProfile } from './questionSelector';
import { IPriorityProfile } from './storage.types';

describe('selectQuestionsByProfile', () => {
  it('returns questions for all high priority profile', () => {
    const profile: IPriorityProfile = {
      family: 'high',
      career: 'high',
      finances: 'high',
      lifestyle: 'high',
      values: 'high',
      intimacy: 'high',
    };

    const questions = selectQuestionsByProfile(profile);
    // HIGH = all questions for each dimension (6+5+5+6+6+0 = 28, intimacy has no output questions yet)
    expect(questions.length).toBe(28);
  });

  it('returns fewer questions for all flexible priority profile', () => {
    const profile: IPriorityProfile = {
      family: 'flexible',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    };

    const questions = selectQuestionsByProfile(profile);
    // FLEXIBLE = only essential questions per dimension
    expect(questions.length).toBeGreaterThan(0);
    expect(questions.length).toBeLessThan(28);
    questions.forEach((q) => {
      expect(q.priorityLevel).toBe('essential');
    });
  });

  it('returns only essential questions for flexible dimensions', () => {
    const profile: IPriorityProfile = {
      family: 'flexible',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    };

    const questions = selectQuestionsByProfile(profile);
    questions.forEach((q) => {
      expect(q.priorityLevel).toBe('essential');
    });
  });

  it('returns more questions for high than medium priority', () => {
    const highProfile: IPriorityProfile = {
      family: 'high',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    };

    const mediumProfile: IPriorityProfile = {
      family: 'medium',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    };

    const highQuestions = selectQuestionsByProfile(highProfile);
    const mediumQuestions = selectQuestionsByProfile(mediumProfile);

    const highFamilyCount = highQuestions.filter((q) => q.dimension === 'family').length;
    const mediumFamilyCount = mediumQuestions.filter((q) => q.dimension === 'family').length;

    expect(highFamilyCount).toBeGreaterThan(mediumFamilyCount);
  });

  it('returns more questions for medium than flexible priority', () => {
    const mediumProfile: IPriorityProfile = {
      family: 'medium',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    };

    const flexibleProfile: IPriorityProfile = {
      family: 'flexible',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    };

    const mediumQuestions = selectQuestionsByProfile(mediumProfile);
    const flexibleQuestions = selectQuestionsByProfile(flexibleProfile);

    const mediumFamilyCount = mediumQuestions.filter((q) => q.dimension === 'family').length;
    const flexibleFamilyCount = flexibleQuestions.filter((q) => q.dimension === 'family').length;

    expect(mediumFamilyCount).toBeGreaterThan(flexibleFamilyCount);
  });

  it('orders questions by priority - high dimensions first', () => {
    const profile: IPriorityProfile = {
      family: 'flexible',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'high',
      intimacy: 'flexible',
    };

    const questions = selectQuestionsByProfile(profile);
    // First questions should be from the HIGH priority dimension (values)
    expect(questions[0].dimension).toBe('values');
  });

  it('returns no duplicate questions', () => {
    const profile: IPriorityProfile = {
      family: 'high',
      career: 'high',
      finances: 'high',
      lifestyle: 'high',
      values: 'high',
      intimacy: 'high',
    };

    const questions = selectQuestionsByProfile(profile);
    const ids = questions.map((q) => q.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  it('handles mixed priority profile correctly', () => {
    const profile: IPriorityProfile = {
      family: 'high',
      career: 'medium',
      finances: 'flexible',
      lifestyle: 'high',
      values: 'medium',
      intimacy: 'flexible',
    };

    const questions = selectQuestionsByProfile(profile);
    expect(questions.length).toBeGreaterThan(0);

    // High dimensions should have all questions
    const familyQuestions = questions.filter((q) => q.dimension === 'family');
    expect(familyQuestions.length).toBe(6);

    const lifestyleQuestions = questions.filter((q) => q.dimension === 'lifestyle');
    expect(lifestyleQuestions.length).toBe(6);

    // Flexible dimension should have only essential
    const financeQuestions = questions.filter((q) => q.dimension === 'finances');
    financeQuestions.forEach((q) => {
      expect(q.priorityLevel).toBe('essential');
    });
  });

  it('medium priority returns essential + exactly 2 high questions per dimension', () => {
    const profile: IPriorityProfile = {
      family: 'medium',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    };

    const questions = selectQuestionsByProfile(profile);
    const familyQuestions = questions.filter((q) => q.dimension === 'family');

    const essentialCount = familyQuestions.filter((q) => q.priorityLevel === 'essential').length;
    const highCount = familyQuestions.filter((q) => q.priorityLevel === 'high').length;

    // Family has 2 essential, and medium gets 2 high
    expect(essentialCount).toBe(2);
    expect(highCount).toBe(2);
    expect(familyQuestions.length).toBe(4);
  });

  it('flexible returns exact essential count per dimension', () => {
    const profile: IPriorityProfile = {
      family: 'flexible',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    };

    const questions = selectQuestionsByProfile(profile);

    // family: 2 essential, career: 2 essential, finances: 2 essential,
    // lifestyle: 2 essential, values: 3 essential
    const familyCount = questions.filter((q) => q.dimension === 'family').length;
    const careerCount = questions.filter((q) => q.dimension === 'career').length;
    const financesCount = questions.filter((q) => q.dimension === 'finances').length;
    const lifestyleCount = questions.filter((q) => q.dimension === 'lifestyle').length;
    const valuesCount = questions.filter((q) => q.dimension === 'values').length;

    expect(familyCount).toBe(2);
    expect(careerCount).toBe(2);
    expect(financesCount).toBe(2);
    expect(lifestyleCount).toBe(2);
    expect(valuesCount).toBe(3);
  });

  it('high priority returns all questions for each dimension', () => {
    const profile: IPriorityProfile = {
      family: 'high',
      career: 'high',
      finances: 'high',
      lifestyle: 'high',
      values: 'high',
      intimacy: 'high',
    };

    const questions = selectQuestionsByProfile(profile);

    expect(questions.filter((q) => q.dimension === 'family').length).toBe(6);
    expect(questions.filter((q) => q.dimension === 'career').length).toBe(5);
    expect(questions.filter((q) => q.dimension === 'finances').length).toBe(5);
    expect(questions.filter((q) => q.dimension === 'lifestyle').length).toBe(6);
    expect(questions.filter((q) => q.dimension === 'values').length).toBe(6);
  });

  it('orders high before medium before flexible', () => {
    const profile: IPriorityProfile = {
      family: 'flexible',
      career: 'medium',
      finances: 'high',
      lifestyle: 'flexible',
      values: 'medium',
      intimacy: 'flexible',
    };

    const questions = selectQuestionsByProfile(profile);

    // Find first index for each priority group
    const firstHighIdx = questions.findIndex((q) => q.dimension === 'finances');
    const firstMediumIdx = questions.findIndex(
      (q) => q.dimension === 'career' || q.dimension === 'values'
    );
    const firstFlexibleIdx = questions.findIndex(
      (q) => q.dimension === 'family' || q.dimension === 'lifestyle'
    );

    expect(firstHighIdx).toBeLessThan(firstMediumIdx);
    expect(firstMediumIdx).toBeLessThan(firstFlexibleIdx);
  });

  it('no duplicates even with mixed profile', () => {
    const profile: IPriorityProfile = {
      family: 'medium',
      career: 'high',
      finances: 'flexible',
      lifestyle: 'medium',
      values: 'high',
      intimacy: 'high',
    };

    const questions = selectQuestionsByProfile(profile);
    const ids = questions.map((q) => q.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('every returned question has required fields', () => {
    const profile: IPriorityProfile = {
      family: 'high',
      career: 'high',
      finances: 'high',
      lifestyle: 'high',
      values: 'high',
      intimacy: 'high',
    };

    const questions = selectQuestionsByProfile(profile);
    questions.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.dimension).toBeDefined();
      expect(q.priorityLevel).toBeDefined();
      expect(q.question_en).toBeDefined();
      expect(q.question_hi).toBeDefined();
      expect(q.whyItMatters_en).toBeDefined();
      expect(q.whyItMatters_hi).toBeDefined();
    });
  });
});

import { calculatePriorityProfile, getDimensionScores } from './scoring';
import { IAssessmentAnswers } from './storage.types';

describe('calculatePriorityProfile', () => {
  it('returns all flexible when no answers provided', () => {
    const profile = calculatePriorityProfile({});
    expect(profile).toEqual({
      family: 'flexible',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    });
  });

  it('returns high when all answers are A (avg = 3.0)', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'A',
      family_03: 'A',
      career_01: 'A',
      career_02: 'A',
      career_03: 'A',
      finances_01: 'A',
      finances_02: 'A',
      finances_03: 'A',
      lifestyle_01: 'A',
      lifestyle_02: 'A',
      lifestyle_03: 'A',
      lifestyle_04: 'A',
      values_01: 'A',
      values_02: 'A',
      values_03: 'A',
      values_04: 'A',
      intimacy_01: 'A',
      intimacy_02: 'A',
      intimacy_03: 'A',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile).toEqual({
      family: 'high',
      career: 'high',
      finances: 'high',
      lifestyle: 'high',
      values: 'high',
      intimacy: 'high',
    });
  });

  it('returns flexible when all answers are D (avg = 0.0)', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'D',
      family_02: 'D',
      family_03: 'D',
      career_01: 'D',
      career_02: 'D',
      career_03: 'D',
      finances_01: 'D',
      finances_02: 'D',
      finances_03: 'D',
      lifestyle_01: 'D',
      lifestyle_02: 'D',
      lifestyle_03: 'D',
      lifestyle_04: 'D',
      values_01: 'D',
      values_02: 'D',
      values_03: 'D',
      values_04: 'D',
      intimacy_01: 'D',
      intimacy_02: 'D',
      intimacy_03: 'D',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile).toEqual({
      family: 'flexible',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    });
  });

  // Boundary: avg exactly 2.0 => high
  it('returns high when avg is exactly 2.0 (all B)', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'B',
      family_02: 'B',
      family_03: 'B',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('high');
  });

  // Boundary: avg exactly 1.0 => medium
  it('returns medium when avg is exactly 1.0 (all C)', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'C',
      family_02: 'C',
      family_03: 'C',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('medium');
  });

  // Boundary: avg just below 2.0 => medium
  it('returns medium when avg is just below 2.0', () => {
    // A=3, C=1, C=1 => avg = 5/3 = 1.67 => medium
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'C',
      family_03: 'C',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('medium');
  });

  // Boundary: avg just below 1.0 => flexible
  it('returns flexible when avg is just below 1.0', () => {
    // C=1, D=0, D=0 => avg = 1/3 = 0.33 => flexible
    const answers: IAssessmentAnswers = {
      family_01: 'C',
      family_02: 'D',
      family_03: 'D',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('flexible');
  });

  it('handles mixed answers across dimensions correctly', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'A', // 3
      family_02: 'D', // 0
      family_03: 'D', // 0
      // family avg = 1.0 => medium
      career_01: 'A', // 3
      career_02: 'A', // 3
      career_03: 'B', // 2
      // career avg = 2.67 => high
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('medium');
    expect(profile.career).toBe('high');
  });

  it('handles partial answers (only some dimensions answered)', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'A',
      family_03: 'A',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('high');
    expect(profile.career).toBe('flexible');
    expect(profile.finances).toBe('flexible');
    expect(profile.lifestyle).toBe('flexible');
    expect(profile.values).toBe('flexible');
    expect(profile.intimacy).toBe('flexible');
  });

  it('handles single question answered per dimension', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'A', // avg = 3.0 => high
      career_01: 'C', // avg = 1.0 => medium
      finances_01: 'D', // avg = 0.0 => flexible
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('high');
    expect(profile.career).toBe('medium');
    expect(profile.finances).toBe('flexible');
  });

  it('ignores invalid question ids', () => {
    const answers: IAssessmentAnswers = {
      invalid_01: 'A',
      fake_question: 'B',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile).toEqual({
      family: 'flexible',
      career: 'flexible',
      finances: 'flexible',
      lifestyle: 'flexible',
      values: 'flexible',
      intimacy: 'flexible',
    });
  });

  it('returns medium for all C answers across all dimensions', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'C',
      family_02: 'C',
      family_03: 'C',
      career_01: 'C',
      career_02: 'C',
      career_03: 'C',
      finances_01: 'C',
      finances_02: 'C',
      finances_03: 'C',
      lifestyle_01: 'C',
      lifestyle_02: 'C',
      lifestyle_03: 'C',
      lifestyle_04: 'C',
      values_01: 'C',
      values_02: 'C',
      values_03: 'C',
      values_04: 'C',
      intimacy_01: 'C',
      intimacy_02: 'C',
      intimacy_03: 'C',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile).toEqual({
      family: 'medium',
      career: 'medium',
      finances: 'medium',
      lifestyle: 'medium',
      values: 'medium',
      intimacy: 'medium',
    });
  });

  it('returns high when avg is just above 2.0', () => {
    // A=3, A=3, C=1 => avg = 7/3 = 2.33 => high
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'A',
      family_03: 'C',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('high');
  });

  it('returns medium when avg is just above 1.0', () => {
    // B=2, D=0, D=0 => avg = 2/3 = 0.67 => flexible
    // C=1, C=1, D=0 => avg = 2/3 = 0.67 => flexible
    // B=2, C=1, D=0 => avg = 3/3 = 1.0 => medium (exact boundary)
    const answers: IAssessmentAnswers = {
      family_01: 'B',
      family_02: 'C',
      family_03: 'D',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('medium');
  });

  it('handles 4-question dimension (lifestyle) correctly', () => {
    // A=3, B=2, C=1, D=0 => avg = 6/4 = 1.5 => medium
    const answers: IAssessmentAnswers = {
      lifestyle_01: 'A',
      lifestyle_02: 'B',
      lifestyle_03: 'C',
      lifestyle_04: 'D',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.lifestyle).toBe('medium');
  });

  it('handles 4-question dimension (values) at boundary', () => {
    // B=2, B=2, B=2, B=2 => avg = 8/4 = 2.0 => high
    const answers: IAssessmentAnswers = {
      values_01: 'B',
      values_02: 'B',
      values_03: 'B',
      values_04: 'B',
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.values).toBe('high');
  });

  it('profile and scores are consistent', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'A',
      family_03: 'A',
      career_01: 'C',
      career_02: 'C',
      career_03: 'C',
      finances_01: 'D',
      finances_02: 'D',
      finances_03: 'D',
    };

    const profile = calculatePriorityProfile(answers);
    const scores = getDimensionScores(answers);

    // family avg = 3.0 >= 2.0 => high
    expect(scores.family).toBe(3);
    expect(profile.family).toBe('high');

    // career avg = 1.0 >= 1.0 => medium
    expect(scores.career).toBe(1);
    expect(profile.career).toBe('medium');

    // finances avg = 0.0 < 1.0 => flexible
    expect(scores.finances).toBe(0);
    expect(profile.finances).toBe('flexible');
  });

  it('returns correct profile for all dimensions with different priorities', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'A',
      family_03: 'A',
      // family avg = 3.0 => high
      career_01: 'B',
      career_02: 'C',
      career_03: 'B',
      // career avg = 5/3 = 1.67 => medium
      finances_01: 'D',
      finances_02: 'D',
      finances_03: 'C',
      // finances avg = 1/3 = 0.33 => flexible
      lifestyle_01: 'A',
      lifestyle_02: 'B',
      lifestyle_03: 'A',
      lifestyle_04: 'B',
      // lifestyle avg = 10/4 = 2.5 => high
      values_01: 'C',
      values_02: 'B',
      values_03: 'C',
      values_04: 'B',
      // values avg = 6/4 = 1.5 => medium
    };

    const profile = calculatePriorityProfile(answers);
    expect(profile.family).toBe('high');
    expect(profile.career).toBe('medium');
    expect(profile.finances).toBe('flexible');
    expect(profile.lifestyle).toBe('high');
    expect(profile.values).toBe('medium');
    expect(profile.intimacy).toBe('flexible');
  });
});

describe('getDimensionScores', () => {
  it('returns 0 for all dimensions when no answers', () => {
    const scores = getDimensionScores({});
    expect(scores).toEqual({
      family: 0,
      career: 0,
      finances: 0,
      lifestyle: 0,
      values: 0,
      intimacy: 0,
    });
  });

  it('returns correct average for mixed A, B, C answers', () => {
    // A=3, B=2, C=1 => avg = 2.0
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'B',
      family_03: 'C',
    };

    const scores = getDimensionScores(answers);
    expect(scores.family).toBe(2);
  });

  it('returns 3.0 when all answers are A', () => {
    const answers: IAssessmentAnswers = {
      values_01: 'A',
      values_02: 'A',
      values_03: 'A',
      values_04: 'A',
    };

    const scores = getDimensionScores(answers);
    expect(scores.values).toBe(3);
  });

  it('returns 0 when all answers are D', () => {
    const answers: IAssessmentAnswers = {
      career_01: 'D',
      career_02: 'D',
      career_03: 'D',
    };

    const scores = getDimensionScores(answers);
    expect(scores.career).toBe(0);
  });

  it('returns correct score for single answer', () => {
    const answers: IAssessmentAnswers = {
      finances_01: 'B', // 2
    };

    const scores = getDimensionScores(answers);
    expect(scores.finances).toBe(2);
  });

  it('returns correct scores for all A, B, C, D mixed', () => {
    // A=3, B=2, C=1, D=0 => avg = 6/4 = 1.5
    const answers: IAssessmentAnswers = {
      lifestyle_01: 'A',
      lifestyle_02: 'B',
      lifestyle_03: 'C',
      lifestyle_04: 'D',
    };

    const scores = getDimensionScores(answers);
    expect(scores.lifestyle).toBe(1.5);
  });

  it('only counts answered questions in average', () => {
    // only 2 of 3 family questions answered
    // A=3, B=2 => avg = 5/2 = 2.5
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'B',
    };

    const scores = getDimensionScores(answers);
    expect(scores.family).toBe(2.5);
  });

  it('returns independent scores per dimension', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'A',
      family_03: 'A',
      career_01: 'D',
      career_02: 'D',
      career_03: 'D',
    };

    const scores = getDimensionScores(answers);
    expect(scores.family).toBe(3);
    expect(scores.career).toBe(0);
    expect(scores.finances).toBe(0);
  });

  it('returns correct score for 4-question dimension (lifestyle)', () => {
    const answers: IAssessmentAnswers = {
      lifestyle_01: 'A', // 3
      lifestyle_02: 'A', // 3
      lifestyle_03: 'B', // 2
      lifestyle_04: 'C', // 1
    };

    // avg = 9/4 = 2.25
    const scores = getDimensionScores(answers);
    expect(scores.lifestyle).toBe(2.25);
  });

  it('returns correct score for 4-question dimension (values)', () => {
    const answers: IAssessmentAnswers = {
      values_01: 'B', // 2
      values_02: 'C', // 1
      values_03: 'D', // 0
      values_04: 'A', // 3
    };

    // avg = 6/4 = 1.5
    const scores = getDimensionScores(answers);
    expect(scores.values).toBe(1.5);
  });

  it('ignores invalid question ids in scores', () => {
    const answers: IAssessmentAnswers = {
      invalid_01: 'A',
      family_01: 'B',
    };

    const scores = getDimensionScores(answers);
    expect(scores.family).toBe(2);
  });

  it('scores all 6 dimensions independently with full answers', () => {
    const answers: IAssessmentAnswers = {
      family_01: 'A',
      family_02: 'A',
      family_03: 'A', // 3.0
      career_01: 'B',
      career_02: 'B',
      career_03: 'B', // 2.0
      finances_01: 'C',
      finances_02: 'C',
      finances_03: 'C', // 1.0
      lifestyle_01: 'D',
      lifestyle_02: 'D',
      lifestyle_03: 'D',
      lifestyle_04: 'D', // 0.0
      values_01: 'A',
      values_02: 'B',
      values_03: 'C',
      values_04: 'D', // 1.5
      intimacy_01: 'B',
      intimacy_02: 'B',
      intimacy_03: 'B', // 2.0
    };

    const scores = getDimensionScores(answers);
    expect(scores.family).toBe(3);
    expect(scores.career).toBe(2);
    expect(scores.finances).toBe(1);
    expect(scores.lifestyle).toBe(0);
    expect(scores.values).toBe(1.5);
    expect(scores.intimacy).toBe(2);
  });
});

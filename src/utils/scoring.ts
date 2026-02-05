/**
 * Scoring logic for priority calculation
 * Based on spec: A=3, B=2, C=1, D=0 points
 * Average >= 2.0 → HIGH, >= 1.0 → MEDIUM, < 1.0 → FLEXIBLE
 */

import { Dimension, assessmentQuestions } from '../data/assessmentQuestions';

import { IAssessmentAnswers, IPriorityProfile, PriorityLevel } from './storage.types';

/** Points for each answer option */
const ANSWER_POINTS: Record<'A' | 'B' | 'C' | 'D', number> = {
  A: 3,
  B: 2,
  C: 1,
  D: 0,
};

/**
 * Calculate average score for a dimension
 * @param dimension - The dimension to calculate
 * @param answers - User's assessment answers
 * @returns Average score (0-3)
 */
function calculateDimensionScore(
  dimension: Dimension,
  answers: IAssessmentAnswers
): number {
  const dimensionQuestions = assessmentQuestions.filter(
    (q) => q.dimension === dimension
  );

  if (dimensionQuestions.length === 0) return 0;

  let totalPoints = 0;
  let answeredCount = 0;

  for (const question of dimensionQuestions) {
    const answer = answers[question.id];
    if (answer) {
      totalPoints += ANSWER_POINTS[answer];
      answeredCount++;
    }
  }

  if (answeredCount === 0) return 0;

  return totalPoints / answeredCount;
}

/**
 * Convert average score to priority level
 * @param score - Average score (0-3)
 * @returns Priority level
 */
function scoreToPriority(score: number): PriorityLevel {
  if (score >= 2.0) return 'high';
  if (score >= 1.0) return 'medium';
  return 'flexible';
}

/**
 * Calculate full priority profile from assessment answers
 * @param answers - User's assessment answers
 * @returns Priority profile for all dimensions
 */
export function calculatePriorityProfile(
  answers: IAssessmentAnswers
): IPriorityProfile {
  const dimensions: Dimension[] = ['family', 'career', 'finances', 'lifestyle', 'values'];

  const profile: IPriorityProfile = {
    family: 'flexible',
    career: 'flexible',
    finances: 'flexible',
    lifestyle: 'flexible',
    values: 'flexible',
  };

  for (const dimension of dimensions) {
    const score = calculateDimensionScore(dimension, answers);
    profile[dimension] = scoreToPriority(score);
  }

  return profile;
}

/**
 * Get dimension scores for display (optional - for showing detailed results)
 * @param answers - User's assessment answers
 * @returns Scores for each dimension
 */
export function getDimensionScores(
  answers: IAssessmentAnswers
): Record<Dimension, number> {
  return {
    family: calculateDimensionScore('family', answers),
    career: calculateDimensionScore('career', answers),
    finances: calculateDimensionScore('finances', answers),
    lifestyle: calculateDimensionScore('lifestyle', answers),
    values: calculateDimensionScore('values', answers),
  };
}

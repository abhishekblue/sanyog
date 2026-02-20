/**
 * Question selector logic
 * Selects output questions based on user's priority profile
 */

import { Dimension } from '../data/assessmentQuestions';
import { IOutputQuestion, outputQuestions } from '../data/outputQuestions';

import { IPriorityProfile } from './storage.types';

/** Questions per dimension for MEDIUM priority */
const MEDIUM_PRIORITY_QUESTIONS = 2;

/**
 * Select questions for a single dimension based on priority
 * @param dimension - The dimension
 * @param priority - Priority level for this dimension
 * @returns Selected questions for this dimension
 */
function selectQuestionsForDimension(
  dimension: Dimension,
  priority: 'high' | 'medium' | 'flexible'
): IOutputQuestion[] {
  const dimensionQuestions = outputQuestions.filter((q) => q.dimension === dimension);
  const essentialQuestions = dimensionQuestions.filter((q) => q.priorityLevel === 'essential');
  const highQuestions = dimensionQuestions.filter((q) => q.priorityLevel === 'high');

  switch (priority) {
    case 'high':
      // Show ALL questions for HIGH priority dimensions
      return dimensionQuestions;

    case 'medium':
      // Show essential + some high priority questions
      return [...essentialQuestions, ...highQuestions.slice(0, MEDIUM_PRIORITY_QUESTIONS)];

    case 'flexible':
      // Show only essential questions
      return essentialQuestions;

    default:
      return essentialQuestions;
  }
}

/**
 * Select all questions based on user's priority profile
 * @param profile - User's priority profile
 * @returns Selected questions ordered by priority
 */
export function selectQuestionsByProfile(profile: IPriorityProfile): IOutputQuestion[] {
  const dimensions: Dimension[] = [
    'family',
    'career',
    'finances',
    'lifestyle',
    'values',
    'intimacy',
  ];
  const selectedQuestions: IOutputQuestion[] = [];

  // Sort dimensions by priority (HIGH first, then MEDIUM, then FLEXIBLE)
  const sortedDimensions = [...dimensions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, flexible: 2 };
    return priorityOrder[profile[a]] - priorityOrder[profile[b]];
  });

  // Select questions for each dimension
  for (const dimension of sortedDimensions) {
    const questions = selectQuestionsForDimension(dimension, profile[dimension]);
    selectedQuestions.push(...questions);
  }

  // Remove duplicates (in case any question appears in multiple dimensions)
  const uniqueQuestions = selectedQuestions.filter(
    (q, index, self) => self.findIndex((x) => x.id === q.id) === index
  );

  return uniqueQuestions;
}

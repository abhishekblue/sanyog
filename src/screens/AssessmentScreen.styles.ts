import { StyleSheet } from 'react-native';

import { colors } from '../theme/colors';
import { shadows } from '../theme/spacing';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.lg,
  },
  questionText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  optionsContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.selectedBackground,
    borderColor: colors.selectedBorder,
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionIndicatorSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionLetter: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  optionLetterSelected: {
    color: colors.textLight,
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    paddingVertical: spacing.buttonVertical,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  navButtonTextDisabled: {
    color: colors.textSecondary,
  },
  nextButton: {
    flex: 1,
    paddingVertical: spacing.buttonVertical,
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    alignItems: 'center',
    ...shadows.subtle,
  },
  nextButtonDisabled: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
  nextButtonTextDisabled: {
    color: colors.textSecondary,
  },
});

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
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.screenVertical,
  },
  languageToggle: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadiusRound,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  bottomSection: {
    paddingBottom: spacing.lg,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonVertical,
    paddingHorizontal: spacing.buttonHorizontal,
    borderRadius: spacing.borderRadius,
    alignItems: 'center',
    ...shadows.subtle,
  },
  getStartedText: {
    ...typography.button,
    color: colors.textLight,
  },
  privacyNote: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

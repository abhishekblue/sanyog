import { StyleSheet } from 'react-native';

import { colors } from '../theme/colors';
import { shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.screenVertical,
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
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  bottomSection: {
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.buttonVertical,
    paddingHorizontal: spacing.buttonHorizontal,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.subtle,
  },
  googleLogo: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    ...typography.button,
    color: colors.textPrimary,
    textTransform: 'none' as const,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.buttonVertical,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.body,
    color: colors.textPrimary,
  },
  sendOtpButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonVertical,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius,
    justifyContent: 'center',
    ...shadows.subtle,
  },
  sendOtpButtonDisabled: {
    opacity: 0.5,
  },
  sendOtpText: {
    ...typography.buttonSmall,
    color: colors.textLight,
  },
  otpInput: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.buttonVertical,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 4,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonVertical,
    paddingHorizontal: spacing.buttonHorizontal,
    borderRadius: spacing.borderRadius,
    alignItems: 'center',
    ...shadows.subtle,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
  verifyingText: {
    ...typography.h3,
    color: colors.primary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  errorText: {
    ...typography.captionSmall,
    color: colors.error,
    textAlign: 'center',
  },
});

import { StyleSheet } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  featuresList: {
    marginBottom: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
    color: colors.success,
  },
  featureText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  unlockButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonVertical,
    borderRadius: spacing.borderRadius,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  unlockButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
  comingSoonText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

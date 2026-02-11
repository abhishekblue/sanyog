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
  planCards: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  planCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.selectedBackground,
  },
  planDuration: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  planDurationSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  planPrice: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  planPriceSelected: {
    color: colors.primary,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonVertical,
    borderRadius: spacing.borderRadius,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subscribeButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
  restoreText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});

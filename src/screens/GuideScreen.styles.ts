import { StyleSheet } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  questionCardLocked: {
    opacity: 0.6,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  questionNumberText: {
    ...typography.captionSmall,
    color: colors.textLight,
    fontWeight: '600',
  },
  questionText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  expandIcon: {
    marginLeft: spacing.sm,
    color: colors.textSecondary,
  },
  expandedContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    ...typography.captionSmall,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    color: colors.textSecondary,
  },
  paywallBanner: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  paywallTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  paywallDescription: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  paywallButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius,
    alignItems: 'center',
  },
  paywallButtonText: {
    ...typography.buttonSmall,
    color: colors.textLight,
  },
  bottomSection: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  coachButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonVertical,
    borderRadius: spacing.borderRadius,
    alignItems: 'center',
  },
  coachButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
});

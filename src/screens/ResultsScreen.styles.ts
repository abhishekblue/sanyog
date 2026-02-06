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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  cardsContainer: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dimensionName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  priorityBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.borderRadiusSmall,
  },
  priorityText: {
    ...typography.captionSmall,
    fontWeight: '600',
  },
  bottomSection: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonVertical,
    paddingHorizontal: spacing.buttonHorizontal,
    borderRadius: spacing.borderRadius,
    alignItems: 'center',
    ...shadows.subtle,
  },
  continueText: {
    ...typography.button,
    color: colors.textLight,
  },
});

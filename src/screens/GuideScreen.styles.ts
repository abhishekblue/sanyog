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
  header: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  summaryCard: {
    backgroundColor: colors.selectedBackground,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.selectedBorder,
    padding: spacing.md,
  },
  summaryTitle: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  summaryText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.subtle,
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
    ...shadows.subtle,
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
});

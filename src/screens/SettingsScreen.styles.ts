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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  settingLabelDisabled: {
    color: colors.textSecondary,
  },
  retakeHint: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  destructiveText: {
    ...typography.body,
    color: colors.error,
  },
  privacyCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  privacyTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  privacyText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  premiumBadge: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
  upgradeLinkText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  versionText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

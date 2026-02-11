import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { shadows } from '../../theme/spacing';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  // MessageBubble
  messageBubble: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: spacing.borderRadius,
    marginBottom: spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userText: {
    ...typography.body,
    color: colors.textLight,
  },
  assistantText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  loadingText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  // SuggestedChips
  chipsContainer: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  chip: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipText: {
    ...typography.captionSmall,
    color: colors.textPrimary,
  },

  // ChatInput
  remainingBar: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    backgroundColor: colors.background,
  },
  remainingText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    marginLeft: spacing.sm,
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.subtle,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  limitBanner: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.selectedBackground,
    gap: spacing.xs,
  },
  limitTitle: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  countdownText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.borderRadius,
    marginTop: spacing.xs,
  },
  upgradeButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
});

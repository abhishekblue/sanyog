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
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
  },
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
  loadingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: spacing.borderRadius,
    marginLeft: spacing.screenHorizontal,
  },
  loadingText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
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
    overflow: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.textLight,
    fontSize: 20,
    lineHeight: 44,
    ...shadows.subtle,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  limitBanner: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  limitText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  countdownText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

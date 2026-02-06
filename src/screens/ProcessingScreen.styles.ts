import { StyleSheet } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.15,
  },
  iconInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    opacity: 1,
  },
  stepText: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  progressContainer: {
    width: '80%',
    marginBottom: spacing.xl,
  },
  progressBackground: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  subtleText: {
    ...typography.captionSmall,
    color: colors.textSecondary,
    opacity: 0.5,
  },
});

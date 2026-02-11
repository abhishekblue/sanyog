import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface IProps {
  children: ReactNode;
}

interface IState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): IState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleRestart = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={boundaryStyles.container}>
          <Text style={boundaryStyles.title}>
            Something went wrong
          </Text>
          <Text style={boundaryStyles.subtitle}>
            The app ran into an unexpected error.
          </Text>
          <TouchableOpacity
            style={boundaryStyles.button}
            onPress={this.handleRestart}
            accessibilityRole="button"
            accessibilityLabel="Restart app"
            accessibilityHint="Restart app"
          >
            <Text style={boundaryStyles.buttonText}>
              Restart App
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const boundaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.borderRadius,
  },
  buttonText: {
    ...typography.button,
    color: colors.textLight,
  },
});

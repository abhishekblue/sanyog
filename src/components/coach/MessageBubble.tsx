import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './coach.styles';
import { IMessageBubbleProps } from './coach.types';

export function MessageBubble(
  { message, translator, onRetry }: IMessageBubbleProps,
): React.JSX.Element {
  if (message.id === 'loading') {
    return (
      <View style={[styles.messageBubble, styles.assistantBubble]}>
        <Text style={styles.loadingText}>{translator.common('status.thinking')}</Text>
      </View>
    );
  }

  const isUser = message.role === 'user';

  if (message.isError) {
    return (
      <View style={[styles.messageBubble, styles.errorBubble]}>
        <Text style={styles.errorText}>{message.content}</Text>
        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel={translator.common('buttons.retry')}
            accessibilityHint={translator.common('buttons.tryAgain')}
          >
            <Text style={styles.retryButtonText}>
              {translator.common('buttons.retry')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
      <Text style={isUser ? styles.userText : styles.assistantText}>{message.content}</Text>
    </View>
  );
}

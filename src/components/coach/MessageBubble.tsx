import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './coach.styles';
import { IMessageBubbleProps } from './coach.types';

export function MessageBubble({ message, translator }: IMessageBubbleProps): React.JSX.Element {
  if (message.id === 'loading') {
    return (
      <View style={[styles.messageBubble, styles.assistantBubble]}>
        <Text style={styles.loadingText}>{translator.common('status.thinking')}</Text>
      </View>
    );
  }

  const isUser = message.role === 'user';

  return (
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
      <Text style={isUser ? styles.userText : styles.assistantText}>{message.content}</Text>
    </View>
  );
}

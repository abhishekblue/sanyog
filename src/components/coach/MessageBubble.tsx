import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './coach.styles';
import { IMessageBubbleProps } from './coach.types';

export function MessageBubble(
  { message, translator, onRetry }: IMessageBubbleProps,
): React.JSX.Element {
  const d1 = useRef(new Animated.Value(0.3)).current;
  const d2 = useRef(new Animated.Value(0.3)).current;
  const d3 = useRef(new Animated.Value(0.3)).current;
  const slideIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message.id === 'loading') {
      const dots = [d1, d2, d3];
      const anims = dots.map((d, i) =>
        Animated.loop(Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(d, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ]))
      );
      anims.forEach((a) => a.start());
      return () => anims.forEach((a) => a.stop());
    }
    Animated.timing(slideIn, {
      toValue: 1, duration: 200, useNativeDriver: true,
    }).start();
  }, [message.id, d1, d2, d3, slideIn]);

  if (message.id === 'loading') {
    return (
      <View style={[styles.messageBubble, styles.assistantBubble, styles.dotsRow]}>
        {[d1, d2, d3].map((d, i) => (
          <Animated.View key={i} style={[styles.dot, { opacity: d }]} />
        ))}
      </View>
    );
  }

  const isUser = message.role === 'user';
  const slideOffset = isUser ? 20 : -20;
  const animStyle = {
    opacity: slideIn,
    transform: [{
      translateX: slideIn.interpolate({
        inputRange: [0, 1],
        outputRange: [slideOffset, 0],
      }),
    }],
  };

  if (message.isError) {
    return (
      <Animated.View
        style={[styles.messageBubble, styles.errorBubble, animStyle]}
      >
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
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.assistantBubble,
        animStyle,
      ]}
    >
      <Text style={isUser ? styles.userText : styles.assistantText}>
        {message.content}
      </Text>
    </Animated.View>
  );
}

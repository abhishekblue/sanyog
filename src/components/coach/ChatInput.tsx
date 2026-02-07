import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { colors } from '../../theme/colors';

import { styles } from './coach.styles';
import { IChatInputProps } from './coach.types';

export function ChatInput({
  inputText,
  onChangeText,
  onSend,
  canSend,
  remaining,
  limitReached,
  translator,
  onFocus,
}: IChatInputProps): React.JSX.Element {
  if (limitReached) {
    return (
      <View style={styles.limitBanner}>
        <Feather name="moon" size={28} color={colors.primary} />
        <Text style={styles.limitTitle}>{translator.t('coach.limitReached')}</Text>
        <Text style={styles.countdownText}>{translator.t('coach.resetsIn')}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.remainingBar}>
        <Text style={styles.remainingText}>
          {translator.t('coach.remaining', { count: remaining })}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={onChangeText}
          placeholder={translator.t('coach.placeholder')}
          placeholderTextColor="#999"
          multiline
          maxLength={700}
          onFocus={onFocus}
        />
        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={onSend}
          activeOpacity={0.7}
          disabled={!canSend}
        >
          <Feather name="arrow-up" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
  );
}

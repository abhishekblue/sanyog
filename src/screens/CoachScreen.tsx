import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsButton } from '../components/SettingsButton';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../utils/api';
import { canSendMessage, getRemainingMessages, incrementDailyMessageCount } from '../utils/storage';
import { IChatMessage } from '../utils/storage.types';

import { styles } from './CoachScreen.styles';

export function CoachScreen(): React.JSX.Element {
  const { translator, chatHistory, addChatMessage, language, basicInfo, priorityProfile } =
    useApp();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState(7);
  const [limitReached, setLimitReached] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const suggestedChips = [
    { key: 'prepare', label: translator.t('coach.chips.prepare') },
    { key: 'sensitive', label: translator.t('coach.chips.sensitive') },
    { key: 'evaluate', label: translator.t('coach.chips.evaluate') },
    { key: 'redFlags', label: translator.t('coach.chips.redFlags') },
  ];

  const refreshLimit = useCallback(async () => {
    const canSend = await canSendMessage();
    const count = await getRemainingMessages();
    setRemaining(count);
    setLimitReached(!canSend);
  }, []);

  useEffect(() => {
    refreshLimit();
  }, [refreshLimit]);

  const handleSend = async (text?: string): Promise<void> => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading || limitReached) return;

    setInputText('');
    setIsLoading(true);

    const userMessage: IChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };

    await addChatMessage(userMessage);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const allMessages = [...chatHistory, userMessage];
      const response = await sendChatMessage({
        messages: allMessages,
        context: { basicInfo, priorityProfile, language },
      });

      const assistantMessage: IChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.error || response.message || translator.common('status.error'),
        timestamp: Date.now(),
      };

      await addChatMessage(assistantMessage);
      await incrementDailyMessageCount();
      await refreshLimit();
    } catch {
      const errorMessage: IChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: translator.common('status.error'),
        timestamp: Date.now(),
      };

      await addChatMessage(errorMessage);
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleChipPress = (chipKey: string): void => {
    const chip = suggestedChips.find((c) => c.key === chipKey);
    if (chip) {
      handleSend(chip.label);
    }
  };

  const renderMessage = ({ item }: { item: IChatMessage }): React.JSX.Element => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text style={item.role === 'user' ? styles.userText : styles.assistantText}>
        {item.content}
      </Text>
    </View>
  );

  const getInitialMessages = (): IChatMessage[] => {
    if (chatHistory.length > 0) return chatHistory;

    return [
      {
        id: 'initial',
        role: 'assistant',
        content: translator.t('coach.initialMessage'),
        timestamp: Date.now(),
      },
    ];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{translator.t('coach.title')}</Text>
          <SettingsButton />
        </View>
        <Text style={styles.subtitle}>{translator.t('coach.subtitle')}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          data={getInitialMessages()}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {isLoading && (
          <View style={styles.loadingBubble}>
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}

        {chatHistory.length === 0 && !limitReached && (
          <View style={styles.chipsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestedChips.map((chip) => (
                <View key={chip.key} style={styles.chip}>
                  <Text style={styles.chipText} onPress={() => handleChipPress(chip.key)}>
                    {chip.label}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {limitReached ? (
          <View style={styles.limitBanner}>
            <Text style={styles.limitText}>{translator.t('coach.limitReached')}</Text>
            <Text style={styles.countdownText}>{translator.t('coach.resetsIn')}</Text>
          </View>
        ) : (
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
                onChangeText={setInputText}
                placeholder={translator.t('coach.placeholder')}
                placeholderTextColor="#999"
                multiline
                maxLength={700}
              />
              <Text
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={() => {
                  if (inputText.trim() && !isLoading) handleSend();
                }}
              >
                ↑
              </Text>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

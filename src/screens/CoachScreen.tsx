import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatInput, MessageBubble, SuggestedChips } from '../components/coach';
import { PaywallModal } from '../components/PaywallModal';
import { SettingsButton } from '../components/SettingsButton';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../utils/api';
import { IChatMessage } from '../utils/storage.types';

import { styles } from './CoachScreen.styles';

const INITIAL_MESSAGE_ID = 'initial';

export function CoachScreen(): React.JSX.Element {
  const {
    translator,
    chatHistory,
    addChatMessage,
    language,
    basicInfo,
    priorityProfile,
    subscriptionTier,
    canSendMessage,
    getRemainingMessages,
    incrementDailyMessageCount,
  } = useApp();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState(5);
  const [limitReached, setLimitReached] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const isPremium = subscriptionTier === 'premium';

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
  }, [canSendMessage, getRemainingMessages]);

  useEffect(() => {
    refreshLimit();
  }, [refreshLimit]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, []);

  const handleSend = async (text?: string): Promise<void> => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading || limitReached) return;

    setInputText('');
    Keyboard.dismiss();
    setIsLoading(true);

    const userMessage: IChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };

    await addChatMessage(userMessage);
    scrollToBottom();

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
      scrollToBottom();
    }
  };

  const handleChipPress = (chipKey: string): void => {
    const chip = suggestedChips.find((c) => c.key === chipKey);
    if (chip) {
      handleSend(chip.label);
    }
  };

  const displayMessages = useMemo((): IChatMessage[] => {
    if (chatHistory.length > 0) {
      if (isLoading) {
        return [
          ...chatHistory,
          { id: 'loading', role: 'assistant', content: '...', timestamp: Date.now() },
        ];
      }
      return chatHistory;
    }

    return [
      {
        id: INITIAL_MESSAGE_ID,
        role: 'assistant',
        content: translator.t('coach.initialMessage'),
        timestamp: Date.now(),
      },
    ];
  }, [chatHistory, isLoading, translator]);

  const canSendNow = inputText.trim().length > 0 && !isLoading;

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
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          data={displayMessages}
          renderItem={({ item }) => <MessageBubble message={item} translator={translator} />}
          keyExtractor={(item) => item.id}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
        />

        {chatHistory.length === 0 && !limitReached && (
          <SuggestedChips chips={suggestedChips} onChipPress={handleChipPress} />
        )}

        <ChatInput
          inputText={inputText}
          onChangeText={setInputText}
          onSend={() => {
            if (canSendNow) handleSend();
          }}
          canSend={canSendNow}
          remaining={remaining}
          limitReached={limitReached}
          isPremium={isPremium}
          onUpgrade={() => setPaywallVisible(true)}
          translator={translator}
          onFocus={scrollToBottom}
        />
      </KeyboardAvoidingView>

      <PaywallModal visible={paywallVisible} onClose={() => setPaywallVisible(false)} />
    </SafeAreaView>
  );
}

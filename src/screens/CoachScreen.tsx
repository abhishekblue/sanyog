import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatInput, MessageBubble, SuggestedChips } from '../components/coach';
import { PaywallModal } from '../components/PaywallModal';
import { SettingsButton } from '../components/SettingsButton';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../utils/api';
import { sanitizeUserMessage } from '../utils/api/sanitize';
import { IChatMessage } from '../utils/storage.types';

import { styles } from './CoachScreen.styles';

const INITIAL_MESSAGE_ID = 'initial';
const CHIP_KEYS = ['prepare', 'sensitive', 'evaluate', 'redFlags'] as const;

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
  const { t, common } = translator;
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState(5);
  const [limitReached, setLimitReached] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<IChatMessage | null>(null);
  const retryMessagesRef = useRef<IChatMessage[] | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const isPremium = subscriptionTier === 'premium';

  const suggestedChips = CHIP_KEYS.map((key) => ({
    key,
    label: t(`coach.chips.${key}`),
  }));

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

  const fetchResponse = async (
    allMessages: IChatMessage[],
  ): Promise<void> => {
    setErrorMessage(null);
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await sendChatMessage({
        messages: allMessages,
        context: { basicInfo, priorityProfile, language },
      });

      if (response.error) {
        const isBlocked = response.errorType === 'blocked';
        setErrorMessage({
          id: 'error',
          role: 'assistant',
          content: t(`coach.errors.${response.errorType ?? 'server'}`),
          timestamp: Date.now(),
          isError: true,
        });
        retryMessagesRef.current = isBlocked ? null : allMessages;
      } else {
        await addChatMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message || common('status.error'),
          timestamp: Date.now(),
        });
        await incrementDailyMessageCount();
        await refreshLimit();
        retryMessagesRef.current = null;
      }
    } catch {
      setErrorMessage({
        id: 'error',
        role: 'assistant',
        content: t('coach.errors.network'),
        timestamp: Date.now(),
        isError: true,
      });
      retryMessagesRef.current = allMessages;
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleSend = async (text?: string): Promise<void> => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading || limitReached) return;

    const check = sanitizeUserMessage(messageText);
    if (!check.safe) {
      setErrorMessage({
        id: 'error',
        role: 'assistant',
        content: t('coach.errors.blocked'),
        timestamp: Date.now(),
        isError: true,
      });
      setInputText('');
      return;
    }

    setInputText('');
    Keyboard.dismiss();

    const userMessage: IChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: check.sanitizedText,
      timestamp: Date.now(),
    };

    await addChatMessage(userMessage);
    const allMessages = [...chatHistory, userMessage];
    await fetchResponse(allMessages);
  };

  const handleRetry = (): void => {
    if (!retryMessagesRef.current || isLoading) return;
    fetchResponse(retryMessagesRef.current);
  };

  const handleChipPress = (chipKey: string): void => {
    const chip = suggestedChips.find((c) => c.key === chipKey);
    if (chip) {
      handleSend(chip.label);
    }
  };

  const displayMessages = useMemo((): IChatMessage[] => {
    const base: IChatMessage[] = chatHistory.length > 0
      ? chatHistory
      : [{
        id: INITIAL_MESSAGE_ID,
        role: 'assistant',
        content: t('coach.initialMessage'),
        timestamp: Date.now(),
      }];

    if (isLoading) {
      return [
        ...base,
        { id: 'loading', role: 'assistant', content: '...', timestamp: Date.now() },
      ];
    }

    if (errorMessage) {
      return [...base, errorMessage];
    }

    return base;
  }, [chatHistory, isLoading, errorMessage, t]);

  const canSendNow = inputText.trim().length > 0 && !isLoading;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('coach.title')}</Text>
          <SettingsButton />
        </View>
        <Text style={styles.subtitle}>{t('coach.subtitle')}</Text>
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
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              translator={translator}
              onRetry={item.isError ? handleRetry : undefined}
            />
          )}
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

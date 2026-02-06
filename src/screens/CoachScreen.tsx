import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { IChatMessage } from '../utils/storage.types';

import { styles } from './CoachScreen.styles';

export function CoachScreen(): React.JSX.Element {
  const { translator, isPremium, chatHistory, addChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const suggestedChips = [
    { key: 'prepare', label: translator.t('coach.chips.prepare') },
    { key: 'sensitive', label: translator.t('coach.chips.sensitive') },
    { key: 'evaluate', label: translator.t('coach.chips.evaluate') },
    { key: 'redFlags', label: translator.t('coach.chips.redFlags') },
  ];

  const handleUnlock = (): void => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(translator.t('paywall.comingSoon'), ToastAndroid.SHORT);
    }
  };

  const handleSend = async (text?: string): Promise<void> => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

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

    // TODO: Replace with actual API call
    setTimeout(async () => {
      const assistantMessage: IChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'This is a placeholder response. The AI Coach feature will be connected to Claude API soon. Your question was: "' +
          messageText +
          '"',
        timestamp: Date.now(),
      };

      await addChatMessage(assistantMessage);
      setIsLoading(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
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

  // Show locked state if not premium
  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>{translator.t('coach.title')}</Text>
          <Text style={styles.subtitle}>{translator.t('coach.subtitle')}</Text>
        </View>

        <View style={styles.lockedContainer}>
          <Feather name="lock" size={48} color={colors.textSecondary} style={styles.lockedIcon} />
          <Text style={styles.lockedTitle}>{translator.t('paywall.title')}</Text>
          <Text style={styles.lockedDescription}>{translator.t('paywall.description')}</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Feather name="check" size={16} color={colors.success} style={styles.featureIcon} />
              <Text style={styles.featureText}>{translator.t('paywall.features.unlimited')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check" size={16} color={colors.success} style={styles.featureIcon} />
              <Text style={styles.featureText}>{translator.t('paywall.features.cultural')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check" size={16} color={colors.success} style={styles.featureIcon} />
              <Text style={styles.featureText}>{translator.t('paywall.features.analysis')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check" size={16} color={colors.success} style={styles.featureIcon} />
              <Text style={styles.featureText}>{translator.t('paywall.features.followup')}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
            <Text style={styles.unlockButtonText}>{translator.t('paywall.unlock')}</Text>
          </TouchableOpacity>
          <Text style={styles.comingSoonText}>{translator.t('paywall.comingSoon')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{translator.t('coach.title')}</Text>
        <Text style={styles.subtitle}>{translator.t('coach.subtitle')}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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

        {chatHistory.length === 0 && (
          <View style={styles.chipsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestedChips.map((chip) => (
                <TouchableOpacity
                  key={chip.key}
                  style={styles.chip}
                  onPress={() => handleChipPress(chip.key)}
                >
                  <Text style={styles.chipText}>{chip.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={translator.t('coach.placeholder')}
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

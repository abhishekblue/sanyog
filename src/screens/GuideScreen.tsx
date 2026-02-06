import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedAccordion } from '../components/AnimatedAccordion';
import { useApp } from '../context/AppContext';
import { IOutputQuestion } from '../data/outputQuestions';
import { isQuestionLocked, selectQuestionsByProfile } from '../utils/questionSelector';

import { styles } from './GuideScreen.styles';

export function GuideScreen(): React.JSX.Element {
  const { translator, language, priorityProfile, isPremium } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const questions = useMemo(() => {
    if (!priorityProfile) return [];
    return selectQuestionsByProfile(priorityProfile);
  }, [priorityProfile]);

  const handleToggleExpand = (questionId: string, index: number): void => {
    if (!isPremium && isQuestionLocked(index)) return;
    setExpandedId(expandedId === questionId ? null : questionId);
  };

  const renderQuestion = (question: IOutputQuestion, index: number): React.JSX.Element => {
    const isExpanded = expandedId === question.id;
    const isLocked = !isPremium && isQuestionLocked(index);
    const questionText = language === 'hi' ? question.question_hi : question.question_en;
    const whyItMatters = language === 'hi' ? question.whyItMatters_hi : question.whyItMatters_en;
    const whatToListenFor =
      language === 'hi' ? question.whatToListenFor_hi : question.whatToListenFor_en;

    return (
      <TouchableOpacity
        key={question.id}
        style={[styles.questionCard, isLocked && styles.questionCardLocked]}
        onPress={() => handleToggleExpand(question.id, index)}
        activeOpacity={isLocked ? 1 : 0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.questionHeader}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.questionText} numberOfLines={isExpanded ? undefined : 2}>
            {questionText}
          </Text>
          <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
        </View>

        {!isLocked && (
          <AnimatedAccordion isExpanded={isExpanded}>
            <View style={styles.expandedContent}>
              <Text style={styles.sectionTitle}>{translator.t('guide.whyMatters')}</Text>
              <Text style={styles.sectionText}>{whyItMatters}</Text>

              <Text style={styles.sectionTitle}>{translator.t('guide.listenFor')}</Text>
              <Text style={styles.sectionText}>{whatToListenFor}</Text>
            </View>
          </AnimatedAccordion>
        )}

        {isLocked && (
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const lockedCount = questions.length - 7;
  const showPaywall = !isPremium && lockedCount > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{translator.t('guide.title')}</Text>
        <Text style={styles.subtitle}>{translator.t('guide.subtitle')}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {questions.map((question, index) => renderQuestion(question, index))}

        {showPaywall && (
          <View style={styles.paywallBanner}>
            <Text style={styles.paywallTitle}>{translator.t('guide.unlockTitle')}</Text>
            <Text style={styles.paywallDescription}>{translator.t('guide.unlockDescription')}</Text>
            <TouchableOpacity style={styles.paywallButton} activeOpacity={0.8}>
              <Text style={styles.paywallButtonText}>{translator.t('guide.unlockPremium')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.coachButton}
          activeOpacity={0.8}
          onPress={() => {
            if (Platform.OS === 'android') {
              ToastAndroid.show(translator.t('paywall.comingSoon'), ToastAndroid.SHORT);
            }
          }}
        >
          <Text style={styles.coachButtonText}>{translator.t('guide.talkToCoach')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

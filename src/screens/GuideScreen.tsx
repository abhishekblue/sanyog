import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedAccordion } from '../components/AnimatedAccordion';
import { useApp } from '../context/AppContext';
import { IOutputQuestion } from '../data/outputQuestions';
import { selectQuestionsByProfile } from '../utils/questionSelector';

import { styles } from './GuideScreen.styles';

export function GuideScreen(): React.JSX.Element {
  const { translator, language, priorityProfile } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const questions = useMemo(() => {
    if (!priorityProfile) return [];
    return selectQuestionsByProfile(priorityProfile);
  }, [priorityProfile]);

  const handleToggleExpand = (questionId: string): void => {
    setExpandedId(expandedId === questionId ? null : questionId);
  };

  const renderQuestion = (question: IOutputQuestion, index: number): React.JSX.Element => {
    const isExpanded = expandedId === question.id;
    const questionText = language === 'hi' ? question.question_hi : question.question_en;
    const whyItMatters = language === 'hi' ? question.whyItMatters_hi : question.whyItMatters_en;
    const whatToListenFor =
      language === 'hi' ? question.whatToListenFor_hi : question.whatToListenFor_en;

    return (
      <TouchableOpacity
        key={question.id}
        style={styles.questionCard}
        onPress={() => handleToggleExpand(question.id)}
        activeOpacity={0.7}
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

        <AnimatedAccordion isExpanded={isExpanded}>
          <View style={styles.expandedContent}>
            <Text style={styles.sectionTitle}>{translator.t('guide.whyMatters')}</Text>
            <Text style={styles.sectionText}>{whyItMatters}</Text>

            <Text style={styles.sectionTitle}>{translator.t('guide.listenFor')}</Text>
            <Text style={styles.sectionText}>{whatToListenFor}</Text>
          </View>
        </AnimatedAccordion>
      </TouchableOpacity>
    );
  };

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
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { assessmentQuestions, TOTAL_QUESTIONS } from '../data/assessmentQuestions';

import { styles } from './AssessmentScreen.styles';
import { IAssessmentScreenProps } from './screens.types';

export function AssessmentScreen({
  onComplete,
  onBack,
}: IAssessmentScreenProps): React.JSX.Element {
  const { language, translator, assessmentAnswers, setAssessmentAnswer } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = assessmentQuestions[currentIndex];
  const selectedAnswer = assessmentAnswers[currentQuestion.id];
  const progress = (currentIndex + 1) / TOTAL_QUESTIONS;

  const questionText =
    language === 'hi' ? currentQuestion.question_hi : currentQuestion.question_en;

  const handleSelectOption = async (optionId: 'A' | 'B' | 'C' | 'D'): Promise<void> => {
    await setAssessmentAnswer(currentQuestion.id, optionId);
  };

  const handleNext = (): void => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onBack();
    }
  };

  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;
  const canProceed = selectedAnswer !== undefined;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {translator.t('assessment.questionOf', {
            current: currentIndex + 1,
            total: TOTAL_QUESTIONS,
          })}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{questionText}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const optionText = language === 'hi' ? option.text_hi : option.text_en;

          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionButton, isSelected && styles.optionSelected]}
              onPress={() => handleSelectOption(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
            >
              <View style={[styles.optionIndicator, isSelected && styles.optionIndicatorSelected]}>
                <Text style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                  {option.id}
                </Text>
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {optionText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack}>
          <Text style={styles.navButtonText}>{translator.common('buttons.back')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed}
        >
          <Text style={[styles.nextButtonText, !canProceed && styles.nextButtonTextDisabled]}>
            {isLastQuestion
              ? translator.common('buttons.finish')
              : translator.common('buttons.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

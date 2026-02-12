import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { generateGuideSummary } from '../utils/api';
import { calculatePriorityProfile } from '../utils/scoring';

import { styles } from './ProcessingScreen.styles';
import { IProcessingScreenProps } from './screens.types';

const STEP_DURATION = 1425;
const STEP_KEYS = ['step1', 'step2', 'step3', 'step4'] as const;
const PROGRESS_TARGETS = [0.25, 0.55, 0.85, 1.0];

export function ProcessingScreen({ onComplete }: IProcessingScreenProps): React.JSX.Element {
  const {
    translator,
    language,
    basicInfo,
    assessmentAnswers,
    setPriorityProfile,
    setGuideSummary,
  } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const textFade = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  // Fade in content on mount
  useEffect(() => {
    Animated.timing(contentFade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [contentFade]);

  // Run scoring + fire summary generation in parallel (once on mount)
  useEffect(() => {
    async function processResults(): Promise<void> {
      const profile = calculatePriorityProfile(assessmentAnswers);
      await setPriorityProfile(profile);

      // Fire AI summary in background (don't block navigation)
      generateGuideSummary(basicInfo, profile, language, assessmentAnswers).then((summary) => {
        if (summary) setGuideSummary(summary);
      });
    }
    processResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step through the animation phases
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i < STEP_KEYS.length; i++) {
      timers.push(
        setTimeout(() => {
          // Fade out current text
          Animated.timing(textFade, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            setCurrentStep(i);
            // Fade in new text
            Animated.timing(textFade, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }).start();
          });
        }, i * STEP_DURATION)
      );
    }

    // Navigate after all steps complete
    timers.push(
      setTimeout(
        () => {
          onComplete();
        },
        STEP_KEYS.length * STEP_DURATION + 300
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [textFade, onComplete]);

  // Animate progress bar for each step
  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: PROGRESS_TARGETS[currentStep],
      duration: STEP_DURATION - 100,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressWidth]);

  const stepText = translator.t(`processing.${STEP_KEYS[currentStep]}`);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: contentFade }]}>
        <View style={styles.iconContainer}>
          <View style={styles.iconOuter}>
            <View style={styles.iconInner} />
          </View>
        </View>

        <Animated.Text style={[styles.stepText, { opacity: textFade }]}>{stepText}</Animated.Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.subtleText}>{translator.t('app.name')}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

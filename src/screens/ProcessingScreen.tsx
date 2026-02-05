import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { calculatePriorityProfile } from '../utils/scoring';

import { styles } from './ProcessingScreen.styles';
import { IProcessingScreenProps } from './screens.types';

export function ProcessingScreen({ onComplete }: IProcessingScreenProps): React.JSX.Element {
  const { translator, assessmentAnswers, setPriorityProfile, setAssessmentComplete } = useApp();

  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [spinValue, fadeValue]);

  useEffect(() => {
    async function processResults(): Promise<void> {
      const profile = calculatePriorityProfile(assessmentAnswers);

      await setPriorityProfile(profile);
      await setAssessmentComplete(true);

      setTimeout(() => {
        onComplete();
      }, 1500);
    }

    processResults();
  }, [assessmentAnswers, setPriorityProfile, setAssessmentComplete, onComplete]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeValue }]}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
          <View style={styles.spinnerInner} />
        </Animated.View>

        <Text style={styles.title}>{translator.t('processing.analyzing')}</Text>
        <Text style={styles.subtitle}>{translator.t('processing.creating')}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

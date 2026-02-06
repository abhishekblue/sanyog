import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsButton } from '../components/SettingsButton';
import { useApp } from '../context/AppContext';
import { Dimension } from '../data/assessmentQuestions';
import { colors } from '../theme/colors';
import { PriorityLevel } from '../utils/storage.types';

import { styles } from './ResultsScreen.styles';
import { IResultsScreenProps } from './screens.types';

const DIMENSIONS: Dimension[] = ['family', 'career', 'finances', 'lifestyle', 'values'];

const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  high: colors.priorityHigh,
  medium: colors.priorityMedium,
  flexible: colors.priorityFlexible,
};

const PRIORITY_TEXT_COLORS: Record<PriorityLevel, string> = {
  high: colors.textLight,
  medium: colors.textPrimary,
  flexible: colors.textSecondary,
};

export function ResultsScreen({ onContinue }: IResultsScreenProps): React.JSX.Element {
  const { translator, priorityProfile, language } = useApp();

  const getPriorityLabel = (level: PriorityLevel): string => {
    const labels: Record<PriorityLevel, Record<'en' | 'hi', string>> = {
      high: { en: 'HIGH', hi: 'उच्च' },
      medium: { en: 'MEDIUM', hi: 'मध्यम' },
      flexible: { en: 'FLEXIBLE', hi: 'लचीला' },
    };
    return labels[level][language];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>{translator.t('results.title')}</Text>
          <SettingsButton />
        </View>
        <Text style={styles.subtitle}>{translator.t('results.subtitle')}</Text>

        <View style={styles.cardsContainer}>
          {DIMENSIONS.map((dimension) => {
            const priority = priorityProfile?.[dimension] ?? 'flexible';
            const dimensionLabel = translator.t(`assessment.dimensions.${dimension}`);

            return (
              <View key={dimension} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.dimensionName}>{dimensionLabel}</Text>
                  <View
                    style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[priority] }]}
                  >
                    <Text style={[styles.priorityText, { color: PRIORITY_TEXT_COLORS[priority] }]}>
                      {getPriorityLabel(priority)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
        >
          <Text style={styles.continueText}>{translator.t('results.seeGuide')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

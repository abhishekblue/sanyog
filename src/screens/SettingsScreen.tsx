import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { Language } from '../locales';
import { RootStackParamList } from '../navigation/AppNavigator.types';
import { colors } from '../theme/colors';

import { styles } from './SettingsScreen.styles';

const MAX_RETAKES = 3;

export function SettingsScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    translator,
    language,
    setLanguage,
    clearAllData,
    clearAssessmentData,
    retakeCount,
    incrementRetakeCount,
  } = useApp();

  const retakesRemaining = MAX_RETAKES - retakeCount;
  const canRetake = retakesRemaining > 0;

  const handleLanguageToggle = async (): Promise<void> => {
    const newLang: Language = language === 'en' ? 'hi' : 'en';
    await setLanguage(newLang);
  };

  const handleRetakeAssessment = (): void => {
    if (!canRetake) return;
    Alert.alert(translator.t('settings.retake'), translator.t('settings.confirmRetake'), [
      { text: translator.common('buttons.cancel'), style: 'cancel' },
      {
        text: translator.common('buttons.confirm'),
        style: 'destructive',
        onPress: async () => {
          await incrementRetakeCount();
          navigation.goBack();
          await clearAssessmentData();
        },
      },
    ]);
  };

  const handleClearData = (): void => {
    Alert.alert(translator.t('settings.clearData'), translator.t('settings.confirmClear'), [
      { text: translator.common('buttons.cancel'), style: 'cancel' },
      {
        text: translator.common('buttons.confirm'),
        style: 'destructive',
        onPress: async () => {
          navigation.goBack();
          await clearAllData();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{translator.t('settings.title')}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="x" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem} onPress={handleLanguageToggle}>
              <Text style={styles.settingLabel}>{translator.t('settings.language')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.settingValue}>{language === 'en' ? 'English' : 'हिंदी'}</Text>
                <Text style={styles.settingChevron}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, styles.settingItemLast]}
              onPress={handleRetakeAssessment}
              disabled={!canRetake}
            >
              <View>
                <Text style={[styles.settingLabel, !canRetake && styles.settingLabelDisabled]}>
                  {translator.t('settings.retake')}
                </Text>
                <Text style={styles.retakeHint}>
                  {canRetake
                    ? translator.t('settings.retakesRemaining', {
                        count: retakesRemaining,
                      })
                    : translator.t('settings.noRetakesLeft')}
                </Text>
              </View>
              {canRetake && <Text style={styles.settingChevron}>›</Text>}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translator.t('settings.privacy')}</Text>
          <View style={styles.privacyCard}>
            <Text style={styles.privacyText}>{translator.t('settings.privacyText')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <TouchableOpacity
              style={[styles.settingItem, styles.settingItemLast]}
              onPress={handleClearData}
            >
              <Text style={styles.destructiveText}>{translator.t('settings.clearData')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.versionText}>Samvaad v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

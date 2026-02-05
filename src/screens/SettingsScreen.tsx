import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { Language } from '../locales';

import { ISettingsScreenProps } from './screens.types';
import { styles } from './SettingsScreen.styles';

export function SettingsScreen({ onRetakeAssessment }: ISettingsScreenProps): React.JSX.Element {
  const { translator, language, setLanguage, clearAllData, clearAssessmentData } = useApp();

  const handleLanguageToggle = async (): Promise<void> => {
    const newLang: Language = language === 'en' ? 'hi' : 'en';
    await setLanguage(newLang);
  };

  const handleRetakeAssessment = (): void => {
    Alert.alert(translator.t('settings.retake'), translator.t('settings.confirmRetake'), [
      { text: translator.common('cancel'), style: 'cancel' },
      {
        text: translator.common('confirm'),
        style: 'destructive',
        onPress: async () => {
          await clearAssessmentData();
          onRetakeAssessment();
        },
      },
    ]);
  };

  const handleClearData = (): void => {
    Alert.alert(translator.t('settings.clearData'), translator.t('settings.confirmClear'), [
      { text: translator.common('cancel'), style: 'cancel' },
      {
        text: translator.common('confirm'),
        style: 'destructive',
        onPress: async () => {
          await clearAllData();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{translator.t('settings.title')}</Text>
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
            >
              <Text style={styles.settingLabel}>{translator.t('settings.retake')}</Text>
              <Text style={styles.settingChevron}>›</Text>
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

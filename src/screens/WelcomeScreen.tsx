import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { Language } from '../locales';

import { IWelcomeScreenProps } from './screens.types';
import { styles } from './WelcomeScreen.styles';

export function WelcomeScreen({ onGetStarted }: IWelcomeScreenProps): React.JSX.Element {
  const { language, setLanguage, translator } = useApp();

  const handleLanguageToggle = async (): Promise<void> => {
    const newLang: Language = language === 'en' ? 'hi' : 'en';
    await setLanguage(newLang);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.languageToggle}
          onPress={handleLanguageToggle}
          accessibilityLabel="Toggle language"
          accessibilityHint="Switch between English and Hindi"
        >
          <Text style={styles.languageText}>{language === 'en' ? 'हिंदी' : 'English'}</Text>
        </TouchableOpacity>

        <View style={styles.heroSection}>
          <Text style={styles.appName}>{translator.t('app.name')}</Text>
          <Text style={styles.tagline}>{translator.t('welcome.tagline')}</Text>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={onGetStarted}
            accessibilityLabel={translator.t('welcome.getStarted')}
            accessibilityRole="button"
          >
            <Text style={styles.getStartedText}>{translator.t('welcome.getStarted')}</Text>
          </TouchableOpacity>

          <Text style={styles.privacyNote}>{translator.t('welcome.privacyNote')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

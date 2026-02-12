import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaywallModal } from '../components/PaywallModal';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
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
    subscriptionTier,
  } = useApp();
  const { user, signOut, deleteAccount } = useAuth();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const isPremium = subscriptionTier === 'premium';
  const retakesRemaining = MAX_RETAKES - retakeCount;
  const canRetake = retakesRemaining > 0;

  const handleManageSubscription = (): void => {
    Linking.openURL('https://play.google.com/store/account/subscriptions');
  };

  useEffect(() => {
    const onBackPress = (): boolean => {
      navigation.goBack();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navigation]);

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
          await signOut();
        },
      },
    ]);
  };

  const handleDeleteAccount = (): void => {
    // First confirmation
    Alert.alert(
      translator.t('settings.deleteAccount'),
      translator.t('settings.deleteConfirm1'),
      [
        { text: translator.common('buttons.cancel'), style: 'cancel' },
        {
          text: translator.t('settings.deleteButton'),
          style: 'destructive',
          onPress: () => {
            // Second confirmation
            Alert.alert(
              translator.t('settings.deleteAccount'),
              translator.t('settings.deleteConfirm2'),
              [
                { text: translator.common('buttons.cancel'), style: 'cancel' },
                {
                  text: translator.t('settings.deleteButton'),
                  style: 'destructive',
                  onPress: async () => {
                    navigation.goBack();
                    await deleteAccount();
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleSignOut = (): void => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: translator.common('buttons.cancel'), style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          navigation.goBack();
          await signOut();
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
                <Feather name="chevron-right" size={16} color={colors.textSecondary} />
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
              {canRetake && <Feather name="chevron-right" size={16} color={colors.textSecondary} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translator.t('settings.subscription')}</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{translator.t('settings.currentPlan')}</Text>
              <Text style={isPremium ? styles.premiumBadge : styles.settingValue}>
                {isPremium
                  ? translator.t('settings.planPremium')
                  : translator.t('settings.planFree')}
              </Text>
            </View>
            {isPremium ? (
              <TouchableOpacity
                style={[styles.settingItem, styles.settingItemLast]}
                onPress={handleManageSubscription}
              >
                <Text style={styles.settingLabel}>
                  {translator.t('settings.manageSubscription')}
                </Text>
                <Feather name="chevron-right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.settingItem, styles.settingItemLast]}
                onPress={() => setPaywallVisible(true)}
              >
                <Text style={styles.upgradeLinkText}>
                  {translator.t('settings.upgradePremium')}
                </Text>
                <Feather name="chevron-right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translator.t('settings.legal')}</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('Terms')}
            >
              <Text style={styles.settingLabel}>{translator.t('legal.termsTitle')}</Text>
              <Feather name="chevron-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingItem, styles.settingItemLast]}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <Text style={styles.settingLabel}>{translator.t('legal.privacyTitle')}</Text>
              <Feather name="chevron-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
              <Text style={styles.destructiveText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleClearData}
            >
              <Text style={styles.destructiveText}>{translator.t('settings.clearData')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingItem, styles.settingItemLast]}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.destructiveText}>
                {translator.t('settings.deleteAccount')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.versionText}>Samvaad v1.0.0</Text>
        {user && (
          <Text style={styles.versionText}>{user.email || user.phoneNumber || user.uid}</Text>
        )}
      </ScrollView>

      <PaywallModal visible={paywallVisible} onClose={() => setPaywallVisible(false)} />
    </SafeAreaView>
  );
}

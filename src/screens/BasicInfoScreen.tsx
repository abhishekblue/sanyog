import React, { useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsButton } from '../components/SettingsButton';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { IBasicInfo } from '../utils/storage.types';

import { styles } from './BasicInfoScreen.styles';
import { IBasicInfoScreenProps } from './screens.types';

const AGE_RANGES: IBasicInfo['ageRange'][] = ['23-25', '26-28', '29-32', '33-35', '35+'];

const TIMELINE_OPTIONS: IBasicInfo['timeline'][] = ['thisWeek', 'withinMonth', 'exploring'];

export function BasicInfoScreen({ onContinue }: IBasicInfoScreenProps): React.JSX.Element {
  const { translator, setBasicInfo } = useApp();
  const { user, signOut } = useAuth();

  const authEmail = user?.email ?? '';
  const authPhone = user?.phoneNumber?.replace('+91', '') ?? '';
  const authName = user?.displayName ?? '';

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const [name, setName] = useState(authName);
  const [email, setEmail] = useState(authEmail);
  const [phone, setPhone] = useState(authPhone);
  const [gender, setGender] = useState<IBasicInfo['gender'] | null>(null);
  const [ageRange, setAgeRange] = useState<IBasicInfo['ageRange'] | null>(null);
  const [isFirstMeeting, setIsFirstMeeting] = useState<boolean | null>(null);
  const [timeline, setTimeline] = useState<IBasicInfo['timeline'] | null>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidPhone = /^\d{10}$/.test(phone.trim());
  const emailError = email.length > 0 && !isValidEmail;
  const phoneError = phone.length > 0 && !isValidPhone;

  const isFormComplete =
    name.trim() !== '' &&
    isValidEmail &&
    isValidPhone &&
    gender !== null &&
    ageRange !== null &&
    isFirstMeeting !== null &&
    timeline !== null;

  const handleContinue = async (): Promise<void> => {
    if (!isFormComplete) return;

    await setBasicInfo({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gender: gender!,
      ageRange: ageRange!,
      isFirstMeeting: isFirstMeeting!,
      timeline: timeline!,
    });

    onContinue();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>{translator.t('basicInfo.title')}</Text>
          <SettingsButton />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{translator.t('basicInfo.name.label')}</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder={translator.t('basicInfo.name.placeholder')}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{translator.t('basicInfo.email.label')}</Text>
          <TextInput
            ref={emailRef}
            style={[
              styles.textInput,
              emailError && styles.textInputError,
              !!authEmail && styles.textInputDisabled,
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder={translator.t('basicInfo.email.placeholder')}
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            blurOnSubmit={false}
            editable={!authEmail}
          />
          {emailError && (
            <Text style={styles.errorText}>{translator.t('basicInfo.errors.invalidEmail')}</Text>
          )}
          {!!authEmail && (
            <TouchableOpacity onPress={signOut} accessibilityRole="link">
              <Text style={styles.changeLink}>
                {translator.t('basicInfo.email.changeEmail')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{translator.t('basicInfo.phone.label')}</Text>
          <TextInput
            ref={phoneRef}
            style={[
              styles.textInput,
              phoneError && styles.textInputError,
              !!authPhone && styles.textInputDisabled,
            ]}
            value={phone}
            onChangeText={setPhone}
            placeholder={translator.t('basicInfo.phone.placeholder')}
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            maxLength={10}
            returnKeyType="done"
            editable={!authPhone}
          />
          {phoneError && (
            <Text style={styles.errorText}>{translator.t('basicInfo.errors.invalidPhone')}</Text>
          )}
          {!!authPhone && (
            <TouchableOpacity onPress={signOut} accessibilityRole="link">
              <Text style={styles.changeLink}>
                {translator.t('basicInfo.phone.changeNumber')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{translator.t('basicInfo.gender.label')}</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'male' && styles.optionSelected]}
              onPress={() => setGender('male')}
              accessibilityRole="radio"
              accessibilityState={{ checked: gender === 'male' }}
            >
              <Text style={[styles.optionText, gender === 'male' && styles.optionTextSelected]}>
                {translator.t('basicInfo.gender.male')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'female' && styles.optionSelected]}
              onPress={() => setGender('female')}
              accessibilityRole="radio"
              accessibilityState={{ checked: gender === 'female' }}
            >
              <Text style={[styles.optionText, gender === 'female' && styles.optionTextSelected]}>
                {translator.t('basicInfo.gender.female')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{translator.t('basicInfo.age.label')}</Text>
          <View style={styles.chipRow}>
            {AGE_RANGES.map((age) => (
              <TouchableOpacity
                key={age}
                style={[styles.chip, ageRange === age && styles.chipSelected]}
                onPress={() => setAgeRange(age)}
                accessibilityRole="radio"
                accessibilityState={{ checked: ageRange === age }}
              >
                <Text style={[styles.chipText, ageRange === age && styles.chipTextSelected]}>
                  {age}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{translator.t('basicInfo.firstMeeting.label')}</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.optionButton, isFirstMeeting === true && styles.optionSelected]}
              onPress={() => setIsFirstMeeting(true)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isFirstMeeting === true }}
            >
              <Text
                style={[styles.optionText, isFirstMeeting === true && styles.optionTextSelected]}
              >
                {translator.t('basicInfo.firstMeeting.yes')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, isFirstMeeting === false && styles.optionSelected]}
              onPress={() => setIsFirstMeeting(false)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isFirstMeeting === false }}
            >
              <Text
                style={[styles.optionText, isFirstMeeting === false && styles.optionTextSelected]}
              >
                {translator.t('basicInfo.firstMeeting.no')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{translator.t('basicInfo.timeline.label')}</Text>
          <View style={styles.chipRow}>
            {TIMELINE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, timeline === option && styles.chipSelected]}
                onPress={() => setTimeline(option)}
                accessibilityRole="radio"
                accessibilityState={{ checked: timeline === option }}
              >
                <Text style={[styles.chipText, timeline === option && styles.chipTextSelected]}>
                  {translator.t(`basicInfo.timeline.${option}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.continueButton, !isFormComplete && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!isFormComplete}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isFormComplete }}
        >
          <Text style={[styles.continueText, !isFormComplete && styles.continueTextDisabled]}>
            {translator.common('buttons.continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

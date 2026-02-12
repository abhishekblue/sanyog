import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

import { styles } from './AuthScreen.styles';

export function AuthScreen(): React.JSX.Element {
  const { signInWithGoogle, sendPhoneOtp, confirmPhoneOtp } = useAuth();

  const [phone, setPhone] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = googleLoading || phoneLoading;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  if (phoneLoading) {
    const ease = Easing.inOut(Easing.ease);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3, duration: 800, easing: ease, useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, duration: 800, easing: ease, useNativeDriver: true,
        }),
      ])
    ).start();
  } else {
    pulseAnim.setValue(1);
  }

  const handleGoogleSignIn = async (): Promise<void> => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google Sign-In failed';
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendOtp = async (): Promise<void> => {
    const trimmed = phone.trim();
    if (!trimmed) return;

    const formatted = trimmed.startsWith('+') ? trimmed : `+91${trimmed}`;
    setPhoneLoading(true);
    setError(null);
    try {
      const id = await sendPhoneOtp(formatted);
      setVerificationId(id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(message);
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async (): Promise<void> => {
    if (!verificationId || otp.length < 6) return;

    setPhoneLoading(true);
    setError(null);
    try {
      await confirmPhoneOtp(verificationId, otp);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <Text style={styles.appName}>Samvaad</Text>
            <Text style={styles.tagline}>Your personal meeting prep companion</Text>
          </View>

          <View style={styles.bottomSection}>
            {phoneLoading ? (
              <Animated.Text style={[styles.verifyingText, { opacity: pulseAnim }]}>
                Verifying...
              </Animated.Text>
            ) : (
              <>
                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <Image
                    source={require('../../assets/google-logo.png')}
                    style={styles.googleLogo}
                  />
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {!verificationId ? (
                  <View style={styles.phoneInputRow}>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="Phone number"
                      placeholderTextColor={colors.textSecondary}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                    <TouchableOpacity
                      style={[
                        styles.sendOtpButton,
                        !phone.trim() && styles.sendOtpButtonDisabled,
                      ]}
                      onPress={handleSendOtp}
                      disabled={!phone.trim()}
                    >
                      <Text style={styles.sendOtpText}>Send OTP</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <TextInput
                      style={styles.otpInput}
                      placeholder="- - - - - -"
                      placeholderTextColor={colors.border}
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                    />
                    <TouchableOpacity
                      style={[
                        styles.verifyButton,
                        otp.length < 6 && styles.verifyButtonDisabled,
                      ]}
                      onPress={handleVerifyOtp}
                      disabled={otp.length < 6}
                    >
                      <Text style={styles.verifyButtonText}>Verify</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

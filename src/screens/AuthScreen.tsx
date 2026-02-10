import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

import { styles } from './AuthScreen.styles';

export function AuthScreen(): React.JSX.Element {
  const { signInWithGoogle, sendPhoneOtp, confirmPhoneOtp } = useAuth();

  const [phone, setPhone] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google Sign-In failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (): Promise<void> => {
    const trimmed = phone.trim();
    if (!trimmed) return;

    const formatted = trimmed.startsWith('+') ? trimmed : `+91${trimmed}`;
    setLoading(true);
    setError(null);
    try {
      const id = await sendPhoneOtp(formatted);
      setVerificationId(id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (): Promise<void> => {
    if (!verificationId || otp.length < 6) return;

    setLoading(true);
    setError(null);
    try {
      await confirmPhoneOtp(verificationId, otp);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.appName}>Samvaad</Text>
          <Text style={styles.tagline}>Your personal meeting prep companion</Text>
        </View>

        <View style={styles.bottomSection}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.textPrimary} />
            ) : (
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            )}
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
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.sendOtpButton, !phone.trim() && styles.sendOtpButtonDisabled]}
                onPress={handleSendOtp}
                disabled={!phone.trim() || loading}
              >
                <Text style={styles.sendOtpText}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.otpInput}
                placeholder="Enter OTP"
                placeholderTextColor={colors.textSecondary}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.verifyButton, otp.length < 6 && styles.verifyButtonDisabled]}
                onPress={handleVerifyOtp}
                disabled={otp.length < 6 || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.textLight} />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

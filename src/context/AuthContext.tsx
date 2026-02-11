/**
 * Firebase Auth context
 * Manages authentication state, Google Sign-In, and Phone OTP
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface IAuthState {
  user: FirebaseAuthTypes.User | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  sendPhoneOtp: (phoneNumber: string) => Promise<string>;
  confirmPhoneOtp: (verificationId: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<IAuthState | undefined>(undefined);

interface IAuthProviderProps {
  children: React.ReactNode;
}

GoogleSignin.configure({
  webClientId: '117179963177-ccd4crsak6nk14mdcbr6ocedhcdtab5q.apps.googleusercontent.com',
});

export function AuthProvider({ children }: IAuthProviderProps): React.JSX.Element {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (!response.data?.idToken) {
      throw new Error('Google Sign-In failed: no ID token');
    }
    const credential = auth.GoogleAuthProvider.credential(response.data.idToken);
    await auth().signInWithCredential(credential);
  };

  const sendPhoneOtp = async (phoneNumber: string): Promise<string> => {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    if (!confirmation.verificationId) {
      throw new Error('Phone OTP failed: no verification ID');
    }
    return confirmation.verificationId;
  };

  const confirmPhoneOtp = async (verificationId: string, code: string): Promise<void> => {
    const credential = auth.PhoneAuthProvider.credential(verificationId, code);
    await auth().signInWithCredential(credential);
  };

  const signOut = async (): Promise<void> => {
    await GoogleSignin.signOut();
    await auth().signOut();
  };

  const value: IAuthState = {
    user,
    isAuthLoading,
    signInWithGoogle,
    sendPhoneOtp,
    confirmPhoneOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): IAuthState {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

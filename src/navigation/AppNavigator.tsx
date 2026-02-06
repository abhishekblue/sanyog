import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { AssessmentScreen } from '../screens/AssessmentScreen';
import { BasicInfoScreen } from '../screens/BasicInfoScreen';
import { CoachScreen } from '../screens/CoachScreen';
import { GuideScreen } from '../screens/GuideScreen';
import { ProcessingScreen } from '../screens/ProcessingScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { colors } from '../theme/colors';

import {
  MainTabParamList,
  OnboardingStackParamList,
  RootStackParamList,
} from './AppNavigator.types';

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function OnboardingNavigator(): React.JSX.Element {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeScreen onGetStarted={() => navigation.navigate('BasicInfo')} />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="BasicInfo">
        {({ navigation }) => (
          <BasicInfoScreen onContinue={() => navigation.navigate('Assessment')} />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Assessment">
        {({ navigation }) => (
          <AssessmentScreen
            onComplete={() => navigation.navigate('Processing')}
            onBack={() => navigation.goBack()}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Processing">
        {({ navigation }) => <ProcessingScreen onComplete={() => navigation.navigate('Results')} />}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Results">
        {({ navigation }) => (
          <ResultsScreen
            onContinue={() =>
              navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] })
            }
          />
        )}
      </OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  );
}

function MainTabNavigator(): React.JSX.Element {
  const { translator } = useApp();

  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <MainTab.Screen
        name="Guide"
        component={GuideScreen}
        options={{
          tabBarLabel: translator.t('guide.title'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
        }}
      />
      <MainTab.Screen
        name="Coach"
        component={CoachScreen}
        options={{
          tabBarLabel: translator.t('coach.title'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💬</Text>,
        }}
      />
      <MainTab.Screen
        name="Settings"
        options={{
          tabBarLabel: translator.t('settings.title'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
        }}
      >
        {({ navigation }) => (
          <SettingsScreen
            onRetakeAssessment={() =>
              navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Onboarding' }] })
            }
          />
        )}
      </MainTab.Screen>
    </MainTab.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  const { isLoading, assessmentComplete } = useApp();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {assessmentComplete ? (
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

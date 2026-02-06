import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, BackHandler, ToastAndroid, View } from 'react-native';

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
  const { basicInfo } = useApp();
  const initialRoute = basicInfo ? 'Assessment' : 'Welcome';

  return (
    <OnboardingStack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
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
  const lastBackPress = useRef(0);

  useEffect(() => {
    const onBackPress = (): boolean => {
      const now = Date.now();
      if (now - lastBackPress.current < 2000) {
        BackHandler.exitApp();
        return true;
      }
      lastBackPress.current = now;
      ToastAndroid.show(translator.common('status.pressBackToExit'), ToastAndroid.SHORT);
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [translator]);

  return (
    <MainTab.Navigator
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          marginBottom: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <MainTab.Screen
        name="Guide"
        component={GuideScreen}
        options={{
          tabBarLabel: translator.t('guide.tabLabel'),
          tabBarIcon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
        }}
      />
      <MainTab.Screen
        name="Coach"
        component={CoachScreen}
        options={{
          tabBarLabel: translator.t('coach.tabLabel'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="Settings"
        options={{
          tabBarLabel: translator.t('settings.title'),
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      >
        {() => <SettingsScreen />}
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

import { Feather } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AssessmentScreen } from '../screens/AssessmentScreen';
import { AuthScreen } from '../screens/AuthScreen';
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
  const { basicInfo, setAssessmentComplete } = useApp();
  const { user } = useAuth();
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
            onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Processing">
        {({ navigation }) => <ProcessingScreen onComplete={() => navigation.navigate('Results')} />}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Results">
        {() => (
          <ResultsScreen
            onContinue={async () => {
              if (user) {
                await firestore()
                  .collection('users')
                  .doc(user.uid)
                  .set({ assessmentComplete: true }, { merge: true });
              }
              setAssessmentComplete(true);
            }}
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
    </MainTab.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  const { isLoading, assessmentComplete } = useApp();
  const { user, isAuthLoading } = useAuth();

  if (isLoading || isAuthLoading) {
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
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthScreen} />
        ) : assessmentComplete ? (
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
        <RootStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

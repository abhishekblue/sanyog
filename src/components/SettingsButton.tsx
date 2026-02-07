import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../navigation/AppNavigator.types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export function SettingsButton(): React.JSX.Element {
  const navigation = useNavigation<RootNav>();

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Settings')}
        accessibilityLabel="Settings"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name="settings" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  button: {
    padding: 4,
  },
});

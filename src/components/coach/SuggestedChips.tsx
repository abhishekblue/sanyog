import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './coach.styles';
import { ISuggestedChipsProps } from './coach.types';

export function SuggestedChips({ chips, onChipPress }: ISuggestedChipsProps): React.JSX.Element {
  return (
    <View style={styles.chipsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            style={styles.chip}
            onPress={() => onChipPress(chip.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipText}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

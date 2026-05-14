import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { Card } from '../atoms/Card';
import { SectionLabel } from '../atoms/SectionLabel';

interface Props {
  value: number;
  onChange: (seconds: number) => void;
}

export function RestTimeInput({ value, onChange }: Props) {
  const [input, setInput] = useState(String(value));

  function commit() {
    const parsed = parseInt(input, 10);
    if (!isNaN(parsed) && parsed >= 0) onChange(parsed);
  }

  return (
    <Card>
      <SectionLabel>REST BETWEEN EXERCISES</SectionLabel>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={input}
          onChangeText={setInput}
          onBlur={commit}
          placeholder="0"
          placeholderTextColor={Colors.muted}
        />
        <Text style={styles.unit}>seconds</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.inputBg,
    color: Colors.text,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    fontSize: FontSize.input,
  },
  unit: {
    color: Colors.muted,
    marginLeft: Spacing.md,
    fontSize: FontSize.body,
  },
});

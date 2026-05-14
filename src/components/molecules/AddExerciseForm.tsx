import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { Exercise } from '../../types';
import { Card } from '../atoms/Card';
import { SectionLabel } from '../atoms/SectionLabel';

interface Props {
  onAdd: (exercise: Omit<Exercise, 'id'>) => void;
}

export function AddExerciseForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');

  function handleAdd() {
    const trimmedName = name.trim();
    const parsedDuration = parseInt(duration, 10);

    if (!trimmedName) {
      Alert.alert('Error', 'Enter an exercise name.');
      return;
    }
    if (!parsedDuration || parsedDuration <= 0) {
      Alert.alert('Error', 'Enter a valid duration in seconds.');
      return;
    }

    onAdd({ name: trimmedName, duration: parsedDuration });
    setName('');
    setDuration('');
  }

  return (
    <Card>
      <SectionLabel>ADD EXERCISE</SectionLabel>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Exercise name (e.g. Jab-Cross)"
        placeholderTextColor={Colors.muted}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.durationInput]}
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
          placeholder="Duration (sec)"
          placeholderTextColor={Colors.muted}
        />
        <Text style={styles.unit}>seconds</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonLabel}>+ ADD</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.inputBg,
    color: Colors.text,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    fontSize: FontSize.input,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  durationInput: {
    flex: 1,
    marginBottom: 0,
  },
  unit: {
    color: Colors.muted,
    marginLeft: Spacing.md,
    fontSize: FontSize.body,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  addButtonLabel: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: FontSize.bodyLg,
    letterSpacing: 1,
  },
});

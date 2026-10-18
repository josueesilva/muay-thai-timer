import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { Exercise } from '../../types';
import { Card } from '../atoms/Card';
import { SectionLabel } from '../atoms/SectionLabel';
import { DurationStepper } from './DurationStepper';

interface Props {
  onAdd: (exercise: Omit<Exercise, 'id'>) => void;
}
const DEFAULT_DURATION = 30;
const DURATION_PRESETS = [30, 60, 120, 180];

export function AddExerciseForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [nameError, setNameError] = useState('');

  function handleAdd() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError('Enter an exercise name.');
      return;
    }
    if (duration <= 0) {
      return;
    }

    onAdd({ name: trimmedName, duration });
    setName('');
    setNameError('');
  }

  return (
    <Card>
      <SectionLabel>ADD EXERCISE</SectionLabel>
      <TextInput
        style={[styles.input, !!nameError && styles.inputError]}
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (nameError) setNameError('');
        }}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
        placeholder="Exercise name (e.g. Jab-Cross)"
        placeholderTextColor={Colors.muted}
      />
      {!!nameError && <Text style={styles.error}>{nameError}</Text>}

      <DurationStepper
        value={duration}
        onChange={setDuration}
        min={5}
        presets={DURATION_PRESETS}
      />

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
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: Colors.primary,
    marginBottom: Spacing.xs,
  },
  error: {
    color: Colors.primary,
    fontSize: FontSize.caption,
    marginBottom: Spacing.md,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  addButtonLabel: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: FontSize.bodyLg,
    letterSpacing: 1,
  },
});

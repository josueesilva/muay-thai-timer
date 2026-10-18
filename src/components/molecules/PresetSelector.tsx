import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { WORKOUT_PRESETS, WorkoutPreset } from '../../constants/presets';
import { Card } from '../atoms/Card';
import { SectionLabel } from '../atoms/SectionLabel';

interface Props {
  onSelectPreset: (preset: WorkoutPreset) => void;
}

export function PresetSelector({ onSelectPreset }: Props) {
  return (
    <Card>
      <SectionLabel>WORKOUT PRESETS</SectionLabel>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {WORKOUT_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => onSelectPreset(preset)}>
            <Text style={styles.icon}>{preset.icon}</Text>
            <Text style={styles.name}>{preset.name}</Text>
            <Text style={styles.roundsBadge}>{preset.rounds} ROUNDS</Text>
            <Text style={styles.desc}>{preset.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: Spacing.xs,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: 170,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    fontSize: 26,
    marginBottom: Spacing.xs,
  },
  name: {
    color: Colors.text,
    fontSize: FontSize.body,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  roundsBadge: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  desc: {
    color: Colors.muted,
    fontSize: FontSize.label,
    lineHeight: 14,
  },
});

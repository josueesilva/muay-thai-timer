import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { Card } from '../atoms/Card';
import { SectionLabel } from '../atoms/SectionLabel';

interface Props {
  value: number;
  onChange: (rounds: number) => void;
}

const PRESET_ROUNDS = [1, 3, 5, 10];

export function RoundCountInput({ value, onChange }: Props) {
  function decrement() {
    if (value > 1) onChange(value - 1);
  }

  function increment() {
    if (value < 20) onChange(value + 1);
  }

  return (
    <Card>
      <SectionLabel>ROUNDS</SectionLabel>

      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={[styles.btn, value <= 1 && styles.btnDisabled]}
          disabled={value <= 1}
          onPress={decrement}>
          <Text style={styles.btnText}>−</Text>
        </TouchableOpacity>

        <View style={styles.display}>
          <Text style={styles.valueText}>{value}</Text>
          <Text style={styles.unitText}>{value === 1 ? 'ROUND' : 'ROUNDS'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, value >= 20 && styles.btnDisabled]}
          disabled={value >= 20}
          onPress={increment}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chipsRow}>
        {PRESET_ROUNDS.map((r) => {
          const selected = value === r;
          return (
            <TouchableOpacity
              key={r}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => onChange(r)}>
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {r} {r === 1 ? 'Round' : 'Rounds'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  btn: {
    backgroundColor: Colors.inputBg,
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: Colors.text,
    fontSize: FontSize.heading,
    fontWeight: '700',
    lineHeight: 30,
  },
  display: {
    alignItems: 'center',
    minWidth: 100,
  },
  valueText: {
    color: Colors.accent,
    fontSize: FontSize.display,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  unitText: {
    color: Colors.muted,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.sm,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipText: {
    color: Colors.muted,
    fontSize: FontSize.caption,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Colors.background,
    fontWeight: '800',
  },
});

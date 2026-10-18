import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { formatTime } from '../../utils/time';

interface Props {
  value: number;
  onChange: (seconds: number) => void;
  step?: number;
  min?: number;
  max?: number;
  presets?: number[];
}

export function DurationStepper({
  value,
  onChange,
  step = 5,
  min = 0,
  max = 3600,
  presets,
}: Props) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.stepButton}
          accessibilityLabel={`Decrease by ${step} seconds`}
          onPress={() => onChange(clamp(value - step))}>
          <Text style={styles.stepLabel}>−</Text>
        </TouchableOpacity>

        <View style={styles.valueBox}>
          <Text style={styles.value}>{formatTime(value)}</Text>
          <Text style={styles.valueHint}>{value}s</Text>
        </View>

        <TouchableOpacity
          style={styles.stepButton}
          accessibilityLabel={`Increase by ${step} seconds`}
          onPress={() => onChange(clamp(value + step))}>
          <Text style={styles.stepLabel}>+</Text>
        </TouchableOpacity>
      </View>

      {presets && (
        <View style={styles.presets}>
          {presets.map((p) => {
            const active = p === value;
            return (
              <TouchableOpacity
                key={p}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => onChange(clamp(p))}>
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                  {formatTime(p)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 32,
  },
  valueBox: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    color: Colors.accent,
    fontSize: FontSize.heading,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  valueHint: {
    color: Colors.muted,
    fontSize: FontSize.caption,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 20,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipLabel: {
    color: Colors.text,
    fontSize: FontSize.body,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: Colors.background,
  },
});


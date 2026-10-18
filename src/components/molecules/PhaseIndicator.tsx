import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { Phase } from '../../types';

interface Props {
  phase: Phase;
  isWarning?: boolean;
}

const PHASE_CONFIG: Record<Phase, { label: string; backgroundColor: string }> = {
  exercise: { label: '🥊 EXERCISE', backgroundColor: Colors.primary },
  rest: { label: '💤 REST', backgroundColor: Colors.restSurface },
};

export function PhaseIndicator({ phase, isWarning = false }: Props) {
  const config = PHASE_CONFIG[phase];
  const backgroundColor = isWarning ? Colors.warning : config.backgroundColor;
  const label = isWarning ? '⚠️ 10 SECONDS LEFT' : config.label;

  return (
    <View style={[styles.bar, { backgroundColor }]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    marginHorizontal: Spacing.xl,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  label: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: FontSize.body,
    letterSpacing: 3,
  },
});

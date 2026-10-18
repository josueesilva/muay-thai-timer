import { DimensionValue, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface Props {
  progress: number;
  variant?: 'exercise' | 'rest' | 'warning';
}

export function ProgressBar({ progress, variant = 'exercise' }: Props) {
  const clampedWidth: DimensionValue = `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%`;
  let fillColor: string = Colors.primary;
  if (variant === 'rest') {
    fillColor = Colors.success;
  } else if (variant === 'warning') {
    fillColor = Colors.warning;
  }

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: clampedWidth, backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: Colors.inputBg,
    marginHorizontal: Spacing.xl,
    borderRadius: Radius.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.sm,
  },
});

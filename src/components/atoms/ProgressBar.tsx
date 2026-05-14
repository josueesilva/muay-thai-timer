import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface Props {
  progress: number;
  variant?: 'exercise' | 'rest';
}

export function ProgressBar({ progress, variant = 'exercise' }: Props) {
  const clampedWidth = `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%`;
  const fillColor = variant === 'rest' ? Colors.success : Colors.primary;

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

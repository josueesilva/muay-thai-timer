import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../constants/theme';
import { IconButton } from '../atoms/IconButton';

interface Props {
  isRunning: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerControls({ isRunning, onPlay, onPause, onReset }: Props) {
  return (
    <View style={styles.row}>
      <IconButton icon="↺" size="sm" onPress={onReset} />
      <IconButton
        icon={isRunning ? '⏸' : '▶'}
        size="lg"
        onPress={isRunning ? onPause : onPlay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
});

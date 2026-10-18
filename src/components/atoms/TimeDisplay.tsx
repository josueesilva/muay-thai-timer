import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';

interface Props {
  time: string;
  variant?: 'exercise' | 'rest' | 'warning';
}

export function TimeDisplay({ time, variant = 'exercise' }: Props) {
  let color: string = Colors.accent;
  if (variant === 'rest') {
    color = Colors.success;
  } else if (variant === 'warning') {
    color = Colors.warning;
  }

  return <Text style={[styles.text, { color }]}>{time}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.countdown,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
});

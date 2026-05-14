import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';

interface Props {
  time: string;
  variant?: 'exercise' | 'rest';
}

export function TimeDisplay({ time, variant = 'exercise' }: Props) {
  const color = variant === 'rest' ? Colors.success : Colors.accent;
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

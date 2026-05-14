import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize, Spacing } from '../../constants/theme';

interface Props {
  children: string;
}

export function SectionLabel({ children }: Props) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    color: Colors.accent,
    fontWeight: '800',
    fontSize: FontSize.label,
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
});

import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';

interface Props extends TouchableOpacityProps {
  label: string;
}

export function PrimaryButton({ label, disabled, style, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      disabled={disabled}
      {...rest}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: Colors.background,
    fontWeight: '900',
    fontSize: FontSize.title,
    letterSpacing: 2,
  },
});

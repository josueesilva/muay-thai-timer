import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface Props extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...rest }: Props) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
});

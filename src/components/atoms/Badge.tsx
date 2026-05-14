import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../../constants/theme';

interface Props {
  value: number;
}

const SIZE = 28;

export function Badge({ value }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  text: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSize.caption,
  },
});

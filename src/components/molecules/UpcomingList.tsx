import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { Exercise } from '../../types';
import { formatTime } from '../../utils/time';

interface Props {
  exercises: Exercise[];
  fromIndex: number;
}

export function UpcomingList({ exercises, fromIndex }: Props) {
  const upcoming = exercises.slice(fromIndex + 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>UPCOMING</Text>
      {upcoming.length === 0 ? (
        <Text style={styles.item}>Last exercise!</Text>
      ) : (
        upcoming.map((ex, i) => (
          <Text key={ex.id} style={styles.item}>
            {fromIndex + 2 + i}. {ex.name} — {formatTime(ex.duration)}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    minHeight: 60,
  },
  title: {
    color: Colors.accent,
    fontWeight: '800',
    fontSize: FontSize.label,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  item: {
    color: Colors.muted,
    fontSize: FontSize.caption,
    marginBottom: Spacing.xs,
  },
});

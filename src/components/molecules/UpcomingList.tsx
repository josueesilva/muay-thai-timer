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
  const nextExercise = upcoming[0];
  const laterExercises = upcoming.slice(1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>UPCOMING</Text>
      {upcoming.length === 0 ? (
        <Text style={styles.emptyText}>Last exercise of the workout! 🥊</Text>
      ) : (
        <>
          {nextExercise && (
            <View style={styles.nextBox}>
              <View style={styles.nextBadge}>
                <Text style={styles.nextBadgeText}>UP NEXT</Text>
              </View>
              <Text style={styles.nextName} numberOfLines={1}>
                {nextExercise.name}
              </Text>
              <Text style={styles.nextDuration}>{formatTime(nextExercise.duration)}</Text>
            </View>
          )}

          {laterExercises.map((ex, i) => (
            <Text key={ex.id} style={styles.item}>
              {fromIndex + 3 + i}. {ex.name} — {formatTime(ex.duration)}
            </Text>
          ))}
        </>
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
  nextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  nextBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  nextBadgeText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  nextName: {
    color: Colors.text,
    fontSize: FontSize.body,
    fontWeight: '700',
    flex: 1,
  },
  nextDuration: {
    color: Colors.accent,
    fontSize: FontSize.body,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  item: {
    color: Colors.muted,
    fontSize: FontSize.caption,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.xs,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: FontSize.caption,
    fontStyle: 'italic',
  },
});

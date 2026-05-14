import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors } from '../../constants/theme';

type Size = 'sm' | 'lg';

interface Props extends TouchableOpacityProps {
  icon: string;
  size?: Size;
}

const CONFIG: Record<Size, { container: number; fontSize: number; bg: string; color: string }> = {
  sm: { container: 60, fontSize: 24, bg: Colors.surface, color: Colors.muted },
  lg: { container: 80, fontSize: 32, bg: Colors.accent, color: Colors.background },
};

export function IconButton({ icon, size = 'sm', style, ...rest }: Props) {
  const { container, fontSize, bg, color } = CONFIG[size];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          width: container,
          height: container,
          borderRadius: container / 2,
          backgroundColor: bg,
        },
        size === 'sm' && styles.border,
        style,
      ]}
      {...rest}>
      <Text style={{ color, fontSize }}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderWidth: 2,
    borderColor: Colors.border,
  },
});

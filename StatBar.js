import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';

/**
 * StatBar — Barra de progresso animada para os atributos do personagem
 */
export default function StatBar({ label, icon, value, max = 100, color, darkColor, delta = 0 }) {
  const progress = useSharedValue(value / max);
  const flashOpacity = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(value / max, {
      damping: 18,
      stiffness: 120,
      mass: 1,
    });

    if (delta !== 0) {
      // Pisca o indicador de mudança
      flashOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 400 })
      );
    }
  }, [value, delta]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progress.value * 100, 100)}%`,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const isLow = value <= 20;
  const barColor = isLow ? COLORS.danger : color;

  return (
    <View style={styles.container}>
      {/* Label row */}
      <View style={styles.labelRow}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          {delta !== 0 && (
            <Animated.Text
              style={[
                styles.delta,
                { color: delta > 0 ? COLORS.success : COLORS.danger },
                flashStyle,
              ]}
            >
              {delta > 0 ? `+${delta}` : delta}
            </Animated.Text>
          )}
          <Text style={[styles.value, isLow && styles.valueLow]}>
            {typeof value === 'number' && value > 999
              ? `R$${value.toLocaleString('pt-BR')}`
              : `${Math.round(value)}`}
          </Text>
        </View>
      </View>

      {/* Track */}
      <View style={[styles.track, { backgroundColor: darkColor }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: barColor }, barStyle]}
        />
        {isLow && (
          <Animated.View
            style={[styles.dangerPulse, { backgroundColor: COLORS.danger }, flashStyle]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm + 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    flex: 1,
    fontSize: FONTS.sizeSm,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weightMedium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
    minWidth: 32,
    textAlign: 'right',
  },
  valueLow: {
    color: COLORS.danger,
  },
  delta: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightBold,
  },
  track: {
    height: 6,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
    minWidth: 4,
  },
  dangerPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS.full,
    opacity: 0.3,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { getPhase, PHASE_MAP } from '../data/scenarios';

export default function AgeTimeline({ age }) {
  const phase = getPhase(age);
  const phaseInfo = PHASE_MAP[phase];
  const phaseProgress = (age - phaseInfo.min) / (phaseInfo.max - phaseInfo.min);
  const lifeProgress = (age - 18) / (65 - 18);

  return (
    <View style={styles.container}>
      {/* Topo: idade em destaque + fase */}
      <View style={styles.header}>
        <View>
          <Text style={styles.ageNumber}>{age}</Text>
          <Text style={styles.ageLabel}>anos</Text>
        </View>
        <View style={styles.phaseInfo}>
          <Text style={styles.phaseLabel}>{phaseInfo.label}</Text>
          <Text style={styles.phaseRange}>
            {phaseInfo.min}–{phaseInfo.max} anos
          </Text>
        </View>
        <View style={styles.lifePct}>
          <Text style={styles.lifePctNumber}>
            {Math.round(lifeProgress * 100)}%
          </Text>
          <Text style={styles.lifePctLabel}>da jornada</Text>
        </View>
      </View>

      {/* Barra de progresso da vida inteira */}
      <View style={styles.lifeTrack}>
        {/* Segmentos das fases */}
        {Object.entries(PHASE_MAP).map(([key, info], i) => {
          const segWidth = ((info.max - info.min) / (65 - 18)) * 100;
          const isActive = key === phase;
          const isPast = info.max < age;
          return (
            <View
              key={key}
              style={[
                styles.segment,
                {
                  width: `${segWidth}%`,
                  backgroundColor: isPast
                    ? COLORS.accent
                    : isActive
                    ? 'transparent'
                    : COLORS.border,
                },
              ]}
            >
              {isActive && (
                <View
                  style={[
                    styles.segmentFill,
                    { width: `${phaseProgress * 100}%` },
                  ]}
                />
              )}
            </View>
          );
        })}

        {/* Cursor da idade atual */}
        <View
          style={[
            styles.cursor,
            { left: `${lifeProgress * 100}%` },
          ]}
        />
      </View>

      {/* Labels das fases */}
      <View style={styles.phaseLabelsRow}>
        {Object.entries(PHASE_MAP).map(([key, info]) => (
          <Text
            key={key}
            style={[
              styles.phaseLabelSmall,
              key === phase && styles.phaseLabelActive,
            ]}
          >
            {info.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  ageNumber: {
    fontSize: FONTS.size3xl,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
    lineHeight: 38,
  },
  ageLabel: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  phaseInfo: {
    alignItems: 'center',
  },
  phaseLabel: {
    fontSize: FONTS.sizeMd,
    color: COLORS.accentGlow,
    fontWeight: FONTS.weightSemibold,
  },
  phaseRange: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  lifePct: {
    alignItems: 'flex-end',
  },
  lifePctNumber: {
    fontSize: FONTS.sizeLg,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weightBold,
  },
  lifePctLabel: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
  },
  lifeTrack: {
    height: 8,
    flexDirection: 'row',
    borderRadius: RADIUS.full,
    overflow: 'visible',
    backgroundColor: COLORS.border,
    position: 'relative',
    gap: 2,
  },
  segment: {
    height: '100%',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    position: 'relative',
  },
  segmentFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
  },
  cursor: {
    position: 'absolute',
    top: -3,
    width: 14,
    height: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.textPrimary,
    borderWidth: 2,
    borderColor: COLORS.accent,
    marginLeft: -7,
    zIndex: 10,
  },
  phaseLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  phaseLabelSmall: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  phaseLabelActive: {
    color: COLORS.accentGlow,
    fontWeight: FONTS.weightSemibold,
  },
});

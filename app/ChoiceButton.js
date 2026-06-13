import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from './theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ChoiceButton({ option, onPress, disabled, index }) {
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
    bgOpacity.value = withTiming(1, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    bgOpacity.value = withTiming(0, { duration: 200 });
  };

  // Pré-formata os efeitos para exibição
  const effectTags = formatEffects(option.effects);

  return (
    <AnimatedPressable
      onPress={() => !disabled && onPress(option)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.button, animStyle, disabled && styles.disabled]}
    >
      {/* Glow de fundo ao pressionar */}
      <Animated.View style={[styles.glow, glowStyle]} />

      <View style={styles.content}>
        {/* Label com índice visual */}
        <View style={styles.labelRow}>
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>{String.fromCharCode(65 + index)}</Text>
          </View>
          <Text style={styles.label} numberOfLines={2}>
            {option.label}
          </Text>
        </View>

        {/* Tags de efeito */}
        <View style={styles.tagsRow}>
          {effectTags.map((tag, i) => (
            <View
              key={i}
              style={[styles.tag, { backgroundColor: tag.bg }]}
            >
              <Text style={[styles.tagText, { color: tag.color }]}>
                {tag.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Seta indicadora */}
      <Text style={styles.arrow}>›</Text>
    </AnimatedPressable>
  );
}

function formatEffects(effects) {
  const tags = [];
  if (effects.money > 0) tags.push({ text: `+R$${effects.money.toLocaleString('pt-BR')}`, color: COLORS.money, bg: COLORS.moneyDark + '55' });
  if (effects.money < 0) tags.push({ text: `-R$${Math.abs(effects.money).toLocaleString('pt-BR')}`, color: COLORS.danger, bg: COLORS.healthDark + '55' });
  if (effects.happiness > 0) tags.push({ text: `+${effects.happiness} feliz`, color: COLORS.happiness, bg: COLORS.happinessDark + '55' });
  if (effects.happiness < 0) tags.push({ text: `${effects.happiness} feliz`, color: COLORS.danger, bg: COLORS.healthDark + '55' });
  if (effects.health > 0) tags.push({ text: `+${effects.health} saúde`, color: COLORS.health, bg: COLORS.healthDark + '55' });
  if (effects.health < 0) tags.push({ text: `${effects.health} saúde`, color: COLORS.danger, bg: COLORS.healthDark + '55' });
  if (effects.knowledge > 0) tags.push({ text: `+${effects.knowledge} conhec.`, color: COLORS.knowledge, bg: COLORS.knowledgeDark + '55' });
  if (effects.knowledge < 0) tags.push({ text: `${effects.knowledge} conhec.`, color: COLORS.textMuted, bg: COLORS.surface });
  return tags;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...SHADOW.card,
  },
  disabled: {
    opacity: 0.5,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.accentDim,
    borderRadius: RADIUS.lg,
  },
  content: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  indexBadge: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent + '33',
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: FONTS.sizeXs,
    color: COLORS.accentGlow,
    fontWeight: FONTS.weightBold,
  },
  label: {
    flex: 1,
    fontSize: FONTS.sizeMd,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightSemibold,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingLeft: 34,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  tagText: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.3,
  },
  arrow: {
    fontSize: 22,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
    fontWeight: FONTS.weightBold,
  },
});

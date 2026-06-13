/**
 * app/index.js — Tela Home / Menu principal do LifePath
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from './theme';

const SAVE_KEY = '@lifepath_save';

export default function HomeScreen() {
  const router = useRouter();
  const [hasSave, setHasSave] = useState(false);
  const [savePreview, setSavePreview] = useState(null);

  // Pulso sutil no logo
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  // Checa save existente
  useEffect(() => {
    async function checkSave() {
      try {
        const raw = await AsyncStorage.getItem(SAVE_KEY);
        if (raw) {
          const save = JSON.parse(raw);
          setHasSave(true);
          setSavePreview(save);
        }
      } catch (_) {}
    }
    checkSave();
  }, []);

  const handleNewGame = async () => {
    await AsyncStorage.removeItem(SAVE_KEY);
    router.push('/game');
  };

  const handleContinue = () => {
    router.push({ pathname: '/game', params: { continue: 'true' } });
  };

  const handleAchievements = () => {
    router.push('/achievements');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* ── Logo / Hero ─────────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeIn.delay(100).duration(800)}
          style={styles.heroSection}
        >
          <Animated.Text style={[styles.logoEmoji, pulseStyle]}>🗺️</Animated.Text>
          <Text style={styles.logoTitle}>LifePath</Text>
          <Text style={styles.logoSubtitle}>O Simulador de Escolhas</Text>
          <Text style={styles.logoTagline}>
            Cada decisão molda quem você se torna.
          </Text>
        </Animated.View>

        {/* ── Botões ──────────────────────────────────────────────────────────── */}
        <Animated.View
          entering={SlideInDown.delay(300).springify().damping(18)}
          style={styles.buttonsSection}
        >

          {/* Continuar (só aparece se houver save) */}
          {hasSave && savePreview && (
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <View>
                <Text style={styles.primaryBtnLabel}>Continuar</Text>
                <Text style={styles.continueMeta}>
                  {savePreview.stats?.age} anos •{' '}
                  R${savePreview.stats?.money?.toLocaleString('pt-BR')} •{' '}
                  Turno {savePreview.turn || 0}
                </Text>
              </View>
              <Text style={styles.btnArrow}>▶</Text>
            </Pressable>
          )}

          {/* Novo Jogo */}
          <Pressable
            onPress={handleNewGame}
            style={({ pressed }) => [
              hasSave ? styles.secondaryBtn : styles.primaryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={hasSave ? styles.secondaryBtnLabel : styles.primaryBtnLabel}>
              {hasSave ? 'Novo Jogo' : 'Começar'}
            </Text>
            {!hasSave && <Text style={styles.btnArrow}>▶</Text>}
          </Pressable>

          {/* Conquistas */}
          <Pressable
            onPress={handleAchievements}
            style={({ pressed }) => [styles.ghostBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.ghostBtnLabel}>🏆 Conquistas</Text>
          </Pressable>
        </Animated.View>

        {/* ── Rodapé ──────────────────────────────────────────────────────────── */}
        <Animated.Text
          entering={FadeIn.delay(600)}
          style={styles.footer}
        >
          Todas as decisões têm consequências.{'\n'}Escolha com sabedoria.
        </Animated.Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xxl : SPACING.xl,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
  },

  // ── Hero ─────────────────────────────────────────────────────────────────────
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  logoEmoji: {
    fontSize: 72,
    marginBottom: SPACING.sm,
  },
  logoTitle: {
    fontSize: FONTS.size3xl + 8,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
    letterSpacing: -1,
  },
  logoSubtitle: {
    fontSize: FONTS.sizeMd,
    color: COLORS.accentGlow,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: FONTS.weightMedium,
  },
  logoTagline: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // ── Botões ───────────────────────────────────────────────────────────────────
  buttonsSection: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: SPACING.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOW.accent,
  },
  secondaryBtn: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  ghostBtn: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  primaryBtnLabel: {
    fontSize: FONTS.sizeLg,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.3,
  },
  secondaryBtnLabel: {
    fontSize: FONTS.sizeLg,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weightSemibold,
  },
  ghostBtnLabel: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textMuted,
    fontWeight: FONTS.weightMedium,
  },
  btnArrow: {
    fontSize: 16,
    color: COLORS.textPrimary,
    opacity: 0.7,
  },
  continueMeta: {
    fontSize: FONTS.sizeXs,
    color: COLORS.accentGlow,
    marginTop: 3,
    opacity: 0.85,
  },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: FONTS.sizeXs,
    lineHeight: 18,
    letterSpacing: 0.3,
  },
});

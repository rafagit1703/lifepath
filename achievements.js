/**
 * app/achievements.js — Tela de conquistas do LifePath
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { loadAchievements } from '../src/hooks/useGameState';
import { ACHIEVEMENTS } from '../src/data/scenarios';
import { COLORS, FONTS, SPACING, RADIUS } from '../src/utils/theme';

export default function AchievementsScreen() {
  const router = useRouter();
  const [unlockedIds, setUnlockedIds] = useState([]);

  useEffect(() => {
    loadAchievements().then(setUnlockedIds);
  }, []);

  const unlocked = ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id));
  const locked = ACHIEVEMENTS.filter((a) => !unlockedIds.includes(a.id));
  const pct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeIn} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </Pressable>
          <Text style={styles.pageTitle}>Conquistas</Text>
          <View style={{ width: 60 }} />
        </Animated.View>

        {/* ── Progresso geral ─────────────────────────────────────────────── */}
        <Animated.View
          entering={SlideInDown.delay(100).springify()}
          style={styles.progressCard}
        >
          <Text style={styles.progressNum}>
            {unlocked.length}
            <Text style={styles.progressTotal}>/{ACHIEVEMENTS.length}</Text>
          </Text>
          <Text style={styles.progressLabel}>conquistas desbloqueadas</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressPct}>{pct}% completo</Text>
        </Animated.View>

        {/* ── Desbloqueadas ───────────────────────────────────────────────── */}
        {unlocked.length > 0 && (
          <Animated.View entering={FadeIn.delay(200)}>
            <Text style={styles.sectionTitle}>Desbloqueadas</Text>
            {unlocked.map((a, i) => (
              <Animated.View
                key={a.id}
                entering={SlideInDown.delay(200 + i * 60).springify()}
                style={styles.achievementCard}
              >
                <Text style={styles.achievementTitle}>{a.title}</Text>
                <Text style={styles.achievementDesc}>{a.description}</Text>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {/* ── Bloqueadas ──────────────────────────────────────────────────── */}
        {locked.length > 0 && (
          <Animated.View entering={FadeIn.delay(400)}>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>
              Bloqueadas
            </Text>
            {locked.map((a) => (
              <View key={a.id} style={[styles.achievementCard, styles.lockedCard]}>
                <Text style={styles.lockedTitle}>🔒 ???</Text>
                <Text style={styles.lockedDesc}>
                  Continue jogando para desbloquear.
                </Text>
              </View>
            ))}
          </Animated.View>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  backBtn: { padding: SPACING.xs },
  backText: { fontSize: FONTS.sizeSm, color: COLORS.textMuted },
  pageTitle: {
    fontSize: FONTS.sizeLg,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
  },
  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressNum: {
    fontSize: FONTS.size3xl,
    color: COLORS.accentGlow,
    fontWeight: FONTS.weightBold,
  },
  progressTotal: {
    fontSize: FONTS.size2xl,
    color: COLORS.textMuted,
  },
  progressLabel: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
  },
  progressPct: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
  },
  sectionTitle: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: FONTS.weightSemibold,
    marginBottom: SPACING.sm,
  },
  achievementCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accent + '33',
  },
  achievementTitle: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  lockedCard: {
    borderColor: COLORS.border,
    opacity: 0.5,
  },
  lockedTitle: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textMuted,
    fontWeight: FONTS.weightBold,
    marginBottom: 4,
  },
  lockedDesc: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
  },
});

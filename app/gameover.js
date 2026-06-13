/**
 * app/gameover.js — Tela de fim de jogo (derrota ou vitória)
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  SlideInDown,
  ZoomIn,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from './theme';
import { ACHIEVEMENTS } from './scenarios';

const ACHIEVEMENTS_KEY = '@lifepath_achievements';

export default function GameOverScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [newAchievements, setNewAchievements] = useState([]);

  const reason = params.reason; // 'health' | 'happiness' | 'victory'
  const age = Number(params.age) || 0;
  const money = Number(params.money) || 0;
  const happiness = Number(params.happiness) || 0;
  const health = Number(params.health) || 0;
  const knowledge = Number(params.knowledge) || 0;
  const turns = Number(params.turns) || 0;

  const isVictory = reason === 'victory';

  // Textos contextuais
  const endData = getEndData(reason, age, money, happiness, knowledge);

  // Calcula "nota" de vida
  const lifeScore = Math.round(
    (money / 1000) * 0.2 +
    happiness * 0.35 +
    health * 0.25 +
    knowledge * 0.2
  );

  useEffect(() => {
    // Desbloqueia conquistas especiais de fim de jogo
    async function finalAchievements() {
      const earned = [];
      const raw = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
      const current = raw ? JSON.parse(raw) : [];

      if (isVictory && !current.includes('retired_in_peace')) {
        earned.push('retired_in_peace');
      }
      if (health <= 0 && !current.includes('near_death')) {
        earned.push('near_death');
      }
      if (money >= 100000 && !current.includes('millionaire_path')) {
        earned.push('millionaire_path');
      }
      if (knowledge >= 90 && !current.includes('polymath')) {
        earned.push('polymath');
      }

      if (earned.length > 0) {
        await AsyncStorage.setItem(
          ACHIEVEMENTS_KEY,
          JSON.stringify([...current, ...earned])
        );
        setNewAchievements(
          earned.map((id) => ACHIEVEMENTS.find((a) => a.id === id)).filter(Boolean)
        );
      }
    }
    finalAchievements();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Emoji principal ──────────────────────────────────────────────── */}
        <Animated.Text
          entering={ZoomIn.delay(100).springify()}
          style={styles.mainEmoji}
        >
          {endData.emoji}
        </Animated.Text>

        {/* ── Título e subtítulo ───────────────────────────────────────────── */}
        <Animated.View
          entering={FadeIn.delay(300)}
          style={styles.titleSection}
        >
          <Text style={[styles.title, isVictory && styles.titleVictory]}>
            {endData.title}
          </Text>
          <Text style={styles.subtitle}>{endData.subtitle}</Text>
        </Animated.View>

        {/* ── Resumo de vida ───────────────────────────────────────────────── */}
        <Animated.View
          entering={SlideInDown.delay(400).springify().damping(18)}
          style={styles.summaryCard}
        >
          <Text style={styles.summaryTitle}>Resumo da Sua Jornada</Text>

          <View style={styles.statsGrid}>
            <StatCell icon="🎂" label="Idade final" value={`${age} anos`} />
            <StatCell icon="💰" label="Patrimônio" value={`R$${money.toLocaleString('pt-BR')}`} color={COLORS.money} />
            <StatCell icon="😊" label="Felicidade" value={`${happiness}/100`} color={COLORS.happiness} />
            <StatCell icon="❤️" label="Saúde" value={`${health}/100`} color={health <= 0 ? COLORS.danger : COLORS.health} />
            <StatCell icon="🧠" label="Conhecimento" value={`${knowledge}/100`} color={COLORS.knowledge} />
            <StatCell icon="🎲" label="Decisões" value={`${turns} escolhas`} />
          </View>

          {/* Nota de vida */}
          <View style={styles.scoreSeparator} />
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Pontuação de Vida</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(lifeScore) }]}>
              {lifeScore}
            </Text>
          </View>
          <Text style={styles.scoreDescription}>{getScoreLabel(lifeScore)}</Text>
        </Animated.View>

        {/* ── Mensagem narrativa ───────────────────────────────────────────── */}
        <Animated.View
          entering={FadeIn.delay(600)}
          style={styles.narrativeCard}
        >
          <Text style={styles.narrativeText}>{endData.narrative}</Text>
        </Animated.View>

        {/* ── Novas conquistas desbloqueadas ───────────────────────────────── */}
        {newAchievements.length > 0 && (
          <Animated.View entering={FadeIn.delay(800)} style={styles.achievementsSection}>
            <Text style={styles.achievementsTitle}>🏆 Conquistas Desbloqueadas</Text>
            {newAchievements.map((a) => (
              <View key={a.id} style={styles.achievementItem}>
                <Text style={styles.achievementTitle}>{a.title}</Text>
                <Text style={styles.achievementDesc}>{a.description}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* ── Ações ────────────────────────────────────────────────────────── */}
        <Animated.View
          entering={SlideInDown.delay(900).springify()}
          style={styles.actionsSection}
        >
          <Pressable
            onPress={() => {
              AsyncStorage.removeItem('@lifepath_save');
              router.replace('/game');
            }}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.primaryBtnText}>🔄 Nova Vida</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/achievements')}
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.secondaryBtnText}>🏆 Ver Conquistas</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.ghostBtnText}>← Voltar ao Menu</Text>
          </Pressable>
        </Animated.View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-componente ───────────────────────────────────────────────────────────

function StatCell({ icon, label, value, color = COLORS.textPrimary }) {
  return (
    <View style={statCellStyles.cell}>
      <Text style={statCellStyles.icon}>{icon}</Text>
      <Text style={statCellStyles.label}>{label}</Text>
      <Text style={[statCellStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const statCellStyles = StyleSheet.create({
  cell: {
    width: '48%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  icon: { fontSize: 18, marginBottom: 4 },
  label: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: FONTS.sizeMd,
    fontWeight: FONTS.weightBold,
    color: COLORS.textPrimary,
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEndData(reason, age, money, happiness, knowledge) {
  if (reason === 'victory') {
    return {
      emoji: '🌅',
      title: 'Uma Vida Bem Vivida',
      subtitle: `Você chegou aos ${age} anos com sabedoria e experiência`,
      narrative:
        'Cada escolha que você fez escreveu uma história única. Não existe caminho certo ou errado — apenas o seu. Agora é hora de descansar e olhar para tudo que construiu.',
    };
  }
  if (reason === 'health') {
    return {
      emoji: '💔',
      title: 'O Corpo Disse Basta',
      subtitle: `Aos ${age} anos, sua saúde chegou ao limite`,
      narrative:
        'Você se dedicou tanto que esqueceu de cuidar de si mesmo. A vida cobra o que ignoramos. Talvez na próxima vez, o equilíbrio venha antes da ambição.',
    };
  }
  return {
    emoji: '🌑',
    title: 'A Escuridão Interior',
    subtitle: `Aos ${age} anos, sua felicidade se esgotou`,
    narrative:
      'Acumular tudo e não sentir nada é o vazio mais profundo. O dinheiro, o status, o conhecimento — nada disso basta sem alegria. Tente de novo, desta vez com o coração como guia.',
  };
}

function getScoreColor(score) {
  if (score >= 80) return COLORS.success;
  if (score >= 50) return COLORS.happiness;
  if (score >= 30) return COLORS.warning;
  return COLORS.danger;
}

function getScoreLabel(score) {
  if (score >= 80) return '"Vida Excepcional" — poucos chegam aqui.';
  if (score >= 60) return '"Vida Plena" — você encontrou equilíbrio.';
  if (score >= 40) return '"Vida Comum" — há mais a explorar.';
  if (score >= 20) return '"Vida Difícil" — mas cheia de lições.';
  return '"Vida no Limite" — recomeçar é sempre possível.';
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xxl : SPACING.xl,
    alignItems: 'center',
  },
  mainEmoji: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.size2xl,
    color: COLORS.danger,
    fontWeight: FONTS.weightBold,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  titleVictory: {
    color: COLORS.success,
  },
  subtitle: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
    fontWeight: FONTS.weightSemibold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scoreSeparator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weightMedium,
  },
  scoreValue: {
    fontSize: FONTS.size2xl,
    fontWeight: FONTS.weightBold,
  },
  scoreDescription: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  narrativeCard: {
    width: '100%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  narrativeText: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  achievementsSection: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  achievementsTitle: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
    marginBottom: SPACING.sm,
  },
  achievementItem: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.accent + '44',
  },
  achievementTitle: {
    fontSize: FONTS.sizeSm,
    color: COLORS.accentGlow,
    fontWeight: FONTS.weightBold,
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
  },
  actionsSection: {
    width: '100%',
    gap: SPACING.sm,
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: SPACING.md + 2,
    alignItems: 'center',
    ...SHADOW.accent,
  },
  primaryBtnText: {
    fontSize: FONTS.sizeLg,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
  },
  secondaryBtn: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryBtnText: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weightSemibold,
  },
  ghostBtn: {
    padding: SPACING.sm,
    alignItems: 'center',
  },
  ghostBtnText: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
  },
});

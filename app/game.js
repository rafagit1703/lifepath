/**
 * app/game.js — Tela principal do jogo LifePath
 *
 * Gerencia:
 *  - Loop de eventos (cenário → escolha → atualização de stats → próximo cenário)
 *  - Animações de transição via Reanimated
 *  - Detecção de Game Over e Victoria
 *  - Persistência via AsyncStorage (via hook)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useGameState } from './useGameState';
import StatBar from './StatBar';
import ChoiceButton from './ChoiceButton';
import AgeTimeline from './AgeTimeline';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from './theme';
import { PHASE_MAP } from './scenarios';

// ─────────────────────────────────────────────────────────────────────────────

const TRANSITION_DURATION = 320;

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isContinuing = params.continue === 'true';

  const {
    stats,
    currentScenario,
    isLoading,
    turn,
    initGame,
    applyChoice,
    loadNextScenario,
    loadGame,
  } = useGameState();

  // Estado local de UI
  const [phase, setPhase] = useState('loading'); // loading | playing | transitioning | gameover
  const [prevStats, setPrevStats] = useState(null);
  const [choiceFeedback, setChoiceFeedback] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Animações da tela de jogo
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);
  const statsFlash = useSharedValue(0);
  const moneyShake = useSharedValue(0);

  // ── Inicialização ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function bootstrap() {
      if (isContinuing) {
        const saved = await loadGame();
        initGame(saved);
      } else {
        initGame(null);
      }
    }
    bootstrap();
  }, []);

  // Quando o cenário muda, anima a entrada do card
  useEffect(() => {
    if (currentScenario && phase !== 'transitioning') {
      setPhase('playing');
      cardOpacity.value = withTiming(0, { duration: 0 }, () => {
        cardOpacity.value = withTiming(1, { duration: TRANSITION_DURATION });
        cardTranslateY.value = withTiming(30, { duration: 0 }, () => {
          cardTranslateY.value = withSpring(0, { damping: 16, stiffness: 120 });
        });
      });
      if (isFirstLoad) setIsFirstLoad(false);
    }
  }, [currentScenario?.id]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleChoice = useCallback(
    async (option) => {
      if (phase !== 'playing' || isLoading) return;
      setPhase('transitioning');
      setPrevStats({ ...stats });

      // Haptic feedback
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (_) {}

      // Feedback visual da escolha
      setChoiceFeedback(option);

      // Anima saída do card
      cardOpacity.value = withDelay(
        400,
        withTiming(0, { duration: TRANSITION_DURATION })
      );
      cardTranslateY.value = withDelay(
        400,
        withTiming(-20, { duration: TRANSITION_DURATION })
      );

      // Aplica a escolha (calcula novos stats, persiste)
      const { newStats, endGame } = await applyChoice(option);

      // Pequena pausa dramática
      await delay(800);

      // ── Verificação de fim de jogo ──────────────────────────────────────
      const isGameOver = newStats.health <= 0 || newStats.happiness <= 0;
      const isVictory = endGame === 'victory' || newStats.age >= 65;

      if (isGameOver || isVictory) {
        router.replace({
          pathname: '/gameover',
          params: {
            reason: isGameOver
              ? newStats.health <= 0
                ? 'health'
                : 'happiness'
              : 'victory',
            age: newStats.age,
            money: newStats.money,
            happiness: newStats.happiness,
            health: newStats.health,
            knowledge: newStats.knowledge,
            turns: turn + 1,
          },
        });
        return;
      }

      // ── Próximo cenário ────────────────────────────────────────────────
      setChoiceFeedback(null);
      loadNextScenario(newStats.age);
      setPhase('playing');
    },
    [phase, isLoading, stats, applyChoice, loadNextScenario, turn, router]
  );

  // ── Estilos animados ─────────────────────────────────────────────────────────
  const cardAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  // ── Cálculo de deltas para as barras ─────────────────────────────────────────
  const deltas = prevStats
    ? {
        money: stats.money - prevStats.money,
        happiness: stats.happiness - prevStats.happiness,
        health: stats.health - prevStats.health,
        knowledge: stats.knowledge - prevStats.knowledge,
      }
    : { money: 0, happiness: 0, health: 0, knowledge: 0 };

  // ── Render ───────────────────────────────────────────────────────────────────
  if (!currentScenario && phase === 'loading') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Animated.Text entering={FadeIn.delay(200)} style={styles.loadingText}>
          Carregando sua história...
        </Animated.Text>
      </SafeAreaView>
    );
  }

  const moneyFormatted =
    stats.money >= 1000
      ? `R$${(stats.money / 1000).toFixed(1)}k`
      : `R$${stats.money}`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.replace('/')}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Text style={styles.backText}>← Menu</Text>
          </Pressable>
          <View style={styles.turnBadge}>
            <Text style={styles.turnText}>Turno {turn + 1}</Text>
          </View>
        </View>

        {/* ── Timeline de Idade ────────────────────────────────────────────── */}
        <Animated.View
          entering={isFirstLoad ? FadeIn.delay(100) : undefined}
          style={styles.timelineContainer}
        >
          <AgeTimeline age={stats.age} />
        </Animated.View>

        {/* ── Painel de Status ─────────────────────────────────────────────── */}
        <Animated.View
          entering={isFirstLoad ? SlideInDown.delay(150).springify() : undefined}
          style={styles.statsPanel}
        >
          {/* Dinheiro — tratado separado por ser valor absoluto */}
          <View style={styles.moneyRow}>
            <Text style={styles.moneyIcon}>💰</Text>
            <Text style={styles.moneyLabel}>SALDO</Text>
            <Animated.Text style={styles.moneyValue}>
              R${stats.money.toLocaleString('pt-BR')}
            </Animated.Text>
            {deltas.money !== 0 && (
              <Text
                style={[
                  styles.moneyDelta,
                  { color: deltas.money > 0 ? COLORS.money : COLORS.danger },
                ]}
              >
                {deltas.money > 0 ? '+' : ''}
                {deltas.money.toLocaleString('pt-BR')}
              </Text>
            )}
          </View>

          {/* Barras de atributos */}
          <StatBar
            label="Felicidade"
            icon="😊"
            value={stats.happiness}
            color={COLORS.happiness}
            darkColor={COLORS.happinessDark}
            delta={deltas.happiness}
          />
          <StatBar
            label="Saúde"
            icon="❤️"
            value={stats.health}
            color={COLORS.health}
            darkColor={COLORS.healthDark}
            delta={deltas.health}
          />
          <StatBar
            label="Conhecimento"
            icon="🧠"
            value={stats.knowledge}
            color={COLORS.knowledge}
            darkColor={COLORS.knowledgeDark}
            delta={deltas.knowledge}
          />
        </Animated.View>

        {/* Aviso de perigo baixo */}
        {(stats.health <= 20 || stats.happiness <= 20) && (
          <Animated.View
            entering={ZoomIn}
            style={styles.dangerBanner}
          >
            <Text style={styles.dangerText}>
              ⚠️{' '}
              {stats.health <= 20 && stats.happiness <= 20
                ? 'Saúde e felicidade críticas!'
                : stats.health <= 20
                ? 'Sua saúde está crítica!'
                : 'Sua felicidade está crítica!'}
            </Text>
          </Animated.View>
        )}

        {/* ── Card do Cenário ──────────────────────────────────────────────── */}
        {currentScenario && (
          <Animated.View style={[styles.scenarioCard, cardAnimStyle]}>
            {/* Eyebrow: tipo do evento */}
            <Text style={styles.scenarioEyebrow}>
              {getPhaseEmoji(stats.age)} Evento • {getCurrentPhaseLabel(stats.age)}
            </Text>

            {/* Título */}
            <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>

            {/* Separador estilizado */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerDot}>◆</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Narrativa */}
            <Text style={styles.scenarioStory}>{currentScenario.story}</Text>

            {/* Instrução */}
            <Text style={styles.chooseLabel}>— Como você decide? —</Text>
          </Animated.View>
        )}

        {/* ── Botões de Escolha ────────────────────────────────────────────── */}
        {currentScenario && (
          <Animated.View style={cardAnimStyle}>
            {currentScenario.options.map((option, i) => (
              <ChoiceButton
                key={`${currentScenario.id}-${i}`}
                option={option}
                index={i}
                onPress={handleChoice}
                disabled={phase === 'transitioning' || isLoading}
              />
            ))}
          </Animated.View>
        )}

        {/* Espaço no final para scroll */}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPhaseEmoji(age) {
  if (age <= 25) return '🌱';
  if (age <= 45) return '⚡';
  return '🌟';
}

function getCurrentPhaseLabel(age) {
  if (age <= 25) return 'Juventude';
  if (age <= 45) return 'Vida Adulta';
  return 'Maturidade';
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizeMd,
    letterSpacing: 0.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.md,
    paddingBottom: SPACING.xl,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  backText: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  turnBadge: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  turnText: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    fontWeight: FONTS.weightSemibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // ── Timeline ─────────────────────────────────────────────────────────────────
  timelineContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ── Stats ────────────────────────────────────────────────────────────────────
  statsPanel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moneyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moneyIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  moneyLabel: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: FONTS.weightSemibold,
  },
  moneyValue: {
    fontSize: FONTS.sizeLg,
    color: COLORS.money,
    fontWeight: FONTS.weightBold,
  },
  moneyDelta: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightBold,
    marginLeft: 6,
  },

  // ── Danger Banner ────────────────────────────────────────────────────────────
  dangerBanner: {
    backgroundColor: COLORS.danger + '22',
    borderWidth: 1,
    borderColor: COLORS.danger + '66',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  dangerText: {
    color: COLORS.danger,
    fontSize: FONTS.sizeSm,
    fontWeight: FONTS.weightSemibold,
    letterSpacing: 0.3,
  },

  // ── Scenario Card ────────────────────────────────────────────────────────────
  scenarioCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.accent,
  },
  scenarioEyebrow: {
    fontSize: FONTS.sizeXs,
    color: COLORS.accentGlow,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: FONTS.weightSemibold,
    marginBottom: SPACING.sm,
  },
  scenarioTitle: {
    fontSize: FONTS.sizeXl,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
    lineHeight: 28,
    marginBottom: SPACING.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerDot: {
    fontSize: 8,
    color: COLORS.accent,
  },
  scenarioStory: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  chooseLabel: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

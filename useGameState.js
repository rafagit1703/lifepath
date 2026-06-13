import { useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_STATS, getNextScenario, ACHIEVEMENTS } from '../data/scenarios';

const SAVE_KEY = '@lifepath_save';
const ACHIEVEMENTS_KEY = '@lifepath_achievements';

export function useGameState() {
  const [stats, setStats] = useState({ ...INITIAL_STATS });
  const [currentScenario, setCurrentScenario] = useState(null);
  const [seenScenarioIds, setSeenScenarioIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [turn, setTurn] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);

  const initGame = useCallback((savedState = null) => {
    if (savedState) {
      setStats(savedState.stats);
      setSeenScenarioIds(savedState.seenIds || []);
      setTurn(savedState.turn || 0);
      setGameHistory(savedState.history || []);
      const next = getNextScenario(savedState.stats.age, savedState.seenIds || []);
      setCurrentScenario(next);
    } else {
      const fresh = { ...INITIAL_STATS };
      setStats(fresh);
      setSeenScenarioIds([]);
      setTurn(0);
      setGameHistory([]);
      const next = getNextScenario(fresh.age, []);
      setCurrentScenario(next);
    }
  }, []);

  const applyChoice = useCallback(
    async (option) => {
      setIsLoading(true);
      const { effects, achievement, endGame } = option;

      // Calcula novos stats
      const AGE_INCREMENT = 2;
      const newStats = {
        age: Math.min(stats.age + AGE_INCREMENT, 65),
        money: Math.max(0, stats.money + (effects.money || 0)),
        happiness: Math.min(100, Math.max(0, stats.happiness + (effects.happiness || 0))),
        health: Math.min(100, Math.max(0, stats.health + (effects.health || 0))),
        knowledge: Math.min(100, Math.max(0, stats.knowledge + (effects.knowledge || 0))),
      };

      // Atualiza histórico
      const historyEntry = {
        age: stats.age,
        scenarioTitle: currentScenario?.title,
        choiceLabel: option.label,
        effects,
      };
      const newHistory = [...gameHistory, historyEntry];

      // Controla cenários vistos
      const newSeenIds = currentScenario
        ? [...seenScenarioIds, currentScenario.id]
        : seenScenarioIds;

      // Desbloqueia conquista
      if (achievement) {
        await unlockAchievement(achievement);
      }

      // Verifica condição especial de conquista por stats
      await checkStatAchievements(newStats);

      // Persiste save
      const saveData = {
        stats: newStats,
        seenIds: newSeenIds,
        turn: turn + 1,
        history: newHistory,
      };
      await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(saveData));

      // Atualiza estado
      setStats(newStats);
      setSeenScenarioIds(newSeenIds);
      setTurn((t) => t + 1);
      setGameHistory(newHistory);
      setIsLoading(false);

      return { newStats, endGame };
    },
    [stats, currentScenario, seenScenarioIds, gameHistory, turn]
  );

  const loadNextScenario = useCallback(
    (currentAge) => {
      const next = getNextScenario(currentAge, seenScenarioIds);
      setCurrentScenario(next);
      return next;
    },
    [seenScenarioIds]
  );

  const loadGame = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(SAVE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const resetGame = useCallback(async () => {
    await AsyncStorage.removeItem(SAVE_KEY);
    initGame(null);
  }, [initGame]);

  return {
    stats,
    currentScenario,
    isLoading,
    turn,
    gameHistory,
    initGame,
    applyChoice,
    loadNextScenario,
    loadGame,
    resetGame,
  };
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export async function unlockAchievement(id) {
  try {
    const raw = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    const current = raw ? JSON.parse(raw) : [];
    if (!current.includes(id)) {
      await AsyncStorage.setItem(
        ACHIEVEMENTS_KEY,
        JSON.stringify([...current, id])
      );
      return true; // Nova conquista
    }
    return false;
  } catch {
    return false;
  }
}

export async function loadAchievements() {
  try {
    const raw = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function checkStatAchievements(stats) {
  if (stats.money >= 100000) await unlockAchievement('millionaire_path');
  if (stats.happiness >= 95) await unlockAchievement('zen_master');
  if (stats.health <= 5) await unlockAchievement('near_death');
  if (stats.knowledge >= 95) await unlockAchievement('polymath');
}

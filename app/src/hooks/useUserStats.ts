import { useLocalStorage } from "./useLocalStorage";

interface ExerciseStats {
  attempts: number;
  correct: number;
  lastAttempt?: string;
}

interface UserStats {
  exercises: Record<string, ExerciseStats>;
}

const INITIAL_STATS: UserStats = { exercises: {} };

export function useUserStats() {
  const [stats, setStats] = useLocalStorage<UserStats>("ea4_user_stats", INITIAL_STATS);

  function recordAttempt(exerciseId: string, correct: boolean) {
    const prev = stats.exercises[exerciseId] ?? { attempts: 0, correct: 0 };
    setStats({
      exercises: {
        ...stats.exercises,
        [exerciseId]: {
          attempts: prev.attempts + 1,
          correct: prev.correct + (correct ? 1 : 0),
          lastAttempt: new Date().toISOString(),
        },
      },
    });
  }

  function getStats(exerciseId: string): ExerciseStats {
    return stats.exercises[exerciseId] ?? { attempts: 0, correct: 0 };
  }

  function clearStats() {
    setStats(INITIAL_STATS);
  }

  return { stats, recordAttempt, getStats, clearStats };
}

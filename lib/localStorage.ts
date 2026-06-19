import type { Player, GameSession, ActProgress, RiddleAttempt } from "@/types/game";

const PLAYER_KEY = "aubligation_player";
const SESSION_KEY = "aubligation_session";

export function getPlayer(): Player | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PLAYER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Player;
  } catch {
    return null;
  }
}

export function savePlayer(player: Player): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

export function getSession(): GameSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameSession;
  } catch {
    return null;
  }
}

export function saveSession(session: GameSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function createNewSession(playerId: string): GameSession {
  const session: GameSession = {
    id: crypto.randomUUID(),
    playerId,
    startedAt: new Date().toISOString(),
    totalScore: 0,
    actProgress: [],
  };
  saveSession(session);
  return session;
}

export function updateSessionWithAttempt(
  session: GameSession,
  actId: string,
  attempt: RiddleAttempt
): GameSession {
  const existingActIdx = session.actProgress.findIndex((a) => a.actId === actId);

  let updatedProgress: ActProgress;
  if (existingActIdx >= 0) {
    const existing = session.actProgress[existingActIdx];
    updatedProgress = {
      ...existing,
      score: existing.score + attempt.pointsEarned,
      attempts: [...existing.attempts, attempt],
    };
  } else {
    updatedProgress = {
      actId,
      completed: false,
      score: attempt.pointsEarned,
      attempts: [attempt],
    };
  }

  const newActProgress = [...session.actProgress];
  if (existingActIdx >= 0) {
    newActProgress[existingActIdx] = updatedProgress;
  } else {
    newActProgress.push(updatedProgress);
  }

  const newSession: GameSession = {
    ...session,
    totalScore: session.totalScore + attempt.pointsEarned,
    actProgress: newActProgress,
  };
  saveSession(newSession);
  return newSession;
}

export function markActComplete(session: GameSession, actId: string): GameSession {
  const newActProgress = session.actProgress.map((ap) =>
    ap.actId === actId ? { ...ap, completed: true } : ap
  );
  const newSession = { ...session, actProgress: newActProgress };
  saveSession(newSession);
  return newSession;
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function clearPlayer(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PLAYER_KEY);
}

// Leaderboard stored locally (will be replaced by Supabase)
export function getLeaderboard() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("aubligation_leaderboard");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Array<{
      nickname: string;
      score: number;
      completedAt: string;
      actsCompleted: number;
    }>;
  } catch {
    return [];
  }
}

export function submitToLeaderboard(
  nickname: string,
  score: number,
  actsCompleted: number
): void {
  if (typeof window === "undefined") return;
  const board = getLeaderboard();
  board.push({
    nickname,
    score,
    completedAt: new Date().toISOString(),
    actsCompleted,
  });
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem("aubligation_leaderboard", JSON.stringify(board.slice(0, 50)));
}

export type RiddleType = "mcq" | "text" | "photo" | "map";

export interface MCQOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface Riddle {
  id: string;
  type: RiddleType;
  question: string;
  hint?: string;
  // MCQ specific
  options?: MCQOption[];
  // Text specific
  correctAnswer?: string;
  alternateAnswers?: string[];
  // Photo specific
  photoDescription?: string;
  // Map specific
  mapTarget?: string; // city name to click
  mapTargetCoords?: { x: number; y: number };
  // Points
  basePoints: number;
}

export interface Act {
  id: string;
  title: string;
  location: string;
  period: string;
  personalities: string[];
  description: string;
  riddles: Riddle[];
  color: string;
}

export interface Player {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
}

export interface RiddleAttempt {
  riddleId: string;
  actId: string;
  answer?: string;
  isCorrect: boolean;
  hintsUsed: number;
  timeTakenSeconds: number;
  pointsEarned: number;
  attemptedAt: string;
}

export interface ActProgress {
  actId: string;
  completed: boolean;
  score: number;
  attempts: RiddleAttempt[];
}

export interface GameSession {
  id: string;
  playerId: string;
  startedAt: string;
  completedAt?: string;
  totalScore: number;
  actProgress: ActProgress[];
}

export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  score: number;
  completionTime?: string;
  actsCompleted: number;
}

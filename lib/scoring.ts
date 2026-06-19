export const POINTS = {
  MCQ_CORRECT: 100,
  TEXT_CORRECT: 150,
  MAP_CORRECT: 120,
  PHOTO_CORRECT: 100,
  HINT_MALUS: -30,
  WRONG_ANSWER: -20,
  SPEED_BONUS_MAX: 50,
  SPEED_BONUS_THRESHOLD_SECONDS: 30,
};

export function calculatePoints({
  basePoints,
  hintsUsed,
  wrongAttempts,
  timeTakenSeconds,
}: {
  basePoints: number;
  hintsUsed: number;
  wrongAttempts: number;
  timeTakenSeconds: number;
}): number {
  let points = basePoints;

  // Malus for hints
  points += hintsUsed * POINTS.HINT_MALUS;

  // Malus for wrong answers
  points += wrongAttempts * POINTS.WRONG_ANSWER;

  // Speed bonus (up to +50 pts if under 30 seconds)
  if (timeTakenSeconds <= POINTS.SPEED_BONUS_THRESHOLD_SECONDS) {
    const ratio = 1 - timeTakenSeconds / POINTS.SPEED_BONUS_THRESHOLD_SECONDS;
    points += Math.round(ratio * POINTS.SPEED_BONUS_MAX);
  }

  // Minimum 0 points
  return Math.max(0, points);
}

export function validateTextAnswer(
  input: string,
  correct: string,
  alternates?: string[]
): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

  const normalizedInput = normalize(input);
  const normalizedCorrect = normalize(correct);

  if (normalizedInput === normalizedCorrect) return true;

  if (alternates) {
    return alternates.some((alt) => normalize(alt) === normalizedInput);
  }

  return false;
}

export function isMapClickCorrect(
  clickX: number,
  clickY: number,
  targetX: number,
  targetY: number,
  tolerancePercent = 8
): boolean {
  const dist = Math.sqrt(
    Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2)
  );
  return dist <= tolerancePercent;
}

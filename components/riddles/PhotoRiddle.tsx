"use client";

import { useState } from "react";
import type { Riddle } from "@/types/game";
import { calculatePoints, validateTextAnswer } from "@/lib/scoring";

interface PhotoRiddleProps {
  riddle: Riddle;
  onComplete: (points: number, hintsUsed: number, timeTaken: number) => void;
}

export default function PhotoRiddle({ riddle, onComplete }: PhotoRiddleProps) {
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const handleSubmit = () => {
    if (!input.trim() || answered) return;

    const isCorrect = validateTextAnswer(
      input,
      riddle.correctAnswer ?? "",
      riddle.alternateAnswers
    );

    if (isCorrect) {
      setAnswered(true);
      setFeedback("correct");
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const points = calculatePoints({
        basePoints: riddle.basePoints,
        hintsUsed,
        wrongAttempts,
        timeTakenSeconds: timeTaken,
      });
      setTimeout(() => onComplete(points, hintsUsed, timeTaken), 1200);
    } else {
      setFeedback("wrong");
      setWrongAttempts((w) => w + 1);
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  const handleHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed((h) => h + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  // Generate a deterministic color from the riddle id for the placeholder
  const placeholderColors: Record<string, string> = {
    "act1-r2": "#8B7355",
    "act3-r3": "#4A5568",
    "act5-r3": "#6B4C88",
  };
  const placeholderColor = placeholderColors[riddle.id] ?? "#6B7280";

  return (
    <div className="space-y-6">
      <p className="text-lg font-semibold" style={{ color: "var(--color-slate)" }}>
        {riddle.question}
      </p>

      {/* Photo placeholder */}
      <div
        className="relative w-full rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          backgroundColor: placeholderColor,
          height: "240px",
        }}
      >
        <div className="text-center px-6">
          <div className="text-5xl mb-3 opacity-60">
            {riddle.id.includes("r3") && riddle.id.includes("act5") ? "🎨" :
             riddle.id.includes("act1") ? "🏘" : "🏰"}
          </div>
          <p className="text-white text-sm opacity-80 font-medium">
            {riddle.photoDescription}
          </p>
          <p className="text-white text-xs opacity-50 mt-1">(Image illustrative)</p>
        </div>
      </div>

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={answered}
          placeholder="Votre réponse..."
          className="w-full border-2 rounded-lg px-4 py-3 text-base outline-none transition-colors"
          style={{
            borderColor:
              feedback === "correct"
                ? "#22C55E"
                : feedback === "wrong"
                ? "#EF4444"
                : "var(--color-gold)",
            backgroundColor: answered ? "#F0FDF4" : "white",
            color: "var(--color-slate)",
          }}
        />
        {feedback === "wrong" && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            Mauvaise réponse, réessayez !
          </p>
        )}
        {feedback === "correct" && (
          <p className="text-green-600 text-sm mt-2 font-medium">
            Bravo ! Bonne réponse !
          </p>
        )}
      </div>

      {showHint && riddle.hint && (
        <div
          className="rounded-lg p-4 border-l-4 text-sm"
          style={{
            backgroundColor: "#FFFBEB",
            borderColor: "var(--color-gold)",
            color: "#92400E",
          }}
        >
          Indice : {riddle.hint}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {!answered && (
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Valider
          </button>
        )}
        {riddle.hint && !showHint && !answered && (
          <button onClick={handleHint} className="btn-secondary text-sm">
            Indice (−30 pts)
          </button>
        )}
      </div>
    </div>
  );
}

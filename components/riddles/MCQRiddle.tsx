"use client";

import { useState, useEffect } from "react";
import type { Riddle } from "@/types/game";
import { calculatePoints } from "@/lib/scoring";

interface MCQRiddleProps {
  riddle: Riddle;
  onComplete: (points: number, hintsUsed: number, timeTaken: number) => void;
}

export default function MCQRiddle({ riddle, onComplete }: MCQRiddleProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const handleSelect = (optionId: string) => {
    if (answered) return;
    setSelected(optionId);
  };

  const handleSubmit = () => {
    if (!selected || answered) return;
    const option = riddle.options?.find((o) => o.id === selected);
    if (!option) return;

    if (option.isCorrect) {
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
      setSelected(null);
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const handleHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed((h) => h + 1);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg font-semibold" style={{ color: "var(--color-slate)" }}>
        {riddle.question}
      </p>

      <div className="grid gap-3">
        {riddle.options?.map((option) => {
          let borderColor = "#D1D5DB";
          let bgColor = "white";
          let textColor = "var(--color-slate)";

          if (selected === option.id && feedback === "wrong") {
            borderColor = "#EF4444";
            bgColor = "#FEF2F2";
          } else if (selected === option.id) {
            borderColor = "var(--color-burgundy)";
            bgColor = "#FDF3F5";
          }
          if (answered && option.isCorrect) {
            borderColor = "#22C55E";
            bgColor = "#F0FDF4";
            textColor = "#16A34A";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={answered}
              className="w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-150 font-medium"
              style={{
                borderColor,
                backgroundColor: bgColor,
                color: textColor,
                cursor: answered ? "default" : "pointer",
              }}
            >
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3"
                style={{
                  backgroundColor: "var(--color-cream)",
                  color: "var(--color-burgundy)",
                }}
              >
                {option.id.toUpperCase()}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>

      {feedback === "wrong" && (
        <p className="text-red-600 text-sm font-medium">Mauvaise réponse, réessayez !</p>
      )}

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
            disabled={!selected}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Valider
          </button>
        )}
        {riddle.hint && !showHint && !answered && (
          <button
            onClick={handleHint}
            className="btn-secondary text-sm"
          >
            Indice (−30 pts)
          </button>
        )}
      </div>

      {answered && feedback === "correct" && (
        <p className="text-green-600 font-semibold">Bravo ! Bonne réponse !</p>
      )}
    </div>
  );
}

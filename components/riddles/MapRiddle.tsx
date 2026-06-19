"use client";

import { useState, useRef } from "react";
import type { Riddle } from "@/types/game";
import { calculatePoints, isMapClickCorrect } from "@/lib/scoring";

interface MapRiddleProps {
  riddle: Riddle;
  onComplete: (points: number, hintsUsed: number, timeTaken: number) => void;
}

// Cities to display on the map (x,y as percentage of SVG viewBox 0-100)
const MAP_CITIES = [
  { name: "Troyes", x: 42, y: 52, label: "Troyes" },
  { name: "Arcis-sur-Aube", x: 48, y: 38, label: "Arcis-s-Aube" },
  { name: "Brienne-le-Château", x: 72, y: 48, label: "Brienne" },
  { name: "Nogent-sur-Seine", x: 20, y: 18, label: "Nogent-s-Seine" },
  { name: "Essoyes", x: 68, y: 82, label: "Essoyes" },
  { name: "Bar-sur-Aube", x: 80, y: 62, label: "Bar-s-Aube" },
  { name: "Bar-sur-Seine", x: 54, y: 74, label: "Bar-s-Seine" },
];

export default function MapRiddle({ riddle, onComplete }: MapRiddleProps) {
  const [click, setClick] = useState<{ x: number; y: number } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const target = riddle.mapTargetCoords ?? { x: 50, y: 50 };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (answered) return;
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClick({ x, y });

    const correct = isMapClickCorrect(x, y, target.x, target.y, 8);
    if (correct) {
      setAnswered(true);
      setFeedback("correct");
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const points = calculatePoints({
        basePoints: riddle.basePoints,
        hintsUsed,
        wrongAttempts,
        timeTakenSeconds: timeTaken,
      });
      setTimeout(() => onComplete(points, hintsUsed, timeTaken), 1400);
    } else {
      setFeedback("wrong");
      setWrongAttempts((w) => w + 1);
      setTimeout(() => {
        setFeedback(null);
        setClick(null);
      }, 1000);
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

      <div
        className="relative rounded-xl overflow-hidden border-2"
        style={{ borderColor: "var(--color-gold)" }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full cursor-crosshair"
          style={{ height: "360px", backgroundColor: "#E8F4E8" }}
          onClick={handleMapClick}
        >
          {/* Aube department simplified outline */}
          <polygon
            points="10,10 90,10 90,90 10,90"
            fill="#D4E8C2"
            stroke="#7B7B5B"
            strokeWidth="0.5"
            opacity="0.5"
          />
          {/* Simplified Aube river */}
          <path
            d="M 15 30 Q 30 35 48 38 Q 65 42 80 55 Q 88 65 85 80"
            fill="none"
            stroke="#6AAED6"
            strokeWidth="1.5"
            opacity="0.8"
          />
          {/* Seine river */}
          <path
            d="M 5 15 Q 15 18 20 18 Q 35 22 54 74"
            fill="none"
            stroke="#6AAED6"
            strokeWidth="1.2"
            opacity="0.8"
          />

          {/* Department border */}
          <path
            d="M 8,8 L 92,8 L 92,92 L 8,92 Z"
            fill="none"
            stroke="#5A6B3A"
            strokeWidth="1"
            strokeDasharray="3,2"
          />

          {/* City dots */}
          {MAP_CITIES.map((city) => (
            <g key={city.name}>
              <circle
                cx={city.x}
                cy={city.y}
                r="1.8"
                fill={
                  answered && city.name === riddle.mapTarget
                    ? "#22C55E"
                    : "#7B1F3A"
                }
                stroke="white"
                strokeWidth="0.5"
              />
              <text
                x={city.x + 2.5}
                y={city.y + 1}
                fontSize="3.5"
                fill="#1C1C2E"
                style={{ fontFamily: "sans-serif", pointerEvents: "none" }}
              >
                {city.label}
              </text>
            </g>
          ))}

          {/* Click indicator */}
          {click && !answered && (
            <circle
              cx={click.x}
              cy={click.y}
              r="4"
              fill={feedback === "wrong" ? "#EF4444" : "var(--color-gold)"}
              opacity="0.7"
              stroke="white"
              strokeWidth="0.8"
            />
          )}

          {/* Correct indicator */}
          {answered && (
            <circle
              cx={target.x}
              cy={target.y}
              r="6"
              fill="none"
              stroke="#22C55E"
              strokeWidth="2"
              opacity="0.9"
            />
          )}

          {/* Hint: highlight zone */}
          {showHint && !answered && (
            <circle
              cx={target.x}
              cy={target.y}
              r="12"
              fill="#C9A84C"
              opacity="0.2"
              stroke="#C9A84C"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
        </svg>

        <div
          className="absolute top-2 right-2 text-xs px-2 py-1 rounded"
          style={{ backgroundColor: "rgba(28,28,46,0.7)", color: "#FAF5E4" }}
        >
          Département de l&apos;Aube (10)
        </div>
      </div>

      {feedback === "wrong" && (
        <p className="text-red-600 text-sm font-medium">
          Pas tout à fait... Essayez encore !
        </p>
      )}
      {feedback === "correct" && (
        <p className="text-green-600 font-semibold">
          Bravo ! Vous avez trouvé {riddle.mapTarget} !
        </p>
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

      {riddle.hint && !showHint && !answered && (
        <button onClick={handleHint} className="btn-secondary text-sm">
          Indice (−30 pts)
        </button>
      )}
    </div>
  );
}

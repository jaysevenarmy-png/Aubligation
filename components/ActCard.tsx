import type { Act } from "@/types/game";
import Link from "next/link";

interface ActCardProps {
  act: Act;
  unlocked: boolean;
  completed: boolean;
  score: number;
  actIndex: number;
}

export default function ActCard({
  act,
  unlocked,
  completed,
  score,
  actIndex,
}: ActCardProps) {
  const content = (
    <div
      className={`rounded-xl p-6 border-2 transition-all duration-200 ${
        unlocked
          ? "cursor-pointer hover:shadow-lg hover:-translate-y-1"
          : "opacity-50 cursor-not-allowed"
      } ${completed ? "border-green-500" : "border-transparent"}`}
      style={{
        backgroundColor: "white",
        borderColor: completed ? "#22c55e" : "transparent",
        boxShadow: unlocked ? "0 2px 12px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: act.color }}
        >
          {actIndex + 1}
        </div>
        {completed && (
          <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
            ✓ Terminé — {score} pts
          </span>
        )}
        {!unlocked && (
          <span className="text-gray-400 text-sm">Verrouillé</span>
        )}
      </div>

      <h3
        className="text-lg font-bold mb-1"
        style={{ color: "var(--color-slate)" }}
      >
        {act.title}
      </h3>
      <p className="text-sm mb-2" style={{ color: "var(--color-gold)" }}>
        {act.period}
      </p>
      <p className="text-sm text-gray-600 mb-3">{act.description}</p>
      <div className="flex flex-wrap gap-1">
        {act.personalities.map((p) => (
          <span
            key={p}
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: "var(--color-cream)",
              color: "var(--color-burgundy)",
            }}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );

  if (!unlocked) return content;

  return <Link href={`/game/${act.id}`}>{content}</Link>;
}

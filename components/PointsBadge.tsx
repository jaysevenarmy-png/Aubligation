interface PointsBadgeProps {
  points: number;
  className?: string;
}

export default function PointsBadge({ points, className = "" }: PointsBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${className}`}
      style={{
        backgroundColor: points >= 0 ? "var(--color-gold)" : "#ef4444",
        color: points >= 0 ? "var(--color-slate)" : "white",
      }}
    >
      {points >= 0 ? "+" : ""}
      {points} pts
    </span>
  );
}

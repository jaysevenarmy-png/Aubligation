import type { LeaderboardEntry } from "@/types/game";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Aucun joueur encore inscrit au classement.</p>
        <p className="text-sm mt-2">Soyez le premier à terminer le jeu !</p>
      </div>
    );
  }

  const medalColors = ["#C9A84C", "#A0A0A0", "#CD7F32"];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: "var(--color-slate)", color: "var(--color-cream)" }}>
            <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Joueur</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Score</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Actes</th>
            <th className="px-4 py-3 text-right text-sm font-semibold hidden sm:table-cell">
              Terminé le
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={i}
              className="border-b hover:bg-yellow-50 transition-colors"
              style={{ borderColor: "#E8E0D0" }}
            >
              <td className="px-4 py-3">
                {i < 3 ? (
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
                    style={{ backgroundColor: medalColors[i] }}
                  >
                    {i + 1}
                  </span>
                ) : (
                  <span className="text-gray-500 font-medium">{i + 1}</span>
                )}
              </td>
              <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-slate)" }}>
                {entry.nickname}
              </td>
              <td
                className="px-4 py-3 text-right font-bold"
                style={{ color: "var(--color-burgundy)" }}
              >
                {entry.score} pts
              </td>
              <td className="px-4 py-3 text-right text-gray-600">
                {entry.actsCompleted}/5
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-500 hidden sm:table-cell">
                {entry.completionTime
                  ? new Date(entry.completionTime).toLocaleDateString("fr-FR")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

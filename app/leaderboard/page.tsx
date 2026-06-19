"use client";

import { useState, useEffect } from "react";
import { getLeaderboard } from "@/lib/localStorage";
import Leaderboard from "@/components/Leaderboard";
import type { LeaderboardEntry } from "@/types/game";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // TODO: Replace with real-time Supabase leaderboard when connected
    const raw = getLeaderboard();
    const mapped: LeaderboardEntry[] = raw
      .slice(0, 10)
      .map((entry, i) => ({
        rank: i + 1,
        nickname: entry.nickname,
        score: entry.score,
        completionTime: entry.completedAt,
        actsCompleted: entry.actsCompleted,
      }));
    setEntries(mapped);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1
          className="text-4xl font-bold mb-3"
          style={{ color: "var(--color-slate)" }}
        >
          Classement
        </h1>
        <p className="text-gray-600">
          Les 10 meilleurs explorateurs de l&apos;Aube.
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: "var(--color-burgundy)" }}
        >
          <h2 className="text-white font-bold text-lg">Top 10</h2>
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(201,168,76,0.2)",
              color: "var(--color-gold)",
            }}
          >
            {entries.length} joueur{entries.length > 1 ? "s" : ""}
          </span>
        </div>

        <Leaderboard entries={entries} />
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Le classement est mis à jour en temps réel. Connectez Supabase pour la
        synchronisation multi-joueurs.
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { GAME_ACTS } from "@/lib/gameData";
import { getPlayer, getSession, createNewSession } from "@/lib/localStorage";
import ActCard from "@/components/ActCard";
import Link from "next/link";
import type { GameSession } from "@/types/game";

export default function GameHubPage() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const player = getPlayer();
    if (player) {
      setNickname(player.nickname);
      let s = getSession();
      if (!s) {
        s = createNewSession(player.id);
      }
      setSession(s);
    }
  }, []);

  if (!mounted) return null;

  if (!nickname) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--color-slate)" }}
        >
          Créez votre profil
        </h1>
        <p className="text-gray-600 mb-8">
          Pour jouer et apparaître au classement, vous devez d&apos;abord créer votre profil de joueur.
        </p>
        <Link href="/profile" className="btn-primary inline-block">
          Créer mon profil →
        </Link>
      </div>
    );
  }

  const totalScore = session?.totalScore ?? 0;
  const completedActs = session?.actProgress.filter((ap) => ap.completed).length ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--color-slate)" }}
            >
              Bienvenue, {nickname} !
            </h1>
            <p className="text-gray-500 mt-1">
              Choisissez votre prochain acte.
            </p>
          </div>
          <div
            className="rounded-xl px-6 py-3 text-center"
            style={{ backgroundColor: "var(--color-slate)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--color-gold)" }}
            >
              {totalScore}
            </div>
            <div className="text-xs uppercase tracking-widest" style={{ color: "var(--color-cream)" }}>
              points
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${(completedActs / GAME_ACTS.length) * 100}%`,
                backgroundColor: "var(--color-burgundy)",
              }}
            />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {completedActs}/{GAME_ACTS.length} actes
          </span>
        </div>
      </div>

      {/* Acts Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {GAME_ACTS.map((act, i) => {
          const actProgress = session?.actProgress.find((ap) => ap.actId === act.id);
          const prevCompleted =
            i === 0 ||
            session?.actProgress.some(
              (ap) => ap.actId === GAME_ACTS[i - 1].id && ap.completed
            );

          return (
            <ActCard
              key={act.id}
              act={act}
              unlocked={prevCompleted ?? false}
              completed={actProgress?.completed ?? false}
              score={actProgress?.score ?? 0}
              actIndex={i}
            />
          );
        })}
      </div>

      {completedActs === GAME_ACTS.length && (
        <div
          className="mt-10 rounded-xl p-8 text-center"
          style={{
            background: `linear-gradient(135deg, var(--color-burgundy), var(--color-slate))`,
          }}
        >
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-gold)" }}>
            Félicitations !
          </h2>
          <p style={{ color: "var(--color-cream)" }} className="mb-6">
            Vous avez terminé tous les actes avec un score de {totalScore} points !
          </p>
          <Link href="/leaderboard" className="btn-secondary inline-block">
            Voir le classement
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GAME_ACTS } from "@/lib/gameData";
import {
  getPlayer,
  getSession,
  createNewSession,
  updateSessionWithAttempt,
  markActComplete,
  submitToLeaderboard,
} from "@/lib/localStorage";
import MCQRiddle from "@/components/riddles/MCQRiddle";
import TextRiddle from "@/components/riddles/TextRiddle";
import PhotoRiddle from "@/components/riddles/PhotoRiddle";
import MapRiddle from "@/components/riddles/MapRiddle";
import PointsBadge from "@/components/PointsBadge";
import Link from "next/link";
import type { GameSession, RiddleAttempt } from "@/types/game";

export default function ActPage() {
  const params = useParams();
  const router = useRouter();
  const actId = params.actId as string;

  const act = GAME_ACTS.find((a) => a.id === actId);

  const [session, setSession] = useState<GameSession | null>(null);
  const [currentRiddleIdx, setCurrentRiddleIdx] = useState(0);
  const [completedRiddles, setCompletedRiddles] = useState<RiddleAttempt[]>([]);
  const [actScore, setActScore] = useState(0);
  const [actComplete, setActComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastPoints, setLastPoints] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const player = getPlayer();
    if (!player) {
      router.push("/profile");
      return;
    }
    let s = getSession();
    if (!s) s = createNewSession(player.id);

    // Check if act was already completed
    const existingProgress = s.actProgress.find((ap) => ap.actId === actId);
    if (existingProgress?.completed) {
      setActComplete(true);
      setActScore(existingProgress.score);
      setCompletedRiddles(existingProgress.attempts);
    }
    setSession(s);
  }, [actId, router]);

  if (!mounted) return null;

  if (!act) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-slate)" }}>
          Acte introuvable
        </h1>
        <Link href="/game" className="btn-primary inline-block">
          Retour au jeu
        </Link>
      </div>
    );
  }

  const handleRiddleComplete = (points: number, hintsUsed: number, timeTaken: number) => {
    const riddle = act.riddles[currentRiddleIdx];
    if (!session) return;

    const attempt: RiddleAttempt = {
      riddleId: riddle.id,
      actId,
      isCorrect: true,
      hintsUsed,
      timeTakenSeconds: timeTaken,
      pointsEarned: points,
      attemptedAt: new Date().toISOString(),
    };

    const newCompleted = [...completedRiddles, attempt];
    setCompletedRiddles(newCompleted);
    setLastPoints(points);
    setActScore((prev) => prev + points);

    const updatedSession = updateSessionWithAttempt(session, actId, attempt);

    // Check if all riddles done
    if (currentRiddleIdx >= act.riddles.length - 1) {
      const finalSession = markActComplete(updatedSession, actId);
      setSession(finalSession);
      setActComplete(true);

      // Submit to leaderboard
      const player = getPlayer();
      if (player) {
        const totalCompleted = finalSession.actProgress.filter((ap) => ap.completed).length;
        submitToLeaderboard(player.nickname, finalSession.totalScore, totalCompleted);
      }
    } else {
      setSession(updatedSession);
      setTimeout(() => {
        setCurrentRiddleIdx((i) => i + 1);
        setLastPoints(null);
      }, 800);
    }
  };

  const riddle = act.riddles[currentRiddleIdx];
  const progress = completedRiddles.length / act.riddles.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/game"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-75 transition-opacity"
        style={{ color: "var(--color-burgundy)" }}
      >
        ← Retour à la carte
      </Link>

      {/* Act header */}
      <div
        className="rounded-2xl p-6 mb-8 text-white"
        style={{
          background: `linear-gradient(135deg, ${act.color}, var(--color-slate))`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{act.title}</h1>
            <p className="text-sm opacity-80 mt-1">{act.period}</p>
          </div>
          <div className="text-right">
            <div
              className="text-3xl font-bold"
              style={{ color: "var(--color-gold)" }}
            >
              {actScore} pts
            </div>
            <div className="text-xs opacity-70 mt-1">score de l&apos;acte</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-70 mb-1">
            <span>Progression</span>
            <span>
              {completedRiddles.length}/{act.riddles.length} énigmes
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: "var(--color-gold)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Act complete screen */}
      {actComplete ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-6">🎉</div>
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--color-slate)" }}
          >
            Acte terminé !
          </h2>
          <p className="text-gray-600 mb-2">
            Vous avez gagné
          </p>
          <div
            className="text-4xl font-bold mb-8"
            style={{ color: "var(--color-burgundy)" }}
          >
            {actScore} points
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10 text-sm">
            {completedRiddles.map((a, i) => (
              <div
                key={i}
                className="rounded-lg p-3"
                style={{ backgroundColor: "var(--color-cream)" }}
              >
                <div className="font-semibold mb-1">Énigme {i + 1}</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: "var(--color-burgundy)" }}
                >
                  +{a.pointsEarned}
                </div>
                <div className="text-xs text-gray-500">{a.timeTakenSeconds}s</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/game" className="btn-primary inline-block">
              Prochain acte →
            </Link>
            <Link href="/leaderboard" className="btn-secondary inline-block">
              Classement
            </Link>
          </div>
        </div>
      ) : (
        /* Riddle card */
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-gold)" }}
              >
                Énigme {currentRiddleIdx + 1}/{act.riddles.length}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor:
                      riddle.type === "mcq"
                        ? "#EDE9FE"
                        : riddle.type === "text"
                        ? "#DBEAFE"
                        : riddle.type === "photo"
                        ? "#FEF3C7"
                        : "#D1FAE5",
                    color:
                      riddle.type === "mcq"
                        ? "#5B21B6"
                        : riddle.type === "text"
                        ? "#1D4ED8"
                        : riddle.type === "photo"
                        ? "#92400E"
                        : "#065F46",
                  }}
                >
                  {riddle.type === "mcq"
                    ? "QCM"
                    : riddle.type === "text"
                    ? "Texte libre"
                    : riddle.type === "photo"
                    ? "Photo"
                    : "Carte"}
                </span>
                <span className="text-xs text-gray-400">
                  {riddle.basePoints} pts base
                </span>
              </div>
            </div>
            {lastPoints !== null && <PointsBadge points={lastPoints} />}
          </div>

          {riddle.type === "mcq" && (
            <MCQRiddle
              key={riddle.id}
              riddle={riddle}
              onComplete={handleRiddleComplete}
            />
          )}
          {riddle.type === "text" && (
            <TextRiddle
              key={riddle.id}
              riddle={riddle}
              onComplete={handleRiddleComplete}
            />
          )}
          {riddle.type === "photo" && (
            <PhotoRiddle
              key={riddle.id}
              riddle={riddle}
              onComplete={handleRiddleComplete}
            />
          )}
          {riddle.type === "map" && (
            <MapRiddle
              key={riddle.id}
              riddle={riddle}
              onComplete={handleRiddleComplete}
            />
          )}
        </div>
      )}
    </div>
  );
}

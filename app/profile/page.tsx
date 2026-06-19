"use client";

import { useState, useEffect } from "react";
import {
  getPlayer,
  savePlayer,
  getSession,
  clearSession,
  clearPlayer,
} from "@/lib/localStorage";
import type { Player } from "@/types/game";
import Link from "next/link";

export default function ProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [form, setForm] = useState({ nickname: "", email: "" });
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p = getPlayer();
    if (p) {
      setPlayer(p);
      setForm({ nickname: p.nickname, email: p.email });
    } else {
      setEditMode(true);
    }
  }, []);

  const handleSave = () => {
    if (!form.nickname.trim() || !form.email.trim()) return;

    const p: Player = {
      id: player?.id ?? crypto.randomUUID(),
      nickname: form.nickname.trim(),
      email: form.email.trim(),
      createdAt: player?.createdAt ?? new Date().toISOString(),
    };
    savePlayer(p);
    setPlayer(p);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir réinitialiser votre progression ? Toutes vos données seront perdues."
      )
    )
      return;
    clearSession();
    clearPlayer();
    setPlayer(null);
    setForm({ nickname: "", email: "" });
    setEditMode(true);
  };

  const session = mounted ? getSession() : null;
  const totalScore = session?.totalScore ?? 0;
  const completedActs = session?.actProgress.filter((ap) => ap.completed).length ?? 0;

  if (!mounted) return null;

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1
        className="text-4xl font-bold mb-2"
        style={{ color: "var(--color-slate)" }}
      >
        Mon Profil
      </h1>
      <p className="text-gray-500 mb-10">
        Gérez votre identité de joueur.
      </p>

      {/* Stats card (only when player exists) */}
      {player && session && (
        <div
          className="rounded-xl p-6 mb-8 text-white"
          style={{
            background: `linear-gradient(135deg, var(--color-slate), var(--color-burgundy))`,
          }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div
                className="text-3xl font-bold"
                style={{ color: "var(--color-gold)" }}
              >
                {totalScore}
              </div>
              <div className="text-xs opacity-70 mt-1">Points totaux</div>
            </div>
            <div>
              <div
                className="text-3xl font-bold"
                style={{ color: "var(--color-gold)" }}
              >
                {completedActs}
              </div>
              <div className="text-xs opacity-70 mt-1">Actes terminés</div>
            </div>
            <div>
              <div
                className="text-3xl font-bold"
                style={{ color: "var(--color-gold)" }}
              >
                {session.actProgress.reduce(
                  (acc, ap) => acc + ap.attempts.length,
                  0
                )}
              </div>
              <div className="text-xs opacity-70 mt-1">Réponses données</div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="card">
        <h2
          className="text-xl font-bold mb-6"
          style={{ color: "var(--color-slate)" }}
        >
          {player && !editMode ? "Informations" : "Créer / Modifier mon profil"}
        </h2>

        {player && !editMode ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400 block mb-1">
                Pseudonyme
              </label>
              <div
                className="text-lg font-semibold"
                style={{ color: "var(--color-slate)" }}
              >
                {player.nickname}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400 block mb-1">
                Email
              </label>
              <div className="text-gray-600">{player.email}</div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400 block mb-1">
                Membre depuis
              </label>
              <div className="text-gray-600">
                {new Date(player.createdAt).toLocaleDateString("fr-FR")}
              </div>
            </div>

            <div className="flex gap-3 pt-4 flex-wrap">
              <button
                onClick={() => setEditMode(true)}
                className="btn-secondary text-sm"
              >
                Modifier
              </button>
              <Link href="/game" className="btn-primary inline-block text-sm">
                Jouer →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--color-slate)" }}
              >
                Pseudonyme *
              </label>
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                placeholder="ex. : ChampagneExplorer"
                maxLength={30}
                className="w-full border-2 rounded-lg px-4 py-3 outline-none text-base"
                style={{
                  borderColor: "var(--color-gold)",
                  color: "var(--color-slate)",
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--color-slate)" }}
              >
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="vous@example.com"
                className="w-full border-2 rounded-lg px-4 py-3 outline-none text-base"
                style={{
                  borderColor: "var(--color-gold)",
                  color: "var(--color-slate)",
                }}
              />
            </div>

            {saved && (
              <p className="text-green-600 font-medium text-sm">
                Profil sauvegardé !
              </p>
            )}

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleSave}
                disabled={!form.nickname.trim() || !form.email.trim()}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sauvegarder
              </button>
              {player && (
                <button
                  onClick={() => setEditMode(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Danger zone */}
      {player && (
        <div
          className="mt-8 rounded-xl p-6 border"
          style={{ borderColor: "#FCA5A5", backgroundColor: "#FFF5F5" }}
        >
          <h3 className="font-bold text-red-700 mb-2">Zone dangereuse</h3>
          <p className="text-sm text-red-600 mb-4">
            Réinitialiser effacera toute votre progression et vos scores.
          </p>
          <button
            onClick={handleReset}
            className="text-sm px-4 py-2 rounded-lg border border-red-400 text-red-600 hover:bg-red-50 transition-colors"
          >
            Réinitialiser ma progression
          </button>
        </div>
      )}
    </div>
  );
}

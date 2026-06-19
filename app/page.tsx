"use client";

import { useState, useEffect } from "react";
import Countdown from "@/components/Countdown";
import Link from "next/link";

export default function HomePage() {
  const [gameOpen, setGameOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // NEXT_PUBLIC_GAME_START_DATE env var controls when the game opens
  // Format: ISO date string e.g. "2024-06-15T10:00:00Z"
  const startDateStr = process.env.NEXT_PUBLIC_GAME_START_DATE;
  const startDate = startDateStr ? new Date(startDateStr) : new Date(0);

  useEffect(() => {
    setMounted(true);
    if (startDate.getTime() <= Date.now()) {
      setGameOpen(true);
    }
  }, [startDate]);

  const handleCountdownExpired = () => {
    setGameOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      <section
        className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center"
        style={{
          background: `linear-gradient(135deg, var(--color-slate) 0%, #2D1F3D 50%, var(--color-burgundy) 100%)`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="inline-block text-sm font-semibold tracking-[0.3em] uppercase mb-6 px-4 py-2 rounded-full"
            style={{
              backgroundColor: "rgba(201,168,76,0.15)",
              color: "var(--color-gold)",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            Département de l&apos;Aube · France
          </div>

          <h1
            className="text-5xl sm:text-7xl font-bold mb-4 tracking-tight"
            style={{ color: "var(--color-cream)" }}
          >
            Aubligation
          </h1>

          <p
            className="text-xl sm:text-2xl font-light mb-4 italic"
            style={{ color: "var(--color-gold)" }}
          >
            L&apos;enquête de l&apos;Aube
          </p>

          <p
            className="text-base sm:text-lg mb-10 leading-relaxed max-w-lg mx-auto"
            style={{ color: "rgba(250,245,228,0.75)" }}
          >
            Parcourez 5 actes à travers l&apos;histoire de l&apos;Aube. Résolvez des
            énigmes sur Rachi, Danton, Napoléon, Flaubert, Camille Claudel et
            Renoir. Chaque bonne réponse vous rapproche du sommet du classement.
          </p>

          {mounted && (
            <>
              {gameOpen ? (
                <Link
                  href="/game"
                  className="inline-block px-10 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 hover:shadow-2xl"
                  style={{
                    backgroundColor: "var(--color-gold)",
                    color: "var(--color-slate)",
                  }}
                >
                  Commencer l&apos;enquête →
                </Link>
              ) : (
                <Countdown
                  targetDate={startDate}
                  onExpired={handleCountdownExpired}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-16 px-6"
        style={{ backgroundColor: "var(--color-cream)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: "var(--color-slate)" }}
          >
            5 Actes, 5 Territoires
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Troyes", icon: "⚜️", sub: "Rachi · Thibaut IV" },
              { title: "Arcis-sur-Aube", icon: "⚔️", sub: "Danton" },
              { title: "Brienne", icon: "🎖️", sub: "Napoléon" },
              { title: "Nogent-s-Seine", icon: "🗿", sub: "Claudel · Flaubert" },
              { title: "Essoyes", icon: "🎨", sub: "Renoir" },
            ].map((act, i) => (
              <div
                key={act.title}
                className="rounded-xl p-5 text-center"
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}
              >
                <div className="text-3xl mb-2">{act.icon}</div>
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: "var(--color-gold)" }}
                >
                  Acte {i + 1}
                </div>
                <div
                  className="font-bold text-sm"
                  style={{ color: "var(--color-slate)" }}
                >
                  {act.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">{act.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="py-16 px-6"
        style={{ backgroundColor: "white" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-10"
            style={{ color: "var(--color-slate)" }}
          >
            Comment jouer ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Créez votre profil",
                desc: "Choisissez un pseudonyme et entrez votre email pour sauvegarder votre progression.",
              },
              {
                step: "02",
                title: "Résolvez les énigmes",
                desc: "QCM, texte libre, photo ou carte interactive — 4 formats pour vous surprendre.",
              },
              {
                step: "03",
                title: "Montez au classement",
                desc: "Rapidité et exactitude font grimper votre score. Les indices coûtent des points.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className="text-5xl font-bold mb-3"
                  style={{ color: "var(--color-gold)", opacity: 0.4 }}
                >
                  {item.step}
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: "var(--color-slate)" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aubligation — L'enquête de l'Aube",
  description:
    "Un jeu d'investigation sur les personnalités et l'histoire du département de l'Aube.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen" style={{ backgroundColor: "var(--color-cream)" }}>
        <nav
          style={{ backgroundColor: "var(--color-slate)" }}
          className="px-6 py-4 flex items-center justify-between"
        >
          <a
            href="/"
            className="text-xl font-bold tracking-wide"
            style={{ color: "var(--color-gold)" }}
          >
            Aubligation
          </a>
          <div className="flex gap-6 text-sm" style={{ color: "var(--color-cream)" }}>
            <a href="/game" className="hover:text-yellow-300 transition-colors">
              Jouer
            </a>
            <a href="/leaderboard" className="hover:text-yellow-300 transition-colors">
              Classement
            </a>
            <a href="/profile" className="hover:text-yellow-300 transition-colors">
              Profil
            </a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}

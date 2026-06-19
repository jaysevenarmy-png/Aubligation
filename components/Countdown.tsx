"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
  onExpired: () => void;
}

export default function Countdown({ targetDate, onExpired }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) {
        setTimeLeft(null);
        onExpired();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onExpired]);

  if (!timeLeft) return null;

  const units = [
    { label: "Jours", value: timeLeft.days },
    { label: "Heures", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Secondes", value: timeLeft.seconds },
  ];

  return (
    <div className="text-center">
      <p
        className="text-lg mb-6 font-semibold tracking-widest uppercase"
        style={{ color: "var(--color-gold)" }}
      >
        Le jeu ouvre dans
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        {units.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-xl p-4 min-w-[80px]"
            style={{ backgroundColor: "var(--color-slate)" }}
          >
            <span
              className="text-4xl font-bold tabular-nums"
              style={{ color: "var(--color-gold)" }}
            >
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-xs mt-1 tracking-widest uppercase" style={{ color: "var(--color-cream)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

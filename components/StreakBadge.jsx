"use client";

import { Flame } from "lucide-react";

export default function StreakBadge({ streak = 0 }) {
  if (streak <= 0) return null;

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full animate-scale-in"
      style={{
        background: "linear-gradient(135deg, var(--warm-50), var(--warm-100))",
        border: "1px solid var(--warm-light)",
      }}
    >
      <Flame size={14} style={{ color: "var(--warm-dark)" }} />
      <span className="text-xs font-bold" style={{ color: "var(--warm-dark)" }}>
        {streak} day{streak !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

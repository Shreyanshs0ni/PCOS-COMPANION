"use client";

const MOODS = [
  { emoji: "😢", label: "Awful", level: 1 },
  { emoji: "😔", label: "Bad", level: 2 },
  { emoji: "😐", label: "Okay", level: 3 },
  { emoji: "😊", label: "Good", level: 4 },
  { emoji: "🤩", label: "Great", level: 5 },
];

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="flex justify-between gap-2">
      {MOODS.map((mood) => {
        const active = value === mood.level;
        return (
          <button
            key={mood.level}
            type="button"
            onClick={() => onChange({ level: mood.level, label: mood.label })}
            className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl flex-1 transition-all duration-200"
            style={{
              background: active ? "var(--primary-50)" : "transparent",
              border: active ? "2px solid var(--primary)" : "2px solid transparent",
              transform: active ? "scale(1.08)" : "scale(1)",
            }}
          >
            <span className="text-3xl" style={{ filter: active ? "none" : "grayscale(0.5)" }}>
              {mood.emoji}
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: active ? "var(--primary-dark)" : "var(--text-tertiary)" }}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

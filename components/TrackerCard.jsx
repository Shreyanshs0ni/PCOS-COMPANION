"use client";

export default function TrackerCard({
  icon,
  label,
  value,
  color = "primary",
  onClick,
}) {
  const colorMap = {
    primary: {
      bg: "var(--primary-50)",
      border: "var(--primary-100)",
      accent: "var(--primary)",
    },
    accent: {
      bg: "var(--accent-50)",
      border: "var(--accent-100)",
      accent: "var(--accent)",
    },
    mint: {
      bg: "var(--mint-50)",
      border: "var(--mint-100)",
      accent: "var(--mint)",
    },
    warm: {
      bg: "var(--warm-50)",
      border: "var(--warm-100)",
      accent: "var(--warm)",
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <button
      onClick={onClick}
      className="card card-interactive flex flex-col items-start gap-3 p-4 w-full text-left"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${c.bg} 72%, var(--glass-bg)), var(--glass-bg))`,
        borderColor: c.border,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ background: c.bg, color: c.accent }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-tertiary)" }}
        >
          {label}
        </p>
        {value !== undefined && value !== null && (
          <p
            className="text-base font-bold mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
          </p>
        )}
      </div>
    </button>
  );
}

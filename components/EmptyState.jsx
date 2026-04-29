"use client";

export default function EmptyState({ icon = "📋", title, subtitle }) {
  return (
    <div className="card flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
      <div className="text-5xl mb-4 animate-float">{icon}</div>
      <h3 className="font-bold text-base mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p className="text-xs" style={{ color: "var(--text-tertiary)", maxWidth: "240px" }}>
        {subtitle}
      </p>
    </div>
  );
}

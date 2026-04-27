"use client";

import { Sparkles } from "lucide-react";

export default function InsightCard({ insight, loading }) {
  if (loading) {
    return (
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--primary-50), var(--primary-100))",
          border: "1px solid var(--primary-100)",
        }}
      >
        <div className="flex flex-col gap-3">
          <div className="skeleton h-4 w-3/4 rounded-lg" />
          <div className="skeleton h-4 w-full rounded-lg" />
          <div className="skeleton h-4 w-2/3 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--primary-50), var(--primary-100))",
        border: "1px solid var(--primary-100)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* BG decoration */}
      <div className="absolute top-0 right-0 p-3 opacity-[0.07]">
        <Sparkles size={72} />
      </div>

      <div className="flex items-center gap-2 mb-3 relative z-10">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "var(--primary)", color: "white" }}
        >
          <Sparkles size={14} />
        </div>
        <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--primary-dark)" }}>
          AI Coach Insight
        </h3>
      </div>

      <p className="text-sm leading-relaxed relative z-10" style={{ color: "var(--text-primary)" }}>
        {insight || "Complete a few check-ins to receive personalized insights from your AI coach! 🌸"}
      </p>
    </div>
  );
}

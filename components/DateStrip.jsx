"use client";

import { useMemo } from "react";

export default function DateStrip({ selectedDate, onDateSelect }) {
  const dates = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!selectedDate) return isToday(date);
    return date.toDateString() === new Date(selectedDate).toDateString();
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1">
      {dates.map((date, i) => {
        const active = isSelected(date);
        return (
          <button
            key={i}
            onClick={() => onDateSelect?.(date.toISOString().split("T")[0])}
            className="flex flex-col items-center gap-1 transition-all duration-200 flex-shrink-0"
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: active
                ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
                : "var(--bg-card)",
              border: active ? "none" : "1px solid var(--border-light)",
              color: active ? "var(--text-inverse)" : "var(--text-secondary)",
              boxShadow: active ? "0 4px 14px rgba(139, 126, 200, 0.3)" : "var(--shadow-sm)",
              minWidth: "52px",
              transform: active ? "scale(1.05)" : "scale(1)",
            }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ opacity: active ? 0.9 : 0.6 }}>
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="text-lg font-bold">{date.getDate()}</span>
            {isToday(date) && (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: active ? "white" : "var(--primary)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

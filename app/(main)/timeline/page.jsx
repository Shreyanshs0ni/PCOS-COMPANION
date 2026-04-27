"use client";

import { useState, useEffect } from "react";
import EmptyState from "@/components/EmptyState";

const TRACKER_ICONS = {
  mood: "😊", sleep: "😴", water: "💧", exercise: "🏃‍♀️",
  symptoms: "🩺", medications: "💊", journal: "📝", nutrition: "🥗",
  weight: "⚖️", stress: "🧠", cycle: "🔴",
};

const TRACKER_LABELS = {
  mood: "Mood", sleep: "Sleep", water: "Water", exercise: "Exercise",
  symptoms: "Symptoms", medications: "Medications", journal: "Journal",
  nutrition: "Nutrition", weight: "Weight", stress: "Stress", cycle: "Cycle",
};

const FILTER_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "30 days", value: 30 },
];

export default function TimelinePage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { getCheckInHistory } = await import("@/app/actions/checkin");
        const data = await getCheckInHistory(days, filterType);
        setEntries(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [days, filterType]);

  // Group by date
  const grouped = entries.reduce((acc, entry) => {
    const date = new Date(entry.created_at).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  const formatEntryValue = (entry) => {
    const d = entry.data;
    switch (entry.tracker_type) {
      case "mood": return d.label || `Level ${d.level}`;
      case "sleep": return `${d.hours} hours`;
      case "water": return `${d.glasses} glasses`;
      case "exercise": return `${d.minutes} min${d.type ? ` — ${d.type}` : ""}`;
      case "symptoms": return (d.selected || []).join(", ");
      case "medications": return d.name || "Logged";
      case "journal": return (d.text || "").substring(0, 60) + ((d.text || "").length > 60 ? "..." : "");
      case "nutrition": return d.type || "Logged";
      case "weight": return `${d.value} kg`;
      case "stress": return `Level ${d.level}/5`;
      case "cycle": return d.status || "Logged";
      default: return "Logged";
    }
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <header className="mb-5 animate-slide-down">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Timeline
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          Your health history at a glance
        </p>
      </header>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar animate-slide-up">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`chip ${days === opt.value ? "active" : ""}`}
            onClick={() => setDays(opt.value)}
          >
            {opt.label}
          </button>
        ))}
        <div className="w-px mx-1" style={{ background: "var(--border)" }} />
        <button
          className={`chip ${!filterType ? "active" : ""}`}
          onClick={() => setFilterType(null)}
        >
          All
        </button>
        {Object.keys(TRACKER_LABELS).map((type) => (
          <button
            key={type}
            className={`chip ${filterType === type ? "active" : ""}`}
            onClick={() => setFilterType(type)}
          >
            {TRACKER_ICONS[type]} {TRACKER_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <EmptyState
          icon="📋"
          title="No timeline data yet"
          subtitle="Complete some check-ins to see your health history here"
        />
      ) : (
        <div className="flex flex-col gap-5 stagger-children">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{ color: "var(--text-tertiary)" }}>
                {date}
              </h3>
              <div className="flex flex-col gap-2">
                {items.map((entry) => (
                  <div
                    key={entry.id}
                    className="card px-4 py-3 flex items-center gap-3"
                  >
                    <span className="text-lg flex-shrink-0">
                      {TRACKER_ICONS[entry.tracker_type] || "📋"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {TRACKER_LABELS[entry.tracker_type] || entry.tracker_type}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                        {formatEntryValue(entry)}
                      </p>
                    </div>
                    <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>
                      {new Date(entry.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

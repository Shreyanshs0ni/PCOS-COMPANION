"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import DateStrip from "@/components/DateStrip";
import StreakBadge from "@/components/StreakBadge";
import InsightCard from "@/components/InsightCard";
import TrackerCard from "@/components/TrackerCard";
import { useRouter } from "next/navigation";

export default function TodayPage() {
  const { user } = useUser();
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [insight, setInsight] = useState(null);
  const [todayCheckins, setTodayCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [{ getStreak }, { getLatestAIInsight }, { getTodayCheckIns }] =
          await Promise.all([
            import("@/app/actions/streak"),
            import("@/app/actions/insights"),
            import("@/app/actions/checkin"),
          ]);

        const [streakData, insightData, checkinsData] = await Promise.all([
          getStreak(),
          getLatestAIInsight(),
          getTodayCheckIns(),
        ]);

        setStreak(streakData?.current_streak || 0);
        setInsight(
          insightData?.parsed_response || insightData?.response || null,
        );
        setTodayCheckins(checkinsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const today = new Date();
  const greeting =
    today.getHours() < 12
      ? "Good morning"
      : today.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  const getCheckinValue = (type) => {
    const entry = todayCheckins.find((c) => c.tracker_type === type);
    if (!entry) return null;
    return entry.data;
  };

  const moodEntry = getCheckinValue("mood");
  const sleepEntry = getCheckinValue("sleep");
  const waterEntry = getCheckinValue("water");
  const exerciseEntry = getCheckinValue("exercise");

  const quickActions = [
    {
      icon: "😊",
      label: "Mood",
      value: moodEntry?.label || "Not logged",
      color: "primary",
    },
    {
      icon: "😴",
      label: "Sleep",
      value: sleepEntry ? `${sleepEntry.hours}h` : "Not logged",
      color: "accent",
    },
    {
      icon: "💧",
      label: "Water",
      value: waterEntry ? `${waterEntry.glasses} glasses` : "Not logged",
      color: "mint",
    },
    {
      icon: "🏃‍♀️",
      label: "Exercise",
      value: exerciseEntry ? `${exerciseEntry.minutes}m` : "Not logged",
      color: "warm",
    },
  ];

  const resolveTipOfDay = (insightData) => {
    if (!insightData) return null;
    if (typeof insightData === "object") {
      return (
        insightData?.recommendedActions?.[0] ||
        insightData?.patternsFound?.[0] ||
        null
      );
    }

    const text = String(insightData).trim();
    if (!text) return null;
    const firstBullet = text
      .split("\n")
      .map((line) => line.trim())
      .find(
        (line) =>
          line.startsWith("-") || line.startsWith("•") || /^\d+\./.test(line),
      );
    if (firstBullet)
      return firstBullet.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "");

    const firstSentence = text.split(/(?<=[.!?])\s+/)[0];
    return firstSentence || text;
  };

  const tipOfDay = resolveTipOfDay(insight);

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <header className="flex items-start justify-between mb-5 animate-slide-down">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            {greeting}, {user?.firstName || "there"} 👋
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-tertiary)" }}
          >
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <StreakBadge streak={streak} />
      </header>

      {/* Date Strip */}
      <section className="mb-5 animate-slide-up">
        <DateStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </section>

      {/* AI Insight */}
      <section
        className="mb-5 animate-slide-up"
        style={{ animationDelay: "60ms" }}
      >
        <InsightCard insight={tipOfDay} loading={loading} mode="tip" />
      </section>

      {/* Quick Check-in Grid */}
      <section className="mb-5" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Today's Summary
          </h2>
          <button
            onClick={() => router.push("/checkin")}
            className="text-xs font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Log now →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 stagger-children">
          {quickActions.map((item) => (
            <TrackerCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              color={item.color}
              onClick={() => router.push("/checkin")}
            />
          ))}
        </div>
      </section>

      {/* Guide Section */}
      <section
        className="mb-6 animate-slide-up"
        style={{ animationDelay: "180ms" }}
      >
        <div
          className="card p-4 flex items-center gap-4"
          style={{
            background:
              "linear-gradient(135deg, var(--mint-50), var(--bg-card))",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: "var(--mint-100)" }}
          >
            📘
          </div>
          <div className="flex-1">
            <h3
              className="text-sm font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              Your Wellness Journey
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Start by completing today's check-in to build your health profile
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

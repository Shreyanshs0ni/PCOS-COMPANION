"use client";

import { useState, useEffect } from "react";
import SimpleChart from "@/components/SimpleChart";
import InsightCard from "@/components/InsightCard";
import EmptyState from "@/components/EmptyState";
import { Sparkles } from "lucide-react";

export default function InsightsPage() {
  const [data, setData] = useState(null);
  const [latestInsight, setLatestInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [remaining, setRemaining] = useState(10);
  const [days, setDays] = useState(7);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [{ getInsightsData }, { getLatestAIInsight }, { getAICallsToday }] = await Promise.all([
          import("@/app/actions/insights"),
          import("@/app/actions/insights"),
          import("@/app/actions/insights"),
        ]);
        const [insightsData, insight, callsToday] = await Promise.all([
          getInsightsData(days),
          getLatestAIInsight(),
          getAICallsToday(),
        ]);
        setData(insightsData);
        setLatestInsight(insight?.response || null);
        setRemaining(10 - callsToday);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [days]);

  const requestNewInsight = async () => {
    if (remaining <= 0) return;
    setAiLoading(true);
    try {
      const { getProfile } = await import("@/app/actions/profile");
      const { getCheckInHistory } = await import("@/app/actions/checkin");
      const [profile, recentCheckIns] = await Promise.all([
        getProfile(),
        getCheckInHistory(7),
      ]);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, recentCheckIns }),
      });

      const result = await res.json();
      if (result.advice) {
        setLatestInsight(result.advice);
        setRemaining(result.remaining ?? remaining - 1);
      } else {
        alert(result.error || "Failed to get insight");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const hasData = data && (
    data.moodData.length > 0 ||
    data.sleepData.length > 0 ||
    data.waterData.length > 0 ||
    data.symptomFrequency.length > 0
  );

  return (
    <div className="px-5 pt-6 pb-4">
      <header className="mb-5 animate-slide-down">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Insights
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          Patterns, trends & AI coaching
        </p>
      </header>

      {/* Period Filter */}
      <div className="flex gap-2 mb-5 animate-slide-up">
        {[7, 14, 30].map((d) => (
          <button
            key={d}
            className={`chip ${days === d ? "active" : ""}`}
            onClick={() => setDays(d)}
          >
            {d} days
          </button>
        ))}
      </div>

      {/* AI Insight Section */}
      <section className="mb-6 animate-slide-up">
        <InsightCard insight={latestInsight} loading={loading} />
        <div className="flex items-center justify-between mt-3 px-1">
          <button
            onClick={requestNewInsight}
            disabled={aiLoading || remaining <= 0}
            className="btn btn-primary btn-sm"
          >
            {aiLoading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Thinking...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} />
                New Insight
              </span>
            )}
          </button>
          <span className="text-[10px] font-semibold" style={{ color: "var(--text-tertiary)" }}>
            {remaining}/10 remaining today
          </span>
        </div>
      </section>

      {/* Charts */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
      ) : !hasData ? (
        <EmptyState
          icon="📊"
          title="No chart data yet"
          subtitle="Complete a few check-ins to start seeing your health trends"
        />
      ) : (
        <div className="flex flex-col gap-5 stagger-children">
          {data.moodData.length > 0 && (
            <div className="card p-4">
              <SimpleChart
                data={data.moodData}
                label="Mood Trend"
                color="var(--primary)"
                maxValue={5}
                type="line"
              />
            </div>
          )}

          {data.sleepData.length > 0 && (
            <div className="card p-4">
              <SimpleChart
                data={data.sleepData}
                label="Sleep Hours"
                color="var(--mint)"
                maxValue={12}
                type="bar"
              />
            </div>
          )}

          {data.waterData.length > 0 && (
            <div className="card p-4">
              <SimpleChart
                data={data.waterData}
                label="Water Intake"
                color="var(--primary)"
                maxValue={16}
                type="bar"
              />
            </div>
          )}

          {data.symptomFrequency.length > 0 && (
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
                Top Symptoms
              </p>
              <div className="flex flex-col gap-2">
                {data.symptomFrequency.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-sm flex-1 font-medium" style={{ color: "var(--text-primary)" }}>
                      {s.name}
                    </span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-input)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(s.count / (data.symptomFrequency[0]?.count || 1)) * 100}%`,
                          background: "linear-gradient(90deg, var(--accent), var(--accent-dark))",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold w-6 text-right" style={{ color: "var(--text-secondary)" }}>
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.stressData.length > 0 && (
            <div className="card p-4">
              <SimpleChart
                data={data.stressData}
                label="Stress Level"
                color="var(--accent)"
                maxValue={5}
                type="line"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

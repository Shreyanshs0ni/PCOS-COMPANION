"use client";

import { useState, useEffect } from "react";
import TrackerCard from "@/components/TrackerCard";
import TrackerModal from "@/components/TrackerModal";
import MoodSelector from "@/components/MoodSelector";
import SymptomChips from "@/components/SymptomChips";

const TRACKERS = [
  { type: "mood", icon: "😊", label: "Mood", color: "primary" },
  { type: "symptoms", icon: "🩺", label: "Symptoms", color: "accent" },
  { type: "sleep", icon: "😴", label: "Sleep", color: "mint" },
  { type: "water", icon: "💧", label: "Water", color: "primary" },
  { type: "exercise", icon: "🏃‍♀️", label: "Exercise", color: "warm" },
  { type: "medications", icon: "💊", label: "Medications", color: "accent" },
  { type: "journal", icon: "📝", label: "Journal", color: "mint" },
  { type: "nutrition", icon: "🥗", label: "Nutrition", color: "warm" },
  { type: "weight", icon: "⚖️", label: "Weight", color: "primary" },
  { type: "stress", icon: "🧠", label: "Stress", color: "accent" },
  { type: "cycle", icon: "🔴", label: "Cycle", color: "accent" },
];

export default function CheckinPage() {
  const [activeTracker, setActiveTracker] = useState(null);
  const [saving, setSaving] = useState(false);
  const [trackerData, setTrackerData] = useState({});
  const [todayCheckins, setTodayCheckins] = useState([]);
  const [enabledTrackers, setEnabledTrackers] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [{ getTodayCheckIns }, { getTrackerSettings }] =
          await Promise.all([
            import("@/app/actions/checkin"),
            import("@/app/actions/tracker"),
          ]);
        const [checkins, settings] = await Promise.all([
          getTodayCheckIns(),
          getTrackerSettings(),
        ]);
        setTodayCheckins(checkins || []);
        setEnabledTrackers(
          settings?.filter((s) => s.enabled).map((s) => s.tracker_type) ||
            TRACKERS.map((t) => t.type),
        );
      } catch (err) {
        console.error(err);
        setEnabledTrackers(TRACKERS.map((t) => t.type));
      }
    }
    load();
  }, []);

  const visibleTrackers = TRACKERS.filter(
    (t) => !enabledTrackers || enabledTrackers.includes(t.type),
  );

  const isLoggedToday = (type) =>
    todayCheckins.some((c) => c.tracker_type === type);

  const handleSave = async () => {
    if (!activeTracker || !trackerData[activeTracker]) return;
    setSaving(true);
    try {
      const { submitCheckIn } = await import("@/app/actions/checkin");
      await submitCheckIn(activeTracker, trackerData[activeTracker]);

      // Refresh today's check-ins
      const { getTodayCheckIns } = await import("@/app/actions/checkin");
      const updated = await getTodayCheckIns();
      setTodayCheckins(updated || []);
      setActiveTracker(null);
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateData = (field, value) => {
    setTrackerData((prev) => ({
      ...prev,
      [activeTracker]: { ...prev[activeTracker], [field]: value },
    }));
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <header className="mb-5 animate-slide-down">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          Check-in
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          How are you doing today?
        </p>
      </header>

      {/* Tracker Grid */}
      <div className="grid grid-cols-2 gap-3 stagger-children">
        {visibleTrackers.map((tracker) => {
          const logged = isLoggedToday(tracker.type);
          return (
            <div key={tracker.type} className="relative">
              <TrackerCard
                icon={tracker.icon}
                label={tracker.label}
                color={tracker.color}
                value={logged ? "✓ Logged" : "Tap to log"}
                onClick={() => {
                  setActiveTracker(tracker.type);
                  if (!trackerData[tracker.type]) {
                    setTrackerData((prev) => ({ ...prev, [tracker.type]: {} }));
                  }
                }}
              />
              {logged && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                  style={{ background: "var(--mint)", color: "white" }}
                >
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tracker Modals */}
      {activeTracker === "mood" && (
        <TrackerModal
          title="Mood"
          icon="😊"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <MoodSelector
            value={trackerData.mood?.level}
            onChange={(mood) => setTrackerData((p) => ({ ...p, mood }))}
          />
        </TrackerModal>
      )}

      {activeTracker === "symptoms" && (
        <TrackerModal
          title="Symptoms"
          icon="🩺"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <SymptomChips
            selected={trackerData.symptoms?.selected || []}
            onChange={(selected) => updateData("selected", selected)}
          />
        </TrackerModal>
      )}

      {activeTracker === "sleep" && (
        <TrackerModal
          title="Sleep"
          icon="😴"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <div>
            <label className="label">Hours slept</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              className="input"
              placeholder="e.g. 7.5"
              value={trackerData.sleep?.hours || ""}
              onChange={(e) => updateData("hours", parseFloat(e.target.value))}
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              {[5, 6, 7, 8, 9].map((h) => (
                <button
                  key={h}
                  className={`chip ${trackerData.sleep?.hours === h ? "active" : ""}`}
                  onClick={() => updateData("hours", h)}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>
        </TrackerModal>
      )}

      {activeTracker === "water" && (
        <TrackerModal
          title="Water"
          icon="💧"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <div>
            <label className="label">Glasses of water</label>
            <div className="flex items-center gap-4 justify-center my-4">
              <button
                className="btn btn-ghost w-12 h-12 rounded-full text-xl"
                style={{ border: "1px solid var(--border)" }}
                onClick={() =>
                  updateData(
                    "glasses",
                    Math.max(0, (trackerData.water?.glasses || 0) - 1),
                  )
                }
              >
                −
              </button>
              <span
                className="text-4xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--primary)",
                }}
              >
                {trackerData.water?.glasses || 0}
              </span>
              <button
                className="btn btn-ghost w-12 h-12 rounded-full text-xl"
                style={{ border: "1px solid var(--border)" }}
                onClick={() =>
                  updateData("glasses", (trackerData.water?.glasses || 0) + 1)
                }
              >
                +
              </button>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              {[4, 6, 8, 10, 12].map((g) => (
                <button
                  key={g}
                  className={`chip ${trackerData.water?.glasses === g ? "active" : ""}`}
                  onClick={() => updateData("glasses", g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </TrackerModal>
      )}

      {activeTracker === "exercise" && (
        <TrackerModal
          title="Exercise"
          icon="🏃‍♀️"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Duration (minutes)</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 30"
                value={trackerData.exercise?.minutes || ""}
                onChange={(e) =>
                  updateData("minutes", parseInt(e.target.value))
                }
              />
            </div>
            <div>
              <label className="label">Type</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Walking",
                  "Running",
                  "Yoga",
                  "Strength",
                  "Swimming",
                  "Cycling",
                  "Dancing",
                  "Other",
                ].map((t) => (
                  <button
                    key={t}
                    className={`chip ${trackerData.exercise?.type === t ? "active" : ""}`}
                    onClick={() => updateData("type", t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TrackerModal>
      )}

      {activeTracker === "medications" && (
        <TrackerModal
          title="Medications"
          icon="💊"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Medication name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Metformin"
                value={trackerData.medications?.name || ""}
                onChange={(e) => updateData("name", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <div className="flex gap-3">
                {["Taken", "Missed", "Skipped"].map((s) => (
                  <button
                    key={s}
                    className={`chip flex-1 justify-center ${trackerData.medications?.status === s ? "active" : ""}`}
                    onClick={() => updateData("status", s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TrackerModal>
      )}

      {activeTracker === "journal" && (
        <TrackerModal
          title="Journal"
          icon="📝"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <div>
            <label className="label">How are you feeling?</label>
            <textarea
              className="input"
              rows={5}
              placeholder="Write your thoughts..."
              style={{ resize: "none" }}
              value={trackerData.journal?.text || ""}
              onChange={(e) => updateData("text", e.target.value)}
            />
          </div>
        </TrackerModal>
      )}

      {activeTracker === "nutrition" && (
        <TrackerModal
          title="Nutrition"
          icon="🥗"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <div>
            <label className="label">How was your eating today?</label>
            <div className="flex flex-wrap gap-2">
              {[
                "Healthy",
                "Balanced",
                "Moderate",
                "Heavy",
                "Skipped meals",
              ].map((t) => (
                <button
                  key={t}
                  className={`chip ${trackerData.nutrition?.type === t ? "active" : ""}`}
                  onClick={() => updateData("type", t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </TrackerModal>
      )}

      {activeTracker === "weight" && (
        <TrackerModal
          title="Weight"
          icon="⚖️"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <div>
            <label className="label">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              className="input"
              placeholder="e.g. 65.5"
              value={trackerData.weight?.value || ""}
              onChange={(e) => updateData("value", parseFloat(e.target.value))}
            />
          </div>
        </TrackerModal>
      )}

      {activeTracker === "stress" && (
        <TrackerModal
          title="Stress"
          icon="🧠"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <div>
            <label className="label">Stress level</label>
            <div className="flex justify-between gap-2 my-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  className="flex flex-col items-center gap-1 flex-1 py-3 rounded-2xl transition-all duration-200"
                  style={{
                    background:
                      trackerData.stress?.level === level
                        ? "var(--accent-50)"
                        : "transparent",
                    border:
                      trackerData.stress?.level === level
                        ? "2px solid var(--accent)"
                        : "2px solid transparent",
                  }}
                  onClick={() => updateData("level", level)}
                >
                  <span className="text-2xl">
                    {["😌", "🙂", "😐", "😰", "🤯"][level - 1]}
                  </span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {level}
                  </span>
                </button>
              ))}
            </div>
            <div
              className="flex justify-between text-[10px] px-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              <span>Calm</span>
              <span>Very stressed</span>
            </div>
          </div>
        </TrackerModal>
      )}

      {activeTracker === "cycle" && (
        <TrackerModal
          title="Cycle"
          icon="🔴"
          onClose={() => setActiveTracker(null)}
          onSave={handleSave}
          saving={saving}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Period status</label>
              <div className="flex flex-wrap gap-2">
                {["Started", "Ongoing", "Ended", "Spotting"].map((s) => (
                  <button
                    key={s}
                    className={`chip flex-1 justify-center ${trackerData.cycle?.status === s ? "active" : ""}`}
                    onClick={() => updateData("status", s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Flow</label>
              <div className="flex gap-2">
                {["Light", "Medium", "Heavy"].map((f) => (
                  <button
                    key={f}
                    className={`chip flex-1 justify-center ${trackerData.cycle?.flow === f ? "active" : ""}`}
                    onClick={() => updateData("flow", f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TrackerModal>
      )}
    </div>
  );
}

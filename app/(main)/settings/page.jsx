"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useClerk } from "@clerk/nextjs";
import SettingsGroup, { SettingsItem } from "@/components/SettingsGroup";

const TRACKER_LIST = [
  { type: "mood", label: "Mood", icon: "😊" },
  { type: "symptoms", label: "Symptoms", icon: "🩺" },
  { type: "sleep", label: "Sleep", icon: "😴" },
  { type: "water", label: "Water", icon: "💧" },
  { type: "exercise", label: "Exercise", icon: "🏃‍♀️" },
  { type: "medications", label: "Medications", icon: "💊" },
  { type: "journal", label: "Journal", icon: "📝" },
  { type: "nutrition", label: "Nutrition", icon: "🥗" },
  { type: "weight", label: "Weight", icon: "⚖️" },
  { type: "stress", label: "Stress", icon: "🧠" },
  { type: "cycle", label: "Cycle", icon: "🔴" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const [darkMode, setDarkMode] = useState(false);
  const [trackerSettings, setTrackerSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [{ getTrackerSettings }, { getProfile }] = await Promise.all([
          import("@/app/actions/tracker"),
          import("@/app/actions/profile"),
        ]);
        const [settings, profileData] = await Promise.all([
          getTrackerSettings(),
          getProfile(),
        ]);
        setTrackerSettings(settings || []);
        setProfile(profileData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();

    // Check dark mode
    const theme = document.documentElement.getAttribute("data-theme");
    setDarkMode(theme === "dark");
  }, []);

  const toggleDarkMode = (enabled) => {
    setDarkMode(enabled);
    document.documentElement.setAttribute("data-theme", enabled ? "dark" : "light");
    localStorage.setItem("theme", enabled ? "dark" : "light");
  };

  const toggleTracker = async (trackerType, enabled) => {
    try {
      const { updateTrackerSetting } = await import("@/app/actions/tracker");
      await updateTrackerSetting(trackerType, enabled);
      setTrackerSettings((prev) =>
        prev.map((s) => (s.tracker_type === trackerType ? { ...s, enabled } : s))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const isEnabled = (type) => {
    const setting = trackerSettings.find((s) => s.tracker_type === type);
    return setting ? setting.enabled : true;
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <header className="mb-5 animate-slide-down flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Settings
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Customize your experience
          </p>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </header>

      {/* Health Profile */}
      <SettingsGroup title="Health Profile">
        <SettingsItem
          icon="👤"
          label="Edit Health Profile"
          value={profile?.onboarding_complete ? "Complete" : "Incomplete"}
          onClick={() => router.push("/settings/profile")}
        />
      </SettingsGroup>

      {/* Manage Trackers */}
      <SettingsGroup title="Manage Trackers">
        {TRACKER_LIST.map((tracker) => (
          <SettingsItem
            key={tracker.type}
            icon={tracker.icon}
            label={tracker.label}
            toggle
            checked={isEnabled(tracker.type)}
            onToggle={(val) => toggleTracker(tracker.type, val)}
          />
        ))}
      </SettingsGroup>

      {/* Appearance */}
      <SettingsGroup title="Appearance">
        <SettingsItem
          icon="🌙"
          label="Dark Mode"
          toggle
          checked={darkMode}
          onToggle={toggleDarkMode}
        />
      </SettingsGroup>

      {/* About */}
      <SettingsGroup title="About">
        <SettingsItem icon="⭐" label="Rate App" onClick={() => {}} />
        <SettingsItem icon="🔗" label="Referral Code" value="Coming soon" onClick={() => {}} />
        <SettingsItem icon="ℹ️" label="Version" value="1.0.0 MVP" onClick={() => {}} />
      </SettingsGroup>

      {/* Sign Out */}
      <div className="mt-2 mb-6">
        <button
          onClick={handleSignOut}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-colors"
          style={{
            background: "rgba(229, 92, 92, 0.08)",
            color: "#E55C5C",
            border: "1px solid rgba(229, 92, 92, 0.15)",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

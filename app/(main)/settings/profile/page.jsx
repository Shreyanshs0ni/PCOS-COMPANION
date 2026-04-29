"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const PCOS_SYMPTOMS = [
  "Irregular Periods", "Weight Gain", "Acne", "Hair Loss",
  "Excess Hair Growth", "Fatigue", "Mood Swings", "Bloating",
  "Headaches", "Dark Patches", "Difficulty Sleeping", "Anxiety",
];

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    sex_at_birth: "",
    height: "",
    weight: "",
    blood_type: "",
    diet_type: "",
    physical_activity_level: "",
    occupation: "",
    pcos_diagnosed: false,
    cycle_regularity: "",
    main_symptoms: [],
  });

  useEffect(() => {
    async function load() {
      try {
        const { getProfile } = await import("@/app/actions/profile");
        const data = await getProfile();
        if (data) {
          setFormData({
            name: data.name || "",
            birthday: data.birthday || "",
            sex_at_birth: data.sex_at_birth || "",
            height: data.height || "",
            weight: data.weight || "",
            blood_type: data.blood_type || "",
            diet_type: data.diet_type || "",
            physical_activity_level: data.physical_activity_level || "",
            occupation: data.occupation || "",
            pcos_diagnosed: data.pcos_diagnosed || false,
            cycle_regularity: data.cycle_regularity || "",
            main_symptoms: data.main_symptoms || [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleSymptom = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      main_symptoms: prev.main_symptoms.includes(symptom)
        ? prev.main_symptoms.filter((s) => s !== symptom)
        : [...prev.main_symptoms, symptom],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { saveProfile } = await import("@/app/actions/profile");
      await saveProfile({ ...formData, onboarding_complete: true });
      router.back();
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-5 pt-6 pb-4">
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <header className="mb-5 flex items-center gap-3 animate-slide-down">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-input)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Edit Profile
          </h1>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Update your health information
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-4 stagger-children pb-6">
        {/* Basics */}
        <div className="card p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Basics
          </h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="label">Name</label>
              <input className="input" type="text" value={formData.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="label">Birthday</label>
              <input className="input" type="date" value={formData.birthday} onChange={(e) => update("birthday", e.target.value)} />
            </div>
            <div>
              <label className="label">Sex assigned at birth</label>
              <div className="flex flex-wrap gap-2">
                {["Female", "Male", "Intersex", "Prefer not to say"].map((opt) => (
                  <button key={opt} type="button" className={`chip ${formData.sex_at_birth === opt ? "active" : ""}`} onClick={() => update("sex_at_birth", opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="card p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Body
          </h3>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Height (cm)</label>
                <input className="input" type="number" value={formData.height} onChange={(e) => update("height", e.target.value)} placeholder="165" />
              </div>
              <div>
                <label className="label">Weight (kg)</label>
                <input className="input" type="number" value={formData.weight} onChange={(e) => update("weight", e.target.value)} placeholder="60" />
              </div>
            </div>
            <div>
              <label className="label">Blood type</label>
              <div className="flex flex-wrap gap-2">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Don't know"].map((bt) => (
                  <button key={bt} type="button" className={`chip ${formData.blood_type === bt ? "active" : ""}`} onClick={() => update("blood_type", bt)}>
                    {bt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="card p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Lifestyle
          </h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="label">Diet type</label>
              <div className="flex flex-wrap gap-2">
                {["Balanced", "Vegetarian", "Vegan", "Low-carb", "Mediterranean", "No preference"].map((d) => (
                  <button key={d} type="button" className={`chip ${formData.diet_type === d ? "active" : ""}`} onClick={() => update("diet_type", d)}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Physical activity level</label>
              <div className="flex flex-wrap gap-2">
                {["Sedentary", "Light", "Moderate", "Active", "Very Active"].map((a) => (
                  <button key={a} type="button" className={`chip ${formData.physical_activity_level === a ? "active" : ""}`} onClick={() => update("physical_activity_level", a)}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Occupation</label>
              <input className="input" type="text" value={formData.occupation} onChange={(e) => update("occupation", e.target.value)} placeholder="e.g. Student, Engineer..." />
            </div>
          </div>
        </div>

        {/* PCOS */}
        <div className="card p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            PCOS
          </h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="label">Diagnosed with PCOS?</label>
              <div className="flex gap-3">
                {[{ label: "Yes", value: true }, { label: "No", value: false }].map((opt) => (
                  <button key={opt.label} type="button" className={`chip flex-1 justify-center ${formData.pcos_diagnosed === opt.value ? "active" : ""}`} onClick={() => update("pcos_diagnosed", opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Cycle regularity</label>
              <div className="flex flex-wrap gap-2">
                {["Regular", "Irregular", "Very Irregular", "Absent", "Not sure"].map((r) => (
                  <button key={r} type="button" className={`chip ${formData.cycle_regularity === r ? "active" : ""}`} onClick={() => update("cycle_regularity", r)}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Symptoms you experience</label>
              <div className="flex flex-wrap gap-2">
                {PCOS_SYMPTOMS.map((s) => (
                  <button key={s} type="button" className={`chip ${formData.main_symptoms.includes(s) ? "active" : ""}`} onClick={() => toggleSymptom(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-lg w-full">
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

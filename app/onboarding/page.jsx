"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const PCOS_SYMPTOMS = [
  "Irregular Periods",
  "Weight Gain",
  "Acne",
  "Hair Loss",
  "Excess Hair Growth",
  "Fatigue",
  "Mood Swings",
  "Bloating",
  "Headaches",
  "Dark Patches",
  "Difficulty Sleeping",
  "Anxiety",
];

const STEPS = [
  { title: "Let's get to know you", subtitle: "Tell us a bit about yourself" },
  {
    title: "Your body profile",
    subtitle: "This helps personalize your experience",
  },
  { title: "Lifestyle", subtitle: "We'll tailor recommendations for you" },
  { title: "PCOS & You", subtitle: "Help us understand your journey" },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState("right");

  const [formData, setFormData] = useState({
    name: user?.firstName || "",
    birthday: "",
    sex_at_birth: "",
    gender_identity: "",
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

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleSymptom = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      main_symptoms: prev.main_symptoms.includes(symptom)
        ? prev.main_symptoms.filter((s) => s !== symptom)
        : [...prev.main_symptoms, symptom],
    }));
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setDirection("right");
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step > 0) {
      setDirection("left");
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { saveProfile } = await import("@/app/actions/profile");
      await saveProfile({ ...formData, onboarding_complete: true });
      router.push("/today");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ background: "var(--bg)" }}
    >
      {/* Progress Bar */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--text-tertiary)" }}
          >
            Step {step + 1} of {STEPS.length}
          </span>
          {step > 0 && (
            <button
              onClick={back}
              className="text-xs font-semibold"
              style={{ color: "var(--primary)" }}
            >
              ← Back
            </button>
          )}
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--border-light)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, var(--primary), var(--accent))",
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pt-4 pb-2">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          {STEPS[step].title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {STEPS[step].subtitle}
        </p>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto" key={step}>
        <div
          className={
            direction === "right" ? "animate-slide-right" : "animate-slide-left"
          }
        >
          {step === 0 && <Step1 formData={formData} update={update} />}
          {step === 1 && <Step2 formData={formData} update={update} />}
          {step === 2 && <Step3 formData={formData} update={update} />}
          {step === 3 && (
            <Step4
              formData={formData}
              update={update}
              toggleSymptom={toggleSymptom}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-4">
        {step < STEPS.length - 1 ? (
          <button onClick={next} className="btn btn-primary btn-lg w-full">
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Start My Journey 🌸"
            )}
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button
            onClick={next}
            className="w-full text-center mt-3 text-sm font-medium"
            style={{ color: "var(--text-tertiary)" }}
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}

function Step1({ formData, update }) {
  return (
    <div className="flex flex-col gap-5 stagger-children">
      <div>
        <label className="label">What should we call you?</label>
        <input
          type="text"
          className="input"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>
      <div>
        <label className="label">When's your birthday?</label>
        <input
          type="date"
          className="input"
          value={formData.birthday}
          onChange={(e) => update("birthday", e.target.value)}
        />
      </div>
      <div>
        <label className="label">Sex assigned at birth</label>
        <div className="flex gap-3">
          {["Female", "Male", "Intersex", "Prefer not to say"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`chip ${formData.sex_at_birth === opt ? "active" : ""}`}
              onClick={() => update("sex_at_birth", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ formData, update }) {
  return (
    <div className="flex flex-col gap-5 stagger-children">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Height (cm)</label>
          <input
            type="number"
            className="input"
            placeholder="165"
            value={formData.height}
            onChange={(e) => update("height", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Weight (kg)</label>
          <input
            type="number"
            className="input"
            placeholder="60"
            value={formData.weight}
            onChange={(e) => update("weight", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label">Blood type</label>
        <div className="flex flex-wrap gap-2">
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Don't know"].map(
            (bt) => (
              <button
                key={bt}
                type="button"
                className={`chip ${formData.blood_type === bt ? "active" : ""}`}
                onClick={() => update("blood_type", bt)}
              >
                {bt}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function Step3({ formData, update }) {
  return (
    <div className="flex flex-col gap-5 stagger-children">
      <div>
        <label className="label">Diet type</label>
        <div className="flex flex-wrap gap-2">
          {[
            "Balanced",
            "Vegetarian",
            "Vegan",
            "Low-carb",
            "Mediterranean",
            "No preference",
          ].map((d) => (
            <button
              key={d}
              type="button"
              className={`chip ${formData.diet_type === d ? "active" : ""}`}
              onClick={() => update("diet_type", d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Physical activity level</label>
        <div className="flex flex-wrap gap-2">
          {["Sedentary", "Light", "Moderate", "Active", "Very Active"].map(
            (a) => (
              <button
                key={a}
                type="button"
                className={`chip ${formData.physical_activity_level === a ? "active" : ""}`}
                onClick={() => update("physical_activity_level", a)}
              >
                {a}
              </button>
            ),
          )}
        </div>
      </div>
      <div>
        <label className="label">Occupation (optional)</label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Student, Engineer..."
          value={formData.occupation}
          onChange={(e) => update("occupation", e.target.value)}
        />
      </div>
    </div>
  );
}

function Step4({ formData, update, toggleSymptom }) {
  return (
    <div className="flex flex-col gap-5 stagger-children">
      <div>
        <label className="label">Have you been diagnosed with PCOS?</label>
        <div className="flex gap-3">
          {[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              className={`chip flex-1 justify-center ${formData.pcos_diagnosed === opt.value ? "active" : ""}`}
              onClick={() => update("pcos_diagnosed", opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">How regular are your periods?</label>
        <div className="flex flex-wrap gap-2">
          {["Regular", "Irregular", "Very Irregular", "Absent", "Not sure"].map(
            (r) => (
              <button
                key={r}
                type="button"
                className={`chip ${formData.cycle_regularity === r ? "active" : ""}`}
                onClick={() => update("cycle_regularity", r)}
              >
                {r}
              </button>
            ),
          )}
        </div>
      </div>
      <div>
        <label className="label">What symptoms do you experience?</label>
        <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
          Select all that apply
        </p>
        <div className="flex flex-wrap gap-2">
          {PCOS_SYMPTOMS.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip ${formData.main_symptoms.includes(s) ? "active" : ""}`}
              onClick={() => toggleSymptom(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

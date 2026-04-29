"use client";

const PCOS_SYMPTOMS = [
  "Cramps",
  "Bloating",
  "Acne",
  "Fatigue",
  "Headache",
  "Mood Swings",
  "Hair Loss",
  "Weight Gain",
  "Excess Hair",
  "Anxiety",
  "Insomnia",
  "Back Pain",
  "Breast Tenderness",
  "Nausea",
  "Cravings",
  "Hot Flashes",
];

export default function SymptomChips({ selected = [], onChange }) {
  const toggle = (symptom) => {
    if (selected.includes(symptom)) {
      onChange(selected.filter((s) => s !== symptom));
    } else {
      onChange([...selected, symptom]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PCOS_SYMPTOMS.map((s) => (
        <button
          key={s}
          type="button"
          className={`chip ${selected.includes(s) ? "active" : ""}`}
          onClick={() => toggle(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

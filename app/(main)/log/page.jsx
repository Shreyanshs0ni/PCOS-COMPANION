"use client";

import { useState } from "react";

export default function LogPage() {
  const [formData, setFormData] = useState({
    sleep: "",
    water: "",
    exercise: "",
    symptomType: "None",
    symptomSeverity: "1",
  });

  const symptoms = ["None", "Acne", "Fatigue", "Mood Swings", "Hair Loss", "Irregular Periods"];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to backend
    alert("Saved!");
  };

  return (
    <div className="p-5">
      <header className="pt-4 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Today's Log</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Track your daily wellness</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sleep (Hours)</label>
          <input
            type="number"
            step="0.5"
            required
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            placeholder="E.g., 7.5"
            value={formData.sleep}
            onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
          />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Water Intake (Liters)</label>
          <input
            type="number"
            step="0.1"
            required
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            placeholder="E.g., 2.5"
            value={formData.water}
            onChange={(e) => setFormData({ ...formData, water: e.target.value })}
          />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Exercise (Minutes)</label>
          <input
            type="number"
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            placeholder="E.g., 30"
            value={formData.exercise}
            onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
          />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Prevalent Symptom</label>
          <select
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow appearance-none"
            value={formData.symptomType}
            onChange={(e) => setFormData({ ...formData, symptomType: e.target.value })}
          >
            {symptoms.map(sym => <option key={sym} value={sym}>{sym}</option>)}
          </select>
          
          {formData.symptomType !== "None" && (
            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Severity (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                className="w-full accent-blue-600"
                value={formData.symptomSeverity}
                onChange={(e) => setFormData({ ...formData, symptomSeverity: e.target.value })}
              />
              <div className="flex justify-between text-xs text-gray-400 font-medium px-1 mt-1">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98]"
        >
          Save Log
        </button>
      </form>
    </div>
  );
}

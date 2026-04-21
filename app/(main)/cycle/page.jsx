"use client";

import { useState } from "react";
import { Droplet, Info } from "lucide-react";

export default function CyclePage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    alert("Cycle Saved!");
  };

  return (
    <div className="p-5 pb-8">
      <header className="pt-4 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cycle Tracking</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Log and predict your ovulation</p>
      </header>
      
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-5 mb-6 flex flex-col gap-3 shadow-sm relative overflow-hidden">
        <Droplet size={80} className="absolute -bottom-4 -right-2 text-pink-200 opacity-20" />
        <div className="flex items-center gap-2 text-pink-700 font-bold mb-1 relative z-10">
          <Droplet size={20} className="fill-pink-200" />
          <span>Predictions</span>
        </div>
        <p className="text-sm text-pink-900 relative z-10 leading-relaxed">
          Based on an average cycle length, your next predicted ovulation window is <strong className="bg-pink-100 px-1 py-0.5 rounded text-pink-800">April 25-27</strong>.
        </p>
        <p className="text-[11px] text-pink-600 flex items-start gap-1 font-medium mt-1 relative z-10">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          This is an estimate based on ovulation typically occurring 14 days before your next cycle.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cycle Start Date</label>
          <input
            type="date"
            required
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-shadow"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cycle End Date (Optional)</label>
          <input
            type="date"
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-shadow"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-4 bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 hover:bg-pink-700 hover:shadow-pink-300 transition-all active:scale-[0.98]"
        >
          Save Dates
        </button>
      </form>
    </div>
  );
}

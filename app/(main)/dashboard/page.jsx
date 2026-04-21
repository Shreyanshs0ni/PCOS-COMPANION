import { auth } from "@clerk/nextjs/server";
import { Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();

  return (
    <div className="p-5 flex flex-col gap-6">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Today</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Tuesday, April 21</p>
      </header>

      {/* AI Advice Card */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={64} />
        </div>
        <div className="flex items-center gap-2 mb-3 text-blue-800">
          <Sparkles size={20} className="text-blue-600" />
          <h2 className="font-semibold">AI Coach Insight</h2>
        </div>
        <p className="text-blue-900 text-sm leading-relaxed">
          You've averaged 6 hours of sleep this week. PCOS fatigue can be compounded by poor sleep. 
          Try unwinding with magnesium-rich foods today, and keep drinking water!
        </p>
      </section>

      {/* Today's Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sleep</span>
          <div className="mt-2 text-2xl font-bold text-gray-800">0 <span className="text-sm font-medium text-gray-500">hr</span></div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Water</span>
          <div className="mt-2 text-2xl font-bold text-gray-800">0 <span className="text-sm font-medium text-gray-500">L</span></div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Exercise</span>
          <div className="mt-2 text-2xl font-bold text-gray-800">0 <span className="text-sm font-medium text-gray-500">min</span></div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Symptoms</span>
          <div className="mt-2 text-xl font-bold text-gray-800">None</div>
        </div>
      </section>
    </div>
  );
}

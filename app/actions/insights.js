"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function getInsightsData(days = 7) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: entries, error } = await supabaseAdmin
    .from("check_in_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  // Aggregate data for charts
  const moodData = [];
  const sleepData = [];
  const waterData = [];
  const symptomCounts = {};
  const stressData = [];

  (entries || []).forEach((entry) => {
    const date = new Date(entry.created_at).toLocaleDateString("en-US", { weekday: "short" });

    switch (entry.tracker_type) {
      case "mood":
        moodData.push({ date, value: entry.data?.level || 0, label: entry.data?.label || "" });
        break;
      case "sleep":
        sleepData.push({ date, value: entry.data?.hours || 0 });
        break;
      case "water":
        waterData.push({ date, value: entry.data?.glasses || 0 });
        break;
      case "symptoms":
        (entry.data?.selected || []).forEach((symptom) => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
        break;
      case "stress":
        stressData.push({ date, value: entry.data?.level || 0 });
        break;
    }
  });

  const symptomFrequency = Object.entries(symptomCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return { moodData, sleepData, waterData, symptomFrequency, stressData };
}

export async function getLatestAIInsight() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin
    .from("ai_insights")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data;
}

export async function getAICallsToday() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabaseAdmin
    .from("ai_insights")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", today.toISOString());

  if (error) throw new Error(error.message);
  return count || 0;
}

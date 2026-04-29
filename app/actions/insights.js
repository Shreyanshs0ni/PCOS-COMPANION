"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

function toDayKey(isoDate) {
  return new Date(isoDate).toISOString().slice(0, 10);
}

function toLabel(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", { weekday: "short" });
}

function toFiniteNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

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

  const dayMap = new Map();
  const symptomCounts = {};

  (entries || []).forEach((entry) => {
    const dayKey = toDayKey(entry.created_at);
    const dayLabel = toLabel(entry.created_at);
    if (!dayMap.has(dayKey)) {
      dayMap.set(dayKey, {
        date: dayLabel,
        mood: [],
        sleep: [],
        water: [],
        stress: [],
      });
    }

    const bucket = dayMap.get(dayKey);

    switch (entry.tracker_type) {
      case "mood":
        bucket.mood.push(clamp(toFiniteNumber(entry.data?.level), 0, 5));
        break;
      case "sleep":
        bucket.sleep.push(clamp(toFiniteNumber(entry.data?.hours), 0, 16));
        break;
      case "water":
        bucket.water.push(clamp(toFiniteNumber(entry.data?.glasses), 0, 30));
        break;
      case "symptoms":
        (entry.data?.selected || []).forEach((symptom) => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
        break;
      case "stress":
        bucket.stress.push(clamp(toFiniteNumber(entry.data?.level), 0, 5));
        break;
    }
  });

  const aggregatedDays = Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  const average = (arr) => {
    if (!arr.length) return null;
    return Number(
      (arr.reduce((sum, item) => sum + item, 0) / arr.length).toFixed(1),
    );
  };

  const moodData = aggregatedDays
    .map((day) => ({ date: day.date, value: average(day.mood) }))
    .filter((d) => d.value !== null);
  const sleepData = aggregatedDays
    .map((day) => ({ date: day.date, value: average(day.sleep) }))
    .filter((d) => d.value !== null);
  const waterData = aggregatedDays
    .map((day) => ({ date: day.date, value: average(day.water) }))
    .filter((d) => d.value !== null);
  const stressData = aggregatedDays
    .map((day) => ({ date: day.date, value: average(day.stress) }))
    .filter((d) => d.value !== null);

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
  if (!data) return null;

  return {
    ...data,
    parsed_response: data.response_json || null,
  };
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

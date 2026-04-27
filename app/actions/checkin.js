"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function submitCheckIn(trackerType, data, notes = null) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { error } = await supabaseAdmin
    .from("check_in_entries")
    .insert({
      user_id: userId,
      tracker_type: trackerType,
      data,
      notes,
    });

  if (error) throw new Error(error.message);

  // Update streak after a check-in
  await updateStreakInternal(userId);

  return { success: true };
}

export async function getCheckInsForDate(date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabaseAdmin
    .from("check_in_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCheckInHistory(days = 7, trackerType = null) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const since = new Date();
  since.setDate(since.getDate() - days);

  let query = supabaseAdmin
    .from("check_in_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (trackerType) {
    query = query.eq("tracker_type", trackerType);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getTodayCheckIns() {
  const today = new Date().toISOString().split("T")[0];
  return getCheckInsForDate(today);
}

// Internal helper — update streak
async function updateStreakInternal(userId) {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabaseAdmin
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    await supabaseAdmin.from("streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_check_in_date: today,
    });
    return;
  }

  if (existing.last_check_in_date === today) return; // Already checked in today

  const lastDate = new Date(existing.last_check_in_date);
  const todayDate = new Date(today);
  const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

  let newStreak;
  if (diffDays === 1) {
    newStreak = existing.current_streak + 1;
  } else {
    newStreak = 1; // Reset streak
  }

  const longestStreak = Math.max(newStreak, existing.longest_streak);

  await supabaseAdmin
    .from("streaks")
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_check_in_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

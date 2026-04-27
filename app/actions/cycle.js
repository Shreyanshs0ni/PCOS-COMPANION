"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function submitCycle(startDate, endDate) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const cycleLength = endDate
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : null;

  const { error } = await supabaseAdmin
    .from("cycles")
    .insert({
      user_id: userId,
      start_date: startDate,
      end_date: endDate || null,
      cycle_length: cycleLength,
    });

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getCycleHistory() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin
    .from("cycles")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: false })
    .limit(12);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getLatestCycle() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin
    .from("cycles")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data;
}

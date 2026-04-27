"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

const DEFAULT_TRACKERS = [
  { tracker_type: "mood", display_order: 0 },
  { tracker_type: "symptoms", display_order: 1 },
  { tracker_type: "sleep", display_order: 2 },
  { tracker_type: "water", display_order: 3 },
  { tracker_type: "exercise", display_order: 4 },
  { tracker_type: "medications", display_order: 5 },
  { tracker_type: "journal", display_order: 6 },
  { tracker_type: "nutrition", display_order: 7 },
  { tracker_type: "weight", display_order: 8 },
  { tracker_type: "stress", display_order: 9 },
  { tracker_type: "cycle", display_order: 10 },
];

export async function getTrackerSettings() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin
    .from("tracker_settings")
    .select("*")
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);

  // If no settings yet, initialize with defaults
  if (!data || data.length === 0) {
    const defaults = DEFAULT_TRACKERS.map((t) => ({
      user_id: userId,
      ...t,
      enabled: true,
    }));

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("tracker_settings")
      .insert(defaults)
      .select();

    if (insertError) throw new Error(insertError.message);
    return inserted;
  }

  return data;
}

export async function updateTrackerSetting(trackerType, enabled) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { error } = await supabaseAdmin
    .from("tracker_settings")
    .update({ enabled })
    .eq("user_id", userId)
    .eq("tracker_type", trackerType);

  if (error) throw new Error(error.message);
  return { success: true };
}

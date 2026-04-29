import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase";
import { createHash } from "crypto";

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safeAverage(values) {
  if (!values.length) return null;
  const sum = values.reduce((acc, item) => acc + item, 0);
  return Number((sum / values.length).toFixed(1));
}

function summarizeCheckins(entries) {
  const summary = {
    sleep: [],
    water: [],
    mood: [],
    stress: [],
    exercise: [],
    symptoms: {},
  };

  for (const entry of entries) {
    if (entry.tracker_type === "sleep") summary.sleep.push(asNumber(entry.data?.hours));
    if (entry.tracker_type === "water") summary.water.push(asNumber(entry.data?.glasses));
    if (entry.tracker_type === "mood") summary.mood.push(asNumber(entry.data?.level));
    if (entry.tracker_type === "stress") summary.stress.push(asNumber(entry.data?.level));
    if (entry.tracker_type === "exercise") summary.exercise.push(asNumber(entry.data?.minutes));
    if (entry.tracker_type === "symptoms") {
      for (const symptom of entry.data?.selected || []) {
        summary.symptoms[symptom] = (summary.symptoms[symptom] || 0) + 1;
      }
    }
  }

  const topSymptoms = Object.entries(summary.symptoms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return {
    averages: {
      sleepHours: safeAverage(summary.sleep),
      waterGlasses: safeAverage(summary.water),
      moodLevel: safeAverage(summary.mood),
      stressLevel: safeAverage(summary.stress),
      exerciseMinutes: safeAverage(summary.exercise),
    },
    topSymptoms,
    checkinCount: entries.length,
  };
}

function buildCacheKey(userId, timeframeDays, profile, trendSummary, cycles) {
  const serializable = JSON.stringify({
    userId,
    timeframeDays,
    pcos: !!profile?.pcos_diagnosed,
    diet: profile?.diet_type || null,
    activity: profile?.physical_activity_level || null,
    cycleRegularity: profile?.cycle_regularity || null,
    trendSummary,
    recentCycleStarts: (cycles || []).map((c) => c.start_date).slice(0, 3),
  });
  return createHash("sha256").update(serializable).digest("hex");
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate Limiting Check (max 10 calls per day) — from DB
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabaseAdmin
      .from("ai_insights")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", today.toISOString());

    if ((count || 0) >= 10) {
      return NextResponse.json({ error: "Daily limit reached (10/10). Try again tomorrow!" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const timeframeDays = Math.min(Math.max(Number(body.timeframeDays) || 30, 7), 90);
    const since = new Date();
    since.setDate(since.getDate() - timeframeDays);

    const [{ data: profile }, { data: checkIns }, { data: cycles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", userId).single(),
      supabaseAdmin
        .from("check_in_entries")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("cycles")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false })
        .limit(6),
    ]);

    const trendSummary = summarizeCheckins(checkIns || []);
    const cacheKey = buildCacheKey(userId, timeframeDays, profile, trendSummary, cycles || []);

    let cachedInsight = null;
    const { data: cacheData } = await supabaseAdmin
      .from("ai_insights")
      .select("*")
      .eq("user_id", userId)
      .eq("cache_key", cacheKey)
      .gte("created_at", today.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    cachedInsight = cacheData || null;

    if (cachedInsight) {
      return NextResponse.json({
        advice: cachedInsight.response,
        structured: cachedInsight.response_json || null,
        remaining: 10 - (count || 0),
        cached: true,
      });
    }

    const profileContext = {
      name: profile?.name || "Unknown",
      age: profile?.birthday ? Math.floor((Date.now() - new Date(profile.birthday)) / 31557600000) : null,
      pcosDiagnosed: !!profile?.pcos_diagnosed,
      dietType: profile?.diet_type || null,
      activityLevel: profile?.physical_activity_level || null,
      cycleRegularity: profile?.cycle_regularity || null,
      symptomsFromOnboarding: profile?.main_symptoms || [],
    };

    const prompt = `
You are a supportive and practical PCOS wellness coach.
Use the data context to produce specific, non-medical lifestyle guidance.
Do not diagnose conditions. Do not suggest medications.
Respond ONLY as strict JSON with this exact shape:
{
  "patternsFound": ["..."],
  "likelyDrivers": ["..."],
  "recommendedActions": ["..."],
  "nextCheckGoals": ["..."],
  "safetyNote": "..."
}
Rules:
- patternsFound: 2-4 bullets grounded in trend data.
- likelyDrivers: 2-4 likely behavior drivers tied to data.
- recommendedActions: 3-5 concrete actions, one sentence each.
- nextCheckGoals: 2-3 measurable goals for next 3-7 days.
- safetyNote: 1 concise disclaimer.
- Tone: warm, encouraging, clear, not clinical.

UserProfile:
${JSON.stringify(profileContext)}
TrendSummary:
${JSON.stringify(trendSummary)}
RecentCycles:
${JSON.stringify(cycles || [])}
RecentCheckInsRaw:
${JSON.stringify((checkIns || []).slice(0, 60))}
    `.trim();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.4,
      max_tokens: 650,
    });

    const raw = completion.choices[0].message.content || "";
    let structured = null;
    try {
      structured = JSON.parse(raw);
    } catch {
      structured = null;
    }

    const advice = structured
      ? [
          "Patterns found:",
          ...(structured.patternsFound || []).map((item, i) => `${i + 1}. ${item}`),
          "",
          "Recommended actions:",
          ...(structured.recommendedActions || []).map((item, i) => `${i + 1}. ${item}`),
        ].join("\n")
      : raw;

    // Store in DB
    const insertPayload = {
      user_id: userId,
      prompt_context: prompt.substring(0, 500),
      response: advice,
      response_json: structured,
      cache_key: cacheKey,
      timeframe_days: timeframeDays,
    };
    const { error: insertError } = await supabaseAdmin.from("ai_insights").insert(insertPayload);
    if (insertError) {
      await supabaseAdmin.from("ai_insights").insert({
        user_id: userId,
        prompt_context: prompt.substring(0, 500),
        response: advice,
      });
    }

    return NextResponse.json({
      advice,
      structured,
      remaining: 10 - (count || 0) - 1,
      cached: false,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to get AI insight." }, { status: 500 });
  }
}

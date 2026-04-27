import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase";

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

    const body = await req.json();

    // Build context from user data
    const profileContext = body.profile
      ? `User: ${body.profile.name || "Unknown"}, Age: ${body.profile.birthday ? Math.floor((Date.now() - new Date(body.profile.birthday)) / 31557600000) : "unknown"}, PCOS: ${body.profile.pcos_diagnosed ? "Yes" : "No"}, Diet: ${body.profile.diet_type || "unknown"}, Activity: ${body.profile.physical_activity_level || "unknown"}.`
      : "No profile data available.";

    const checkInContext = body.recentCheckIns?.length
      ? `Recent check-ins: ${body.recentCheckIns.map(c => `${c.tracker_type}: ${JSON.stringify(c.data)}`).join("; ")}.`
      : "No recent check-in data.";

    const prompt = `
      ${profileContext}
      ${checkInContext}

      You are a warm, supportive, and knowledgeable health coach for women with PCOS.
      Based on the user's recent data, provide 2-3 short, actionable tips.
      Be encouraging and friendly — not clinical. Use emoji sparingly.
      Keep each tip to 1-2 sentences with a brief reasoning.
      DO NOT provide medical diagnoses or replace professional medical advice.
    `.trim();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 200,
    });

    const advice = completion.choices[0].message.content;

    // Store in DB
    await supabaseAdmin.from("ai_insights").insert({
      user_id: userId,
      prompt_context: prompt.substring(0, 500),
      response: advice,
    });

    return NextResponse.json({ advice, remaining: 10 - (count || 0) - 1 });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to get AI insight." }, { status: 500 });
  }
}

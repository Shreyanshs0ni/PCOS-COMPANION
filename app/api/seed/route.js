import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

function generatePastDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  // Add some random hours/minutes so they don't all look like exactly the same time
  date.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Please sign in first" }, { status: 401 });
    }

    const entries = [];
    const moods = ["Awful", "Bad", "Okay", "Good", "Great"];
    
    // Generate 14 days of mock data
    for (let i = 0; i <= 14; i++) {
        // We might want to skip some days to make it look realistic, but let's just do every day for testing
        
        const date = generatePastDate(i);
        
        // Mood
        const moodLevel = Math.floor(Math.random() * 5) + 1;
        entries.push({
            user_id: userId,
            tracker_type: 'mood',
            data: { level: moodLevel, label: moods[moodLevel - 1] },
            created_at: date
        });

        // Sleep
        entries.push({
            user_id: userId,
            tracker_type: 'sleep',
            data: { hours: parseFloat((Math.random() * 4 + 5).toFixed(1)) },
            created_at: date
        });

        // Water
        entries.push({
            user_id: userId,
            tracker_type: 'water',
            data: { glasses: Math.floor(Math.random() * 8) + 2 }, // 2 to 9 glasses
            created_at: date
        });

        // Symptoms (randomly occurring)
        if (Math.random() > 0.3) {
            const symptoms = [];
            if (Math.random() > 0.5) symptoms.push("Acne");
            if (Math.random() > 0.5) symptoms.push("Fatigue");
            if (Math.random() > 0.5) symptoms.push("Bloating");
            if (Math.random() > 0.5) symptoms.push("Cramps");
            if (Math.random() > 0.8) symptoms.push("Headache");
            
            if (symptoms.length > 0) {
                entries.push({
                    user_id: userId,
                    tracker_type: 'symptoms',
                    data: { selected: symptoms },
                    created_at: date
                });
            }
        }

        // Stress
        entries.push({
            user_id: userId,
            tracker_type: 'stress',
            data: { level: Math.floor(Math.random() * 5) + 1 },
            created_at: date
        });
        
        // Exercise (maybe 50% of the time)
        if (Math.random() > 0.5) {
            const types = ["Walking", "Running", "Yoga", "Strength"];
            entries.push({
                user_id: userId,
                tracker_type: 'exercise',
                data: { 
                    minutes: Math.floor(Math.random() * 40) + 20, // 20 to 60 mins
                    type: types[Math.floor(Math.random() * types.length)]
                },
                created_at: date
            });
        }
    }

    // Insert into Supabase using the admin key
    const { error } = await supabaseAdmin.from('check_in_entries').insert(entries);
    
    if (error) {
        throw error;
    }

    // Attempt to update the user's streak
    await supabaseAdmin
        .from('streaks')
        .upsert({ user_id: userId, current_streak: 15, longest_streak: 15, last_check_in: new Date().toISOString().split('T')[0] }, { onConflict: 'user_id' });

    return NextResponse.json({ message: "Mock data seeded successfully for the last 14 days! You can close this tab and refresh the app." });

  } catch (error) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: "Failed to seed data." }, { status: 500 });
  }
}

"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function getProfile() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data;
}

export async function checkOnboardingComplete() {
  const { userId } = await auth();
  if (!userId) return { authenticated: false, onboarded: false };

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", userId)
    .single();

  return {
    authenticated: true,
    onboarded: data?.onboarding_complete === true,
  };
}

export async function saveProfile(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await currentUser();
  const name = formData.name || user?.firstName || "User";

  const profileData = {
    id: userId,
    name,
    birthday: formData.birthday || null,
    sex_at_birth: formData.sex_at_birth || null,
    gender_identity: formData.gender_identity || null,
    ethnicity: formData.ethnicity || null,
    height: formData.height ? parseFloat(formData.height) : null,
    weight: formData.weight ? parseFloat(formData.weight) : null,
    blood_type: formData.blood_type || null,
    phone: formData.phone || null,
    occupation: formData.occupation || null,
    marital_status: formData.marital_status || null,
    diet_type: formData.diet_type || null,
    physical_activity_level: formData.physical_activity_level || null,
    pcos_diagnosed:
      formData.pcos_diagnosed === true || formData.pcos_diagnosed === "true",
    cycle_regularity: formData.cycle_regularity || null,
    main_symptoms: formData.main_symptoms || [],
    onboarding_complete:
      formData.onboarding_complete === true ||
      formData.onboarding_complete === "true",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin.from("profiles").upsert(profileData);

  if (error) throw new Error(error.message);

  return { success: true };
}

export async function updateProfileField(field, value) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw new Error(error.message);
  return { success: true };
}

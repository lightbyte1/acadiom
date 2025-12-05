"use server";

import { createServerClient } from "@/lib/supabase/server";
import { OnboardingFormData } from "@/schemas/onboarding/onboarding.schema";

export async function onboard(data: OnboardingFormData) {
  const supabase = await createServerClient();

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: true, message: "User not authenticated" };
  }

  // Build full_name - handle optional last_name
  const fullName = data.last_name
    ? `${data.first_name} ${data.last_name}`.trim()
    : data.first_name;

  // Update user profile
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .update({
      full_name: fullName,
    })
    .eq("id", user.id) // CRITICAL: Filter by user ID
    .select()
    .single();

  if (profileError) {
    return {
      error: true,
      message: "Failed to update profile",
      details: profileError,
    };
  }

  if (!profile) {
    return { error: true, message: "Profile not found" };
  }

  // Create organization
  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .insert({
      name: data.organization_name,
      owner_id: profile.id,
    })
    .select()
    .single();

  if (organizationError) {
    return {
      error: true,
      message: "Failed to create organization",
      details: organizationError,
    };
  }

  return {
    error: false,
    message: "Onboarded successfully",
    data: { profile, organization },
  };
}

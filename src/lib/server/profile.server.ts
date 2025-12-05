import { createServerClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/index.t";

/**
 * Server-side profile functions
 * ALL database queries for server-side go here
 */

export type ProfileUpdate = {
  full_name?: string;
  avatar_url?: string | null;
};

export async function getProfileServer(
  userId: string
): Promise<UserProfile | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function updateProfileServer(
  userId: string,
  updates: ProfileUpdate
): Promise<UserProfile> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

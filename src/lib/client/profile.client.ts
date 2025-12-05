import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types/index.t";

/**
 * Client-side profile functions
 * ALL database queries for client-side go here
 */

export type ProfileUpdate = {
  full_name?: string;
  avatar_url?: string | null;
};

export async function getProfileClient(
  userId: string
): Promise<UserProfile | null> {
  const supabase = createClient();
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

export async function updateProfileClient(
  userId: string,
  updates: ProfileUpdate
): Promise<UserProfile> {
  const supabase = createClient();
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

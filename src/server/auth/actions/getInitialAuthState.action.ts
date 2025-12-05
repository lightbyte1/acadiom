import { createServerClient } from "@/lib/supabase/server";
import { getProfileServer } from "@/lib/server/profile.server";

export async function getInitialAuthState() {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return { user: null, profile: null };
    }

    // Get full profile using the new service
    const profile = await getProfileServer(data.user.id);

    return {
      user: data.user,
      profile,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in getInitialAuthState:", error);
    }
    return { user: null, profile: null };
  }
}

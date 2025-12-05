import { Database } from "@/types/supabase.types";
import { createClient } from "@supabase/supabase-js";

export async function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SAAS_SUPABASE_URL!,
    process.env.SAAS_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

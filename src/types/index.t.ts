import { Database } from "./supabase.types";

export type UserProfile = Database["public"]["Tables"]["users"]["Row"];
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];

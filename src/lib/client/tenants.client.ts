import { createClient } from "@/lib/supabase/client";
import { Tenant } from "@/types/index.t";

/**
 * Client-side tenant functions
 * ALL database queries for client-side go here
 */

const ALLOWED_ROLES = ["owner", "admin", "teacher", "assistant"];

export async function getTenantsClient(userId: string): Promise<Tenant[]> {
  const supabase = createClient();

  // 1. Get tenant IDs where user has an allowed role
  const { data: memberships } = await supabase
    .from("tenant_memberships")
    .select("tenant_id, role")
    .eq("user_id", userId)
    .in("role", ALLOWED_ROLES);

  // 2. Get tenants owned by user
  const { data: ownedTenants } = await supabase
    .from("tenants")
    .select("*")
    .eq("owner_id", userId)
    .order("name", { ascending: true });

  const tenantIds = new Set<string>();

  // Add membership tenant IDs
  memberships?.forEach((m) => tenantIds.add(m.tenant_id));

  // Add owned tenants
  ownedTenants?.forEach((t) => tenantIds.add(t.id));

  if (tenantIds.size === 0) {
    return ownedTenants || [];
  }

  // Fetch all tenants by the collected IDs
  const { data: allTenants } = await supabase
    .from("tenants")
    .select("*")
    .in("id", Array.from(tenantIds))
    .order("name", { ascending: true });

  return allTenants || ownedTenants || [];
}

export async function getTenantsByOrganizationIdClient(
  organizationId: string
): Promise<Tenant[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("organization_id", organizationId)
    .order("name", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getTenantByIdClient(
  tenantId: string
): Promise<Tenant | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

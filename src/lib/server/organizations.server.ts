import { createServerClient } from "@/lib/supabase/server";
import { Organization } from "@/types/index.t";
import {
  getOrganizationWithTenants,
  type OrganizationWithTenants,
} from "@/services/organizations.service";
import { getTenantsByOrganizationIdServer } from "./tenants.server";

/**
 * Server-side organization functions
 * ALL database queries for server-side go here
 */

export async function getOrganizationsServer(
  userId: string
): Promise<Organization[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", userId)
    .order("name", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getOrganizationByIdServer(
  organizationId: string
): Promise<Organization | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", organizationId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getOrganizationWithTenantsServer(
  organizationId: string
): Promise<OrganizationWithTenants | null> {
  return getOrganizationWithTenants(
    getOrganizationByIdServer,
    getTenantsByOrganizationIdServer,
    organizationId
  );
}

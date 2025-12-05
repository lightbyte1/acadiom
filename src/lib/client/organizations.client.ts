import { createClient } from "@/lib/supabase/client";
import { Organization } from "@/types/index.t";
import {
  getOrganizationWithTenants,
  type OrganizationWithTenants,
} from "@/services/organizations.service";
import { getTenantsByOrganizationIdClient } from "./tenants.client";

/**
 * Client-side organization functions
 * ALL database queries for client-side go here
 */

export async function getOrganizationsClient(
  userId: string
): Promise<Organization[]> {
  const supabase = createClient();
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

export async function getOrganizationByIdClient(
  organizationId: string
): Promise<Organization | null> {
  const supabase = createClient();
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

export async function getOrganizationWithTenantsClient(
  organizationId: string
): Promise<OrganizationWithTenants | null> {
  return getOrganizationWithTenants(
    getOrganizationByIdClient,
    getTenantsByOrganizationIdClient,
    organizationId
  );
}

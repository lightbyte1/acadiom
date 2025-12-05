import { Organization, Tenant } from "@/types/index.t";

/**
 * Organizations Service - Business logic only
 * NO database queries - calls client/server functions
 */

export type OrganizationWithTenants = Organization & {
  tenants: Tenant[];
};

/**
 * Business logic: Get organization with its tenants
 * Combines organization and tenant data into a single object
 * Accepts fetcher functions as parameters (from client or server)
 */
export async function getOrganizationWithTenants(
  getOrgById: (id: string) => Promise<Organization | null>,
  getTenantsByOrgId: (id: string) => Promise<Tenant[]>,
  organizationId: string
): Promise<OrganizationWithTenants | null> {
  // 1. Get the organization
  const organization = await getOrgById(organizationId);

  if (!organization) {
    return null;
  }

  // 2. Get all tenants that belong to this organization
  const tenants = await getTenantsByOrgId(organizationId);

  // Return organization with tenants
  return {
    ...organization,
    tenants: tenants || [],
  };
}

import { useQuery } from "@tanstack/react-query";
import { getOrganizationWithTenantsClient } from "@/lib/client/organizations.client";
import { OrganizationWithTenants } from "@/services/organizations.service";

/**
 * React Query hook to fetch organization with its tenants
 */
export function useOrganizationWithTenants(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["organization-with-tenants", organizationId],
    queryFn: () => {
      if (!organizationId) return null;
      return getOrganizationWithTenantsClient(organizationId);
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

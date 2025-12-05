import { useQuery } from "@tanstack/react-query";
import {
  getOrganizationsClient,
  getOrganizationByIdClient,
} from "@/lib/client/organizations.client";
import { Organization } from "@/types/index.t";

/**
 * React Query hook to fetch user organizations
 */
export function useOrganizations(
  userId: string | undefined,
  initialData?: Organization[] | null
) {
  return useQuery({
    queryKey: ["organizations", userId],
    queryFn: () => {
      if (!userId) return [];
      return getOrganizationsClient(userId);
    },
    enabled: !!userId,
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * React Query hook to fetch organization by ID
 */
export function useOrganization(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["organization", organizationId],
    queryFn: () => {
      if (!organizationId) return null;
      return getOrganizationByIdClient(organizationId);
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

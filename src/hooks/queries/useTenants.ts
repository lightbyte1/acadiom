import { useQuery } from "@tanstack/react-query";
import {
  getTenantByIdClient,
  getTenantsClient,
} from "@/lib/client/tenants.client";

/**
 * React Query hook to fetch user tenants
 */
export function useTenants(userId: string | undefined) {
  return useQuery({
    queryKey: ["tenants", userId],
    queryFn: () => {
      if (!userId) return [];
      return getTenantsClient(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

import { Tenant } from "@/types/index.t";

/**
 * React Query hook to fetch a single tenant by ID
 */
export function useTenant(
  tenantId: string | undefined,
  initialData?: Tenant | null
) {
  return useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: () => {
      if (!tenantId) return null;
      return getTenantByIdClient(tenantId);
    },
    enabled: !!tenantId,
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

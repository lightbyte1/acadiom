"use client";

import { usePathname } from "next/navigation";
import { useTenant as useTenantQuery } from "@/hooks/queries/useTenants";
import { Tenant } from "@/types/index.t";

/**
 * Hook to get the current tenant from the URL
 * Automatically extracts tenant ID from pathname and fetches tenant data
 * Works everywhere in the dashboard
 *
 * @param initialData - Optional initial tenant data from SSR
 * @returns Tenant data with loading/error states, or null if not on a tenant route
 */
export function useCurrentTenant(initialData?: Tenant | null) {
  const pathname = usePathname();

  // Extract tenant ID from URL pattern: /dashboard/platforms/[tenantId]
  const tenantIdMatch = pathname?.match(/\/dashboard\/platforms\/([^/]+)/);
  const tenantId = tenantIdMatch ? tenantIdMatch[1] : undefined;

  // Use React Query to fetch tenant data
  const {
    data: tenant,
    isLoading,
    isError,
    error,
  } = useTenantQuery(tenantId, initialData);

  return {
    tenant: tenant ?? null,
    tenantId: tenantId ?? null,
    isLoading,
    isError,
    error,
    isTenantRoute: !!tenantId, // Whether we're currently on a tenant route
  };
}

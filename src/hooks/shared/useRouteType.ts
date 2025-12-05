"use client";

import { usePathname } from "next/navigation";

export type RouteType = "overview" | "tenant";

/**
 * Hook to determine the current route type in the dashboard
 */
export function useRouteType(): RouteType {
  const pathname = usePathname();

  // Check if we're on a tenant (platform) route
  if (pathname?.includes("/dashboard/platforms/")) {
    return "tenant";
  }

  // Default to overview
  return "overview";
}

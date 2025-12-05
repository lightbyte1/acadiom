"use client";

import { Tenant } from "@/types/index.t";
import { ReactNode, createContext, useContext } from "react";

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  isError: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  initialTenant: Tenant | null;
}

export function TenantProvider({
  children,
  initialTenant,
}: TenantProviderProps) {
  const value: TenantContextType = {
    tenant: initialTenant,
    isLoading: false,
    isError: false,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

/**
 * Hook to access tenant context
 * Returns safe defaults if not within a TenantProvider
 * This allows the sidebar to render even when provider isn't available yet
 */
export function useTenant(): TenantContextType {
  const context = useContext(TenantContext);
  
  // Return safe defaults if not in provider (allows graceful rendering)
  if (!context) {
    return {
      tenant: null,
      isLoading: false,
      isError: false,
    };
  }
  
  return context;
}

"use client";

import { User } from "@supabase/supabase-js";
import { ReactNode, createContext, useContext } from "react";
import { useProfile, useOrganizations } from "@/hooks/queries";
import { Organization, UserProfile } from "@/types/index.t";

interface DashboardContextType {
  user: User | null;
  profile: UserProfile | null;
  orgs: Organization[];
  isLoading: boolean;
  isError: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

interface DashboardProviderProps {
  children: ReactNode;
  initialUser: User | null;
  initialProfile: UserProfile | null;
  initialOrgs: Organization[] | null;
}

export default function DashboardProvider({
  children,
  initialUser,
  initialProfile,
  initialOrgs,
}: DashboardProviderProps) {
  // Use React Query hooks with initial data from SSR
  // React Query will use initialData and won't refetch if data is fresh
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfile(initialUser?.id, initialProfile);

  const {
    data: orgs,
    isLoading: isOrgsLoading,
    isError: isOrgsError,
  } = useOrganizations(initialUser?.id, initialOrgs ?? null);

  const value: DashboardContextType = {
    user: initialUser,
    profile: profile ?? null,
    orgs: orgs ?? [],
    isLoading: isProfileLoading || isOrgsLoading,
    isError: isProfileError || isOrgsError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

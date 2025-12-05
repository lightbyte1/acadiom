"use client";
import { useOrganizations } from "@/hooks/queries";
import React from "react";
import OrganizationCard from "./OrganizationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Organization } from "@/types/index.t";
import { useDashboard } from "@/contexts/dashboard/DashboardContext";

function useHasMounted() {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export default function OrganizationsShow() {
  const hasMounted = useHasMounted();
  const { user } = useDashboard();
  const { data: organizations, isLoading } = useOrganizations(user?.id);

  // To avoid hydration errors, don't render anything until after mount.
  if (!hasMounted) {
    return null;
  }

  if (isLoading && !organizations) {
    // Show placeholder skeletons while loading
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="min-h-48 min-w-48" />
        ))}
      </div>
    );
  }

  // If there are no organizations
  if (!organizations || organizations.length === 0) {
    return (
      <div className="text-muted-foreground text-center w-full py-8">
        No organizations found.
      </div>
    );
  }

  // Render organizations
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {organizations.map((org: Organization) => (
        <OrganizationCard key={org.id} {...org} />
      ))}
    </div>
  );
}

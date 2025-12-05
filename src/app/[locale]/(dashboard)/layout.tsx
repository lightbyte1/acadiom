import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardProvider from "@/contexts/dashboard/DashboardContext";

import { getOrganizationsServer } from "@/lib/server/organizations.server";
import { getInitialAuthState } from "@/server/auth/actions/getInitialAuthState.action";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch initial data server-side
  const { user, profile } = await getInitialAuthState();
  if (!user || !user.id) {
    redirect("/sign-in");
  }

  const orgs = await getOrganizationsServer(user.id);

  return (
    <DashboardProvider
      initialUser={user}
      initialProfile={profile}
      initialOrgs={orgs}
    >
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardProvider>
  );
}

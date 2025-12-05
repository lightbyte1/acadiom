"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { DashboardOverviewSidebar } from "../dashboard/DashboardOverviewSidebar";
import { DashboardTenantSidebar } from "../dashboard/DashboardTenantSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";
import { useRouteType } from "@/hooks/shared/useRouteType";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const routeType = useRouteType();

  // Conditionally render the appropriate sidebar
  const SidebarComponent =
    routeType === "tenant" ? DashboardTenantSidebar : DashboardOverviewSidebar;

  return (
    <main className="bg-sidebar h-screen flex flex-col md:py-2 p-0 md:pr-2 overflow-hidden">
      <SidebarProvider className="flex-1 min-h-0">
        <SidebarComponent />
        <div className="flex-1 min-w-0 rounded-0 md:rounded-3xl bg-background shadow-sm z-10 flex flex-col min-h-0">
          <DashboardHeader />
          <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
        </div>
      </SidebarProvider>
    </main>
  );
}

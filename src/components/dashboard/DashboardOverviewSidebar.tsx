"use client";

import * as React from "react";
import {
  Building2,
  Settings,
  Users,
  Calendar,
  Home,
  CircleQuestionMark,
  CreditCard,
  BuildingIcon,
} from "lucide-react";

import { NavMain, type NavigationGroup } from "@/components/nav-main";
// import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import PlanUpgrade from "../shared/PlanUpgrade";
import Link from "next/link";
import { useOrganizations, useTenants } from "@/hooks/queries";
import { useDashboard } from "@/contexts/dashboard/DashboardContext";

export type SidebarGroup = NavigationGroup;

export interface DashboardOverviewSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  groups?: SidebarGroup[];
  teams?: {
    name: string;
    logo: React.ElementType;
    plan: string;
    url: string;
  }[];
}

export function DashboardOverviewSidebar({
  groups: customGroups,
  ...props
}: DashboardOverviewSidebarProps) {
  const { user } = useDashboard();
  const { data: organizations = [], isLoading: isLoadingOrganizations } =
    useOrganizations(user?.id);
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenants(
    user?.id
  );

  // Build navigation groups dynamically based on fetched data
  const groups: SidebarGroup[] = React.useMemo(() => {
    if (customGroups) {
      return customGroups;
    }

    // Build organizations submenu items
    const organizationItems =
      organizations && organizations.length > 0
        ? organizations.map((org) => ({
            title: org.name,
            url: `/dashboard/org/${org.id}`,
          }))
        : [];

    // Build tenants (platforms) submenu items
    const tenantItems =
      tenants && tenants.length > 0
        ? tenants.map((tenant) => ({
            title: tenant.name,
            url: `/dashboard/platforms/${tenant.id}`,
          }))
        : [];

    return [
      {
        title: "Overview",
        homeUrl: "/dashboard",
        items: [
          {
            title: "Home",
            icon: Home,
            url: "/dashboard",
          },
          {
            title: "Organizations",
            icon: Building2,
            url: "/dashboard/org",
            submenuMode: "always",
            items: organizationItems,
            isLoading: isLoadingOrganizations,
          },
          {
            title: "Team",
            icon: Users,
            url: "/team",
          },
          {
            title: "Billing",
            icon: CreditCard,
            url: "/billing",
          },
          {
            title: "Calendar",
            icon: Calendar,
            url: "/calendar",
          },
          {
            title: "Settings",
            icon: Settings,
            url: "/settings",
          },
        ],
      },
      {
        title: "Platforms",
        homeUrl: "/platforms",
        collapsedAggregate: {
          title: "Platforms",
          icon: BuildingIcon,
        },
        items: [
          {
            title: "Platforms",
            icon: BuildingIcon,
            url: "/platforms",
            submenuMode: "always",
            items: tenantItems,
            isLoading: isLoadingTenants,
          },
        ],
      },
      {
        title: "Support",
        homeUrl: "/support",
        items: [
          {
            title: "Help",
            icon: CircleQuestionMark,
            url: "/help",
          },
        ],
      },
    ];
  }, [
    customGroups,
    organizations,
    tenants,
    isLoadingOrganizations,
    isLoadingTenants,
  ]);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden border-b-0 pt-2"
      {...props}
    >
      {/* <SidebarHeader className=" justify-center flex items-center">
        <TeamSwitcher teams={teams} />
      </SidebarHeader> */}

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="tabler-icon tabler-icon-inner-shadow-top !size-5"
                >
                  <path d="M5.636 5.636a9 9 0 1 0 12.728 12.728a9 9 0 0 0 -12.728 -12.728z"></path>
                  <path d="M16.243 7.757a6 6 0 0 0 -8.486 0"></path>
                </svg>
                <span className="text-base font-semibold">acadiom</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent
        className="scroll-container p-0"
        style={{ overscrollBehavior: "contain" }}
      >
        {groups.map((group, index) => (
          <NavMain key={index} group={group} />
        ))}
      </SidebarContent>

      <SidebarFooter className="overflow-x-hidden">
        <PlanUpgrade />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

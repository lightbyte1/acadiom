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
import { useCurrentTenant } from "@/hooks/shared/useCurrentTenant";

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

export function DashboardTenantSidebar({
  groups: customGroups,
  ...props
}: DashboardOverviewSidebarProps) {
  const { tenant } = useCurrentTenant();
  console.log(tenant);

  const groups: SidebarGroup[] = [
    {
      title: "Overview",
      homeUrl: "/dashboard",
      items: [
        {
          title: "Home",
          icon: Home,
          url: `/dashboard/platforms/${tenant?.id}`,
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

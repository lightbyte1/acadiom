"use client";

import DarkModeToggle from "../shared/DarkModeToggle";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import Profile from "../shared/Profile";
import DashboardNotificationsButton from "./DashboardNotificationsButton";

export default function DashboardHeader() {
  return (
    <div className="flex gap-4 p-4 items-center border-b max-h-12 min-h-12 justify-between">
      <div className="flex items-center h-5 gap-2">
        <SidebarTrigger /> <Separator orientation="vertical" />
        <span className="text-base">Organization</span>
      </div>
      <div className="flex items-center gap-2">
        <DarkModeToggle />
        <DashboardNotificationsButton />
        <Profile />
      </div>
    </div>
  );
}

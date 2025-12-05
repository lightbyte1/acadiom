import React from "react";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function DashboardNotificationsButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell />
          <span
            className="absolute top-0 right-0 flex items-center justify-center h-[18px] w-[18px] rounded-full bg-red-500 text-white text-xs font-semibold shadow-lg border-2 border-background"
            aria-label="4 unread notifications"
          >
            4
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>Fuck</PopoverContent>
    </Popover>
  );
}

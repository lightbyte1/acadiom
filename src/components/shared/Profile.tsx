"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDashboard } from "@/contexts/dashboard/DashboardContext";

export default function Profile() {
  const { profile, user } = useDashboard();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!profile || !user) {
    return null;
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Avatar>
          <AvatarImage
            src={profile.avatar_url || undefined}
            alt={profile.full_name || "User"}
          />
          <AvatarFallback className="bg-sidebar-primary text-xs text-sidebar-primary-foreground">
            {profile.full_name
              ?.split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar>
            <AvatarImage
              src={profile.avatar_url || undefined}
              alt={profile.full_name || "User"}
            />
            <AvatarFallback className="bg-sidebar-primary text-xs text-sidebar-primary-foreground">
              {profile.full_name
                ?.split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            {profile.full_name || "User"}
          </span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

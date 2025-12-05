import OrganizationsShow from "@/components/dashboard/organizations/OrganizationsShow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import React from "react";

export default function OrganizationsPage() {
  return (
    <div className="flex flex-col gap-6 container-md pt-12">
      <h3>Your Organizations</h3>
      <div className="flex flex-col gap-4">
        <div className="flex w-full justify-between items-center">
          <Input
            className="max-w-xs"
            size="sm"
            placeholder="Search for organizations"
          />
          <div className="flex items-center gap-2">
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Sort ascending"
              title="Sort ascending"
            >
              <ArrowDownAZ />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Sort descending"
              title="Sort descending"
            >
              <ArrowUpZA />
            </Button>

            <Button size="sm">Create Organization</Button>
          </div>
        </div>
        <OrganizationsShow />
      </div>
    </div>
  );
}

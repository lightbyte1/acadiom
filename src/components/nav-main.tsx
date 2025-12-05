"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";

export type NavigationItem = {
  title: string;
  icon: LucideIcon;
  url: string;
  submenuMode?: "always" | "collapsible";
  items?: {
    title: string;
    url: string;
  }[];
  isLoading?: boolean;
};

export type NavigationGroup = {
  title: string;
  homeUrl: string;
  items: NavigationItem[];
  collapsedAggregate?: {
    title: string;
    icon: LucideIcon;
  };
};

export interface NavMainProps {
  group: NavigationGroup;
}

// Constant widths for skeleton loaders (outside component to prevent hydration issues)
function InlineSubmenu({
  items,
  isLoading,
}: {
  items: { title: string; url: string }[];
  isLoading?: boolean;
}) {
  const PAGE_SIZE = 3;
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const [mounted, setMounted] = React.useState(false);

  const shown = items.slice(0, visibleCount);
  const remaining = Math.max(items.length - visibleCount, 0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();

  // Show skeleton when loading
  if (isLoading || !mounted) {
    return (
      <SidebarMenuSub className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <SidebarMenuSubItem key={`skeleton-${index}`}>
            <Skeleton className="h-6 w-full" />
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    );
  }

  return (
    <SidebarMenuSub>
      {shown.map((subItem) => (
        <SidebarMenuSubItem key={subItem.title}>
          <SidebarMenuSubButton
            asChild
            className="w-full justify-start"
            isActive={pathname.endsWith(subItem.url)}
          >
            <Link href={subItem.url}>
              <span>{subItem.title}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
      {remaining > 0 && (
        <SidebarMenuSubItem>
          <SidebarMenuSubButton
            asChild
            className="w-full justify-start text-sidebar-foreground/70"
            isActive={pathname.endsWith(items[items.length - 1].url)}
          >
            <Button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              variant="ghost"
            >
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>Show More ({remaining})</span>
            </Button>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      )}
      {visibleCount > PAGE_SIZE && (
        <SidebarMenuSubItem>
          <SidebarMenuSubButton
            asChild
            className="w-full justify-start text-sidebar-foreground/70"
          >
            <Button
              type="button"
              onClick={() => setVisibleCount(PAGE_SIZE)}
              variant="ghost"
            >
              <ChevronDown />
              <span>Show less</span>
            </Button>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      )}
    </SidebarMenuSub>
  );
}

export function NavMain({ group }: NavMainProps) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const pathname = usePathname();

  console.log("pathname", pathname.endsWith(group.homeUrl), group.homeUrl);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
      <SidebarMenu>
        {isCollapsed && group.collapsedAggregate ? (
          <SidebarMenuItem key={group.title + "-collapsed"}>
            <SidebarMenuButton
              asChild
              tooltip={group.collapsedAggregate.title}
              isActive={pathname.endsWith(group.homeUrl)}
            >
              <Link href={group.homeUrl}>
                <group.collapsedAggregate.icon />
                <span>{group.collapsedAggregate.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          group.items.map((item) => {
            const hasSubItems = item.items && item.items.length > 0;

            if (hasSubItems && item.submenuMode !== "always") {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname.endsWith(item.url)}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname.endsWith(subItem.url)}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            if (hasSubItems && item.submenuMode === "always") {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname.endsWith(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {(item.items || item.isLoading) && (
                    <InlineSubmenu
                      items={item.items || []}
                      isLoading={item.isLoading}
                    />
                  )}
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname.endsWith(item.url)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

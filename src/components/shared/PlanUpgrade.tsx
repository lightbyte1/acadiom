"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";

export default function PlanUpgrade() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  // Sidebar open/close transition duration (must match Sidebar's CSS transition)
  const SIDEBAR_ANIMATION_MS = 200;

  // Local state to delay showing the card until sidebar has finished expanding
  const [showCard, setShowCard] = React.useState(!isCollapsed);
  const [showIcon, setShowIcon] = React.useState(isCollapsed);

  React.useEffect(() => {
    if (!isCollapsed) {
      setShowIcon(false);
      const timeout = setTimeout(() => setShowCard(true), SIDEBAR_ANIMATION_MS);
      return () => clearTimeout(timeout);
    } else {
      setShowCard(false);
      const timeout = setTimeout(() => setShowIcon(true), SIDEBAR_ANIMATION_MS);
      return () => clearTimeout(timeout);
    }
  }, [isCollapsed]);

  return (
    <>
      {/* Collapsed state - icon button with smooth animation */}
      <AnimatePresence initial={false}>
        {showIcon && (
          <motion.div
            key="plan-upgrade-icon"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.2,
              ease: [0.2, 0.1, 0.2, 1],
            }}
          >
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{
                    side: "right",
                    align: "center",
                    children: (
                      <div className="space-y-1">
                        <div className="font-medium">Upgrade to Pro</div>
                        <div className="text-xs opacity-80">
                          Unlock advanced features and get priority support
                        </div>
                      </div>
                    ),
                  }}
                >
                  <Link href="/upgrade">
                    <Sparkles className="size-4" />
                    <span className="sr-only">Upgrade to Pro</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded state - full card with smooth animation */}
      <AnimatePresence initial={false}>
        {showCard && (
          <motion.div
            key="plan-upgrade-card"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{
              duration: 0.2,
              ease: [0.2, 0.1, 0.2, 1], // smooth cubic-bezier similar to ChatGPT
            }}
          >
            <Card
              className="mx-2 mb-2 p-3! rounded-lg min-w-[220px] overflow-x-hidden bg-sidebar-accent/50 border-sidebar-border"
              hoverable
              href="/upgrade"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 group transition-colors">
                  <div className="rounded-md bg-accent p-1.5 transition-colors">
                    <Sparkles className="size-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-sidebar-foreground mb-0.5">
                      Upgrade to Pro
                    </div>
                    <div className="text-xs text-sidebar-foreground/70 leading-relaxed">
                      Unlock advanced features and get priority support
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="default" className="w-full">
                  Upgrade
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

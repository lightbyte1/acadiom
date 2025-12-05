"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedErrorMessageProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedErrorMessage({
  children,
  className = "text-sm text-destructive m-0",
}: AnimatedErrorMessageProps) {
  return (
    <AnimatePresence>
      <motion.p
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className={cn(className, "text-xs text-destructive m-0")}
      >
        {children}
      </motion.p>
    </AnimatePresence>
  );
}

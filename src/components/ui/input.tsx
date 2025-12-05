import * as React from "react";

import { cn } from "@/lib/utils";

type InputSize = "sm" | "md" | "lg";

const inputSizeClasses: Record<InputSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-12 px-4 text-base md:text-sm",
  lg: "h-16 px-6 text-sm",
};

// Use Omit to avoid conflicting with the native HTML "size" prop
interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  size?: InputSize;
}

function Input({ className, type, size = "md", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input mb-0 w-full min-w-0 rounded-md border bg-transparent py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        inputSizeClasses[size],
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };

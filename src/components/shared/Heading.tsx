import { cn } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

export default function Heading({
  title,
  description,
  hasLogo = false,
  size = "md",
  placement = "start",
  titleClassName,
  descriptionClassName,
}: {
  title: string;
  description: string;
  hasLogo?: boolean;
  size?: "sm" | "md" | "lg";
  placement?: "start" | "center" | "end";
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col",
        placement === "start" && "items-start",
        placement === "center" && "items-center",
        placement === "end" && "items-end",
        titleClassName
      )}
    >
      {hasLogo && (
        <div className="flex items-center gap-2">
          <Image
            src="/dark-logo.png"
            className="invert-100"
            alt="logo"
            width={128}
            height={128}
          />
        </div>
      )}
      <h1
        className={clsx(
          "",
          size === "sm" && "text-xl md:text-2xl",
          size === "md" && "text-3xl md:text-4xl",
          size === "lg" && "text-4xl md:text-5xl",
          placement === "start" && "text-start",
          placement === "center" && "text-center",
          placement === "end" && "text-end",
          titleClassName
        )}
      >
        {title}
      </h1>
      <p
        className={clsx(
          "lead",
          size === "sm" && "text-base",
          size === "md" && "text-lg",
          size === "lg" && "text-xl",
          placement === "start" && "text-start",
          placement === "center" && "text-center",
          placement === "end" && "text-end",
          descriptionClassName
        )}
      >
        {description}
      </p>
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const translations = useTranslations("onboarding");
  const currentYear = new Date().getFullYear();

  return (
    <main className="bg-background w-full min-h-screen px-8 py-12 flex flex-col items-center justify-center gap-12">
      <div className="md:p-8 p-0 w-full max-w-2xl mx-auto">{children}</div>
      <small className="text-xs text-muted-foreground text-center">
        {translations("copyright", { year: currentYear })}
      </small>
    </main>
  );
}

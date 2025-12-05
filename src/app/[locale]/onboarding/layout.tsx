import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}

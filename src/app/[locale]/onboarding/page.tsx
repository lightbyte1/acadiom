"use client";

import OnboardingStep from "@/components/onboarding/OnboardingStep";
import Heading from "@/components/shared/Heading";
import { useTranslations } from "next-intl";
import React from "react";

export default function OnboardingPage() {
  const translations = useTranslations("onboarding");

  return (
    <div className="flex flex-col space-y-6 items-center justify-center">
      <Heading
        title={translations("title")}
        description={translations("description")}
        placement="center"
      />
      <OnboardingStep />
    </div>
  );
}

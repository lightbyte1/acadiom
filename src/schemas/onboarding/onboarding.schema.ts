import { useTranslations } from "next-intl";
import { z } from "zod";

export function useOnboardingSchema() {
  const translations = useTranslations("onboarding");

  return z.object({
    first_name: z
      .string()
      .min(1, translations("fields.first_name.requiredMessage"))
      .min(2, translations("fields.first_name.minMessage")),
    last_name: z.union([z.string(), z.literal("")]).optional(),
    organization_name: z
      .string()
      .min(1, translations("fields.organization_name.requiredMessage"))
      .min(2, translations("fields.organization_name.minMessage")),
  });
}

export type OnboardingFormData = z.infer<
  ReturnType<typeof useOnboardingSchema>
>;

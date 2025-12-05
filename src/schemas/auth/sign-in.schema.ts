import { useTranslations } from "next-intl";
import { z } from "zod";

export function useSignInSchema() {
  const translations = useTranslations("auth");

  return z.object({
    email: z
      .string()
      .min(1, translations("fields.email.requiredMessage"))
      .email(translations("fields.email.invalidMessage")),
  });
}

export type SignInFormData = z.infer<ReturnType<typeof useSignInSchema>>;

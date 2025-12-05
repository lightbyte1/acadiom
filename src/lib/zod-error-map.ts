import { z, ZodErrorMap, ZodIssue } from "zod";
import { getTranslations } from "next-intl/server";

export async function initZod(locale: string) {
  const t = await getTranslations({ locale, namespace: "errors" });

  const errorMap: ZodErrorMap = (issue: ZodIssue, ctx: ZodErrorMapCtx) => {
    switch (issue.code) {
      case "invalid_type":
        return { message: t("invalidType") };
      case "invalid_string":
        if (issue.validation === "email") {
          return { message: t("invalidEmail") };
        }
        break;
      case "too_small":
        return { message: t("tooSmall", { min: issue.minimum }) };
    }
    return { message: ctx.defaultError };
  };

  z.setErrorMap(errorMap);
}

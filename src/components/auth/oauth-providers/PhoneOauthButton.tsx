import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { SignInFormData } from "../../../schemas/auth/sign-in.schema";
import { useFormContext } from "../FormContext";
import { useTranslations } from "next-intl";

function PhoneIcon() {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M3 5.5C3 14.0604 9.93959 21 18.5 21C19.3807 21 20.25 20.8807 21.0816 20.6501C21.3523 20.5751 21.4877 20.5376 21.5922 20.5407C21.6967 20.5438 21.7699 20.5654 21.8532 20.6151C21.9365 20.6648 22.0241 20.7524 22.1992 20.9275L23.2929 22.0212C23.6834 22.4117 23.6834 23.0449 23.2929 23.4354C22.9024 23.8259 22.2692 23.8259 21.8787 23.4354L20.785 22.3417C20.6099 22.1666 20.5223 22.079 20.4726 21.9957C20.4229 21.9124 20.4013 21.8392 20.3982 21.7347C20.3951 21.6302 20.4326 21.4948 20.5076 21.2241C20.7382 20.3925 20.8575 19.5232 20.8575 18.6425C20.8575 10.0821 13.9179 3.14254 5.35754 3.14254C4.47684 3.14254 3.60754 3.26184 2.77594 3.49244C2.50524 3.56744 2.36984 3.60494 2.26534 3.60184C2.16084 3.59874 2.08764 3.57714 2.00434 3.52744C1.92104 3.47774 1.83344 3.39014 1.65824 3.21494L0.564573 2.12127C0.174048 1.73075 0.174048 1.09758 0.564573 0.707058C0.955098 0.316533 1.58826 0.316533 1.97879 0.707058L3.07245 1.80072C3.24765 1.97592 3.33525 2.06352 3.38495 2.14682C3.43465 2.23012 3.45625 2.30332 3.45935 2.40782C3.46245 2.51232 3.42495 2.64772 3.34995 2.91842C3.11935 3.75002 3 4.61932 3 5.5Z"
          fill="#000000"
        ></path>
      </g>
    </svg>
  );
}

export default function PhoneOauthButton() {
  const translations = useTranslations("auth.oauthButtons");
  const form = useFormContext<SignInFormData>();

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-4"
      disabled={form.formState.isSubmitting}
      type="button"
    >
      <Phone className="col-span-1" />{" "}
      <span>{translations("continueWithPhone")}</span>
    </Button>
  );
}

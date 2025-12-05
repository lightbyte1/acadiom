import { Button } from "@/components/ui/button";
import { SignInFormData } from "../../../schemas/auth/sign-in.schema";
import { useFormContext } from "../FormContext";
import { useTranslations } from "next-intl";

function FacebookIcon() {
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
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          fill="#1877F2"
        ></path>
      </g>
    </svg>
  );
}

export default function FacebookOauthButton() {
  const translations = useTranslations("auth");
  const form = useFormContext<SignInFormData>();

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-4"
      disabled={form.formState.isSubmitting}
      type="button"
    >
      <FacebookIcon />{" "}
      <span>{translations("oauthButtons.continueWithFacebook")}</span>
    </Button>
  );
}

"use client";

import React from "react";
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import Heading from "@/components/shared/Heading";
import AnimatedErrorMessage from "@/components/shared/AnimatedErrorMessage";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import OauthProviders from "@/components/auth/oauth-providers";
import {
  FormContextProvider,
  useFormContext,
} from "@/components/auth/FormContext";
import { SignInFormData, useSignInSchema } from "@/schemas/auth/sign-in.schema";
import useMultistep from "@/hooks/shared/useMultistep";
import { useSignInFlowContext } from "@/contexts/auth/SignInFlowContext";
import { signIn } from "../../server/auth/actions/signIn.action";

function EmailForm() {
  const translations = useTranslations("auth");
  const form = useFormContext<SignInFormData>();
  const multistep = useMultistep();
  const { setTargetEmail } = useSignInFlowContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    const { error } = await signIn(data.email, "saas");
    if (error) {
      console.error("Failed to sign in:", error);
      return;
    }
    setTargetEmail(data.email);
    await multistep.nextStep();
  };

  const onError: SubmitErrorHandler<SignInFormData> = (
    errors: FieldErrors<SignInFormData>
  ) => {
    console.log("Form errors:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col space-y-4 w-full"
    >
      <div className="flex flex-col">
        <Input
          placeholder={translations("fields.email.placeholder")}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <AnimatedErrorMessage>
            {typeof errors.email.message === "string"
              ? errors.email.message
              : translations("fields.email.requiredMessage")}
          </AnimatedErrorMessage>
        )}
      </div>
      <ActionButton
        className="w-full glow"
        type="submit"
        action={async () => {
          await form.trigger();
          return { error: false, message: "Email sent successfully" };
        }}
        isLoading={form.formState.isSubmitting}
      >
        {translations("oauthButtons.signIn")}
      </ActionButton>
      <div className="flex items-center gap-4 w-full">
        <Separator className="flex-1 w-full" />
        <p className="muted m-0">Or</p>
        <Separator className="flex-1 w-full" />
      </div>
      <OauthProviders />
    </form>
  );
}

export default function EmailStep() {
  const translations = useTranslations("auth");
  const form = useForm<SignInFormData>({
    resolver: zodResolver(useSignInSchema()),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="flex flex-col space-y-6 min-w-full">
      <Heading
        title={translations("title")}
        description={translations("description")}
        placement="center"
      />
      <FormContextProvider form={form}>
        <EmailForm />
      </FormContextProvider>
    </div>
  );
}

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

import AnimatedErrorMessage from "@/components/shared/AnimatedErrorMessage";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  FormContextProvider,
  useFormContext,
} from "@/components/auth/FormContext";
import {
  OnboardingFormData,
  useOnboardingSchema,
} from "@/schemas/onboarding/onboarding.schema";
import { Card } from "../ui/card";
import clsx from "clsx";
import { useIsMobile } from "@/hooks/use-mobile";
import { onboard } from "@/server/auth/actions/onboard.action";
import { redirect } from "next/navigation";

function OnboardingForm() {
  const translations = useTranslations("onboarding");
  const form = useFormContext<OnboardingFormData>();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = form;
  const isMobile = useIsMobile();

  const onSubmit: SubmitHandler<OnboardingFormData> = async (data) => {
    console.log("Onboarding data:", data);
    const result = await onboard(data);
    if (result.error) {
      setError("root", { message: result.message });
    } else {
      redirect("/dashboard");
    }
  };

  const onError: SubmitErrorHandler<OnboardingFormData> = (
    errors: FieldErrors<OnboardingFormData>
  ) => {
    console.log("Form errors:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col space-y-6 w-full"
    >
      <div
        className={clsx(
          "w-full md:max-w-full max-md:bg-background max-md:border-0 md:p-6 max-w-2xl mx-auto bg-card flex flex-col gap-6 rounded-xl"
        )}
      >
        <div className="flex flex-col space-y-2">
          <Label
            htmlFor="organization_name"
            className={clsx({ "text-destructive": !!errors.organization_name })}
          >
            {translations("fields.organization_name.label")}
          </Label>
          <Input
            id="organization_name"
            placeholder={translations("fields.organization_name.placeholder")}
            aria-invalid={!!errors.organization_name}
            {...register("organization_name")}
          />
          {errors.organization_name && (
            <AnimatedErrorMessage>
              {typeof errors.organization_name.message === "string"
                ? errors.organization_name.message
                : translations("fields.organization_name.requiredMessage")}
            </AnimatedErrorMessage>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-2 items-center">
          <div className="flex flex-col space-y-2 w-full">
            <Label
              htmlFor="first_name"
              className={clsx({ "text-destructive": !!errors.first_name })}
            >
              {translations("fields.first_name.label")}
            </Label>
            <Input
              id="first_name"
              placeholder={translations("fields.first_name.placeholder")}
              aria-invalid={!!errors.first_name}
              {...register("first_name")}
            />
            {errors.first_name && (
              <AnimatedErrorMessage>
                {typeof errors.first_name.message === "string"
                  ? errors.first_name.message
                  : translations("fields.first_name.requiredMessage")}
              </AnimatedErrorMessage>
            )}
          </div>

          <div className="flex flex-col space-y-2 w-full">
            <Label
              htmlFor="last_name"
              className={clsx({ "text-destructive": !!errors.last_name })}
            >
              {translations("fields.last_name.label")}
            </Label>
            <Input
              id="last_name"
              placeholder={translations("fields.last_name.placeholder")}
              aria-invalid={!!errors.last_name}
              {...register("last_name")}
            />
            {errors.last_name && (
              <AnimatedErrorMessage>
                {typeof errors.last_name.message === "string"
                  ? errors.last_name.message
                  : translations("fields.last_name.requiredMessage")}
              </AnimatedErrorMessage>
            )}
          </div>
        </div>
      </div>

      <ActionButton
        type="submit"
        action={async () => {
          await form.trigger();
          return { error: false, message: "Onboarding completed successfully" };
        }}
        disabled={!form.formState.isValid}
        isLoading={form.formState.isSubmitting}
      >
        {translations("submitButton")}
      </ActionButton>
    </form>
  );
}

export default function OnboardingStep() {
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(useOnboardingSchema()),
    defaultValues: {
      first_name: "",
      last_name: "",
      organization_name: "",
    },
  });

  return (
    <div className="flex flex-col space-y-6 w-full">
      <FormContextProvider form={form}>
        <OnboardingForm />
      </FormContextProvider>
    </div>
  );
}

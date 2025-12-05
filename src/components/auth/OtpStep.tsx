"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import Heading from "@/components/shared/Heading";
import AnimatedErrorMessage from "@/components/shared/AnimatedErrorMessage";
import { ActionButton } from "@/components/ui/action-button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { OtpFormData, useOtpSchema } from "@/schemas/auth/otp.schema";
import {
  FormContextProvider,
  useFormContext,
} from "@/components/auth/FormContext";
import { useSignInFlowContext } from "@/contexts/auth/SignInFlowContext";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { verifyOtp } from "@/server/auth/actions/signIn.action";
import { useRouter } from "next/navigation";

function OtpForm() {
  const translations = useTranslations("auth");
  const form = useFormContext<OtpFormData>();
  const { targetEmail } = useSignInFlowContext();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;

  const otpValue = watch("otp") || "";

  const onSubmit: SubmitHandler<OtpFormData> = async (data) => {
    try {
      const result = await verifyOtp(targetEmail, data.otp);

      if (result.error) {
        setErrorMessage(result.message);
      } else {
        // Success - redirect to dashboard or home
        setErrorMessage(null);
        router.push("/dashboard"); // or wherever you want to redirect after login
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleOtpChange = (value: string) => {
    setValue("otp", value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-6 w-full"
    >
      <div className="flex flex-col items-center min-w-full space-y-2">
        <InputOTP
          pattern={REGEXP_ONLY_DIGITS}
          maxLength={6}
          value={otpValue}
          onChange={handleOtpChange}
        >
          <InputOTPGroup className="min-w-full flex justify-between gap-2 items-center">
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {errorMessage && (
          <AnimatedErrorMessage className="">
            {errorMessage}
          </AnimatedErrorMessage>
        )}
      </div>

      <ActionButton
        className="w-full"
        type="submit"
        action={async () => {
          console.log("Email:", targetEmail, "|", "OTP:", otpValue);
          return { error: false, message: "OTP verified successfully" };
        }}
        isLoading={isSubmitting}
        disabled={otpValue.length !== 6}
      >
        {translations("otp.verifyButton")}
      </ActionButton>
    </form>
  );
}

export default function OtpStep() {
  const translations = useTranslations("auth");
  const { targetEmail } = useSignInFlowContext();
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    if (!isCounting) return;
    if (secondsLeft <= 0) {
      setIsCounting(false);
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isCounting, secondsLeft]);

  const form = useForm<OtpFormData>({
    resolver: zodResolver(useOtpSchema()),
    defaultValues: {
      otp: "",
    },
  });

  const handleResend = async () => {
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const json = (await res.json()) as { nextAllowedAt?: number | null };
      const now = Date.now();
      const msLeft = json.nextAllowedAt
        ? Math.max(0, json.nextAllowedAt - now)
        : 60000;
      setSecondsLeft(Math.ceil(msLeft / 1000));
      setIsCounting(true);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  const seedFromServer = async () => {
    try {
      const res = await fetch("/api/auth/otp-next-allowed", {
        cache: "no-store",
      });
      const json = (await res.json()) as { nextAllowedAt: number | null };
      const now = Date.now();
      const msLeft = json.nextAllowedAt
        ? Math.max(0, json.nextAllowedAt - now)
        : 0;
      if (msLeft > 0) {
        setSecondsLeft(Math.ceil(msLeft / 1000));
        setIsCounting(true);
      } else {
        setSecondsLeft(0);
        setIsCounting(false);
      }
    } catch {
      setSecondsLeft(0);
      setIsCounting(false);
    }
  };

  useEffect(() => {
    seedFromServer();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <Button
        size="sm"
        variant="outline"
        disabled={isCounting}
        className="max-w-fit"
        onClick={handleResend}
      >
        {secondsLeft > 0 ? (
          <span>
            {translations("otp.resendCodeIn", { time: `${secondsLeft}s` })}
          </span>
        ) : (
          translations("otp.resendButton")
        )}
      </Button>
      <Heading
        title={translations("otp.title")}
        description={translations("otp.description", { email: targetEmail })}
        placement="center"
      />
      <FormContextProvider form={form}>
        <OtpForm />
      </FormContextProvider>
    </div>
  );
}

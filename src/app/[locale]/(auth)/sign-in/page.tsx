"use client";

import React from "react";

import MultistepProvider from "@/contexts/shared/MultistepContext";
import { SignInFlowProvider } from "@/contexts/auth/SignInFlowContext";
import EmailStep from "@/components/auth/EmailStep";
import OtpStep from "@/components/auth/OtpStep";

export default function SignInPage() {
  const steps = [<EmailStep key="email-step" />, <OtpStep key="otp-step" />];

  const stepConfigs = [
    {
      id: "email",
      title: "Email Verification",
      description: "Enter your email address",
    },
    {
      id: "otp",
      title: "OTP Verification",
      description: "Enter the verification code",
    },
  ];

  return (
    <div className="container-xl pt-48 h-full flex items-center justify-center">
      <div className="min-w-full flex flex-col space-y-4 items-center justify-center">
        <SignInFlowProvider>
          <MultistepProvider
            className="min-w-full"
            steps={steps}
            stepConfigs={stepConfigs}
            onComplete={() => {
              console.log("Sign-in process completed!");
            }}
            onError={(error) => {
              console.error("Multistep error:", error);
            }}
          />
        </SignInFlowProvider>
      </div>
    </div>
  );
}

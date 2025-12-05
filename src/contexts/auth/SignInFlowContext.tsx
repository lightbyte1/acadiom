"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SignInFlowContextValue {
  targetEmail: string;
  setTargetEmail: (email: string) => void;
  clearTargetEmail: () => void;
}

const SignInFlowContext = createContext<SignInFlowContextValue | undefined>(
  undefined
);

export function useSignInFlowContext(): SignInFlowContextValue {
  const ctx = useContext(SignInFlowContext);
  if (!ctx) {
    throw new Error(
      "useSignInFlowContext must be used within a SignInFlowProvider"
    );
  }
  return ctx;
}

export function SignInFlowProvider({ children }: { children: ReactNode }) {
  const [targetEmail, setTargetEmailState] = useState("");

  const setTargetEmail = (email: string) => setTargetEmailState(email);
  const clearTargetEmail = () => setTargetEmailState("");

  return (
    <SignInFlowContext.Provider
      value={{ targetEmail, setTargetEmail, clearTargetEmail }}
    >
      {children}
    </SignInFlowContext.Provider>
  );
}

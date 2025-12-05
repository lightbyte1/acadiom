"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface FormContextType<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
}

const FormContext = createContext<UseFormReturn<FieldValues> | undefined>(
  undefined
);

interface FormContextProviderProps<T extends FieldValues = FieldValues> {
  children: ReactNode;
  form: UseFormReturn<T>;
}

export function FormContextProvider<T extends FieldValues = FieldValues>({
  children,
  form,
}: FormContextProviderProps<T>) {
  return (
    <FormContext.Provider value={form as UseFormReturn<FieldValues>}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext<
  T extends FieldValues = FieldValues
>(): UseFormReturn<T> {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormContextProvider");
  }
  return context as UseFormReturn<T>;
}

export { FormContext };

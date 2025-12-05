"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import QueryProvider from "./QueryProvider";

export default function CSRProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </QueryProvider>
  );
}

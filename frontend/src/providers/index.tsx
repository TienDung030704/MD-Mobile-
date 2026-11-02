"use client";

import * as React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root Client Providers Wrapper
 * Ready to integrate ThemeProvider, QueryClientProvider, CartProvider, ToastProvider, etc.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {/* Add 3rd-party or context providers here (e.g. SessionProvider, CartProvider, ThemeProvider) */}
      {children}
    </>
  );
}

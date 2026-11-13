"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root Client Providers Wrapper
 * Cung cấp Redux Store cho toàn bộ các component trong ứng dụng Next.js
 */
export function Providers({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}

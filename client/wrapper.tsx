"use client";


import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "@/store/index";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
const queryClient = new QueryClient();

export default function Wrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NextTopLoader color="#0177AB" showSpinner={false} />
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

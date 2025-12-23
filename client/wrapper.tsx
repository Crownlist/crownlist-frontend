"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "@/store/index";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import BackToTop from "@/components/BackToTop";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";
import { LikedProductsProvider } from "@/context/LikedProductsContext";
const queryClient = new QueryClient();

export default function Wrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't show BottomNav on admin pages
  const showBottomNav =
    !pathname?.startsWith("/admin") && !pathname?.startsWith("/auth/admin");

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LikedProductsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="#0177AB" showSpinner={false} />
            <Toaster position="top-center" />
            {children}
            {showBottomNav && <BottomNav />}
            <BackToTop />
          </ThemeProvider>
        </LikedProductsProvider>
      </QueryClientProvider>
    </Provider>
  );
}

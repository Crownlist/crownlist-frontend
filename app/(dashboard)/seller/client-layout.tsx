"use client";

import type React from "react";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import DashboardSidebar from "@/components/dashboard-sidebar";
import MobileSidebar from "@/components/mobile-sidebar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: RootLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-col">
      {/* Fixed header */}
      <div className="fixed max-w-dvw top-0 left-0 right-0 z-50">
        <DashboardHeader />
      </div>

      <div className="flex flex-1 pt-16">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          //   size="lg"
          className="fixed top-2.5 left-4 z-50 md:hidden h-10"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-10 w-6 text-white" />
        </Button>

        {/* Mobile sidebar */}
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Fixed desktop sidebar */}
        <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 overflow-hidden">
          <DashboardSidebar />
        </div>

        {/* Main content - scrollable without visible scrollbars */}
        <main className="flex-1 ml-0 md:ml-64 bg-white overflow-auto scrollbar-hide h-[calc(100vh-64px)] max-w-full">
          <div className="h-full w-full max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

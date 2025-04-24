"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, LogOut, MessageSquare, Package, PieChart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardSidebar() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <aside className="w-64 bg-white border-r h-full overflow-y-auto scrollbar-hide">
      <nav className="p-4 space-y-3 my-3">
        <Link
          href="/seller/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            activeTab === "dashboard" ? " bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("dashboard")}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/seller/product"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            activeTab === "product" ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("product")}
        >
          <Package className="h-5 w-5" />
          <span>Product</span>
        </Link>

        <Link
          href="/seller/messages"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            activeTab === "messages" ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("messages")}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Messages</span>
        </Link>

        <Link
          href="/seller/analytics"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            activeTab === "analytics" ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("analytics")}
        >
          <PieChart className="h-5 w-5" />
          <span>Analytics</span>
        </Link>

        <Link
          href="/seller/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            activeTab === "settings" ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="absolute bottom-8 w-full px-4">
        <Link
          href="/seler/logout"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  )
}

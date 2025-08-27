"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LogOut, MessageSquare, Package, PieChart, Settings, User, Crown, Puzzle, Database } from "lucide-react"

import { cn } from "@/lib/utils"

export default function DashboardSidebar() {
  const pathname = usePathname()

  // Helper function to check if path is active
  const isActive = (path: string) => {
    return pathname.includes(path)
  }

  return (
    <aside className="w-64 bg-white border-r h-full overflow-y-auto scrollbar-hide">
      <nav className="p-4 space-y-3 my-3">
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/admin/dashboard") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/admin/categories"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/admin/categories") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Package className="h-5 w-5" />
          <span>Categories</span>
        </Link>

        <Link
          href="/admin/users"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/admin/users") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <User className="h-5 w-5" />
          <span>Users</span>
        </Link>

        <Link
          href="/admin/messages"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/admin/messages") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Messages</span>
        </Link>

        <Link
          href="/admin/subscriptions"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/admin/subscriptions") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Crown className="h-5 w-5" />
          <span>Subscription Plans</span>
        </Link>

        <Link
          href="/admin/addon-services"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/admin/addon-services") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Puzzle className="h-5 w-5" />
          <span>Add-on Services</span>
        </Link>

        <Link
          href="/admin/resources"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/admin/resources") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Database className="h-5 w-5" />
          <span>Resources</span>
        </Link>

        <Link
          href="/admin/analytics"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/admin/analytics") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <PieChart className="h-5 w-5" />
          <span>Analytics</span>
        </Link>

        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/admin/settings") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="absolute bottom-8 w-full px-4">
        <Link
          href="/admin/logout"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  )
}
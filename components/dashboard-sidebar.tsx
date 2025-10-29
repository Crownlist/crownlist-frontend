"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LogOut, MessageSquare, Package, PieChart, SendHorizontal, Settings, CreditCard, Shield, Bell } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"

import { cn } from "@/lib/utils"
import LogoutModal from "./logout-modal"
import { useState } from "react"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { notifications } = useNotifications()
  // Helper function to check if path is active
  const isActive = (path: string) => {
    return pathname.includes(path)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length

 

  return (
    <aside className="w-64 bg-white border-r h-full overflow-y-auto scrollbar-hide">
      <nav className="p-4 space-y-3 my-3">
        <Link
          href="/seller/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/seller/dashboard") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F] font-medium" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/seller/request"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/seller/request") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <SendHorizontal className="h-5 w-5" />
          {/* <div className="h-7 w-7">
          <Image
           src={'/try.png'}
           height={15}
           width={15}
           alt='leww'
           className=" h-5 w-5"
          />
          </div> */}
          <span>Request</span>
        </Link>

        <Link
          href="/seller/product"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/seller/product") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Package className="h-5 w-5" />
          <span>Product</span>
        </Link>

        <Link
          href="/seller/subscription"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/seller/subscription") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <CreditCard className="h-5 w-5" />
          <span>Subscription</span>
        </Link>

        <Link
          href="/seller/escrow"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/seller/escrow") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Shield className="h-5 w-5" />
          <span>Escrow</span>
        </Link>

        <Link
          href="/seller/messages"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/seller/messages") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Messages</span>
        </Link>

        <Link
          href="/seller/notification"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/seller/notification") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        <Link
          href="/seller/analytics"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/seller/analytics") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <PieChart className="h-5 w-5" />
          <span>Analytics</span>
        </Link>

        <Link
          href="/seller/settings/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            isActive("/seller/settings") ? "bg-[#EDE9FF] text-[#1F058F] border-l-4 border-[#1F058F]" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="absolute bottom-8 w-full px-4">
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
      <LogoutModal open={open} handleClose={handleClose} />
    </aside>
  )
}

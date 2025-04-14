"use client"

import { cn } from "@/lib/utils"
import { MenuIcon } from "lucide-react"
import { useState } from "react"
import Chat from "./Chat"

export default function Message() {
  const navItems = [
    "Notification",
    "Messages",
    "Saved",
    "Sellers hub",
    "User hub",
  ]

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col md:flex-row bg-white">
      {/* Mobile topbar */}
      <div className="md:hidden p-4 border-b flex justify-between items-center">
        <h1 className="text-lg font-semibold">Menu</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuIcon />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-full md:w-64 p-6 border-r md:block",
          sidebarOpen ? "block" : "hidden md:block"
        )}
      >
        <nav className="space-y-2">
          {navItems.map((item) => (
            <div
              key={item}
              className={cn(
                "px-4 py-2 rounded-md text-sm cursor-pointer",
                item === "Messages" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
              )}
            >
              {item}
            </div>
          ))}
        </nav>
        <div className="mt-10 pt-6 border-t">
          <div className="text-sm text-gray-600 cursor-pointer hover:underline">Logout</div>
        </div>
      </aside>

      {/* Main Content */}
      <main
       className="md:flex-1 flex  md:justify-center md:px-6 "
       >
       <Chat/>
      </main>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { HeartIcon, MenuIcon } from "lucide-react"
import { useState } from "react"

export default function NoSavedPage() {
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
                item === "Saved" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
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
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <HeartIcon size={60} fill="red" color="red" className="mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">No saved post</h2>
          <p className="text-gray-500 mt-1">You currently have no message to display</p>
          <p className="text-sm text-gray-600 mt-6">
            For further assistance, reach out via our 24/7 <br />
            email at{" "}
            <Link href="mailto:support@crownlist.com" className="text-blue-600 underline">
              support@crownlist.com
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

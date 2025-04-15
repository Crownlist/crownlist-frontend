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
    <div className="flex flex-col w-full h-full md:flex-row bg-white">
      {/* Main Content */}
      <main
       className=" flex h-full w-full  md:px-6 "
       >
       <Chat/>
      </main>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { MenuIcon } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "../ui/button"

export default function NoMessagePage() {
  const navItems = [
    "Notification",
    "Messages",
    "Saved",
    "Sellers hub",
    "User hub",
  ]

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex w-full h-full  md:flex-row bg-white">
      {/* Main Content */}
      <main className="w-full h-full flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full h-full flex flex-col gap-5 items-center justify-center">
          <div className="flex w-full justify-center">
            <Image
            src='/nomessage.png'
            width={48}
            height={48}
            alt='message'
            className="flex"
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No Message</h2>
          <p className="text-gray-500 ">You currently have no message to display</p>
          <div>
          <Button className=" rounded-full  border-[#1F058F] hover:bg-[#2a0bc0] hover:text-white  text-black border-2 bg-transparent px-14">Check out  Post</Button>
          </div>
        </div>
      </main>
    </div>
  )
}

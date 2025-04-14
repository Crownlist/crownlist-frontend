"use client"

import { MenuIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"


const savedItems = [
  {
    id: 1,
    title: "Promotion",
    description: "These ads might be interesting for you! Check now!",
     time: "Just now"
  },
  {
    id: 2,
    title: "Saved",
    description: "Check out your saved product out",
     time: "5min ago"
  },
  {
    id: 3,
    title: "Message",
    description: "Adesina properties sent you a meesage",
     time: "5min ago"
  },


  {
    id: 4,
    title: "List",
    description: "Check out your advert to see how they are performing",
    time: "5min ago"
  },

  
]

export default function NotificationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openedNotifications, setOpenedNotifications] = useState(new Set())
  const navItems = ["Notification", "Messages", "Saved", "Sellers hub", "User hub"]


  const handleNotificationClick = (id: number) => {
    setOpenedNotifications((prev) => new Set(prev).add(id))
  }

  const handleMarkAllAsRead = () => {
    const allIds = savedItems.map((item) => item.id)
    setOpenedNotifications(new Set(allIds))
  }

  // Function to determine bell image based on time and opened status
  const getBellImage = (time: string, id: number) => {
    const isNew = time === "Just now"
    const isOpened = openedNotifications.has(id)
    return isNew && !isOpened ? "/black-bell.svg" : "/white-bell.svg"
  }

  return (
    <div className=" flex flex-col md:flex-row">
      {/* Top nav for small screen */}
      <div className="md:hidden p-4 border-b flex justify-between items-center">
        <h1 className="font-semibold text-lg">Menu</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuIcon />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-full md:w-64 p-4 md:p-6 border-r md:block",
          sidebarOpen ? "block" : "hidden md:block"
        )}
      >
        <nav className="space-y-2">
          {navItems.map((item) => (
            <div
              key={item}
              className={cn(
                "px-4 py-2 rounded-md text-sm cursor-pointer",
                item === "Notification" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
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
      <main className="flex-1 p-4 md:p-8">
       <div className="flex items-center justify-between mb-6">
       <h2 className="text-xl font-semibold  ">Notification</h2>
       <p className="underline cursor-pointer " onClick={handleMarkAllAsRead}>Mark all as read</p>
       </div>

        <div className="space-y-6">
          {savedItems.map((item) => (
            <Link href='' key={item.id} onClick={() => handleNotificationClick(item.id)}>
            <div  className="flex flex-col sm:flex-row gap-4 border p-4 rounded-xl bg-white mb-2">
              <Image
                src={getBellImage(item.time, item.id)}
                alt={item.title}
                width={24}
                height={24}
              
              />
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <p>{item.time}</p>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

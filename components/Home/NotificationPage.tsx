"use client"

import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

const savedNotification = [
  {
    id: 1,
    title: "Promotion",
    description: "These ads might be interesting for you! Check now!",
    time: "Just now",
  },
  {
    id: 2,
    title: "Saved",
    description: "Check out your saved product out",
    time: "5min ago",
  },
  {
    id: 3,
    title: "Message",
    description: "Adesina properties sent you a meesage",
    time: "5min ago",
  },
  {
    id: 4,
    title: "List",
    description: "Check out your advert to see how they are performing",
    time: "5min ago",
  },
]

export default function NotificationPage() {
  const [openedNotifications, setOpenedNotifications] = useState(new Set())

  const handleNotificationClick = (id: number) => {
    setOpenedNotifications((prev) => new Set(prev).add(id))
  }

  const handleMarkAllAsRead = () => {
    const allIds = savedNotification.map((item) => item.id)
    setOpenedNotifications(new Set(allIds))
  }

  const getBellImage = (time: string, id: number) => {
    const isNew = time === "Just now"
    const isOpened = openedNotifications.has(id)
    return isNew && !isOpened ? "/black-bell.svg" : "/white-bell.svg"
  }

  return (
    <div className="w-full px-4 py-4 mb-0 ">
      <main className="w-full max-w-2xl mx-auto max-h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notification</h2>
          <p
            className="underline cursor-pointer text-sm text-blue-600"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </p>
        </div>

        <div className="flex flex-col gap-3 ">
          {savedNotification.map((item) => (
            <Link href="#" key={item.id} onClick={() => handleNotificationClick(item.id)}>
              <div className="flex flex-col sm:flex-row gap-3 p-3 border rounded-md w-full mb-0">
                <Image
                  src={getBellImage(item.time, item.id)}
                  alt={item.title}
                  width={24}
                  height={24}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start ">
                    <div>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap">{item.time}</p>
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

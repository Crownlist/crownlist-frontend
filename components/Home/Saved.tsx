"use client"

import { HeartIcon, MapPinIcon, MenuIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"


const savedItems = [
  {
    id: 1,
    image: "/product1.png",
    title: "The Green hostel",
    description: "This product is perfect for your balcony or other smaller spaces since it can be easily folded",
    location: "Eleko",
    tags: ["One room", "Gate"],
    price: "₦95,232",
  },
  {
    id: 2,
    image: "/product2.png",
    title: "St Andrews Glasgow Green",
    description: "A corner, a nook or even part of a passage can be a well-equipped, comfortable place for a few ...",
    location: "Poly gate",
    tags: ["Room & parlor", "24hrs solar"],
    price: "₦595,232",
  },
  {
    id: 3,
    image: "/product3.png",
    title: "AMOLED Touch Screen Laptop",
    description: "Copilot+ PC - 16” - Intel Core Ultra 7 - 16GB Memory - 1TB SSD - Gray",
    location: "Lagos, Amuwo-Odofin",
    tags: ["Used", "Automatic"],
    price: "₦32,695,000",
  },
]

export default function Saved() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navItems = ["Notification", "Messages", "Saved", "Sellers hub", "User hub"]

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
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
      <main className="flex-1 p-4 md:p-8">
        <h2 className="text-xl font-semibold mb-6">Saved</h2>

        <div className="space-y-6">
          {savedItems.map((item) => (
            <Link href='/product' key={item.id}>
            <div  className="flex flex-col sm:flex-row gap-4 border p-4 rounded-xl bg-white mb-2">
              <Image
                src={item.image}
                alt={item.title}
                width={280}
                height={180}
                className="rounded-xl object-cover w-full sm:w-[280px] h-auto"
              />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <HeartIcon className="text-red-500 shrink-0" fill="red" size={20} />
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-700 mt-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon size={14} />
                    {item.location}
                  </span>
                  {item.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-2 text-black font-semibold">{item.price}</div>
              </div>
            </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button className="hover:underline whitespace-nowrap">&larr; Previous</button>
            <div className="flex gap-1">
              {[1, 2, 3, "...", 8, 9, 10].map((pg, i) => (
                <button
                  key={i}
                  className={cn(
                    "px-2 py-1 rounded",
                    pg === 1 ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                  )}
                >
                  {pg}
                </button>
              ))}
            </div>
            <button className="hover:underline whitespace-nowrap">Next &rarr;</button>
          </div>

          <div className="flex items-center gap-1">
            Showing
            <select className="border rounded px-2 py-1">
              <option>8</option>
              <option>16</option>
              <option>32</option>
            </select>
            of 50
          </div>
        </div>
      </main>
    </div>
  )
}

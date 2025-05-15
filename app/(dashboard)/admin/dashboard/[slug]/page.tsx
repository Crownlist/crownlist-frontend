"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Image from "next/image"

// Mock data for the chart
const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 450 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 550 },
  { name: "May", value: 650 },
  { name: "Jun", value: 750 },
  { name: "Jul", value: 650 },
  { name: "Aug", value: 700 },
  { name: "Sep", value: 800 },
  { name: "Oct", value: 850 },
  { name: "Nov", value: 900 },
  { name: "Dec", value: 1000 },
]

// Mock data for recent listings
const recentListings = [
  {
    id: "1",
    name: "The Green hostel",
    image: "/product1.png",
    user: {
      name: "Ronald Richards",
      avatar: "/profile.png",
    },
    plan: "Premium plan",
    planIcon: "premium",
    status: "Reviewing",
    timestamp: "6:00 am · 12 jul 2014",
  },
  {
    id: "2",
    name: "SamsungGalaxy Note20 5G",
    image: "/product2.png",
    user: {
      name: "Eleanor Pena",
      avatar: "/profile.png",
    },
    plan: "Basic plan",
    planIcon: "basic",
    status: "Decline",
    timestamp: "6:00 am · 12 jul 2014",
  },
  {
    id: "3",
    name: "AMOLED Touch Screen Laptop",
    image: "/product3.png",
    user: {
      name: "Cameron Williamson",
      avatar: "/profile.png",
    },
    plan: "Premium plan",
    planIcon: "premium",
    status: "Live",
    timestamp: "6:00 am · 12 jul 2014",
  },
  {
    id: "4",
    name: "DAMMÄNG",
    image: "/product4.png",
    user: {
      name: "Courtney Henry",
      avatar: "/profile.png",
    },
    plan: "Standard plan",
    planIcon: "standard",
    status: "Live",
    timestamp: "6:00 am · 12 jul 2014",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("listing")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 md:mb-12">
        {/* Mobile - Horizontal Scroll */}
        <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Total Listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">1,000</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Active Users</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">875</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Paid vs Free Plan</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">48%</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Reports</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">59</p>
          </div>
        </div>

        {/* Desktop - Grid */}
        <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className="  font-medium">Total Listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">1,000</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Active Users</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">875</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Paid vs Free Plan</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">48%</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Reports</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">59</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="listing" className="mb-8 max-w-md" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#f0eeff] p-1 rounded-full w-auto h-auto">
          <TabsTrigger
            value="listing"
            className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-[#1a0066] data-[state=active]:shadow-sm"
          >
            Listing
          </TabsTrigger>
          <TabsTrigger
            value="paid-plan"
            className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-[#1a0066] data-[state=active]:shadow-sm"
          >
            Paid plan
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Chart Section */}
      <div className="mb-12 bg-white p-6 rounded-lg">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 1000]}
                ticks={[0, 200, 400, 600, 800, 1000]}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip />
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a0066" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1a0066" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1a0066"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Listings Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent listing</h2>
          <Button variant="link" className="text-[#1a0066]">
            See all
          </Button>
        </div>

        <div className="bg-[#f0eeff] rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium">
            <div>Details</div>
            <div>User</div>
            <div>Plan</div>
            <div>Status</div>
            <div>Timestamp</div>
          </div>

          {/* Table Body */}
          <div className="bg-white">
            {recentListings.map((listing) => (
              <div key={listing.id} className="grid grid-cols-5 gap-4 p-4 border-b items-center relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                    <img
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{listing.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={listing.user.avatar || "/profil.png"} alt={listing.user.name} />
                    <AvatarFallback>
                      {listing.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{listing.user.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${listing.planIcon === "premium"
                        ? "bg-amber-100"
                        : listing.planIcon === "basic"
                          ? "bg-indigo-100"
                          : "bg-gray-100"
                      }`}
                  >
                    {listing.planIcon === "premium" && (
                      <div>
                      <Image
                        src={'/dash.png'}
                        width={80}
                        height={80}
                        alt="box"
                      />
                    </div>
                    )}
                    {listing.planIcon === "basic" && (
                      <div>
                      <Image
                        src={'/pplan.png'}
                        width={80}
                        height={80}
                        alt="box"
                      />
                    </div>
                    )}
                    {listing.planIcon === "standard" && (
                      <div>
                        <Image
                          src={'/dash.png'}
                          width={80}
                          height={80}
                          alt="box"
                        />
                      </div>
                    )}
                  </div>
                  <span>{listing.plan}</span>
                </div>

                <div>
                  <Badge
                    variant={
                      listing.status === "Live" ? "default" : listing.status === "Reviewing" ? "secondary" : "destructive"
                    }
                    className="flex jjustify-center align-middle"
                  >
                    {listing.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{listing.timestamp}</span>
                  <div className="relative">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleDropdown(listing.id)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {activeDropdown === listing.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Edit
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            See details
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Update Status
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Delete
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Flag
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

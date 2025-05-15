"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#1a0066] text-white">
          <CardContent className="p-6">
            <div className="text-sm mb-1">Total Listing</div>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500 mb-1">Active Users</div>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500 mb-1">Paid vs free plan</div>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500 mb-1">Reports</div>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>
      </div> */}

      <div className="mb-8 md:mb-12">
        {/* Mobile - Horizontal Scroll */}
        <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Total Listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Active Users</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Paid vs Free Plan</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Reports</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
          </div>
        </div>

        {/* Desktop - Grid */}
        <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className="  font-medium">Total Listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Active Users</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Paid vs Free Plan</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Reports</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">0.00</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="Listing" className="mb-8 max-w-md flex ">
        <TabsList className="bg-[#f0eeff] p-1 rounded-full w-auto h-auto">
          <TabsTrigger
            value="Listing"
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

      {/* Analysis Section */}
      <div className="mb-12">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className=" mb-4">
            <Image
              src={'/analytics.png'}
              width={80}
              height={80}
              alt="box"
            />
          </div>
          <h3 className="text-xl font-medium mb-2">No analysis</h3>
          <p className="text-gray-500">You currently have no analysis to display</p>
        </div>
      </div>

      {/* Recent Listings Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Recent Listing</h2>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className=" mb-4">
            <Image
              src={'/box.png'}
              width={80}
              height={80}
              alt="box"
            />
          </div>
          <h3 className="text-xl font-medium mb-2">No recent list</h3>
          <p className="text-gray-500">You currently have no recent list to display</p>
        </div>
      </div>
    </div>
  )
}

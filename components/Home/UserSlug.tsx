"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Flag, MessageSquare, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const UserSlug = () => {
    const [activeTab, setActiveTab] = useState("details")
    console.log(setActiveTab)
  return (
    <div className="p-4 md:p-12">
    {/* Breadcrumb */}
    <div className="flex items-center text-sm mb-6">
      <Link href="/admin/users" className="text-[#1a0066]">
        Users
      </Link>
      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
      <span className="text-[#1a0066] font-medium">Users details</span>
    </div>

    {/* User Profile Summary */}
    <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
      <div className="w-20 h-20 rounded-full overflow-hidden">
        <Image src="/profile.png" width={80} height={80} alt="User avatar" />
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-1">Jimoh Adesina</h1>
        <p className="text-gray-600 mb-2">8 years on crownlist</p>

        <div className="space-y-2 mb-4">
          <div className="flex flex-row gap-3">
            <div className="flex items-center">
              <div className="w-5 h-5 mr-2 text-green-500">
              <Image
                src='/what.png'
                alt='map'
                width={30}
                height={30}
                className="w-full h-full object-cover"
              />
              </div>
              <span>081 0000 0000</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 mr-2 ">
              <Image
                src='/gmail.png'
                alt='map'
                width={30}
                height={30}
                className="w-full h-full object-cover"
              />
            </div>
              <span>Oyekings@joelist.com.ng</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 ">
              <Image
                src='/gmap.png'
                alt='map'
                width={30}
                height={30}
                className="w-full h-full object-cover"
              />
            </div>
            <span>Kwara, Nigeria</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2 rounded-full shadow-none hover:shadow ">
            <MessageSquare className="h-4 w-4" />
            Message user
          </Button>
          <Button variant="outline" className="flex items-center gap-2 rounded-full shadow-none hover:shadow">
            <Flag className="h-4 w-4" />
            Flag user
          </Button>
          <Button variant="outline" className="flex items-center gap-2 rounded-full shadow-none hover:shadow">
            <X className="h-4 w-4" />
            Block user
          </Button>
        </div>
      </div>
    </div>

    {/* Tabs */}
    <div className="bg-[#f0eeff] rounded-full p-1 inline-flex mb-8 w-full ">
      <Link
        href={`/admin/users`}
        className={`px-6 py-2 rounded-full ${activeTab === "details" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
          }`}
      >
        Details
      </Link>
      <Link
        href={`/admin/users/products`}
        className={`px-6 py-2 rounded-full ${activeTab === "products" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
          }`}
      >
        Products
      </Link>
      <Link
        href={`/admin/users/rating`}
        className={`px-6 py-2 rounded-full ${activeTab === "rating" ? "bg-white text-[#1a0066] font-medium shadow-sm" : "text-gray-700 font-medium"
          }`}
      >
        Rating
      </Link>
    </div>

    {/* Profile Details Form */}
    <div>
      <h2 className="text-lg font-medium mb-6">Profile details</h2>

      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
          <Image src="/profile.png" width={80} height={80} alt="User avatar" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload image
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Full name</label>
          <Input defaultValue="Jimoh Adesina" className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input defaultValue="Sample@gmail.com" className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">number</label>
          <Input defaultValue="+234 081 000 000 0000" className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <div className="relative">
            <select className="w-full h-10 px-3 py-2 bg-white border border-input rounded-md appearance-none">
              <option>Nigeria</option>
              <option>Ghana</option>
              <option>Kenya</option>
            </select>
            <ChevronRight className="absolute right-3 top-3 h-4 w-4 rotate-90 text-gray-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <div className="relative">
            <select className="w-full h-10 px-3 py-2 bg-white border border-input rounded-md appearance-none">
              <option>Kwara</option>
              <option>Lagos</option>
              <option>Abuja</option>
            </select>
            <ChevronRight className="absolute right-3 top-3 h-4 w-4 rotate-90 text-gray-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <Input className="w-full" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="bg-[#1a0066] hover:bg-[#150050] rounded-full">Update</Button>
        <Button variant="outline" className="rounded-full">Cancel</Button>
      </div>
    </div>
  </div>
  )
}

export default UserSlug
"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminProfileSettingsPage() {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="bg-[#f0eeff] rounded-full p-1 inline-flex mb-8">
        <Link
          href="/admin/settings/profile"
          className="px-6 py-2 rounded-full bg-white text-[#1a0066] font-medium shadow-sm"
        >
          Profile
        </Link>
        <Link
          href="/admin/settings/notification"
          className="px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-50"
        >
          Notification
        </Link>
        <Link href="/admin/settings/team" className="px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-50">
          Team
        </Link>
      </div>

      {/* Profile Details Section */}
      <div className="mb-10 border-b pb-10">
        <h2 className="text-lg font-medium mb-1">Profile details</h2>
        <p className="text-gray-600 mb-6">Update and manage your profile</p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar and Upload Button */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl font-semibold mb-4">
              F
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload image
            </Button>
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
              <Input defaultValue="Jimoh Adesina" className="w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input defaultValue="Sample@gmail.com" className="w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">number</label>
              <Input defaultValue="+234 081 000 000 0000" className="w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="ghana">Ghana</SelectItem>
                  <SelectItem value="kenya">Kenya</SelectItem>
                  <SelectItem value="southafrica">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">Abuja</SelectItem>
                  <SelectItem value="kano">Kano</SelectItem>
                  <SelectItem value="kwara">Kwara</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <Input className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mb-10 border-b pb-10">
        <h2 className="text-lg font-medium mb-1">Security</h2>
        <p className="text-gray-600 mb-6">Update and manage your password</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Old password</label>
            <div className="relative">
              <Input type={showOldPassword ? "text" : "password"} className="w-full pr-10" />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
            <div className="relative">
              <Input type={showNewPassword ? "text" : "password"} className="w-full pr-10" />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
            <div className="relative">
              <Input type={showConfirmPassword ? "text" : "password"} className="w-full pr-10" />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="bg-[#1a0066] hover:bg-[#2a0bc0]">Update</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  )
}

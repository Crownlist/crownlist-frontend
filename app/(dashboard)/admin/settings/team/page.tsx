"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Pencil, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for team members
const users = [
  {
    id: "1",
    name: "Ronald Richards",
    email: "Sample@gmail.com",
    role: "Super admin",
    status: "NA",
    lastActive: "6:00 am · 12 jul 2014",
    avatar: "/profile.png",
    canEdit: false,
  },
  {
    id: "2",
    name: "Eleanor Pena",
    email: "Sample@gmail.com",
    role: "Admin",
    status: "Pending",
    lastActive: "6:00 am · 12 jul 2014",
    avatar: "/profile.png",
    canEdit: true,
  },
  {
    id: "3",
    name: "Cameron Williamson",
    email: "Sample@gmail.com",
    role: "List manager",
    status: "Approved",
    lastActive: "6:00 am · 12 jul 2014",
    avatar: "/profile.png",
    canEdit: true,
  },
  {
    id: "4",
    name: "Courtney Henry",
    email: "Sample@gmail.com",
    role: "User manager",
    status: "Decline",
    lastActive: "6:00 am · 12 jul 2014",
    avatar: "/profile.png",
    canEdit: true,
  },
]

export default function AdminTeamSettingsPage() {
  const [invitees, setInvitees] = useState([
    { id: "1", name: "Jimoh" },
    { id: "2", name: "Adesina" },
    { id: "3", name: "Dominic" },
  ])

  const removeInvitee = (id: string) => {
    setInvitees(invitees.filter((invitee) => invitee.id !== id))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "Decline":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Decline</Badge>
      default:
        return <span>NA</span>
    }
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="bg-[#f0eeff] rounded-full p-1 inline-flex mb-8">
        <Link
          href="/admin/settings/profile"
          className="px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-50"
        >
          Profile
        </Link>
        <Link
          href="/admin/settings/notification"
          className="px-6 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-50"
        >
          Notification
        </Link>
        <Link
          href="/admin/settings/team"
          className="px-6 py-2 rounded-full bg-white text-[#1a0066] font-medium shadow-sm"
        >
          Team
        </Link>
      </div>

      {/* Invite Team Members */}
      <div className="mb-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-medium mb-2">Invite team members</h2>
            <p className="text-gray-600 mb-4">
              Get your projects up and running faster by inviting your team to collaborate.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User company email ID</label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                {invitees.map((invitee) => (
                  <div key={invitee.id} className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                    <span>{invitee.name}</span>
                    <button
                      onClick={() => removeInvitee(invitee.id)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Select defaultValue="admin">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user-manager">User manager</SelectItem>
                  <SelectItem value="admin-manager">Admin manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button className="bg-[#1a0066] hover:bg-[#2a0bc0] flex-1">Send invite</Button>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div>
        <h2 className="text-lg font-medium mb-6">Users</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f0eeff]">
                <th className="text-left py-3 px-4 font-medium rounded-l-lg">Details</th>
                <th className="text-left py-3 px-4 font-medium">Email address</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium rounded-r-lg">Last active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4">{user.role}</td>
                  <td className="py-4 px-4">{getStatusBadge(user.status)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-between">
                      <span>{user.lastActive}</span>
                      {user.canEdit && (
                        <div className="flex items-center gap-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-[#1a0066] text-white">
              1
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              2
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              3
            </Button>
            <span>...</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              8
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              9
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              10
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing</span>
            <Select defaultValue="4">
              <SelectTrigger className="h-8 w-16">
                <SelectValue placeholder="4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">of 50</span>
          </div>
        </div>
      </div>
    </div>
  )
}

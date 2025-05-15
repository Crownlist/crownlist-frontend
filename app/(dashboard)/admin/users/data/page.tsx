"use client"

import { useState } from "react"
import { ArrowUpDown, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"


// Mock data for users
const users = [
    {
        id: "1",
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        status: "Active",
        type:'Vendor',
        list:"12",
        joinDate: "Jan 19, 2025",
        avatar: "/profile.png",
        timestamp: "6:00 am · 12 jul 2014",
    },
    {
        id: "2",
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        status: "Inactive",
        type:'User',
        list:"NA",
        joinDate: "Jan 15, 2025",
        avatar: "/profile.png",
        timestamp: "6:00 am · 12 jul 2014",
    },
    {
        id: "3",
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        status: "Flagged",
        type:'Vendor',
        list:"72",
        joinDate: "Jan 10, 2025",
        avatar: "/profile.png",
        timestamp: "6:00 am · 12 jul 2014",
    },
    {
        id: "4",
        name: "William Kim",
        email: "william.kim@email.com",
        status: "Active",
        type:'User',
        joinDate: "Jan 5, 2025",
        list:"48",
        avatar: "/profile.png",
        timestamp: "6:00 am · 12 jul 2014",
    },
    {
        id: "5",
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        status: "Block",
        type:'Vendor',
        list:"NA",
        joinDate: "Dec 28, 2024",
        avatar: "/profile.png",
        timestamp: "6:00 am · 12 jul 2014",
    },
]

export default function UsersDataPage() {
    const [searchQuery, setSearchQuery] = useState("")
    // const [activePage, setActivePage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState("4")
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    const toggleDropdown = (id: string) => {
        setActiveDropdown(activeDropdown === id ? null : id)
    }
    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Users</h1>
                    <p className="text-muted-foreground">Keep track and manage users</p>
                </div>
                <Button className="mt-4 md:mt-0 bg-[#1a0066] hover:bg-[#2e0a94]">Add Users</Button>
            </div>

            {/* Stats Cards */}
            <div className="mb-2 md:mb-3">
                {/* Mobile - Horizontal Scroll */}
                <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                        <h3 className=" hover:text-white font-medium">Total Users</h3>
                        <p className="text-3xl font-bold hover:text-white mt-1">100</p>
                    </div>

                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                        <h3 className=" hover:text-white font-medium">Active Users</h3>
                        <p className="text-3xl font-bold hover:text-white mt-1">50</p>
                    </div>

                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                        <h3 className=" hover:text-white font-medium">Inactive Users</h3>
                        {/* <p className="text-3xl font-bold hover:text-white mt-1">50<p> */}
                        <p className="text-3xl font-bold hover:text-white mt-1">50</p>
                    </div>

                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                        <h3 className=" hover:text-white font-medium">Blocked Users </h3>
                        <p className="text-3xl font-bold hover:text-white mt-1">7</p>
                    </div>

                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
                        <h3 className=" hover:text-white font-medium">Flag Users</h3>
                        <p className="text-3xl font-bold hover:text-white mt-1">5</p>
                    </div>
                </div>

                {/* Desktop - Grid */}
                <div className="hidden md:grid grid-cols-5 gap-6 md:gap-8">
                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                        <h3 className="  font-medium">Total Users</h3>
                        <p className="text-3xl font-bold hover:t10ext-white mt-1">0</p>
                    </div>

                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                        <h3 className=" hover:text-white font-medium">Active Users</h3>
                        <p className="text-3xl font-bold hover:text-white mt-1">50</p>
                    </div>

                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                        <h3 className=" hover:text-white font-medium">Inactive Users</h3>
                        {/* <p className="text-3xl font-bold hover:text-white mt-1"> 50 <p> */}
                        <p className="text-3xl font-bold hover:text-white mt-1">50</p>
                    </div>

                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                        <h3 className=" hover:text-white font-medium">Blocked Users </h3>
                        <p className="text-3xl font-bold hover:text-white mt-1">7</p>
                    </div>

                    <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
                        <h3 className=" hover:text-white font-medium">Flag Users</h3>
                        <p className="text-3xl font-bold hover:text-white mt-1">5</p>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 pt-3">
                <div className="relative  flex">
                    <Input
                        placeholder="Search"
                        className="rounded-full rounded-r-none border-r-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button className="rounded-full rounded-l-none bg-[#1a0066] hover:bg-[#2e0a94]">Search</Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        <span>Sort</span>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </Button>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Listing</h2>

            {/* Listings Table */}
            <div className="bg-[#f0eeff] rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-7 gap-4 p-4 text-base items-center w-full  font-medium">
                    <div>Details</div>
                    <div>Contact info</div>
                    <div>Country</div>
                    <div>Type</div>
                    <div>List</div>
                    <div>Status</div>
                    <div>Timestamp</div>
                </div>

                {/* Table Body */}
                <div className="bg-white">
                    {users.map((listing) => (
                        <Link href={'/admin/users/1'} key={listing.id}>
                            <div className="grid grid-cols-7 gap-4 p-4 border-b items-center relative">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={listing.avatar || "/profil.png"} alt={listing.name} />
                                        <AvatarFallback>
                                            {listing.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{listing.name}</span>
                                </div>

                                <div className="flex items-center">
                                    {listing.email}
                                </div>

                                  <div className="flex items-center">
                                    Nigeria
                                </div>

                                <div className="flex items-center gap-2">
                                    <span>{listing.type}</span>
                                </div>

                                 <div className="flex items-center">
                                    {listing.list}
                                </div>


                                <div>
                                    <Badge
                                        variant={
                                            listing.status === "Active" ? "default" : listing.status === "Block" ? "secondary" : "destructive"
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
                        </Link>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-3">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                    </Button>
                    <Button variant="outline" size="sm" className="px-3 py-1 h-8 bg-gray-100">
                        1
                    </Button>
                    <Button variant="outline" size="sm" className="px-3 py-1 h-8">
                        2
                    </Button>
                    <Button variant="outline" size="sm" className="px-3 py-1 h-8">
                        3
                    </Button>
                    <span>...</span>
                    <Button variant="outline" size="sm" className="px-3 py-1 h-8">
                        8
                    </Button>
                    <Button variant="outline" size="sm" className="px-3 py-1 h-8">
                        9
                    </Button>
                    <Button variant="outline" size="sm" className="px-3 py-1 h-8">
                        10
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Showing</span>
                    <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                        <SelectTrigger className="w-16 h-8">
                            <SelectValue placeholder="4" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">of 50</span>
                </div>
            </div>
        </div>
    )
}

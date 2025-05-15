"use client"

import { useState } from "react"
import { ArrowUpDown, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"

// Mock data for listings
// const listings = [
//   {
//     id: "1",
//     title: "The Green hostel",
//     image: "/placeholder.svg?height=40&width=40",
//     category: "House",
//     price: "₦500,000",
//     status: "Live",
//     date: "6:00 am · 12 jul 2014",
//     seller: {
//       name: "Ronald Richards",
//       avatar: "/placeholder.svg?height=32&width=32",
//     },
//     plan: {
//       type: "Premium plan",
//       icon: "premium",
//     },
//   },
//   {
//     id: "2",
//     title: "SamsungGalaxy Note20 5G",
//     image: "/placeholder.svg?height=40&width=40",
//     category: "Phone & tablets",
//     price: "₦250,000",
//     status: "Reviewing",
//     date: "6:00 am",
//     seller: {
//       name: "Eleanor Pena",
//       avatar: "/placeholder.svg?height=32&width=32",
//     },
//     plan: {
//       type: "Basic plan",
//       icon: "basic",
//     },
//   },
//   {
//     id: "3",
//     title: "AMOLED Touch Screen Laptop",
//     image: "/placeholder.svg?height=40&width=40",
//     category: "Electronics",
//     price: "₦350,000",
//     status: "Flagged",
//     date: "6:00 am",
//     seller: {
//       name: "Cameron Williamson",
//       avatar: "/placeholder.svg?height=32&width=32",
//     },
//     plan: {
//       type: "Premium plan",
//       icon: "premium",
//     },
//   },
//   {
//     id: "4",
//     title: "DAMMÄNG",
//     image: "/placeholder.svg?height=40&width=40",
//     category: "Furniture",
//     price: "₦75,000",
//     status: "Decline",
//     date: "6:00 am",
//     seller: {
//       name: "Courtney Henry",
//       avatar: "/placeholder.svg?height=32&width=32",
//     },
//     plan: {
//       type: "Standard plan",
//       icon: "standard",
//     },
//   },
// ]
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

export default function ListingsPage() {
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
          <h1 className="text-2xl font-bold">Listing</h1>
          <p className="text-muted-foreground">Keep track and manage users listing</p>
        </div>
        <Link href={'/admin/listing/1/list-product'}>
          <Button className="mt-4 md:mt-0 bg-[#1a0066] hover:bg-[#2e0a94]">Add listing</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-2 md:mb-3">
        {/* Mobile - Horizontal Scroll */}
        <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Total Listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">100</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Approved listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">54</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Pending listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">45</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Declined listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">34</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className=" hover:text-white font-medium">Expired listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">7</p>
          </div>
        </div>

        {/* Desktop - Grid */}
        <div className="hidden md:grid grid-cols-5 gap-6 md:gap-8">
          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className="  font-medium">Total Listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">100</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Approved listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">54</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Pending listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">45</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Declined listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">34</p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className=" hover:text-white font-medium">Expired listing</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">7</p>
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
      {/* <div className="border rounded-lg overflow-hidden mb-6 bg-slate-50">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>Details</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded overflow-hidden">
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="font-medium">{listing.title}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={listing.seller.avatar || "/placeholder.svg"} alt={listing.seller.name} />
                      <AvatarFallback>{listing.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{listing.seller.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {listing.plan.icon === "premium" && (
                      <div className="bg-orange-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                        P
                      </div>
                    )}
                    {listing.plan.icon === "basic" && (
                      <div className="bg-slate-400 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                        B
                      </div>
                    )}
                    {listing.plan.icon === "standard" && (
                      <div className="bg-slate-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                        S
                      </div>
                    )}
                    <span>{listing.plan.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      listing.status === "Live"
                        ? "default"
                        : listing.status === "Reviewing"
                          ? "secondary"
                          : listing.status === "Flagged"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell>{listing.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>See details</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem>Flag</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
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
            <Link href={'/admin/listing/product_details'} key={listing.id}>
              <div className="grid grid-cols-5 gap-4 p-4 border-b items-center relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                    <Image
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.name}
                      width={30}
                      height={30}
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

"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { Search, Filter, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { User, UsersResponse } from "@/types/user/user"
import { apiClientAdmin } from "@/lib/interceptor"
export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [accountType, setAccountType] = useState<string>("all")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(42)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch users data with pagination
  const { data, isLoading, error, refetch } = useQuery<UsersResponse>({
    queryKey: ['users', currentPage, itemsPerPage],
    queryFn: async () => {
      const response = await apiClientAdmin.get(
        `/users?page=${currentPage}&limit=${itemsPerPage}`
      )
      return response.data
    },
    // keepPreviousData: true,
    refetchOnWindowFocus: false,
  })

  // Update total pages and current page when data changes
  useEffect(() => {
    if (data?.data) {
      setTotalPages(data.data.totalPages || 1)
      setCurrentPage(data.data.currentPage || 1)
    }
  }, [data?.data])

  // Apply filters when data or filter values change
  useEffect(() => {
    if (data?.data?.users) {
      let result = [...data.data.users]

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        result = result.filter(user =>
          user.fullName?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.userCustomId?.toLowerCase().includes(term)
        )
      }

      // Filter by account type
      if (accountType !== "all") {
        result = result.filter(user => user.accountType === accountType)
      }

      setFilteredUsers(result)
    } else {
      setFilteredUsers([])
    }
  }, [data, searchTerm, accountType, data?.data?.users])

  // Calculate stats
  const totalUsers = data?.data?.stats?.totalUsers || 0
  const activeUsers = data?.data?.stats?.activeUsers || 0
  const inactiveUsers = data?.data?.stats?.inactiveUsers || 0
  const sellerUsers = data?.data?.stats?.sellers || 0
  const regularUsers = data?.data?.stats?.regularUsers || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-[#1F058F]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading users: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4" variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 flex flex-col w-full h-full">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-gray-600">Manage and track all users</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-row sm:flex-row justify-between align-middle items-center gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Show:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1) // Reset to first page when changing items per page
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="User">Regular Users</SelectItem>
                  <SelectItem value="Seller">Sellers</SelectItem>
                  <SelectItem value="Admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  refetch()
                  setCurrentPage(1) // Reset to first page on refresh
                }}
                className="h-10 w-10"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-9 w-full sm:w-[250px]"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard title="Total Users" value={totalUsers} />
          <StatCard title="Active Users" value={activeUsers} />
          <StatCard title="Inactive Users" value={inactiveUsers} />
          <StatCard title="Sellers" value={sellerUsers} />
          <StatCard title="Regular Users" value={regularUsers} />
        </div>

        {/* Users Table/Cards */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4">
            <h2 className="text-lg font-semibold">All Users</h2>
            <div className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalUsers)} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto w-full">
                <Table className="min-w-[800px] w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Subscription Status</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.profilePicture} alt={user.fullName} />
                              <AvatarFallback>
                                {user.fullName
                                  .split(' ')
                                  .map((n) => n[0] || '')
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.fullName || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">
                                {user.isVerified ? 'Verified' : 'Not Verified'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.accountType === 'Seller' ? 'default' : 'outline'}
                            className={user.accountType === 'Admin' ? 'bg-purple-100 text-purple-800' : ''}
                          >
                            {user.accountType || 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.subscriptionStatus === 'active' ? 'default' : 'outline'}
                            className={user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {(user.subscriptionStatus || 'inactive').charAt(0).toUpperCase() + (user.subscriptionStatus || 'inactive').slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/users/${user._id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                            {user.accountType === 'Seller' && (
                              <Link href={`/admin/users/${user._id}/seller-products`}>
                                <Button variant="ghost" size="sm" className="text-[#1F058F] hover:bg-[#1F058F]/10">
                                  View Products
                                </Button>
                              </Link>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={user.profilePicture} alt={user.fullName} />
                        <AvatarFallback>
                          {user.fullName
                            .split(' ')
                            .map((n) => n[0] || '')
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{user.fullName || 'Unknown'}</div>
                        <div className="text-sm text-gray-500 mb-1">
                          {user.isVerified ? 'Verified' : 'Not Verified'}
                        </div>
                        <div className="text-sm text-gray-600 truncate">{user.email || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Account Type</div>
                        <Badge
                          variant={user.accountType === 'Seller' ? 'default' : 'outline'}
                          className={`mt-1 text-xs ${user.accountType === 'Admin' ? 'bg-purple-100 text-purple-800' : ''}`}
                        >
                          {user.accountType || 'User'}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Subscription</div>
                        <Badge
                          variant={user.subscriptionStatus === 'active' ? 'default' : 'outline'}
                          className={`mt-1 text-xs ${user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {(user.subscriptionStatus || 'inactive').charAt(0).toUpperCase() + (user.subscriptionStatus || 'inactive').slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Joined: {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/users/${user._id}`}>
                          <Button variant="outline" size="sm" className="text-xs px-3 py-1">View</Button>
                        </Link>
                        {user.accountType === 'Seller' && (
                          <Link href={`/admin/users/${user._id}/seller-products`}>
                            <Button variant="ghost" size="sm" className="text-xs px-3 py-1 text-[#1F058F] hover:bg-[#1F058F]/10">
                              Products
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || accountType !== 'all'
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'There are no users in the system yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, data?.data?.totalUsers || 0)}
            </span>{' '}
            of <span className="font-medium">{data?.data?.totalUsers || 0}</span> users
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-1 order-2 sm:order-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="text-xs px-3 py-1"
              >
                Previous
              </Button>

              {/* Mobile: Show fewer page buttons */}
              <div className="flex items-center space-x-1 sm:hidden">
                <span className="text-sm text-gray-600 px-2">
                  {currentPage} of {totalPages}
                </span>
              </div>

              {/* Desktop: Show page number buttons */}
              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum = currentPage - 2 + i;
                  // Adjust if we're near the start or end
                  if (pageNum < 1) pageNum = i + 1;
                  if (pageNum > totalPages) pageNum = totalPages - 4 + i;

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={isLoading}
                      className="text-xs px-3 py-1 min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="px-2 text-sm text-gray-500">... {totalPages}</span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isLoading || totalPages === 0}
                className="text-xs px-3 py-1"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  )
}

/*eslint-disable*/
"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Search, RefreshCw, Plus, UserPlus, Shield, ShieldOff } from "lucide-react"
import { useState, useEffect } from "react"
import { Admin, AdminApiResponse } from "@/types/admin/admin-mgt"
import { apiClientAdmin } from "@/lib/interceptor"
import { useToast } from "@/lib/useToastMessage"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AdminUser extends Admin {}

// Helper function to get display name for admin
const getAdminDisplayName = (admin: AdminUser) => {
  if (admin.firstname && admin.lastname) {
    return `${admin.firstname} ${admin.lastname}`;
  }
  // Fallback to email username or custom ID
  const emailName = admin.email?.split('@')[0];
  return emailName || admin.adminCustomId || 'Admin';
};

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAdmins, setFilteredAdmins] = useState<AdminUser[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(42)
  const [totalPages, setTotalPages] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { handleMessage } = useToast()
  const queryClient = useQueryClient()

  // Form state for creating sub-admin
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  })

  // Fetch admins data
  const { data, isLoading, error, refetch } = useQuery<AdminApiResponse>({
    queryKey: ['admins', currentPage, itemsPerPage],
    queryFn: async () => {
      const response = await apiClientAdmin.get(
        `/admins?page=${currentPage}&limit=${itemsPerPage}`
      )
      return response.data
    },
    refetchOnWindowFocus: false,
  })

  // Update total pages when data changes
  useEffect(() => {
    if (data?.data && data?.meta) {
      const totalAdmins = data.data.totalAdmins || 0
      const limit = data.meta.limit || itemsPerPage
      setTotalPages(Math.ceil(totalAdmins / limit) || 1)
      setCurrentPage(data.meta.page || 1)
    }
  }, [data?.data, data?.meta, itemsPerPage])

  // Apply filters when data or filter values change
  useEffect(() => {
    if (data?.data?.admins) {
      let result = [...data.data.admins] as AdminUser[]

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        result = result.filter(admin =>
          admin.email?.toLowerCase().includes(term) ||
          admin.adminCustomId?.toLowerCase().includes(term)
        )
      }

      setFilteredAdmins(result)
    } else {
      setFilteredAdmins([])
    }
  }, [data, searchTerm, data?.data?.admins])

  // Mutation for creating sub-admin
  const createAdminMutation = useMutation({
    mutationFn: async (adminData: typeof formData) => {
      const response = await apiClientAdmin.post('/auth/admin/register', {
        ...adminData,
        adminType: "Sub-Admin"
      })
      return response.data
    },
    onSuccess: (data) => {
      handleMessage("success", data.data?.message || "Sub-admin created successfully")
      setFormData({ fullName: "", email: "", password: "" })
      setIsCreateDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: (error: any) => {
      handleMessage("error", error.response?.data?.message || "Failed to create sub-admin")
    }
  })

  // Mutation for blocking/unblocking admin
  const blockAdminMutation = useMutation({
    mutationFn: async ({ adminId, blockDecision }: { adminId: string; blockDecision: boolean }) => {
      const response = await apiClientAdmin.patch('/admins', {
        adminId,
        blockDecision
      })
      return response.data
    },
    onSuccess: (data, variables) => {
      const action = variables.blockDecision ? "blocked" : "unblocked"
      handleMessage("success", data.data?.message || `Admin has been ${action}`)
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    },
    onError: (error: any) => {
      handleMessage("error", error.response?.data?.message || "Failed to update admin status")
    }
  })

  const handleCreateAdmin = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      handleMessage("error", "Please fill in all fields")
      return
    }
    createAdminMutation.mutate(formData)
  }

  const totalAdmins = data?.data?.totalAdmins || 0

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
        <p className="text-red-500">Error loading admins: {error.message}</p>
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
            <h1 className="text-2xl font-bold">Admin Management</h1>
            <p className="text-gray-600">Create and manage sub-admin accounts</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Sub-Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Sub-Admin Account</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new sub-admin account.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={createAdminMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAdmin}
                    disabled={createAdminMutation.isPending}
                    className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                  >
                    {createAdminMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Create Admin
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                refetch()
                setCurrentPage(1)
              }}
              className="h-10 w-10"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-9 w-full sm:w-[250px]"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Admins" value={totalAdmins} />
          <StatCard title="Super Admins" value={filteredAdmins.filter(a => a.adminType === 'Super-Admin').length} />
          <StatCard title="Sub Admins" value={filteredAdmins.filter(a => a.adminType === 'Sub-Admin').length} />
        </div>

        {/* Admins Table/Cards */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4">
            <h2 className="text-lg font-semibold">All Admins</h2>
            <div className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalAdmins)} to {Math.min(currentPage * itemsPerPage, totalAdmins)} of {totalAdmins} admins
            </div>
          </div>

          {filteredAdmins.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto w-full">
                <Table className="min-w-[800px] w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Admin Type</TableHead>
                      <TableHead>Admin ID</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.map((admin) => (
                      <TableRow key={admin._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={admin.profilePicture} alt={getAdminDisplayName(admin)} />
                              <AvatarFallback>
                                {getAdminDisplayName(admin).split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{getAdminDisplayName(admin)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={admin.adminType === 'Super-Admin' ? 'default' : 'outline'}
                            className={admin.adminType === 'Super-Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
                          >
                            {admin.adminType}
                          </Badge>
                        </TableCell>
                        <TableCell>{admin.adminCustomId || 'N/A'}</TableCell>
                        <TableCell>{admin.createdAt ? format(new Date(admin.createdAt), 'MMM d, yyyy') : 'N/A'}</TableCell>
                        <TableCell>
                          {admin.deletedAt ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => blockAdminMutation.mutate({
                                adminId: admin._id,
                                blockDecision: false
                              })}
                              disabled={blockAdminMutation.isPending}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => blockAdminMutation.mutate({
                                adminId: admin._id,
                                blockDecision: true
                              })}
                              disabled={blockAdminMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <ShieldOff className="h-4 w-4 mr-1" />
                              Block
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {filteredAdmins.map((admin) => (
                  <div key={admin._id} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={admin.profilePicture} alt={getAdminDisplayName(admin)} />
                        <AvatarFallback>
                          {getAdminDisplayName(admin).split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{getAdminDisplayName(admin)}</div>
                        <div className="text-sm text-gray-600 truncate">{admin.email}</div>
                        <div className="text-sm text-gray-500">ID: {admin.adminCustomId || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Admin Type</div>
                        <Badge
                          variant={admin.adminType === 'Super-Admin' ? 'default' : 'outline'}
                          className={`mt-1 text-xs ${admin.adminType === 'Super-Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}
                        >
                          {admin.adminType}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Created</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {admin.createdAt ? format(new Date(admin.createdAt), 'MMM d, yyyy') : 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {admin.deletedAt ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => blockAdminMutation.mutate({
                            adminId: admin._id,
                            blockDecision: false
                          })}
                          disabled={blockAdminMutation.isPending}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-1"
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => blockAdminMutation.mutate({
                            adminId: admin._id,
                            blockDecision: true
                          })}
                          disabled={blockAdminMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                        >
                          <ShieldOff className="h-4 w-4 mr-1" />
                          Block
                        </Button>
                      )}
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
              <h3 className="text-lg font-medium text-gray-900">No admins found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search to find what you\'re looking for.'
                  : 'There are no admin accounts in the system yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalAdmins)}
            </span>{' '}
            of <span className="font-medium">{totalAdmins}</span> admins
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

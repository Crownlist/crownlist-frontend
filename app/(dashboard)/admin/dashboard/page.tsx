"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Image from "next/image"
import { apiClientAdmin } from "@/lib/interceptor"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Types
type DashboardData = {
  metrics: {
    totalListings: number
    activeUsers: number
    paidVsFreePlanPercentage: number
    reports: number
  }
  analytics: {
    year: number
    monthlyListings: Array<{
      month: number
      monthName: string
      year: number
      count: number
      totalValue: number
    }>
    monthlySubscriptions: Array<{
      month: number
      monthName: string
      year: number
      count: number
    }>
  }
  recentListings: Array<{
    id: string
    details: {
      name: string
      primaryImage: string
      category: string
      subCategory: string
    }
    user: {
      name: string
      customId: string
      profilePicture: string
    }
    plan: {
      type: string
      icon: string
    }
    status: {
      label: string
      value: string
    }
    timestamp: string
  }>
}

// Empty chart data for initial state
const emptyChartData = Array(12).fill(0).map((_, i) => ({
  name: new Date(0, i).toLocaleString('default', { month: 'short' }),
  value: 0
}));


interface StatusModalState {
  isOpen: boolean;
  listingId: string | null;
  status: 'live' | 'declined' | '';
  reasonForDecline: string;
}

interface StatusUpdateModalProps {
  statusModal: StatusModalState;
  setStatusModal: React.Dispatch<React.SetStateAction<StatusModalState>>;
  isSubmitting: boolean;
  showConfirmation: boolean;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  pendingStatus: 'live' | 'declined' | null;
  handleStatusUpdate: () => Promise<void>;
  setPendingStatus: React.Dispatch<React.SetStateAction<'live' | 'declined' | null>>;
}

// Status Update Modal Component
const StatusUpdateModal = ({
  statusModal,
  setStatusModal,
  isSubmitting,
  showConfirmation,
  setShowConfirmation,
  pendingStatus,
  handleStatusUpdate,
  setPendingStatus
}: StatusUpdateModalProps) => (
  <div className={`fixed inset-0 bg-black/85 bg-opacity-50 flex items-center justify-center z-50 ${!statusModal.isOpen ? 'hidden' : ''}`}>
    <div className="bg-white p-6 rounded-lg w-full max-w-2xl min-h-[100px] relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a0066]"></div>
        </div>
      )}
      <h3 className="text-lg font-semibold mb-4">Update Listing Status</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={statusModal.status}
            defaultValue="live"
            onValueChange={(value) => setStatusModal(prev => ({ ...prev, status: value as 'live' | 'declined' }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {statusModal.status === 'declined' && (
          <div>
            <label className="block text-sm font-medium mb-1">Reason for Decline</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Please provide a reason for declining this listing"
              value={statusModal.reasonForDecline}
              onChange={(e) => setStatusModal(prev => ({ ...prev, reasonForDecline: e.target.value }))}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setPendingStatus(statusModal.status as 'live' | 'declined');
              setShowConfirmation(true);
            }}
            disabled={!statusModal.status || (statusModal.status === 'declined' && !statusModal.reasonForDecline.trim()) || isSubmitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              !statusModal.status || (statusModal.status === 'declined' && !statusModal.reasonForDecline.trim()) || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#1a0066] hover:bg-[#160052]'
            }`}
          >
            Update Status
          </button>
        </div>

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Confirm Status Update</h3>
                <p className="mb-6">Are you sure you want to update this listing&apos;s status to <span className="font-medium">{pendingStatus}</span>?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                      isSubmitting ? 'bg-gray-400' : 'bg-[#1a0066] hover:bg-[#160052]'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  
  const router = useRouter();

  const [statusModal, setStatusModal] = useState<StatusModalState>({
    isOpen: false,
    listingId: null,
    status: '',
    reasonForDecline: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'live' | 'declined' | null>(null);

  const handleStatusUpdate = async () => {
    if (!statusModal.listingId || !pendingStatus) return;
    
    setIsSubmitting(true);
    
    const payload = pendingStatus === 'declined' ? {
      status: pendingStatus,
      reasonForDecline: statusModal.reasonForDecline
    } : {
      status: pendingStatus
    };
    
    try {
      const response = await apiClientAdmin.patch(`/products/status/${statusModal.listingId}`, payload);
       console.log("admin dash", response);
      // Close the modal and reset states
      setStatusModal({
        isOpen: false,
        listingId: null,
        status: '',
        reasonForDecline: ''
      });
      setShowConfirmation(false);
      setPendingStatus(null);

      // Refresh the dashboard data
      const refreshResponse = await apiClientAdmin.get('/admins/dashboard');
      setDashboardData(refreshResponse.data.data);
      
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStatusModal = (listingId: string, currentStatus: string) => {
    setStatusModal({
      isOpen: true,
      listingId,
      status: currentStatus as 'live' | 'declined',
      reasonForDecline: ''
    });
  };

  // const showStatusModalWithConfirmation = () => {
  //   setPendingStatus(statusModal.status as 'live' | 'declined');
  //   setShowConfirmation(true);
  // };


  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClientAdmin.get('/admins/dashboard');
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    // fetchDashboardData();

    fetchDashboardData();
  }, [])

  // Prepare chart data
  const chartData = dashboardData?.analytics?.monthlyListings?.length 
    ? dashboardData.analytics.monthlyListings.map((item: { monthName: string; count: number }) => ({
        name: item.monthName.slice(0, 3),
        value: item.count
      }))
    : emptyChartData

  // const hasData = !!dashboardData && (
  // //   dashboardData.metrics.totalListings > 0 || 
  // //   dashboardData.analytics.monthlyListings.some((item: { count: number }) => item.count > 0) ||
  // //   dashboardData.recentListings.length > 0
  // // )

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading dashboard data...</p>
        </div>
        {/* Status Update Modal */}
        <StatusUpdateModal
          statusModal={statusModal}
          setStatusModal={setStatusModal}
          isSubmitting={isSubmitting}
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          pendingStatus={pendingStatus}
          handleStatusUpdate={handleStatusUpdate}
          setPendingStatus={setPendingStatus}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 md:mb-12">
        {/* Mobile - Horizontal Scroll */}
        <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className="hover:text-white font-medium">Total Listings</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">
              {dashboardData?.metrics?.totalListings?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className="hover:text-white font-medium">Active Users</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">
              {dashboardData?.metrics?.activeUsers?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className="hover:text-white font-medium">Paid Plan %</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">
              {dashboardData?.metrics?.paidVsFreePlanPercentage || '0'}%
            </p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm flex-shrink-0" style={{ width: '280px' }}>
            <h3 className="hover:text-white font-medium">Reports</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">
              {dashboardData?.metrics?.reports?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Desktop - Grid */}
        <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className="font-medium">Total Listings</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">
              {dashboardData?.metrics?.totalListings?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className="font-medium">Active Users</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">
              {dashboardData?.metrics?.activeUsers?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className="font-medium">Paid Plan %</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">
              {dashboardData?.metrics?.paidVsFreePlanPercentage || '0'}%
            </p>
          </div>

          <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
            <h3 className="font-medium">Reports</h3>
            <p className="text-3xl font-bold hover:text-white mt-1">
              {dashboardData?.metrics?.reports?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs
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
      </Tabs> */}

      {/* Chart Section */}
      {dashboardData?.analytics?.monthlyListings?.some(item => item.count > 0) ? (
        <div className="mb-12 bg-white p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Monthly Listings</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a0066" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1a0066" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#666' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} listings`, 'Listings']}
                  labelFormatter={(label) => `${label} ${new Date().getFullYear()}`}
                />
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
      ) : (
        <div className="mb-12 bg-white p-12 rounded-lg text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <Image
                src={'/analytics.png'}
                width={80}
                height={80}
                alt="No analytics data"
              />
            </div>
            <h3 className="text-xl font-medium mb-2">No analysis</h3>
            <p className="text-gray-500">You currently have no analysis to display</p>
          </div>
        </div>
      )}

      {/* Recent Listings Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Listings</h2>
          {dashboardData?.recentListings && dashboardData?.recentListings?.length > 0 ? (
            <Button variant="link" className="text-[#1a0066] p-0 h-auto">
              See all
            </Button>
          ) : null}
        </div>

        {!dashboardData?.recentListings?.length ? (
          <div className="bg-white p-12 rounded-lg text-center border">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4">
                <Image
                  src={'/box.png'}
                  width={80}
                  height={80}
                  alt="No recent listings"
                />
              </div>
              <h3 className="text-xl font-medium mb-2">No recent listings</h3>
              <p className="text-gray-500">You currently have no recent listings to display</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium bg-gray-50 border-b">
              <div className="col-span-5">Details</div>
              <div className="col-span-2">User</div>
              <div className="col-span-2">Plan</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            <div className="divide-y">
              {dashboardData.recentListings.slice(0, 5).map((listing) => {
                return (
                  <div key={listing.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                    <div className="col-span-5 flex items-center space-x-3">
                      <Link href={`/admin/dashboard/${listing.id}`}>
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={listing.details.primaryImage || "/placeholder.svg"}
                          alt={listing.details.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      </Link>
                      <div>
                        <p className="font-medium text-sm">{listing.details.name}</p>
                        <p className="text-xs text-gray-500">{listing.details.category}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={listing.user.profilePicture} alt={listing.user.name} />
                        <AvatarFallback>
                          {listing.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{listing.user.name}</span>
                    </div>

                    <div className="col-span-2">
                      <Badge 
                        variant={listing.plan.type.includes('Premium') ? 'default' : 'outline'}
                        className={`text-xs ${listing.plan.type.includes('Free') ? 'bg-gray-100' : ''}`}
                      >
                        {listing.plan.type}
                      </Badge>
                    </div>

                    <div className="col-span-2">
                      <Badge
                        variant={
                          listing.status.value === 'live' ? 'default' : 
                          listing.status.value === 'reviewing' ? 'secondary' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {listing.status.label}
                      </Badge>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => toggleDropdown(listing.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {activeDropdown === listing.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              {/* <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Edit
                              </button> */}
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                               onClick={()=>{router.push(`/admin/dashboard/${listing.id}`)}}
                              >
                                See details
                              </button>
                              <button 
                                onClick={() => openStatusModal(listing.id, listing.status.value.toLowerCase())}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Update Status
                              </button>
                              {/* <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                Delete
                              </button> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Status Update Modal */}
        <StatusUpdateModal
          statusModal={statusModal}
          setStatusModal={setStatusModal}
          isSubmitting={isSubmitting}
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          pendingStatus={pendingStatus}
          handleStatusUpdate={handleStatusUpdate}
          setPendingStatus={setPendingStatus}
        />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { apiClientAdmin } from "@/lib/interceptor";
import { toast } from "sonner";
import Link from "next/link";

// Types and Components
import { DashboardData, StatusModalState } from "@/types/admin-dashboard";
import StatusUpdateModal from "@/components/admin/dashboard/StatusUpdateModal";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import AnalyticsChart from "@/components/admin/dashboard/AnalyticsChart";
import EmptyStates from "@/components/admin/dashboard/EmptyStates";
import RecentListings from "@/components/admin/dashboard/RecentListings";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [statusModal, setStatusModal] = useState<StatusModalState>({
    isOpen: false,
    listingId: null,
    status: "",
    reasonForDecline: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "live" | "declined" | null
  >(null);

  const handleStatusUpdate = async () => {
    if (!statusModal.listingId || !pendingStatus) return;

    setIsSubmitting(true);

    const payload =
      pendingStatus === "declined"
        ? {
            status: pendingStatus,
            reasonForDecline: statusModal.reasonForDecline,
          }
        : {
            status: pendingStatus,
          };

    try {
      const response = await apiClientAdmin.patch(
        `/products/status/${statusModal.listingId}`,
        payload
      );
      console.log("admin dash", response);
      // Close the modal and reset states
      setStatusModal({
        isOpen: false,
        listingId: null,
        status: "",
        reasonForDecline: "",
      });
      setShowConfirmation(false);
      setPendingStatus(null);

      // Refresh the dashboard data
      const refreshResponse = await apiClientAdmin.get("/admins/dashboard");
      setDashboardData(refreshResponse.data.data);

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStatusModal = (listingId: string, currentStatus: string) => {
    setStatusModal({
      isOpen: true,
      listingId,
      status: currentStatus as "live" | "declined",
      reasonForDecline: "",
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
        const response = await apiClientAdmin.get("/admins/dashboard");
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // const hasData = !!dashboardData && (
  // //   dashboardData.metrics.totalListings > 0 ||
  // //   dashboardData.analytics.monthlyListings.some((item: { count: number }) => item.count > 0) ||
  // //   dashboardData.recentListings.length > 0
  // // )

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

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
      <StatsCards dashboardData={dashboardData} />

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
      {dashboardData?.analytics?.monthlyListings?.some(
        (item) => item.count > 0
      ) ? (
        <AnalyticsChart dashboardData={dashboardData} />
      ) : (
        <EmptyStates type="chart" />
      )}

      {/* Recent Listings Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Listings</h2>
          {dashboardData?.recentListings &&
          dashboardData?.recentListings?.length > 0 ? (
            <Link href="/admin/listings">
              <button className="text-[#1a0066] underline hover:no-underline">
                See all
              </button>
            </Link>
          ) : null}
        </div>

        {dashboardData?.recentListings &&
        dashboardData.recentListings.length > 0 ? (
          <RecentListings
            dashboardData={dashboardData}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            openStatusModal={openStatusModal}
          />
        ) : (
          <EmptyStates type="listings" />
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

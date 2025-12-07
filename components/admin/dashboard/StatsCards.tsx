import { DashboardData } from "@/types/admin-dashboard";

interface StatsCardsProps {
  dashboardData: DashboardData | null;
}

const StatsCards = ({ dashboardData }: StatsCardsProps) => {
  return (
    <div className="mb-8 md:mb-12">
      {/* Mobile - 2 per row grid */}
      <div className="md:hidden grid grid-cols-2 gap-4 px-4">
        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <h3 className="hover:text-white font-medium text-base md:text-lg">
            Total Listings
          </h3>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.totalListings?.toLocaleString() || "0"}
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <h3 className="hover:text-white font-medium text-base md:text-lg">
            Active Users
          </h3>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.activeUsers?.toLocaleString() || "0"}
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <h3 className="hover:text-white font-medium text-base md:text-lg">
            Paid Plan %
          </h3>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.paidVsFreePlanPercentage || "0"}%
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <h3 className="hover:text-white font-medium text-base md:text-lg">
            Reports
          </h3>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.reports?.toLocaleString() || "0"}
          </p>
        </div>
      </div>

      {/* Desktop - Grid */}
      <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8">
        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <h3 className="font-medium">Total Listings</h3>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.totalListings?.toLocaleString() || "0"}
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <h3 className="font-medium">Active Users</h3>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.activeUsers?.toLocaleString() || "0"}
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <h3 className="font-medium">Paid Plan %</h3>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.paidVsFreePlanPercentage || "0"}%
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <h3 className="font-medium">Reports</h3>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.reports?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

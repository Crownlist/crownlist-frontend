import { DashboardData } from "@/types/admin-dashboard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface StatsCardsProps {
  dashboardData: DashboardData | null;
}

const StatsCards = ({ dashboardData }: StatsCardsProps) => {
  // Derive helpful context from analytics
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const monthlyListings = dashboardData?.analytics?.monthlyListings || [];
  const monthlySubscriptions =
    dashboardData?.analytics?.monthlySubscriptions || [];

  const listingsThisMonth =
    monthlyListings.find((m) => m.month === currentMonth)?.count ??
    monthlyListings
      .slice()
      .reverse()
      .find((m) => m.count > 0)?.count ??
    0;

  const paidSubsThisMonth =
    monthlySubscriptions.find((m) => m.month === currentMonth)?.count ??
    monthlySubscriptions
      .slice()
      .reverse()
      .find((m) => m.count > 0)?.count ??
    0;

  const paidPct = dashboardData?.metrics?.paidVsFreePlanPercentage ?? 0;
  const freePct = Math.max(0, 100 - paidPct);

  return (
    <div className="mb-8 md:mb-12">
      {/* Mobile - 2 per row grid */}
      <div className="md:hidden grid grid-cols-2 gap-4 px-4">
        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            <h3 className="hover:text-white font-medium text-base md:text-lg">
              Total Listings
            </h3>
            <Tooltip>
              <TooltipTrigger
                aria-label="Info"
                className="text-muted-foreground"
              >
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>All currently active listings</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.totalListings?.toLocaleString() || "0"}
          </p>
          <p className="text-xs mt-1 opacity-70">
            New this month: {listingsThisMonth.toLocaleString()}
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            <h3 className="hover:text-white font-medium text-base md:text-lg">
              Active Users
            </h3>
            <Tooltip>
              <TooltipTrigger
                aria-label="Info"
                className="text-muted-foreground"
              >
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                Users with currently active accounts
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.activeUsers?.toLocaleString() || "0"}
          </p>
          <p className="text-xs mt-1 opacity-70">
            New paid subs this month: {paidSubsThisMonth.toLocaleString()}
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            <h3 className="hover:text-white font-medium text-base md:text-lg">
              Paid vs Free
            </h3>
            <Tooltip>
              <TooltipTrigger
                aria-label="Info"
                className="text-muted-foreground"
              >
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>Current plan distribution</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-3xl font-bold hover:text-white mt-1">{paidPct}%</p>
          <p className="text-xs mt-1 opacity-70">
            Paid {paidPct}% • Free {freePct}%
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            <h3 className="hover:text-white font-medium text-base md:text-lg">
              Reports
            </h3>
            <Tooltip>
              <TooltipTrigger
                aria-label="Info"
                className="text-muted-foreground"
              >
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>Open reports requiring attention</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.reports?.toLocaleString() || "0"}
          </p>
        </div>
      </div>

      {/* Desktop - Grid */}
      <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8">
        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            <h3 className="font-medium">Total Listings</h3>
            <Tooltip>
              <TooltipTrigger
                aria-label="Info"
                className="text-muted-foreground"
              >
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>All currently active listings</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.totalListings?.toLocaleString() || "0"}
          </p>
          <p className="text-xs mt-1 opacity-70">
            New this month: {listingsThisMonth.toLocaleString()}
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            <h3 className="font-medium">Active Users</h3>
            <Tooltip>
              <TooltipTrigger
                aria-label="Info"
                className="text-muted-foreground"
              >
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                Users with currently active accounts
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.activeUsers?.toLocaleString() || "0"}
          </p>
          <p className="text-xs mt-1 opacity-70">
            New paid subs this month: {paidSubsThisMonth.toLocaleString()}
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            <h3 className="font-medium">Paid vs Free</h3>
            <Tooltip>
              <TooltipTrigger
                aria-label="Info"
                className="text-muted-foreground"
              >
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>Current plan distribution</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-3xl font-bold hover:text-white mt-1">{paidPct}%</p>
          <p className="text-xs mt-1 opacity-70">
            Paid {paidPct}% • Free {freePct}%
          </p>
        </div>

        <div className="bg-white hover:text-white hover:bg-[#1a0066] p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            <h3 className="font-medium">Reports</h3>
            <Tooltip>
              <TooltipTrigger
                aria-label="Info"
                className="text-muted-foreground"
              >
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>Open reports requiring attention</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-3xl font-bold hover:text-white mt-1">
            {dashboardData?.metrics?.reports?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

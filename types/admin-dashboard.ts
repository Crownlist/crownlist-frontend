// Types for Admin Dashboard
export type DashboardData = {
  metrics: {
    totalListings: number;
    activeUsers: number;
    paidVsFreePlanPercentage: number;
    reports: number;
  };
  analytics: {
    year: number;
    monthlyListings: Array<{
      month: number;
      monthName: string;
      year: number;
      count: number;
      totalValue: number;
    }>;
    monthlySubscriptions: Array<{
      month: number;
      monthName: string;
      year: number;
      count: number;
    }>;
  };
  recentListings: Array<{
    id: string;
    details: {
      name: string;
      primaryImage: string;
      category: string;
      subCategory: string;
    };
    user: {
      name: string;
      customId: string;
      profilePicture: string;
      accountType?: string;
    };
    plan: {
      type: string;
      icon: string;
    };
    status: {
      label: string;
      value: string;
    };
    timestamp: string;
  }>;
};

export interface StatusModalState {
  isOpen: boolean;
  listingId: string | null;
  status: "live" | "declined" | "";
  reasonForDecline: string;
}

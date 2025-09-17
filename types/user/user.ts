export interface User {
  _id: string;
  fullName: string;
  email: string;
  userCustomId: string;
  authMethod: string;
  accountType: 'User' | 'Seller' | 'Admin';
  profilePicture: string;
  isVerified: boolean;
  isAdmin: boolean;
  finishTourGuide: boolean;
  createdAt: string;
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  id: string;
}

export interface UsersResponse {
  status: string;
  data: {
    users: User[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    appliedFilters: {
      limit: string;
      startDate: string;
      endDate: string;
    };
  };
  message?: string;
}

// Product Request Types
export interface ProductRequestImage {
  _id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface ProductRequestUser {
  _id: string;
  fullName: string;
  email: string;
  accountType: string;
  profilePicture: string;
  id: string;
}

export interface ProductRequestCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductRequest {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: ProductRequestImage[];
  user: ProductRequestUser;
  phone: string;
  category: ProductRequestCategory;
  subCategory: ProductRequestCategory;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductRequestsResponse {
  status: string;
  data: {
    productRequests: ProductRequest[];
    pagination: PaginationInfo;
  };
}

export interface ProductRequestsResponseAdmin {
  status: string;
  data: {
    data: {
      productRequests: ProductRequest[];
      pagination: PaginationInfo;
    }
  };
}

export interface ProductRequestDetailsResponse {
  status: string;
  data: {
    productRequest: ProductRequest;
  };
}

export interface ProductRequestSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  userType?: "seller" | "buyer";
  category?: string;
  subCategory?: string;
}

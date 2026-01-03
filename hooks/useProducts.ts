import { useCallback, useEffect, useState } from "react";
import { apiClientPublic } from "@/lib/interceptor";

export interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images?: {
    url: string;
    altText?: string;
    isPrimary?: boolean;
    _id: string;
  }[];
  price?: { currentPrice?: number; discountedPrice?: number };
  likes?: { totalLikes?: number; likedBy?: string[] };
  ratings?: { averageRating?: number; totalRatings?: number };
  listingLocation?: { country?: string; city?: string };
  category?: string;
  subCategory?: string;
  keywords?: string[];
  features?: string[];
  isFeatured?: boolean;
  status?: string;
  facility?: {
    _id?: string;
    facilities?: { label?: string; value?: string; _id?: string }[];
  };
  seller?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PaginationInfo {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export const useProducts = (options?: {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
}) => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/products";
      const params = new URLSearchParams();

      if (options?.page) params.append("page", options.page.toString());
      if (options?.limit) params.append("limit", options.limit.toString());
      if (options?.search) params.append("search", options.search);
      if (options?.location) params.append("location", options.location);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await apiClientPublic.get(url);
      const data = res?.data;
      const list = data?.products || res?.data?.products || [];
      setProducts(Array.isArray(list) ? list : []);

      if (
        data &&
        typeof data === "object" &&
        ("totalProducts" in data || "totalPages" in data)
      ) {
        setPagination({
          totalProducts: data.totalProducts,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          limit: data.limit,
        });
      } else {
        setPagination(null);
      }
    } catch {
      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, pagination, fetchProducts };
};

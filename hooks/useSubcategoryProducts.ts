import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClientPublic } from "@/lib/interceptor";
import { Product, ProductsResponse } from "@/types/product/product";

interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "oldest";
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export interface SubcategoryProductsData {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// React Query based hook for the subcategory page
export const useSubcategoryProductsQuery = (
  subcategorySlug: string,
  options: {
    page?: number;
    limit?: number;
    sort?: string;
    isFeatured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  } = {}
) => {
  const queryKey = [
    "subcategory-products",
    subcategorySlug,
    options.page,
    options.limit,
    options.sort,
    options.isFeatured,
    options.minPrice,
    options.maxPrice,
    options.location,
  ];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<SubcategoryProductsData> => {
      const queryParams = new URLSearchParams();
      queryParams.append("subcategory_slug", subcategorySlug);

      if (options.isFeatured) queryParams.append("isFeatured", "true");
      if (options.page) queryParams.append("page", options.page.toString());
      if (options.limit) queryParams.append("limit", options.limit.toString());
      if (options.sort) queryParams.append("sort", options.sort);
      if (options.minPrice !== undefined)
        queryParams.append("minPrice", options.minPrice.toString());
      if (options.maxPrice !== undefined)
        queryParams.append("maxPrice", options.maxPrice.toString());
      if (options.location) queryParams.append("location", options.location);

      const response: ProductsResponse = await apiClientPublic.get(
        `/products?${queryParams.toString()}`
      );
      const data = response;

      return {
        products: data.data?.products || [],
        totalProducts: data.data?.totalProducts || 0,
        totalPages: data.data?.totalPages || 0,
        currentPage: data.data?.currentPage || 1,
        limit: data.data?.limit || options.limit || 10,
      };
    },
    enabled: !!subcategorySlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useSubcategoryProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch paginated products for a specific subcategory
  const fetchProductsBySubcategory = useCallback(
    async (
      subcategorySlug: string,
      params: PaginationParams = {},
      isFeatured = false
    ): Promise<SubcategoryProductsData> => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        queryParams.append("subcategory_slug", subcategorySlug);

        if (isFeatured) queryParams.append("isFeatured", "true");
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.sort) queryParams.append("sort", params.sort);
        if (params.minPrice)
          queryParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice)
          queryParams.append("maxPrice", params.maxPrice.toString());
        if (params.location) queryParams.append("location", params.location);

        const response = await apiClientPublic.get(
          `/products?${queryParams.toString()}`
        );
        const data: ProductsResponse = response.data;

        return {
          products: data.data?.products || [],
          totalProducts: data.data?.totalProducts || 0,
          totalPages: data.data?.totalPages || 0,
          currentPage: data.data?.currentPage || 1,
          limit: data.data?.limit || params.limit || 10,
        };
      } catch (error) {
        console.log(
          `Error fetching products for subcategory ${subcategorySlug}:`,
          error
        );
        setError("Failed to fetch products");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch products for multiple subcategories
  const fetchProductsForSubcategories = useCallback(
    async (
      subcategoryIds: string[],
      isFeatured = true
    ): Promise<{ [subcategoryId: string]: Product[] }> => {
      try {
        setLoading(true);
        setError(null);

        const results: { [subcategoryId: string]: Product[] } = {};

        // Fetch products for each subcategory
        for (const subcategoryId of subcategoryIds) {
          const data = await fetchProductsBySubcategory(
            subcategoryId,
            {},
            isFeatured
          );
          results[subcategoryId] = data.products;
        }

        return results;
      } catch (error) {
        console.log("Error fetching products for subcategories:", error);
        setError("Failed to fetch products");
        return {};
      } finally {
        setLoading(false);
      }
    },
    [fetchProductsBySubcategory]
  );

  return {
    loading,
    error,
    fetchProductsBySubcategory,
    fetchProductsForSubcategories,
  };
};

import { useQuery } from "@tanstack/react-query";
import { apiClientPublic } from "@/lib/interceptor";
import { Subcategory } from "@/types/subcategory";

interface SubcategoryResponse {
  status: string;
  data: {
    subCategory: Subcategory;
    products: any[]; // Not needed here
  };
  meta: {
    page: number;
    limit: number;
  };
}

export const useSubcategoryDetails = (subcategorySlug: string) => {
  const query = useQuery({
    queryKey: ["subcategory-details", subcategorySlug],
    queryFn: async (): Promise<Subcategory> => {
      const response: SubcategoryResponse = await apiClientPublic.get(
        `/subcategories/slug/${subcategorySlug}`
      );
      return response.data.subCategory;
    },
    enabled: !!subcategorySlug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

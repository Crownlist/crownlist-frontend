import { useQuery } from "@tanstack/react-query";
import { apiClientPublic } from "@/lib/interceptor";

interface ResourceOption {
  label: string;
  value: string;
}

interface ResourceResponse {
  status: string;
  data: {
    value?: string[]; // Array of string values from the API
    options?: ResourceOption[]; // Fallback to options format
  };
}

export const useResourceOptions = (resourcePath: string) => {
  const query = useQuery({
    queryKey: ["resource-options", resourcePath],
    queryFn: async (): Promise<ResourceOption[]> => {
      const response: ResourceResponse = await apiClientPublic.get(
        resourcePath
      );

      // Handle the response format from the backend
      // If data.value is an array of strings, convert to ResourceOption format
      const data = response?.data;
      const values = Array.isArray(data?.value) ? data.value : [];

      // Convert string array to ResourceOption format
      return values.map((val) => ({
        label: val,
        value: val,
      }));
    },
    enabled: !!resourcePath,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

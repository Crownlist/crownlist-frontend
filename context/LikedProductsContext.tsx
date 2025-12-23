"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { apiClientUser } from "@/lib/interceptor";
import { ApiProduct } from "@/hooks/useProducts";

interface LikedProductsContextType {
  products: ApiProduct[];
  meta: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  toggleLike: (productId: string) => Promise<{ success: boolean }>;
}

const LikedProductsContext = createContext<
  LikedProductsContextType | undefined
>(undefined);

export const LikedProductsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = (await apiClientUser.get(
        "/products/liked?limit=1000"
      )) as unknown as {
        data?: { products?: ApiProduct[] };
        products?: ApiProduct[];
      };
      const list = res?.data?.products || res?.products || [];
      const metaData = (res?.data as Record<string, unknown>) || {};
      setProducts(Array.isArray(list) ? list : []);
      setMeta(metaData);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch liked products";
      setError(errorMessage);
      setProducts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleLike = useCallback(
    async (productId: string) => {
      try {
        await apiClientUser.post(`/products/like/${productId}`);
        // After toggling, refetch the liked products to stay in sync
        await fetchLikedProducts();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to toggle like";
        console.error("Failed to toggle like:", err);
        throw new Error(errorMessage);
      }
    },
    [fetchLikedProducts]
  );

  useEffect(() => {
    fetchLikedProducts();
  }, [fetchLikedProducts]);

  return (
    <LikedProductsContext.Provider
      value={{
        products,
        meta,
        loading,
        error,
        refetch: fetchLikedProducts,
        toggleLike,
      }}
    >
      {children}
    </LikedProductsContext.Provider>
  );
};

export const useLikedProductsContext = () => {
  const context = useContext(LikedProductsContext);
  if (context === undefined) {
    throw new Error(
      "useLikedProductsContext must be used within LikedProductsProvider"
    );
  }
  return context;
};

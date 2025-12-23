"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClientUser } from "@/lib/interceptor";
import { ApiProduct } from "./useProducts";

export const useLikedProducts = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await apiClientUser.get("/products/liked?limit=1000");
      const list = res?.data?.products || res?.products || [];
      const metaData = res?.data || {};
      setProducts(Array.isArray(list) ? list : []);
      setMeta(metaData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch liked products");
      setProducts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleLike = useCallback(
    async (productId: string) => {
      try {
        const res = await apiClientUser.post(`/products/like/${productId}`);
        // After toggling, refetch the liked products to stay in sync
        await fetchLikedProducts();
        return { success: true };
      } catch (err: any) {
        console.error("Failed to toggle like:", err);
        throw new Error(err.message || "Failed to toggle like");
      }
    },
    [fetchLikedProducts]
  );

  useEffect(() => {
    fetchLikedProducts();
  }, [fetchLikedProducts]);

  return {
    products,
    meta,
    loading,
    error,
    refetch: fetchLikedProducts,
    toggleLike,
  };
};

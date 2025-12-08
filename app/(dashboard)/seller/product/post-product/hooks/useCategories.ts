import { useState, useEffect, useCallback } from "react";
import { apiClientUser } from "@/lib/interceptor";
import { Category, Subcategory, LoadingState } from "../types";

export const useCategories = (selectedCategory?: string | null) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    categories: true,
    subcategories: false,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClientUser.get("/categories");
        console.log("Categories response:", response.data);
        const categoriesList =
          response.data?.total || response.data?.data?.total || [];
        console.log("Categories list:", categoriesList);
        setCategories(categoriesList);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category is selected
  const fetchSubcategories = useCallback(async (categoryId: string | null) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, subcategories: true }));
      const response = await apiClientUser.get(`/categories/${categoryId}`);
      console.log("Subcategories response:", response.data);
      const list: Subcategory[] =
        response.data?.subCategories ||
        response.data?.data?.subCategories ||
        [];
      console.log("Subcategories list:", list);
      setSubcategories(list);
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
      setSubcategories([]);
    } finally {
      setLoading((prev) => ({ ...prev, subcategories: false }));
    }
  }, []);

  // Auto-fetch subcategories when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    }
  }, [selectedCategory, fetchSubcategories]);

  return {
    categories,
    subcategories,
    loading,
    fetchSubcategories,
  };
};

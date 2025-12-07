import { useState, useEffect } from "react";
import { apiClientAdmin } from "@/lib/interceptor";
import { Category, Subcategory } from "../types";

export const useAdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategoriesByCat, setSubcategoriesByCat] = useState<
    Record<string, Subcategory[]>
  >({});
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoadingCats(true);
      const res = await apiClientAdmin.get("/categories");
      const cats: Category[] = res?.data?.data?.total || [];
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.log(error);
      // keep non-blocking
    } finally {
      setLoadingCats(false);
    }
  };

  const fetchSubcategories = async (catId: string) => {
    if (!catId) return;
    try {
      setLoadingSubs(true);
      const res = await apiClientAdmin.get(`/categories/${catId}`);
      const subs: Subcategory[] =
        res?.data?.data?.subCategories || res?.data?.subCategories || [];
      setSubcategoriesByCat((prev) => ({
        ...prev,
        [catId]: Array.isArray(subs) ? subs : [],
      }));
    } catch {
      setSubcategoriesByCat((prev) => ({ ...prev, [catId]: [] }));
    } finally {
      setLoadingSubs(false);
    }
  };

  const fetchSubcategory = async (subId: string) => {
    if (!subId) return null;
    try {
      const res = await apiClientAdmin.get(`/subcategories/${subId}`);
      return res?.data?.data || null;
    } catch (e) {
      console.error("Error fetching subcategory:", e);
      return null;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    subcategoriesByCat,
    loadingCats,
    loadingSubs,
    fetchCategories,
    fetchSubcategories,
    fetchSubcategory,
  };
};

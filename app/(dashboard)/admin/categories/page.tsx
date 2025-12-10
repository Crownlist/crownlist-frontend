"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiClientAdmin } from "@/lib/interceptor";
import { CreateCategoryModal } from "@/components/admin/CreateCategoryModal";
import { CategoryTable } from "@/components/admin/CategoryTable";
import { CategoryCardList } from "@/components/admin/CategoryCardList";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  categoryIcon: string;
  status: string;
  createdAt: string;
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await apiClientAdmin.get("/categories");
      console.log("neww", response);
      setCategories(response.data?.data?.total);
    } catch (error) {
      toast.error(`Failed to fetch categories, ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center gap-2 flex-wrap mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <CreateCategoryModal onCategoryCreated={fetchCategories} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading categories...</p>
        </div>
      ) : categories?.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">No categories found</p>
          <CreateCategoryModal onCategoryCreated={fetchCategories} />
        </div>
      ) : (
        <>
          <CategoryTable
            categories={categories}
            onCategoryUpdated={fetchCategories}
            onCategoryDeleted={fetchCategories}
          />
          <CategoryCardList
            categories={categories}
            onCategoryUpdated={fetchCategories}
            onCategoryDeleted={fetchCategories}
          />
        </>
      )}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { apiClientAdmin } from "@/lib/interceptor";
import {
  Category,
  Subcategory,
  SubcategoryFormData,
} from "@/types/subcategory";

export const useSubcategoryManagement = (slug: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const categoryResponse = await apiClientAdmin.get(`/categories/${slug}`);
      setCategory(
        categoryResponse.data?.data?.category || categoryResponse.data
      );
      setSubcategories(categoryResponse.data?.data?.subCategories || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) fetchData();
  }, [slug, fetchData]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", "Subcategory-images");

    const response = await apiClientAdmin.post("/users/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.fileUrl;
  };

  const createSubcategory = async (
    formData: SubcategoryFormData,
    selectedFile: File | null,
    onSuccess: () => void
  ) => {
    if (!category) {
      toast.error("Category not found");
      return;
    }

    let imageUrl = formData.imageUrl;

    if (selectedFile) {
      setUploadingImage(true);
      try {
        imageUrl = await uploadImage(selectedFile);
        toast.success("Image uploaded successfully");
      } catch (uploadError: any) {
        console.error("Image upload error:", uploadError);
        toast.error("Failed to upload image");
        setUploadingImage(false);
        return;
      }
    }

    try {
      setActionLoading(true);

      const subcategoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: imageUrl,
        status: formData.status,
        category: category._id,
        facilities: formData.facilities.map((facility) => {
          const facilityData: any = {
            label: facility.label,
            description: facility.description,
            mandatory: facility.mandatory,
            filterable: facility.filterable,
            isActive: facility.isActive,
            dataType: facility.dataType,
            dataInputType: facility.dataInputType,
          };

          if (facility.dataType === "array") {
            facilityData.selectType = facility.selectType;
          }

          if (["array", "object"].includes(facility.dataType)) {
            facilityData.value = facility.value;
          }

          return facilityData;
        }),
      };

      await apiClientAdmin.post("/subcategories/create", subcategoryData);
      toast.success("Subcategory created successfully");
      fetchData();
      onSuccess();
    } catch (error: any) {
      console.error("Create subcategory error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create subcategory"
      );
    } finally {
      setActionLoading(false);
      setUploadingImage(false);
    }
  };

  const updateSubcategory = async (
    id: string,
    formData: SubcategoryFormData,
    selectedFile: File | null,
    onSuccess: () => void
  ) => {
    let imageUrl = formData.imageUrl;

    if (selectedFile) {
      setUploadingImage(true);
      try {
        imageUrl = await uploadImage(selectedFile);
        toast.success("Image uploaded successfully");
      } catch (uploadError: any) {
        console.error("Image upload error:", uploadError);
        toast.error("Failed to upload image");
        setUploadingImage(false);
        return;
      }
    }

    try {
      setActionLoading(true);

      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: imageUrl,
        status: formData.status,
        facilities: formData.facilities.map((facility) => {
          const facilityData: any = {
            label: facility.label,
            description: facility.description,
            mandatory: facility.mandatory,
            filterable: facility.filterable,
            isActive: facility.isActive,
            dataType: facility.dataType,
            dataInputType: facility.dataInputType,
          };

          if (facility.dataType === "array") {
            facilityData.selectType = facility.selectType;
          }

          if (["array", "object"].includes(facility.dataType)) {
            facilityData.value = facility.value;
          }

          return facilityData;
        }),
      };

      await apiClientAdmin.patch(`/subcategories/update/${id}`, updateData);
      toast.success("Subcategory updated successfully");
      fetchData();
      onSuccess();
    } catch (error: any) {
      console.error("Update subcategory error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update subcategory"
      );
    } finally {
      setActionLoading(false);
      setUploadingImage(false);
    }
  };

  const deleteSubcategory = async (id: string) => {
    try {
      setActionLoading(true);
      await apiClientAdmin.delete(`/subcategories/delete/${id}`);
      setSubcategories((prev) => prev.filter((sub) => sub._id !== id));
      toast.success("Subcategory deleted successfully");
    } catch (error: any) {
      console.error("Delete subcategory error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete subcategory"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return {
    category,
    subcategories,
    loading,
    actionLoading,
    uploadingImage,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };
};

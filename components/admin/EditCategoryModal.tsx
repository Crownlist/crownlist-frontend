/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit, Trash2, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClientAdmin } from "@/lib/interceptor";

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

interface EditCategoryModalProps {
  category: Category;
  onCategoryUpdated: () => void;
  onCategoryDeleted: () => void;
}

export function EditCategoryModal({
  category,
  onCategoryUpdated,
  onCategoryDeleted,
}: EditCategoryModalProps) {
  const [editingCategory, setEditingCategory] = useState<Category>(category);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // File upload states
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  // Inline errors for edit form
  const [editErrors, setEditErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  // Upload image to get URL
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", "Profile-pics");

    const response = await apiClientAdmin.post("/users/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.fileUrl;
  };

  // Handle image file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImageFile(file);

    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Clear URL input when file is selected
      setEditingCategory((prev) => ({ ...prev, imageUrl: "" }));
    } else {
      setImagePreview(null);
    }
  };

  // Handle icon file selection and preview
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedIconFile(file);

    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setIconPreview(previewUrl);
      // Clear URL input when file is selected
      setEditingCategory((prev) => ({ ...prev, categoryIcon: "" }));
    } else {
      setIconPreview(null);
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    try {
      setLoading(true);

      // Validate required fields before API call (inline)
      const nextErrors: { name?: string; description?: string } = {};
      if (!editingCategory.name.trim())
        nextErrors.name = "Category name is required";
      if (!editingCategory.description.trim())
        nextErrors.description = "Category description is required";
      setEditErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        toast.error("Please fix the highlighted fields");
        return;
      }

      let imageUrl = editingCategory.imageUrl;
      let categoryIcon = editingCategory.categoryIcon;

      // If user selected a new image file, upload it first
      if (selectedImageFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(selectedImageFile);
          toast.success("Image uploaded successfully");
        } catch (uploadError) {
          toast.error(`Failed to upload image, ${uploadError}`);
          return; // Stop if image upload fails
        } finally {
          setUploadingImage(false);
        }
      }

      // If user selected a new icon file, upload it first
      if (selectedIconFile) {
        setUploadingIcon(true);
        try {
          categoryIcon = await uploadImage(selectedIconFile);
          toast.success("Icon uploaded successfully");
        } catch (uploadError) {
          toast.error(`Failed to upload icon, ${uploadError}`);
          return; // Stop if icon upload fails
        } finally {
          setUploadingIcon(false);
        }
      }

      // Prepare final data with uploaded URLs
      const updateData = {
        ...editingCategory,
        imageUrl: imageUrl,
        categoryIcon: categoryIcon,
      };

      const response = await apiClientAdmin.patch(
        `/categories/update/${editingCategory._id}`,
        updateData
      );

      console.log(response);
      toast.success("Category updated successfully");
      setIsEditModalOpen(false);
      onCategoryUpdated();
    } catch (error) {
      toast.error(`Failed to update category, ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: string | undefined) => {
    try {
      setLoading(true);
      await apiClientAdmin.delete(`/categories/delete/${id}`);
      toast.success("Category deleted successfully");
      setIsEditModalOpen(false);
      onCategoryDeleted();
    } catch (error) {
      toast.error(`Failed to delete category, ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isEditModalOpen}
      onOpenChange={(o) => {
        setIsEditModalOpen(o);
        if (o) {
          setEditingCategory(category);
          setEditErrors({});
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        {editingCategory && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category Name *
                  </label>
                  <Input
                    placeholder="Category Name"
                    value={editingCategory.name}
                    onChange={(e) => {
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      });
                      if (e.target.value.trim())
                        setEditErrors((prev) => ({
                          ...prev,
                          name: undefined,
                        }));
                    }}
                    required
                  />
                  {editErrors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {editErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {editingCategory.status === "active"
                          ? "Active"
                          : "Inactive"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                      <DropdownMenuItem
                        onClick={() =>
                          setEditingCategory({
                            ...editingCategory,
                            status: "active",
                          })
                        }
                      >
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setEditingCategory({
                            ...editingCategory,
                            status: "inactive",
                          })
                        }
                      >
                        Inactive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Description"
                    value={editingCategory.description}
                    onChange={(e) => {
                      setEditingCategory({
                        ...editingCategory,
                        description: e.target.value,
                      });
                      if (e.target.value.trim())
                        setEditErrors((prev) => ({
                          ...prev,
                          description: undefined,
                        }));
                    }}
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                    rows={3}
                    required
                  />
                  {editErrors.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {editErrors.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1F058F] file:text-white hover:file:bg-[#1F058F]/90"
                  />

                  {/* Show selected file name */}
                  {selectedImageFile && (
                    <p className="text-sm text-gray-600">
                      Selected: {selectedImageFile.name}
                    </p>
                  )}

                  {/* Image preview */}
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    </div>
                  )}

                  {/* Or allow manual URL input */}
                  <div className="text-sm text-gray-500">
                    Or paste image URL:
                  </div>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={editingCategory.imageUrl}
                    onChange={(e) => {
                      setEditingCategory({
                        ...editingCategory,
                        imageUrl: e.target.value,
                      });
                      // Clear file selection if URL is entered
                      if (e.target.value) {
                        setSelectedImageFile(null);
                        setImagePreview(null);
                      }
                    }}
                  />
                </div>

                {/* Icon Upload Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Icon</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1F058F] file:text-white hover:file:bg-[#1F058F]/90"
                  />

                  {/* Show selected icon file name */}
                  {selectedIconFile && (
                    <p className="text-sm text-gray-600">
                      Selected: {selectedIconFile.name}
                    </p>
                  )}

                  {/* Icon preview */}
                  {iconPreview && (
                    <div className="mt-2">
                      <img
                        src={iconPreview}
                        alt="Icon Preview"
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    </div>
                  )}

                  {/* Or allow manual icon URL input */}
                  <div className="text-sm text-gray-500">
                    Or paste icon URL:
                  </div>
                  <Input
                    placeholder="https://example.com/icon.jpg"
                    value={editingCategory.categoryIcon}
                    onChange={(e) => {
                      setEditingCategory({
                        ...editingCategory,
                        categoryIcon: e.target.value,
                      });
                      // Clear file selection if URL is entered
                      if (e.target.value) {
                        setSelectedIconFile(null);
                        setIconPreview(null);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setIsEditModalOpen(false);
              setEditErrors({});
            }}
          >
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button
              className="bg-[#1F058F] hover:bg-[#1F058F]/90"
              onClick={() => {
                handleDeleteCategory(editingCategory?._id);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              className="bg-[#1F058F] hover:bg-[#1F058F]/90"
              onClick={handleUpdateCategory}
              disabled={loading || uploadingImage || uploadingIcon}
            >
              {uploadingImage
                ? "Uploading Image..."
                : uploadingIcon
                ? "Uploading Icon..."
                : loading
                ? "Updating..."
                : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

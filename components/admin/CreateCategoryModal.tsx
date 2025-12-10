/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, ChevronDown } from "lucide-react";
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

interface CreateCategoryModalProps {
  onCategoryCreated: () => void;
}

export function CreateCategoryModal({
  onCategoryCreated,
}: CreateCategoryModalProps) {
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    imageUrl: "",
    categoryIcon: "",
    status: "active",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Inline errors for create form
  const [createErrors, setCreateErrors] = useState<{
    name?: string;
    description?: string;
    image?: string;
    icon?: string;
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

  // Handle file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // clear image url if file picked and clear error
      setNewCategory((prev) => ({ ...prev, imageUrl: prev.imageUrl }));
      setCreateErrors((prev) => ({ ...prev, image: undefined }));
    } else {
      setImagePreview(null);
      setNewCategory({ ...newCategory, imageUrl: "" });
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
      // clear icon url if file picked and clear error
      setNewCategory((prev) => ({ ...prev, categoryIcon: prev.categoryIcon }));
      setCreateErrors((prev) => ({ ...prev, icon: undefined }));
    } else {
      setIconPreview(null);
      setNewCategory({ ...newCategory, categoryIcon: "" });
    }
  };

  // Updated create category handler with two-step process
  const handleCreateCategory = async () => {
    try {
      setLoading(true);

      // Validate required fields before any upload/API calls
      const nextErrors: {
        name?: string;
        description?: string;
        image?: string;
        icon?: string;
      } = {};
      if (!newCategory.name.trim()) {
        nextErrors.name = "Category name is required";
      }
      if (!newCategory.description.trim()) {
        nextErrors.description = "Category description is required";
      }
      // Image required: either selected file or valid URL
      if (!selectedFile && !newCategory.imageUrl.trim()) {
        nextErrors.image =
          "Category image is required (upload a file or paste a URL)";
      }
      // Icon required: either selected file or valid URL
      if (!selectedIconFile && !newCategory.categoryIcon.trim()) {
        nextErrors.icon =
          "Category icon is required (upload a file or paste a URL)";
      }
      setCreateErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        // Also show toast summary
        toast.error("Please fix the highlighted fields");
        return;
      }

      let imageUrl = newCategory.imageUrl;
      let categoryIcon = newCategory.categoryIcon;

      // If user selected a new file, upload it first
      if (selectedFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(selectedFile);
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

      // Now create category with the image and icon URLs (using regular JSON, not FormData)
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        imageUrl: imageUrl,
        categoryIcon: categoryIcon,
        status: newCategory.status,
      };

      const response = await apiClientAdmin.post(
        "/categories/create",
        categoryData
      );

      toast.success(response.data.message);

      // Reset form
      setNewCategory({
        name: "",
        description: "",
        imageUrl: "",
        categoryIcon: "",
        status: "active",
      });
      setSelectedFile(null);
      setSelectedIconFile(null);
      setImagePreview(null);
      setIconPreview(null);
      setIsCreateModalOpen(false);
      onCategoryCreated();
    } catch (error) {
      toast.error(`Failed to create category, ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isCreateModalOpen}
      onOpenChange={(o) => {
        setIsCreateModalOpen(o);
        if (!o) {
          setNewCategory({
            name: "",
            description: "",
            imageUrl: "",
            categoryIcon: "",
            status: "active",
          });
          setSelectedFile(null);
          setSelectedIconFile(null);
          setImagePreview(null);
          setIconPreview(null);
          setCreateErrors({});
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-[#1F058F] hover:bg-[#1F058F]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[700px] max-h-[90dvh] overflow-y-auto xl:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Category Name *
            </label>
            <Input
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => {
                setNewCategory({ ...newCategory, name: e.target.value });
                if (e.target.value.trim())
                  setCreateErrors((prev) => ({ ...prev, name: undefined }));
              }}
              required
            />
          </div>
          {createErrors.name && (
            <p className="text-sm text-red-600">{createErrors.name}</p>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => {
                setNewCategory({
                  ...newCategory,
                  description: e.target.value,
                });
                if (e.target.value.trim())
                  setCreateErrors((prev) => ({
                    ...prev,
                    description: undefined,
                  }));
              }}
              className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
              rows={3}
              required
            />
          </div>
          {createErrors.description && (
            <p className="text-sm text-red-600">{createErrors.description}</p>
          )}

          {/* File upload with preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Image *</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1F058F] file:text-white hover:file:bg-[#1F058F]/90"
            />

            {/* Show selected file name */}
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name}
              </p>
            )}

            {/* Image preview */}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
              </div>
            )}

            {/* Or allow manual URL input */}
            <div className="text-sm text-gray-500">Or paste image URL:</div>
            <Input
              placeholder="https://example.com/image.jpg"
              value={newCategory.imageUrl}
              onChange={(e) => {
                setNewCategory({
                  ...newCategory,
                  imageUrl: e.target.value,
                });
                // Clear file selection if URL is entered
                if (e.target.value) {
                  setSelectedFile(null);
                  setImagePreview(null);
                }
                setCreateErrors((prev) => ({ ...prev, image: undefined }));
              }}
            />
            {createErrors.image && (
              <p className="text-sm text-red-600">{createErrors.image}</p>
            )}
          </div>

          {/* Icon upload with preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Icon *</label>
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
            <div className="text-sm text-gray-500">Or paste icon URL:</div>
            <Input
              placeholder="https://example.com/icon.jpg"
              value={newCategory.categoryIcon}
              onChange={(e) => {
                setNewCategory({
                  ...newCategory,
                  categoryIcon: e.target.value,
                });
                // Clear file selection if URL is entered
                if (e.target.value) {
                  setSelectedIconFile(null);
                  setIconPreview(null);
                }
                setCreateErrors((prev) => ({ ...prev, icon: undefined }));
              }}
            />
            {createErrors.icon && (
              <p className="text-sm text-red-600">{createErrors.icon}</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {newCategory.status === "active" ? "Active" : "Inactive"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuItem
                onClick={() =>
                  setNewCategory({ ...newCategory, status: "active" })
                }
              >
                Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setNewCategory({ ...newCategory, status: "inactive" })
                }
              >
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsCreateModalOpen(false);
              // Reset form when closing
              setNewCategory({
                name: "",
                description: "",
                imageUrl: "",
                categoryIcon: "",
                status: "active",
              });
              setSelectedFile(null);
              setSelectedIconFile(null);
              setImagePreview(null);
              setIconPreview(null);
              setCreateErrors({});
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1F058F] hover:bg-[#1F058F]/90"
            onClick={handleCreateCategory}
            disabled={loading || uploadingImage || uploadingIcon}
          >
            {uploadingImage
              ? "Uploading Image..."
              : uploadingIcon
              ? "Uploading Icon..."
              : loading
              ? "Creating..."
              : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

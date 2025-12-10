/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
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
import { Plus } from "lucide-react";
import { FacilityForm } from "./FacilityForm";
import {
  SubcategoryFormData,
  FormErrors,
  FacilityErrors,
  Facility,
} from "@/types/subcategory";

interface CreateSubcategoryModalProps {
  onCreate: (
    formData: SubcategoryFormData,
    selectedFile: File | null,
    onSuccess: () => void
  ) => void;
  actionLoading: boolean;
  uploadingImage: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateSubcategoryModal = ({
  onCreate,
  actionLoading,
  uploadingImage,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: CreateSubcategoryModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;
  const [formData, setFormData] = useState<SubcategoryFormData>({
    name: "",
    description: "",
    imageUrl: "",
    status: "active",
    facilities: [],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [facilityErrors, setFacilityErrors] = useState<FacilityErrors[]>([]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      status: "active",
      facilities: [],
    });
    setSelectedFile(null);
    setImagePreview(null);
    setErrors({});
    setFacilityErrors([]);
    setIsOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setErrors((prev) => ({ ...prev, image: undefined }));
    } else {
      setImagePreview(null);
      setFormData({ ...formData, imageUrl: "" });
    }
  };

  const handleCreate = () => {
    const nextErrors: FormErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = "Subcategory name is required";
    }
    if (!formData.description.trim()) {
      nextErrors.description = "Subcategory description is required";
    }
    if (!selectedFile) {
      nextErrors.image = "Subcategory image is required";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // Validate facilities
    const facErrors: FacilityErrors[] = [];
    let hasFacilityError = false;
    formData.facilities.forEach((facility, index) => {
      const errs: FacilityErrors = {};
      if (!facility.label.trim()) {
        errs.label = "Label is required";
        hasFacilityError = true;
      }
      if (
        ["array", "object"].includes(facility.dataType) &&
        !facility.value?.trim()
      ) {
        errs.value = `Value is required for ${facility.dataType}`;
        hasFacilityError = true;
      }
      if (facility.dataType === "array" && !facility.selectType) {
        errs.selectType = "Select Type is required for array";
        hasFacilityError = true;
      }
      facErrors[index] = errs;
    });
    setFacilityErrors(facErrors);
    if (hasFacilityError) {
      return;
    }

    onCreate(formData, selectedFile, resetForm);
  };

  const addFacility = () => {
    setFormData((prev) => ({
      ...prev,
      facilities: [
        ...prev.facilities,
        {
          label: "",
          description: "",
          mandatory: false,
          filterable: false,
          isActive: true,
          dataType: "string",
          dataInputType: "text",
          value: "",
        },
      ],
    }));
    setFacilityErrors((prev) => [...prev, {}]);
  };

  const updateFacility = (index: number, field: keyof Facility, value: any) => {
    setFormData((prev) => {
      const updatedFacilities = [...prev.facilities];
      updatedFacilities[index] = {
        ...updatedFacilities[index],
        [field]: value,
      };
      return { ...prev, facilities: updatedFacilities };
    });
    setFacilityErrors((prev) => {
      const next = [...prev];
      const errs = { ...(next[index] || {}) };
      if (field === "label" && String(value).trim()) errs.label = undefined;
      if (field === "value" && String(value).trim()) errs.value = undefined;
      if (field === "selectType" && value) errs.selectType = undefined;
      next[index] = errs;
      return next;
    });
  };

  const removeFacility = (index: number) => {
    setFormData((prev) => {
      const updatedFacilities = [...prev.facilities];
      updatedFacilities.splice(index, 1);
      return { ...prev, facilities: updatedFacilities };
    });
    setFacilityErrors((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1F058F] mb-3 hover:bg-[#1F058F]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Subcategory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Subcategory</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subcategory Name *
                </label>
                <Input
                  placeholder="Subcategory Name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (e.target.value.trim())
                      setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.status === "active" ? "Active" : "Inactive"}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, status: "active" })
                      }
                    >
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFormData({ ...formData, status: "inactive" })
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
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (e.target.value.trim())
                      setErrors((prev) => ({
                        ...prev,
                        description: undefined,
                      }));
                  }}
                  required
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image *
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1F058F] file:text-white hover:file:bg-[#1F058F]/90"
                />

                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedFile.name}
                  </p>
                )}

                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                  </div>
                )}
                {errors.image && (
                  <p className="text-sm text-red-600 mt-2">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          <FacilityForm
            facilities={formData.facilities}
            onUpdateFacility={updateFacility}
            onAddFacility={addFacility}
            onRemoveFacility={removeFacility}
            errors={facilityErrors}
            isEdit={false}
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={actionLoading || uploadingImage}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1F058F] hover:bg-[#1F058F]/90"
            onClick={handleCreate}
            disabled={actionLoading || uploadingImage}
          >
            {uploadingImage
              ? "Uploading..."
              : actionLoading
              ? "Creating..."
              : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

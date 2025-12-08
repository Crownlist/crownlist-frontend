/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  Facility,
  DATA_TYPES,
  SELECT_TYPES,
  FacilityErrors,
} from "@/types/subcategory";

interface FacilityFormProps {
  facilities: Facility[];
  onUpdateFacility: (index: number, field: keyof Facility, value: any) => void;
  onAddFacility: () => void;
  onRemoveFacility: (index: number) => void;
  errors: FacilityErrors[];
  isEdit?: boolean;
}

export const FacilityForm = ({
  facilities,
  onUpdateFacility,
  onAddFacility,
  onRemoveFacility,
  errors,
  isEdit = false,
}: FacilityFormProps) => {
  return (
    <div className="border-t pt-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Facilities</h3>
      </div>

      {facilities.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          No facilities added yet. Click &quot;Add Facility&quot; to get
          started.
        </p>
      ) : (
        <div className="space-y-6">
          {facilities.map((facility: any, index: any) => (
            <div
              key={facility._id || index}
              className="border rounded-lg p-6 bg-gray-50"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-lg">Facility #{index + 1}</h4>
                <Button
                  className={
                    isEdit
                      ? "bg-[#1F058F] hover:bg-[#1F058F]/90"
                      : "text-[#1F058F] border-[#1F058F] bg-white hover:bg-[#1F058F]/10"
                  }
                  size="sm"
                  onClick={() => onRemoveFacility(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Label *
                  </label>
                  <Input
                    value={facility.label}
                    className="bg-white"
                    onChange={(e) =>
                      onUpdateFacility(index, "label", e.target.value)
                    }
                    placeholder="e.g., Brand, Color, Size"
                    required
                  />
                  {errors?.[index]?.label && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors[index].label}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data Type *
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {facility.dataType}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                      {DATA_TYPES.map((type) => (
                        <DropdownMenuItem
                          key={type}
                          onClick={() =>
                            onUpdateFacility(index, "dataType", type)
                          }
                        >
                          {type}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Type {facility.dataType === "array" && "*"}
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        disabled={facility.dataType !== "array"}
                      >
                        {facility.selectType || "Select Type"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[--radix-dropdown-menu-trigger-width]">
                      {SELECT_TYPES.map((type) => (
                        <DropdownMenuItem
                          key={type}
                          onClick={() =>
                            onUpdateFacility(index, "selectType", type)
                          }
                        >
                          {type}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {facility.dataType === "array" &&
                    errors?.[index]?.selectType && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors[index].selectType}
                      </p>
                    )}
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-1">
                    Value{" "}
                    {["array", "object"].includes(facility.dataType) && "*"}
                  </label>
                  <Input
                    value={facility.value || ""}
                    onChange={(e) =>
                      onUpdateFacility(index, "value", e.target.value)
                    }
                    placeholder={
                      facility.dataType === "array"
                        ? "Comma-separated values or URL"
                        : facility.dataType === "object"
                        ? "JSON object or URL"
                        : "Optional value"
                    }
                    required={["array", "object"].includes(facility.dataType)}
                    disabled={["boolean", "number", "string"].includes(
                      facility.dataType
                    )}
                    className="bg-white"
                  />
                  {["array", "object"].includes(facility.dataType) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Required for {facility.dataType} data type
                    </p>
                  )}
                  {errors?.[index]?.value && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors[index].value}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description *
                  </label>
                  <textarea
                    value={facility.description}
                    className="bg-white flex min-h-20 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                    onChange={(e) =>
                      onUpdateFacility(index, "description", e.target.value)
                    }
                    placeholder="Description of this facility"
                    required
                    rows={3}
                  />
                </div>
                {/* checkboxes */}
                <div className="space-y-3 sm:flex sm:items-center sm:space-y-0 sm:space-x-2 ">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${isEdit ? "mandatory-edit" : "mandatory"}-${index}`}
                      checked={facility.mandatory}
                      onChange={(e) =>
                        onUpdateFacility(index, "mandatory", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor={`${
                        isEdit ? "mandatory-edit" : "mandatory"
                      }-${index}`}
                      className="text-sm font-medium"
                    >
                      Mandatory
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${
                        isEdit ? "filterable-edit" : "filterable"
                      }-${index}`}
                      checked={facility.filterable}
                      onChange={(e) =>
                        onUpdateFacility(index, "filterable", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor={`${
                        isEdit ? "filterable-edit" : "filterable"
                      }-${index}`}
                      className="text-sm font-medium"
                    >
                      Filterable
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${isEdit ? "active-edit" : "active"}-${index}`}
                      checked={facility.isActive}
                      onChange={(e) =>
                        onUpdateFacility(index, "isActive", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor={`${isEdit ? "active-edit" : "active"}-${index}`}
                      className="text-sm font-medium"
                    >
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Add Facility Button */}
      <div className="flex w-full justify-end mt-4">
        <Button
          size="sm"
          variant="outline"
          className="text-[#1F058F] border-[#1F058F] hover:bg-[#1F058F]/10"
          onClick={onAddFacility}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Facility
        </Button>
      </div>
    </div>
  );
};

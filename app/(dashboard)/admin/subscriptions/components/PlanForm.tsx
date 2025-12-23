import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  Category,
  Subcategory,
  CreatePlanForm,
  ValidationErrors,
} from "../types";
import { Dispatch, SetStateAction, useState } from "react";

interface PlanFormProps {
  formData: CreatePlanForm;
  setFormData: (data: CreatePlanForm) => void;
  featuresInput: string;
  setFeaturesInput: (value: string) => void;
  errors: ValidationErrors;
  setErrors: Dispatch<SetStateAction<ValidationErrors>>;
  categories: Category[];
  subcategoriesByCat: Record<string, Subcategory[]>;
  loadingCats: boolean;
  loadingSubs: boolean;
  selectedCatForLimit: string;
  setSelectedCatForLimit: (value: string) => void;
  selectedSubForLimit: string;
  setSelectedSubForLimit: (value: string) => void;
  limitValue: number | "";
  setLimitValue: (value: number | "") => void;
  onAddLimitItem: () => void;
  onRemoveLimitItem: (subId: string) => void;
  fetchSubcategories: (catId: string) => void;
  subcategoryNames: Record<string, string>;
}

export const PlanForm = ({
  formData,
  setFormData,
  featuresInput,
  setFeaturesInput,
  errors,
  setErrors,
  categories,
  subcategoriesByCat,
  loadingCats,
  loadingSubs,
  selectedCatForLimit,
  setSelectedCatForLimit,
  selectedSubForLimit,
  setSelectedSubForLimit,
  limitValue,
  setLimitValue,
  onAddLimitItem,
  onRemoveLimitItem,
  fetchSubcategories,
  subcategoryNames,
}: PlanFormProps) => {
  const subOptions = selectedCatForLimit
    ? subcategoriesByCat[selectedCatForLimit] || []
    : [];

  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{
    subId: string;
    name: string;
  } | null>(null);

  const handleRemoveClick = (subId: string, name: string) => {
    setItemToRemove({ subId, name });
    setIsConfirmRemoveOpen(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      onRemoveLimitItem(itemToRemove.subId);
      setIsConfirmRemoveOpen(false);
      setItemToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setIsConfirmRemoveOpen(false);
    setItemToRemove(null);
  };

  return (
    <div className="space-y-4 py-2">
      <div>
        <label className="block text-sm font-medium mb-2">Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (e.target.value.trim())
              setErrors((prev: ValidationErrors) => ({
                ...prev,
                name: undefined,
              }));
          }}
          placeholder="e.g., Basic"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (e.target.value.trim())
              setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
          rows={3}
          placeholder="Short summary of this plan"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Features (comma-separated) *
        </label>
        <Input
          value={featuresInput}
          onChange={(e) => {
            setFeaturesInput(e.target.value);
            if (e.target.value.trim())
              setErrors((prev) => ({ ...prev, featuresInput: undefined }));
          }}
          placeholder="e.g., 10 listings, Featured badge, Email support"
        />
        {errors.featuresInput && (
          <p className="text-sm text-red-600 mt-1">{errors.featuresInput}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Amount (NGN) *
          </label>
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.amount}
            onChange={(e) => {
              const v = e.target.value;
              setFormData({ ...formData, amount: v });
              if (v === "")
                setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            placeholder="e.g., 2000"
          />
          {errors.amount && (
            <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Listing Limits
          </label>
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Select
                value={selectedCatForLimit}
                onValueChange={(v) => {
                  setSelectedCatForLimit(v);
                  setSelectedSubForLimit("");
                  if (!subcategoriesByCat[v]) fetchSubcategories(v);
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingCats ? "Loading categories..." : "Select category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedSubForLimit}
                onValueChange={setSelectedSubForLimit}
                disabled={!selectedCatForLimit || loadingSubs}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedCatForLimit
                        ? "Select category first"
                        : loadingSubs
                        ? "Loading..."
                        : "Select subcategory"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subOptions.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={limitValue}
                  onChange={(e) =>
                    setLimitValue(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="Limit"
                />
                <Button
                  size="sm"
                  className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                  type="button"
                  onClick={onAddLimitItem}
                >
                  Add
                </Button>
              </div>
            </div>
            {formData.listingLimit.length > 0 ? (
              <div className="border rounded-md divide-y">
                {formData.listingLimit.map((it, index) => {
                  const subId =
                    typeof it.subCategory === "string"
                      ? it.subCategory
                      : it.subCategory?._id;
                  const name =
                    typeof it.subCategory !== "string" && it.subCategory?.name
                      ? it.subCategory.name
                      : subcategoryNames[subId] || "Loading...";

                  return (
                    <div
                      key={`${subId}-${it.limit}-${index}`}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-medium">
                          {name ? name : "N/A"}
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          • Limit: {it.limit}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveClick(subId!, name)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No listing limits added.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Billing Cycle *
          </label>
          <Select
            value={formData.billing_cycle}
            onValueChange={(v: "daily" | "weekly" | "monthly" | "annually") =>
              setFormData({ ...formData, billing_cycle: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status *</label>
          <Select
            value={formData.status}
            onValueChange={(v: "active" | "inactive") =>
              setFormData({ ...formData, status: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmRemoveOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Remove Listing Limit"
        description={`Are you sure you want to remove the listing limit for "${itemToRemove?.name}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        colour={true}
      />
    </div>
  );
};

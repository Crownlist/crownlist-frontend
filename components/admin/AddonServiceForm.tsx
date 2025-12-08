import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AddOnServiceFormData,
  AddOnServiceErrors,
  AddOnServiceCategory,
} from "@/types/addon-services";
import {
  validateAddOnServiceForm,
  hasValidationErrors,
} from "@/lib/addon-services-validation";

interface AddonServiceFormProps {
  initialData?: Partial<AddOnServiceFormData>;
  categories: AddOnServiceCategory[];
  onSubmit: (data: AddOnServiceFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export const AddonServiceForm: React.FC<AddonServiceFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "Submit",
}) => {
  const [form, setForm] = useState<AddOnServiceFormData>({
    name: "",
    category: "",
    description: "",
    amount: "",
    billing_cycle: "monthly",
    billing_type: "one-time",
    status: "active",
    included_add_ons: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<AddOnServiceErrors>({});

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = (
    field: keyof AddOnServiceFormData,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if value is provided
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateAddOnServiceForm(form);
    setErrors(validationErrors);

    if (!hasValidationErrors(validationErrors)) {
      await onSubmit(form);
    }
  };

  return (
    <div className="space-y-4 py-2">
      <div>
        <label className="block text-sm font-medium mb-2">Name *</label>
        <Input
          value={form.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="e.g., Visibility Booster"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        <Select
          value={form.category}
          onValueChange={(value) => handleInputChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                categories.length ? "Select category" : "Loading categories..."
              }
            />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c._id ?? c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-600 mt-1">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
          rows={3}
          placeholder="Short summary"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Amount (NGN) *
          </label>
          <Input
            inputMode="numeric"
            type="number"
            pattern="[0-9]*"
            value={form.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            placeholder="e.g., 1500"
          />
          {errors.amount && (
            <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Billing Cycle *
          </label>
          <Select
            value={form.billing_cycle}
            onValueChange={(value: AddOnServiceFormData["billing_cycle"]) =>
              setForm((prev) => ({ ...prev, billing_cycle: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
          {errors.billing_cycle && (
            <p className="text-sm text-red-600 mt-1">{errors.billing_cycle}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Billing Type *
          </label>
          <Select
            value={form.billing_type}
            onValueChange={(value: AddOnServiceFormData["billing_type"]) =>
              setForm((prev) => ({ ...prev, billing_type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one-time">One-time</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
            </SelectContent>
          </Select>
          {errors.billing_type && (
            <p className="text-sm text-red-600 mt-1">{errors.billing_type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status *</label>
          <Select
            value={form.status}
            onValueChange={(value: AddOnServiceFormData["status"]) =>
              setForm((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-600 mt-1">{errors.status}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-[#1F058F] hover:bg-[#1F058F]/90"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : submitButtonText}
        </Button>
      </div>
    </div>
  );
};

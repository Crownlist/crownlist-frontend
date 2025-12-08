import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  AddOnService,
  AddOnServiceFormData,
  AddOnServiceCategory,
  CreateAddOnServicePayload,
} from "@/types/addon-services";
import {
  fetchAddOnServices,
  createAddOnService,
  updateAddOnService,
  deleteAddOnService,
} from "@/lib/addon-services-api";

export const useAddonServices = () => {
  const [services, setServices] = useState<AddOnService[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories] = useState<AddOnServiceCategory[]>([
    { _id: "1", name: "Listing Visibility", slug: "listing-visibility" },
    { _id: "2", name: "Trust & Credibility", slug: "trust-&-credibility" },
    { _id: "3", name: "Listing Management", slug: "listing-management" },
    {
      _id: "4",
      name: "Engagement & Promotion",
      slug: "engagement-&-promotion",
    },
    { _id: "5", name: "Bundle", slug: "bundle" },
  ]);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAddOnServices();
      setServices(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Failed to load add-on services: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleCreate = useCallback(
    async (formData: AddOnServiceFormData) => {
      try {
        setLoading(true);
        const payload: CreateAddOnServicePayload = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          description: formData.description.trim(),
          amount: Number(formData.amount),
          billing_cycle: formData.billing_cycle,
          billing_type: formData.billing_type,
          status: formData.status,
        };

        const created = await createAddOnService(payload);
        toast.success("Add-on created successfully");
        await loadServices(); // Reload the list
        return created._id;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error(`Failed to create add-on: ${errorMessage}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadServices]
  );

  const handleUpdate = useCallback(
    async (serviceId: string, formData: AddOnServiceFormData) => {
      try {
        setLoading(true);
        const payload: CreateAddOnServicePayload = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          description: formData.description.trim(),
          amount: Number(formData.amount),
          billing_cycle: formData.billing_cycle,
          billing_type: formData.billing_type,
          status: formData.status,
        };

        await updateAddOnService(serviceId, payload);
        toast.success("Add-on updated successfully");
        await loadServices(); // Reload the list
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error(`Failed to update add-on: ${errorMessage}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadServices]
  );

  const handleDelete = useCallback(async (serviceId: string) => {
    try {
      setLoading(true);
      await deleteAddOnService(serviceId);
      toast.success("Add-on deleted successfully");
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(errorMessage || "Failed to delete add-on");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    services,
    loading,
    categories,
    loadServices,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

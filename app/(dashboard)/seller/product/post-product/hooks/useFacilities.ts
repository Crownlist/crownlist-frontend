/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { apiClientUser } from "@/lib/interceptor";
import { toast } from "sonner";
import { Subcategory } from "../types";
import { getFacilityKey, coerceFacilityValue } from "../utils/helpers";

export const useFacilities = () => {
  const [facilityValues, setFacilityValues] = useState<Record<string, unknown>>(
    {}
  );
  const [objectFieldOptions, setObjectFieldOptions] = useState<
    Record<string, string[]>
  >({});
  const [loadingObjectFields, setLoadingObjectFields] = useState<
    Record<string, boolean>
  >({});

  const handleFacilityChange = (facilityId: string, value: unknown) => {
    setFacilityValues((prev) => ({
      ...prev,
      [facilityId]: value,
    }));
  };

  const getFacilityArrayValue = (facilityId: string): string[] => {
    const v = facilityValues[facilityId];
    return Array.isArray(v) ? (v as string[]) : [];
  };

  const toggleMultiOption = (
    facilityId: string,
    option: string,
    checked: boolean
  ) => {
    setFacilityValues((prev) => {
      const current = Array.isArray(prev[facilityId])
        ? [...(prev[facilityId] as string[])]
        : [];
      const has = current.includes(option);
      let next = current;
      if (checked && !has) next = [...current, option];
      if (!checked && has) next = current.filter((x) => x !== option);
      return { ...prev, [facilityId]: next };
    });
  };

  // Fetch options for object-type facilities
  const loadObjectFieldOptions = async (
    selectedSubcategory: string | null,
    subcategories: Subcategory[]
  ) => {
    if (!selectedSubcategory) return;

    const currentSub = subcategories.find(
      (sub) => sub._id === selectedSubcategory
    );
    if (!currentSub) return;

    const objectFacilities = currentSub.facilities.filter(
      (f) => f.dataType === "object" && f.value
    );

    objectFacilities.forEach(async (facility) => {
      const facilityKey = getFacilityKey(facility);
      if (objectFieldOptions[facilityKey]) return; // Already loaded

      try {
        setLoadingObjectFields((prev) => ({ ...prev, [facilityKey]: true }));
        const endpoint = facility.value as string;
        const res = await apiClientUser.get(endpoint);
        const data = res?.data?.data || res?.data;
        const options = Array.isArray(data?.value) ? data.value : [];
        setObjectFieldOptions((prev) => ({ ...prev, [facilityKey]: options }));
      } catch (e: any) {
        console.error(`Failed to load options for ${facility.label}:`, e);
        toast.error(`Failed to load options for ${facility.label}`);
      } finally {
        setLoadingObjectFields((prev) => ({ ...prev, [facilityKey]: false }));
      }
    });
  };

  // Map product facilities to facilityValues when editing
  const mapProductFacilities = (
    editProduct: Record<string, unknown>,
    selectedSubcategory: string | null,
    originalSubId: string | null,
    subcategories: Subcategory[],
    editId: string | null
  ) => {
    if (!editProduct) return;
    // Ensure we're mapping for the original subcategory in edit mode
    if (editId && originalSubId && selectedSubcategory !== originalSubId)
      return;

    const currentSub = subcategories.find(
      (sub) => sub._id === selectedSubcategory
    );
    if (!currentSub) return;

    const facilityMap: Record<string, unknown> = {};

    // Normalize product facilities into array of {key,label,id,value}
    const prodFacilitiesRaw = (editProduct.facility as Record<string, unknown>)
      ?.facilities;
    let prodFacilities: Array<Record<string, unknown>> = [];
    if (Array.isArray(prodFacilitiesRaw)) {
      prodFacilities = prodFacilitiesRaw as Array<Record<string, unknown>>;
    } else if (prodFacilitiesRaw && typeof prodFacilitiesRaw === "object") {
      // Object map case: { [id|label]: value }
      const facilitiesObj = prodFacilitiesRaw as Record<string, unknown>;
      prodFacilities = Object.keys(facilitiesObj).map((k) => ({
        key: k,
        value: facilitiesObj[k],
      }));
    }

    for (const f of currentSub.facilities || []) {
      // Find by label, id, or key
      const found = prodFacilities.find(
        (pf) =>
          pf.label === f.label ||
          pf._id === f._id ||
          pf.id === f._id ||
          pf.key === f._id ||
          pf.key === f.label
      );
      if (!found) continue;
      let v: unknown = found.value ?? found.val ?? found.data;
      v = coerceFacilityValue(v, f.dataType, f.selectType);
      const k = getFacilityKey(f);
      facilityMap[k] = v;
    }
    setFacilityValues(facilityMap);
  };

  // Clear facility values when subcategory changes (skip in edit mode)
  const clearFacilitiesOnSubcategoryChange = (editId: string | null) => {
    if (editId) return;
    setFacilityValues({});
  };

  return {
    facilityValues,
    objectFieldOptions,
    loadingObjectFields,
    handleFacilityChange,
    getFacilityArrayValue,
    toggleMultiOption,
    loadObjectFieldOptions,
    mapProductFacilities,
    clearFacilitiesOnSubcategoryChange,
  };
};

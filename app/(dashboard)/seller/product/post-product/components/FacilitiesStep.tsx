/* eslint-disable */
"use client";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductFormStepper } from "./ProductFormStepper";

interface Facility {
  _id?: string;
  label: string;
  description: string;
  mandatory: boolean;
  filterable: boolean;
  isActive: boolean;
  dataType: "string" | "number" | "boolean" | "array" | "object";
  selectType?: "single" | "multiple";
  value?: string;
}

interface FacilitiesStepProps {
  subcategories: Array<any>;
  selectedSubcategory: string | null;
  facilityValues: Record<string, unknown>;
  objectFieldOptions: Record<string, string[]>;
  loadingObjectFields: Record<string, boolean>;
  handleFacilityChange: (facilityId: string, value: unknown) => void;
  getFacilityKey: (facility: Facility) => string;
  getArrayOptions: (facility: Facility) => string[];
  getFacilityArrayValue: (facilityId: string) => string[];
  toggleMultiOption: (
    facilityId: string,
    option: string,
    checked: boolean
  ) => void;
  currentStep?: number;
}

export function FacilitiesStep({
  subcategories,
  selectedSubcategory,
  facilityValues,
  objectFieldOptions,
  loadingObjectFields,
  handleFacilityChange,
  getFacilityKey,
  getArrayOptions,
  getFacilityArrayValue,
  toggleMultiOption,
  currentStep = 3,
}: FacilitiesStepProps) {
  // Scroll to top when component mounts or currentStep changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const currentSubcategory = subcategories.find(
    (sub) => sub._id === selectedSubcategory
  );
  const mandatoryFacilities =
    currentSubcategory?.facilities.filter((f: Facility) => f.mandatory) || [];
  const optionalFacilities =
    currentSubcategory?.facilities.filter((f: Facility) => !f.mandatory) || [];

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 flex-1">
      <aside className="lg:order-1 lg:w-80 shrink-0">
        <ProductFormStepper currentStep={currentStep} />
      </aside>

      <main className="order-2 lg:order-1 flex-1 min-w-0">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-8">
          <Link
            href="/seller/product"
            className="text-gray-600 hover:text-[#1F058F] transition-colors duration-200"
          >
            Products
          </Link>
          <ArrowRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-700">Post Product</span>
          <ArrowRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#1F058F] font-medium">Other details</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Other details
          </h1>
          <p className="text-gray-600 text-base">
            Complete the product details below to finish posting
          </p>
        </div>

        {/* Form Content */}
        <div className="space-y-10">
          {/* Mandatory Facilities Section */}
          {mandatoryFacilities.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-1 w-1 rounded-full bg-red-500"></div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Required Information
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-5 bg-gray-50 rounded-lg p-3 border border-gray-100">
                {mandatoryFacilities.map((facility: Facility, idx: number) => (
                  <div key={facility._id}>
                    <FacilityField
                      facility={facility}
                      facilityValues={facilityValues}
                      objectFieldOptions={objectFieldOptions}
                      loadingObjectFields={loadingObjectFields}
                      handleFacilityChange={handleFacilityChange}
                      getFacilityKey={getFacilityKey}
                      getArrayOptions={getArrayOptions}
                      getFacilityArrayValue={getFacilityArrayValue}
                      toggleMultiOption={toggleMultiOption}
                    />
                    {idx < mandatoryFacilities.length - 1 && (
                      <div className="border-t border-gray-200 mt-5" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Optional Facilities Section */}
          {optionalFacilities.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Additional Information
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-5 bg-gray-50 rounded-lg p-6 border border-gray-100">
                {optionalFacilities.map((facility: Facility, idx: number) => (
                  <div key={facility._id}>
                    <FacilityField
                      facility={facility}
                      facilityValues={facilityValues}
                      objectFieldOptions={objectFieldOptions}
                      loadingObjectFields={loadingObjectFields}
                      handleFacilityChange={handleFacilityChange}
                      getFacilityKey={getFacilityKey}
                      getArrayOptions={getArrayOptions}
                      getFacilityArrayValue={getFacilityArrayValue}
                      toggleMultiOption={toggleMultiOption}
                    />
                    {idx < optionalFacilities.length - 1 && (
                      <div className="border-t border-gray-200 mt-5" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function FacilityField({
  facility,
  facilityValues,
  objectFieldOptions,
  loadingObjectFields,
  handleFacilityChange,
  getFacilityKey,
  getArrayOptions,
  getFacilityArrayValue,
  toggleMultiOption,
}: {
  facility: Facility;
  facilityValues: Record<string, unknown>;
  objectFieldOptions: Record<string, string[]>;
  loadingObjectFields: Record<string, boolean>;
  handleFacilityChange: (facilityId: string, value: unknown) => void;
  getFacilityKey: (facility: Facility) => string;
  getArrayOptions: (facility: Facility) => string[];
  getFacilityArrayValue: (facilityId: string) => string[];
  toggleMultiOption: (
    facilityId: string,
    option: string,
    checked: boolean
  ) => void;
}) {
  const facilityKey = getFacilityKey(facility);

  return (
    <div className="py-0">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
        {/* Label */}
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-900">
            {facility.label}
          </label>
          {facility.description && (
            <p className="text-xs text-gray-500 mt-1">{facility.description}</p>
          )}
        </div>

        {/* Input Field */}
        <div className="sm:col-span-2">
          {facility.dataType === "boolean" ? (
            <div className="flex items-center gap-3 h-10">
              <Switch
                checked={Boolean(facilityValues[facilityKey])}
                onCheckedChange={(val) =>
                  handleFacilityChange(facilityKey, val)
                }
                className="data-[state=checked]:bg-[#1F058F]"
              />
              <span className="text-sm text-gray-600">
                {Boolean(facilityValues[facilityKey]) ? "YES" : "NO"}
              </span>
            </div>
          ) : facility.dataType === "number" ? (
            <Input
              type="number"
              placeholder={"Enter a number"}
              value={(facilityValues[facilityKey] as string | undefined) || ""}
              onChange={(e) =>
                handleFacilityChange(facilityKey, e.target.value)
              }
              className="w-full"
            />
          ) : facility.dataType === "array" ? (
            <div className="space-y-3">
              {facility.selectType === "single" ? (
                <ReactSelect
                  value={
                    getFacilityArrayValue(facilityKey)[0]
                      ? {
                          value: getFacilityArrayValue(facilityKey)[0],
                          label: getFacilityArrayValue(facilityKey)[0],
                        }
                      : null
                  }
                  onChange={(option) =>
                    handleFacilityChange(
                      facilityKey,
                      option?.value ? [option.value] : []
                    )
                  }
                  options={getArrayOptions(facility).map((opt) => ({
                    value: opt,
                    label: opt,
                  }))}
                  placeholder={"Select option"}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "40px",
                      borderColor: "#e5e7eb",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      "&:hover": {
                        borderColor: "#9ca3af",
                      },
                      "&:focus-within": {
                        borderColor: "#1F058F",
                        boxShadow: "0 0 0 3px rgba(31, 5, 143, 0.1)",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      maxHeight: "300px",
                      borderRadius: "6px",
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#1F058F"
                        : state.isFocused
                        ? "#f3f4f6"
                        : "#ffffff",
                      color: state.isSelected ? "#ffffff" : "#111827",
                    }),
                  }}
                />
              ) : (
                <div className="flex flex-wrap gap-3">
                  {getArrayOptions(facility).map((opt, index) => {
                    const checked =
                      getFacilityArrayValue(facilityKey).includes(opt);
                    return (
                      <label
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 hover:border-gray-300"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v: any) =>
                            toggleMultiOption(facilityKey, opt, Boolean(v))
                          }
                          className="data-[state=checked]:bg-[#1F058F] data-[state=checked]:border-[#1F058F]"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ) : facility.dataType === "object" ? (
            <ReactSelect
              value={
                (facilityValues[facilityKey] as string | undefined)
                  ? {
                      value: facilityValues[facilityKey] as string,
                      label: facilityValues[facilityKey] as string,
                    }
                  : null
              }
              onChange={(option) =>
                handleFacilityChange(facilityKey, option?.value || "")
              }
              options={(objectFieldOptions[facilityKey] || []).map((opt) => ({
                value: opt,
                label: opt,
              }))}
              isDisabled={loadingObjectFields[facilityKey]}
              placeholder={
                loadingObjectFields[facilityKey]
                  ? "Loading..."
                  : "Select option"
              }
              className="react-select-container"
              classNamePrefix="react-select"
              isClearable={!loadingObjectFields[facilityKey]}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "40px",
                  borderColor: "#e5e7eb",
                  borderRadius: "6px",
                  backgroundColor: loadingObjectFields[facilityKey]
                    ? "#f9fafb"
                    : "#ffffff",
                  "&:hover": {
                    borderColor: loadingObjectFields[facilityKey]
                      ? "#e5e7eb"
                      : "#9ca3af",
                  },
                  "&:focus-within": {
                    borderColor: loadingObjectFields[facilityKey]
                      ? "#e5e7eb"
                      : "#1F058F",
                    boxShadow: loadingObjectFields[facilityKey]
                      ? "none"
                      : "0 0 0 3px rgba(31, 5, 143, 0.1)",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  maxHeight: "300px",
                  borderRadius: "6px",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? "#1F058F"
                    : state.isFocused
                    ? "#f3f4f6"
                    : "#ffffff",
                  color: state.isSelected ? "#ffffff" : "#111827",
                }),
              }}
            />
          ) : (
            <Input
              placeholder={"Enter value"}
              value={(facilityValues[facilityKey] as string | undefined) || ""}
              onChange={(e) =>
                handleFacilityChange(facilityKey, e.target.value)
              }
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

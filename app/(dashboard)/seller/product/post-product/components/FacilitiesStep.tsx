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
    <div className="flex flex-col-reverse md:flex-row gap-10 flex-1">
      <div className="order-2 md:order-1 flex w-full flex-col gap-10">
        <div>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link
              href="/seller/product"
              className="hover:text-[#1F058F] transition-colors"
            >
              Products
            </Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium">Post Product</span>
            <ArrowRight className="w-3 h-3" />
            <span className="text-[#1F058F] font-medium">Other details</span>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Other details</h1>
            <p className="text-gray-500">Enter other details below</p>
          </div>

          {/* Mandatory Facilities */}
          {mandatoryFacilities.length > 0 && (
            <>
              <h3 className="text-sm font-medium mb-2 mt-6 text-gray-700">
                Mandatory Fields
              </h3>
              <div className="space-y-4">
                {mandatoryFacilities.map((facility: Facility) => (
                  <FacilityField
                    key={facility._id}
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
                ))}
              </div>
            </>
          )}

          {/* Optional Facilities */}
          {optionalFacilities.length > 0 && (
            <>
              <h3 className="text-sm font-medium my-2 mt-5 sm:mt-5 text-gray-700">
                Optional Fields
              </h3>
              <div className="space-y-4">
                {optionalFacilities.map((facility: Facility) => (
                  <FacilityField
                    key={facility._id}
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
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <ProductFormStepper currentStep={currentStep} />
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-sm:pb-5">
      <Input value={facility.label} readOnly className="bg-gray-100" />
      <div>
        {facility.dataType === "boolean" ? (
          <div className="flex items-center gap-3">
            <Switch
              checked={Boolean(facilityValues[facilityKey])}
              onCheckedChange={(val) => handleFacilityChange(facilityKey, val)}
            />
            <span className="text-sm text-gray-600">
              {facility.description}
            </span>
          </div>
        ) : facility.dataType === "number" ? (
          <Input
            type="number"
            placeholder={facility.description}
            value={(facilityValues[facilityKey] as string | undefined) || ""}
            onChange={(e) => handleFacilityChange(facilityKey, e.target.value)}
          />
        ) : facility.dataType === "array" ? (
          <div className="space-y-2">
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
                placeholder={facility.description || "Select option"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "40px",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    maxHeight: "300px",
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
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v: any) =>
                          toggleMultiOption(facilityKey, opt, Boolean(v))
                        }
                      />
                      <span>{opt}</span>
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
                : facility.description || "Select option"
            }
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "40px",
                borderColor: "#d1d5db",
                "&:hover": {
                  borderColor: "#9ca3af",
                },
              }),
              menu: (base) => ({
                ...base,
                maxHeight: "300px",
              }),
            }}
          />
        ) : (
          <Input
            placeholder={facility.description}
            value={(facilityValues[facilityKey] as string | undefined) || ""}
            onChange={(e) => handleFacilityChange(facilityKey, e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

export interface Facility {
  label: string;
  description: string;
  mandatory: boolean;
  filterable: boolean;
  isActive: boolean;
  dataType: "string" | "number" | "boolean" | "array" | "object";
  dataInputType: "text" | "number" | "boolean" | "array" | "object";
  selectType?: "single" | "multiple";
  value?: string;
  _id?: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  category: string;
  facilities: Facility[];
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface SubcategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
  status: string;
  facilities: Facility[];
}

export interface FormErrors {
  name?: string;
  description?: string;
  image?: string;
}

export interface FacilityErrors {
  label?: string;
  value?: string;
  selectType?: string;
}

export const DATA_TYPES = [
  "string",
  "number",
  "boolean",
  "array",
  "object",
] as const;
export const DATA_INPUT_TYPES = [
  "text",
  "number",
  "boolean",
  "array",
  "object",
] as const;
export const SELECT_TYPES = ["single", "multiple"] as const;

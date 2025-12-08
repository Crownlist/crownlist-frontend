export interface Category {
  _id: string;
  name: string;
  imageUrl: string;
  status: string;
}

export interface Facility {
  _id?: string;
  label: string;
  description: string;
  mandatory: boolean;
  filterable: boolean;
  isActive: boolean;
  dataType: "string" | "number" | "boolean" | "array" | "object";
  // selectType applies when dataType === 'array'
  selectType?: "single" | "multiple";
  value?: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  category: string;
  facilities: Facility[];
}

export interface UploadedImage {
  url: string;
  altText?: string;
  isPrimary?: boolean;
  file?: File;
}

export interface FormData {
  images: string[];
  price: string;
  discountPrice: string;
  description: string;
  overview: string;
  contactInfo: {
    fullName: string;
    phoneNumber: string;
  };
}

export interface LimitsCheckResult {
  isAtLimit: boolean;
  currentCount: number;
  limit: number;
  planName: string;
  isSubcategoryNotInPlan?: boolean;
}

export interface LoadingState {
  categories: boolean;
  subcategories: boolean;
}

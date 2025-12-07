export interface ListingLimitItem {
  _id?: string;
  subCategory: string | { _id: string; name: string };
  limit: number;
}

export interface SubscriptionPlan {
  _id?: string;
  name: string;
  description: string;
  features: string[];
  listingLimit: ListingLimitItem[];
  amount: string;
  billing_cycle: "daily" | "weekly" | "monthly" | "annually";
  status: "active" | "inactive";
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Subcategory {
  _id: string;
  name: string;
}

export interface CreatePlanForm {
  name: string;
  description: string;
  features: string[];
  listingLimit: ListingLimitItem[];
  amount: string;
  billing_cycle: "daily" | "weekly" | "monthly" | "annually";
  status: "active" | "inactive";
}

export interface ValidationErrors {
  name?: string;
  description?: string;
  featuresInput?: string;
  amount?: string;
}

export interface AddOnService {
  _id?: string;
  name: string;
  category: string;
  description: string;
  amount: string;
  billing_cycle: "daily" | "weekly" | "monthly" | "annually";
  billing_type: "one-time" | "recurring";
  status: "active" | "inactive";
  included_add_ons?: string[];
  createdAt?: string;
}

export interface AddOnServiceCategory {
  _id?: string;
  name: string;
  slug?: string;
}

export interface AddOnServiceFormData {
  name: string;
  category: string;
  description: string;
  amount: string;
  billing_cycle: "daily" | "weekly" | "monthly" | "annually";
  billing_type: "one-time" | "recurring";
  status: "active" | "inactive";
  included_add_ons?: string[];
}

export interface AddOnServiceErrors {
  name?: string;
  category?: string;
  description?: string;
  amount?: string;
  billing_cycle?: string;
  billing_type?: string;
  status?: string;
}

export interface CreateAddOnServicePayload {
  name: string;
  category: string;
  description: string;
  amount: number;
  billing_cycle: "daily" | "weekly" | "monthly" | "annually";
  billing_type: "one-time" | "recurring";
  status: "active" | "inactive";
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status?: number;
}

export interface AddOnServicesResponse {
  addOnService?: AddOnService[];
}

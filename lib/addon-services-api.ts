/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClientAdmin } from "@/lib/interceptor";
import {
  AddOnService,
  CreateAddOnServicePayload,
  ApiResponse,
  AddOnServicesResponse,
} from "@/types/addon-services";

export const fetchAddOnServices = async (): Promise<AddOnService[]> => {
  try {
    const res: ApiResponse<AddOnServicesResponse> = await apiClientAdmin.get(
      "/addonservices"
    );
    // console.log("adds-on", res.data);
    const data = (res as any)?.data?.data?.addOnService;
    return Array.isArray(data) ? data : [];
  } catch (error: unknown) {
    console.error("Error fetching add-on services:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load add-on services: ${errorMessage}`);
  }
};

export const createAddOnService = async (
  payload: CreateAddOnServicePayload
): Promise<AddOnService> => {
  try {
    const res: ApiResponse<AddOnService> = await apiClientAdmin.post(
      "/addonservices",
      payload
    );
    return res?.data || ({} as AddOnService);
  } catch (error: unknown) {
    console.error("Error creating add-on service:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create add-on: ${errorMessage}`);
  }
};

export const updateAddOnService = async (
  id: string,
  payload: CreateAddOnServicePayload
): Promise<ApiResponse<AddOnService>> => {
  try {
    const res: ApiResponse<AddOnService> = await apiClientAdmin.put(
      `/addonservices/${id}`,
      payload
    );
    return res;
  } catch (error: unknown) {
    console.error("Error updating add-on service:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update add-on: ${errorMessage}`);
  }
};

export const deleteAddOnService = async (id: string): Promise<void> => {
  try {
    await apiClientAdmin.delete(`/addonservices/${id}`);
  } catch (error: unknown) {
    console.error("Error deleting add-on service:", error);
    throw error;
  }
};

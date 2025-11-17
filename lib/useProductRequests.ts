/* eslint-disable */
"use client";
import { useQuery } from "react-query";
import { apiClientAdmin, apiClientUser } from "./interceptor";
import {
  ProductRequestsResponse,
  ProductRequestDetailsResponse,
  ProductRequestSearchParams,
  ProductRequestsResponseAdmin,
} from "@/types/product/request";

export const getProductRequests = async (
  params: ProductRequestSearchParams = {},
  userType: "seller" | "buyer" = "seller"
): Promise<ProductRequestsResponse> => {
  const { q, page = 1, limit = 10 } = params;

  // For sellers: /product-requests or /product-requests/search
  // For buyers: /product-requests/me or /product-requests/me/search (if available)
  const baseEndpoint = userType === "buyer" ? "/product-requests/me" : "/product-requests";
  const searchEndpoint = userType === "buyer" ? "/product-requests/me/search" : "/product-requests/search";

  // If search query is provided, use search endpoint
  const endpoint = q
    ? `${searchEndpoint}?q=${encodeURIComponent(q)}&limit=${limit}&page=${page}`
    : `${baseEndpoint}?page=${page}&limit=${limit}`;

  return userType === "buyer" ? apiClientUser(endpoint) : apiClientAdmin(endpoint);
};

export const getProductRequestsAdmin = async (
  params: ProductRequestSearchParams = {},
  userType: "seller" | "buyer" = "seller"
): Promise<ProductRequestsResponseAdmin> => {
  const { q, page = 1, limit = 10 } = params;

  // For sellers: /product-requests or /product-requests/search
  // For buyers: /product-requests/me or /product-requests/me/search (if available)
  const baseEndpoint = userType === "buyer" ? "/product-requests/me" : "/product-requests";
  const searchEndpoint = userType === "buyer" ? "/product-requests/me/search" : "/product-requests/search";

  // If search query is provided, use search endpoint
  const endpoint = q
    ? `${searchEndpoint}?q=${encodeURIComponent(q)}&limit=${limit}&page=${page}`
    : `${baseEndpoint}?page=${page}&limit=${limit}`;

  return userType === "buyer" ? apiClientUser(endpoint) : apiClientAdmin(endpoint);
};

export const getProductRequestDetails = async (
  id: string
): Promise<ProductRequestDetailsResponse> => {
  return apiClientUser(`/product-requests/${id}`);
};

export const updateProductRequestStatus = async (
  id: string,
  status: string
): Promise<any> => {
  return apiClientUser(`/product-requests/${id}`, {
    method: 'PUT',
    data: { status }
  });
};

export const useProductRequests = (
  params: ProductRequestSearchParams = {},
  userType: "seller" | "buyer" = "seller"
) => {
  const { q, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["product-requests", userType, { q, page, limit }],
    queryFn: () => getProductRequests(params, userType),
    keepPreviousData: true,
  });
};


export const useProductRequestsAdmin = (
  params: ProductRequestSearchParams = {},
  userType: "seller" | "buyer" = "seller"
) => {
  const { q, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["product-requests", userType, { q, page, limit }],
    queryFn: () => getProductRequestsAdmin(params, userType),
    keepPreviousData: true,
  });
};


export const useProductRequestDetails = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["product-request-details", id],
    queryFn: () => getProductRequestDetails(id),
    enabled: !!id && enabled,
  });
};

/* eslint-disable */
import Axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { baseURL } from "@/constants";
import { obfuscateToken } from "@/constants/encryptData";

// =============================================================================
// API CONFIGURATION
// =============================================================================

/**
 * Default API configuration settings used across all API clients
 */
const apiSettings = {
  baseURL: `${baseURL}`,
  headers: {
    "Content-Type": "application/json",
  },
};

// =============================================================================
// PUBLIC API CLIENT (No Authentication Required)
// =============================================================================

/**
 * API client for unprotected endpoints (login, register, public data, etc.)
 * No authentication headers are included by default
 */
export const apiClientPublic = Axios.create(apiSettings);

/**
 * Response interceptor for public API client
 * Extracts data from response and handles errors consistently
 */
apiClientPublic.interceptors.response.use(
  (response: any) => {
    return response?.data;
  },
  (error: AxiosError | any) => {
    throw error?.response?.data?.message || error.message;
  }
);

// =============================================================================
// USER API CLIENT (Authentication Required)
// =============================================================================

/**
 * User token variables stored in memory
 * leoKey = Access Token (for authorization)
 * leoLoop = Refresh Token (for getting new access tokens)
 */
let leoLoop: string = "";
let leoKey: string = "";

/**
 * Initialize user tokens from localStorage if available
 * Only runs on client-side (browser environment)
 */
if (typeof window !== "undefined") {
  if (localStorage.getItem("leoLoop")) {
    leoLoop = localStorage.getItem("leoLoop")
      ? obfuscateToken(false, localStorage.getItem("leoLoop") ?? "")
      : "";
  }
  if (localStorage.getItem("leoKey")) {
    leoKey = localStorage.getItem("leoKey")
      ? obfuscateToken(false, localStorage.getItem("leoKey") ?? "")
      : "";
  }
}

/**
 * API client for user protected endpoints
 * Includes Authorization header with user access token
 */
export const apiClientUser = Axios.create({
  ...apiSettings,
  headers: {
    ...apiSettings.headers,
    Authorization: `Bearer ${leoKey}`,
  },
});

/**
 * Error handler for user authentication failures
 * Removes tokens from localStorage and throws the error
 */
const handleUserError = (error: AxiosError | any) => {
  // Clear user tokens from localStorage if they exist
  leoKey && localStorage.removeItem("leoKey");
  leoLoop && localStorage.removeItem("leoLoop");

  throw error.response?.data?.message || error.message;
};

/**
 * Request interceptor for user API client
 * Automatically checks token expiration and refreshes if needed before each request
 */
apiClientUser.interceptors.request.use(async (req: any) => {
  // Only proceed if we have both access and refresh tokens
  if (leoLoop && leoKey) {
    // Decode the JWT access token to extract expiration time
    const userJWTDecode: any = jwtDecode(leoKey);
    
    // Check if token is expired by comparing with current time
    // dayjs.unix converts UNIX timestamp to dayjs object
    // .diff(dayjs()) < 1 checks if difference is less than 1ms (expired)
    const isExpired = dayjs.unix(Number(userJWTDecode.exp)).diff(dayjs()) < 1;

    // If token is still valid, proceed with the original request
    if (!isExpired) return req;

    // Token is expired, attempt to refresh it before continuing
    try {
      const res: any = await apiClientPublic.post(
        "/auth/refresh-token",
        {
          refreshToken: leoLoop,
          accountType: "user", // Specify this is a user token refresh
        },
        {
          headers: {
            Authorization: `Bearer ${leoKey}`, // Send current token for validation
          },
        }
      );

      // Extract the new access token from response
      const accessTokenNew = res.data.accessToken;
      
      // Update the current request with the new token
      req.headers.Authorization = `Bearer ${accessTokenNew}`;

      // Save new token to localStorage for future use
      localStorage.setItem("leoKey", obfuscateToken(true, accessTokenNew));
      
      // Note: Refresh token typically doesn't change, so we don't update leoLoop
      // If your API returns a new refresh token, uncomment these lines:
      // const refreshTokenNew = res.data.refreshToken;
      // localStorage.setItem("leoLoop", obfuscateToken(true, refreshTokenNew));

    } catch (errorToken: any) {
      // If token refresh fails, handle as authentication error
      return handleUserError(errorToken);
    }
  } else {
    // No tokens available - user needs to log in
    return handleUserError(req);
  }

  // Continue with the request using the refreshed token
  return req;
});

/**
 * Response interceptor for user API client
 * Handles successful responses and authentication errors
 */
apiClientUser.interceptors.response.use(
  (res: any) => {
    // If response is successful, return just the data portion
    return res?.data;
  },
  (error: AxiosError | any) => {
    // Handle specific case where user account no longer exists
    if (
      error?.response?.data?.message ===
      "Account with this token no longer exists"
    ) {
      handleUserError(error);
    }

    // Throw the error message for the calling code to handle
    throw error?.response?.data?.message || error?.message;
  }
);

// =============================================================================
// ADMIN API CLIENT (Authentication Required)
// =============================================================================

/**
 * Admin token variables stored in memory
 * orionKey = Access Token (for authorization)
 * orionLoop = Refresh Token (for getting new access tokens)
 */
let orionLoop: string = "";
let orionKey: string = "";

/**
 * Initialize admin tokens from localStorage if available
 * Only runs on client-side (browser environment)
 */
if (typeof window !== "undefined") {
  if (localStorage.getItem("orionLoop")) {
    orionLoop = localStorage.getItem("orionLoop")
      ? obfuscateToken(false, localStorage.getItem("orionLoop") ?? "")
      : "";
  }
  if (localStorage.getItem("orionKey")) {
    orionKey = localStorage.getItem("orionKey")
      ? obfuscateToken(false, localStorage.getItem("orionKey") ?? "")
      : "";
  }
}

/**
 * API client for admin protected endpoints
 * Includes Authorization header with admin access token
 */
export const apiClientAdmin = Axios.create({
  ...apiSettings,
  headers: {
    ...apiSettings.headers,
    Authorization: `Bearer ${orionKey}`,
  },
});

/**
 * Error handler for admin authentication failures
 * Removes admin tokens from localStorage and throws the error
 */
const handleAdminError = (error: AxiosError | any) => {
  // Clear admin tokens from localStorage if they exist
  orionKey && localStorage.removeItem("orionKey");
  orionLoop && localStorage.removeItem("orionLoop");
  
  // Optional: Redirect to admin login page
  // router.push("/admin/signin");

  throw String(error.response?.data?.message || error?.message);
};

/**
 * Request interceptor for admin API client
 * Automatically checks token expiration and refreshes if needed before each request
 */
apiClientAdmin.interceptors.request.use(async (req: any) => {
  // Only proceed if we have both access and refresh tokens
  if (orionLoop && orionKey) {
    try {
      // Decode the JWT access token to extract expiration time
      const adminJWTDecode: any = jwtDecode(orionKey);
      
      // Check if token is expired by comparing with current time
      const isExpired = dayjs.unix(Number(adminJWTDecode.exp)).diff(dayjs()) < 1;

      // If token is still valid, proceed with the original request
      if (!isExpired) return req;

      // Token is expired, attempt to refresh it before continuing
      console.log("Admin token expired, refreshing...");
      
      const res: any = await apiClientPublic.post(
        "/auth/refresh-token",
        {
          refreshToken: orionLoop,
          accountType: "admin", // Important: Specify this is an admin token refresh
        },
        {
          headers: {
            Authorization: `Bearer ${orionKey}`, // Send current token for validation
          },
        }
      );

      // Extract the new access token from response
      const accessTokenNew = res.data.accessToken;
      
      // Update the current request with the new token
      req.headers.Authorization = `Bearer ${accessTokenNew}`;

      // Save new token to localStorage for future use
      if (typeof window !== "undefined") {
        localStorage.setItem("orionKey", obfuscateToken(true, accessTokenNew));
      }
      
      // Update in-memory variable so subsequent requests use the fresh token
      orionKey = accessTokenNew;

      console.log("Admin token refreshed successfully");

    } catch (errorToken: any) {
      // If token refresh fails, handle as authentication error
      console.error("Failed to refresh admin token:", errorToken);
      return handleAdminError(errorToken);
    }
  } else {
    // No tokens available - admin needs to log in
    return handleAdminError(new Error("No authentication tokens found"));
  }

  // Continue with the request using the refreshed token
  return req;
});
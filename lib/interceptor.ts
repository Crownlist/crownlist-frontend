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
// Promise used to serialize user refresh requests so concurrent requests wait
let refreshingUserPromise: Promise<string | null> | null = null;

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
 * Note: Authorization header will be set dynamically in request interceptor
 */
export const apiClientUser = Axios.create({
  ...apiSettings,
  headers: {
    ...apiSettings.headers,
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
  // Read latest tokens from localStorage on every request (keeps in-memory in sync)
  const currentLeoKey =
    typeof window !== "undefined" && localStorage.getItem("leoKey")
      ? obfuscateToken(false, localStorage.getItem("leoKey") ?? "")
      : "";
  const currentLeoLoop =
    typeof window !== "undefined" && localStorage.getItem("leoLoop")
      ? obfuscateToken(false, localStorage.getItem("leoLoop") ?? "")
      : "";

  // No tokens available - user needs to log in
  if (!currentLeoKey || !currentLeoLoop) {
    return handleUserError(new Error("No authentication tokens found"));
  }

  try {
    const userJWTDecode: any = jwtDecode(currentLeoKey);
    const isExpired = dayjs.unix(Number(userJWTDecode.exp)).diff(dayjs()) < 1;

    // If token is valid, attach and proceed
    if (!isExpired) {
      req.headers = req.headers || {};
      req.headers.Authorization = `Bearer ${currentLeoKey}`;
      leoKey = currentLeoKey;
      leoLoop = currentLeoLoop;
      return req;
    }

    // Token expired — attempt refresh. Use shared promise to avoid parallel refreshes.
    if (!refreshingUserPromise) {
      refreshingUserPromise = (async () => {
        try {
          const res: any = await apiClientPublic.post(
            "/auth/refresh-token",
            {
              refreshToken: currentLeoLoop,
              accountType: "User",
            },
            {
              headers: {
                Authorization: `Bearer ${currentLeoKey}`,
              },
            }
          );

          const accessTokenNew = res.data.accessToken;
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "leoKey",
              obfuscateToken(true, accessTokenNew)
            );
          }
          leoKey = accessTokenNew;
          // If refresh token rotates, update it here as well
          // const refreshTokenNew = res.data.refreshToken;
          // if (refreshTokenNew) localStorage.setItem('leoLoop', obfuscateToken(true, refreshTokenNew));
          return accessTokenNew;
        } catch (err) {
          refreshingUserPromise = null;
          throw err;
        } finally {
          refreshingUserPromise = null;
        }
      })();
    }

    const newToken = await refreshingUserPromise;
    if (!newToken) return handleUserError(new Error("Failed to refresh token"));

    req.headers = req.headers || {};
    req.headers.Authorization = `Bearer ${newToken}`;
    return req;
  } catch (errorToken: any) {
    return handleUserError(errorToken);
  }

  // Ensure JSON body is serialized as a single object
  try {
    const ct = req?.headers?.["Content-Type"] || req?.headers?.["content-type"];
    if (
      ct &&
      String(ct).includes("application/json") &&
      req?.data &&
      typeof req.data !== "string"
    ) {
      req.data = JSON.stringify(req.data);
    }
  } catch {}

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
// Promise used to serialize refresh requests so concurrent requests wait
let refreshingAdminPromise: Promise<string | null> | null = null;

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
  // Read latest tokens from localStorage on every request (keeps in-memory in sync)
  const currentOrionKey =
    typeof window !== "undefined" && localStorage.getItem("orionKey")
      ? obfuscateToken(false, localStorage.getItem("orionKey") ?? "")
      : "";
  const currentOrionLoop =
    typeof window !== "undefined" && localStorage.getItem("orionLoop")
      ? obfuscateToken(false, localStorage.getItem("orionLoop") ?? "")
      : "";

  // No tokens available - admin needs to log in
  if (!currentOrionKey || !currentOrionLoop) {
    return handleAdminError(new Error("No authentication tokens found"));
  }

  // Decode token and check expiry
  try {
    const adminJWTDecode: any = jwtDecode(currentOrionKey);
    const isExpired = dayjs.unix(Number(adminJWTDecode.exp)).diff(dayjs()) < 1;

    // If token is valid, attach to request and proceed
    if (!isExpired) {
      req.headers = req.headers || {};
      req.headers.Authorization = `Bearer ${currentOrionKey}`;
      // Keep in-memory copy up-to-date
      orionKey = currentOrionKey;
      orionLoop = currentOrionLoop;
      return req;
    }

    // Token expired — attempt refresh. Use single shared promise to avoid parallel refreshes.
    if (!refreshingAdminPromise) {
      refreshingAdminPromise = (async () => {
        try {
          const res: any = await apiClientPublic.post(
            "/auth/refresh-token",
            {
              refreshToken: currentOrionLoop,
              accountType: "Admin",
            },
            {
              headers: {
                Authorization: `Bearer ${currentOrionKey}`,
              },
            }
          );

          const accessTokenNew = res.data.accessToken;
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "orionKey",
              obfuscateToken(true, accessTokenNew)
            );
          }
          orionKey = accessTokenNew;
          // If refresh token rotates, update it here as well
          // const refreshTokenNew = res.data.refreshToken;
          // if (refreshTokenNew) localStorage.setItem('orionLoop', obfuscateToken(true, refreshTokenNew));
          return accessTokenNew;
        } catch (err) {
          // Ensure we clear the shared promise before throwing
          refreshingAdminPromise = null;
          throw err;
        } finally {
          refreshingAdminPromise = null;
        }
      })();
    }

    // Await refreshed token (either the one we just started or one in progress)
    const newToken = await refreshingAdminPromise;
    if (!newToken)
      return handleAdminError(new Error("Failed to refresh token"));

    req.headers = req.headers || {};
    req.headers.Authorization = `Bearer ${newToken}`;
    return req;
  } catch (e: any) {
    return handleAdminError(e);
  }
});

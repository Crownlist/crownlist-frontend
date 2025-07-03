/* eslint-disable */
import Axios, { AxiosError } from "axios";
import {jwtDecode} from "jwt-decode";
import dayjs from "dayjs";
import { baseURL } from "@/constants";
import { obfuscateToken } from "@/constants/encryptData";


// Default API Config
const apiSettings = {
    baseURL: `${baseURL}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

// \\  API CLIENT FOR USERS  // \\
  // Instance to use for Unprotected endpoints
export const apiClientPublic = Axios.create(apiSettings);

// Get the Tokens in LocalStorage if they exist
let leoLoop: string = "";
let leoKey: string = "";

// Check if localStorage is available
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

// Adding the Authorization key to the Instance for Protected route
export const apiClientUser = Axios.create({
  ...apiSettings,
  headers: {
    ...apiSettings.headers,
    Authorization: `Bearer ${leoKey}`,
  },
});

// This function will be called when an error is encountered in the Protected endpoints
const handleUserError = (error: AxiosError | any) => {
  leoKey && localStorage.removeItem("leoKey");
  leoLoop && localStorage.removeItem("leoLoop");

  throw error.response?.data?.message || error.message;
};

// Instance to use for Protected endpoints
apiClientUser.interceptors.request.use(async (req: any) => {
  if (leoLoop && leoKey) {
    // jwtDecode is used to extract the expire time from the accessToken
    // dayjs is used to convert the expire time from UNIX format then extract and compares it
    // with the current time i.e. [.diff(dayjs()) < 1]
    const userJWTDecode: any = jwtDecode(leoKey);
    const isExpired = dayjs.unix(Number(userJWTDecode.exp)).diff(dayjs()) < 1;

    // If [isExpired] is false i.e. the accessToken is still valid it continues the request
    if (!isExpired) return req;

    // If [isExpired] is true then if refreshes the token before continuing the request
    try {
      const res: any = await apiClientPublic.post(
        "/auth/refresh-token",
        {
          refreshToken: leoLoop,
          accountType: "user",
        },
        {
          headers: {
            Authorization: `Bearer ${leoKey}`,
          },
        }
      );

      const accessTokenNew = res.data.accessToken;
      // const refreshTokenNew = res.data.refreshToken;
      req.headers.Authorization = `Bearer ${accessTokenNew}`;

      localStorage.setItem("leoKey", obfuscateToken(true, accessTokenNew));
      // localStorage.setItem(
      //   "leoLoop",
      //   obfuscateToken(true, refreshTokenNew)
      // );
    } catch (errorToken: any) {
      return handleUserError(errorToken);
    }
  } else {
    return handleUserError(req);
  }

  // After successfully refreshing the token it continues with the request
  return req;
});

apiClientUser.interceptors.response.use(
  (res: any) => {
    // If the response is successful, return the response data
    return res?.data;
  },
  (error: AxiosError | any) => {
    if (
      error?.response?.data?.message ===
      "Account with this token no longer exists"
    ) {
      handleUserError(error);
    }

    throw error?.response?.data?.message || error?.message;
  }
);
apiClientPublic.interceptors.response.use(
    (response: any) => {
      return response?.data;
    },
    (error: AxiosError | any) => {
      throw error?.response?.data?.message || error.message;
    }
  );
  
  

// \\  API CLIENT FOR ADMINS  // \\

// Get the Tokens in LocalStorage if they exist
let orionLoop: string = "";
let orionKey: string = "";

// Check if localStorage is available
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

export const apiClientAdmin = Axios.create({
    ...apiSettings,
    headers: {
      ...apiSettings.headers,
      Authorization: `Bearer ${orionKey}`,
    },
  });

  // This function will be called when an error is encountered in the Protected endpoints
const handleAdminError = (error: AxiosError | any) => {
    orionKey && localStorage.removeItem("orionKey");
    orionLoop && localStorage.removeItem("orionLoop");
    // next.router?.push("/owners/signin");
  
    throw String(error.response?.data?.message || error?.message);
  };
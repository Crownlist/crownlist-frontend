import { AdminSignin } from "./admin/auth";

export interface GetUserRes {
    status: string;
    data: {
      data: any;
      loggedInAccount: AdminSignin;
      message: string;
    };
  }

  export interface UserProfileProps {
    phoneNumber: string;
    lastname: string;
    firstname: string;
    address: string;
    city: string;
    country: string;
  }
  
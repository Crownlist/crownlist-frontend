export interface AdminSigninForm {
  email: string;
  password: string;
}


export interface AdminSignin {
  _id: string;
  firstname: string;
  fullName?: string;
  country?: string;
  state?: string;
  address?: string;
  lastname: string;
  email: string;
  adminCustomId: string;
  profilePicture: string;
  accountType: string;
  adminType: string;
  isAdmin: boolean;
  phoneNumber: string;
}

export interface AdminSigninNew {
  data: {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  adminCustomId: string;
  profilePicture: string;
  accountType: string;
  adminType: string;
  isAdmin: boolean;
  phoneNumber: string;
  }
}

export interface AdminSigninData {
  admin: AdminSignin;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface AdminSigninRes {
  status: string;
  data: AdminSigninData;
}

// Define a custom utility type similar to Omit
type Subset<T, K extends keyof T> = Pick<T, K>;

export type AdminPInfoProps = Subset<
  AdminSignin,
  "firstname" | "lastname" | "phoneNumber"
>;

export interface AdminResetPwdProps {
  oldPassword: string;
  newPassword: string;
}

//// For user logics ////////////////////////////////////

export interface UserSigninForm {
  email: string;
  password: string;
}

export interface UserSignupForm {
 fullName:string;
  email: string;
  phoneNumber?: string;
  accountType: 'Seller' | 'User' | string;
  password: string;
}

export interface UserSignin {
  fullName: string;
  token: string; // accessToken from API response
  id: string;    // _id from account/updatedAccount
  email: string; // email from account/updatedAccount
  createdAt: string;
  authMethod: string;
  // Add other properties you want to store in Redux for an Admin/Seller
  isAdmin?: boolean; // From the isAdmin field
  accountType?: "User" | "Seller"; // From the accountType field
  userCustomId?: string;
  profilePicture?: string;
  isVerified?: boolean;
  finishTourGuide?: boolean;

}

export interface UserSignup {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber? : string;
  password: string;
}
export interface UserSigninData {
  user: UserSignin;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface UserSignupData {
  user: UserSignup;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface UserSigninRes {
  status: string;
  data: UserSigninData;
}
export interface User {
  _id: string;
  fullname: string;
  email: string;
  profilePicture: string;
  authMethod: string;
  accountType: string;
  isVerified: boolean;
  finishTourGuide: boolean;
  isAdmin: boolean;
  phoneNumber: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string; // or Date if you'll convert it
}

export interface UserSignupRes {
  data: {
    account: User;
    message: string;
  };
  status: string;
}
// Define a custom utility type similar to Omit
// type Subset<T, K extends keyof T> = Pick<T, K>;

// export type UserPInfoProps = Subset<
//   UserSignin,
//   "firstname" | "lastname" | "phoneNumber"
// >;

export interface UserResetPwdProps {
  oldPassword: string;
  newPassword: string;
}

// export type UserPInfoProps = Subset<
//   UserSignin,
//   "firstname" | "lastname" | "phoneNumber"
// >;
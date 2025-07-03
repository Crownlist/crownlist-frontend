export interface AdminSigninForm {
  email: string;
  password: string;
}


export interface AdminSignin {
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
 fullname:string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface UserSignin {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  userCustomId: string;
  profilePicture: string;
  authMethod: string;
  accountType: string,
  phoneNumber? : string;
  country? : string;
  city? : string;
  dateOfBirth? : string;
  address?:string;
  finishTourGuide: boolean;
  isAdmin: boolean;
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
  createdAt: string; // or Date if you'll convert it
}

export interface UserSignupRes {
  data: {
    user: User;
    message: string;
    accessToken: string;
  refreshToken: string;
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

export type UserPInfoProps = Subset<
  UserSignin,
  "firstname" | "lastname" | "phoneNumber"
>;
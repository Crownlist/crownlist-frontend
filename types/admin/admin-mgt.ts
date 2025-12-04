import { MediaAppMeta } from "./add-media-print";

export interface Admin {
  _id: string;
  email: string;
  adminCustomId?: string;
  accountType: string;
  adminType: string;
  profilePicture?: string;
  isAdmin: boolean;
  createdAt: string;
  deletedAt?: boolean;
  // Optional fields for backward compatibility
  firstname?: string;
  lastname?: string;
  role?: string;
  phoneNumber?: string;
  password?: string;
}

export interface AdminsResponse {
  admins: Admin[];
  totalAdmins: number;
}

export interface AdminApiResponse {
  status: string;
  data: AdminsResponse;
  meta: MediaAppMeta;
}

export interface AdminBlockType {
  adminId: string;
  blockDecision: boolean;
}

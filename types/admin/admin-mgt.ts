import { MediaAppMeta } from "./add-media-print";

export interface Admin {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  adminCustomId?: string;
  accountType?: string;
  role?: string;
  adminType: string;
  phoneNumber?: string;
  profilePicture?: string;
  password?: string;
  isAdmin?: boolean;
  deletedAt?: boolean;
  createdAt?: Date;
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

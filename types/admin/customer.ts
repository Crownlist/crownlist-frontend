export interface Customer {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  userCustomId: string;
  authMethod: string;
  accountType: string;
  profilePicture: string;
  phoneNumber: string;
  address: string;
  isAdmin: boolean;
  finishTourGuide: boolean;
  deletedAt?: boolean;
  createdAt?: Date;
}

export interface CustomerData {
  users: Customer[];
  totalUsers: number;
}

export interface CustomerApiRes {
  status: string;
  data: CustomerData;
  meta: MediaMetadata;
}

export interface CustBlockType {
  userId: string;
  blockDecision: boolean;
}

export interface SingleCustRes {
  status: string;
  data: Customer;
}

export interface Transaction {
  _id: string;
  userId: string;
  orderId: string;
  transactionCustomId: string;
  transactionType: string;
  amount: number;
  status: string;
  paymentMethod: string;
  paymentComment: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Data {
  transactions: Transaction[];
}

export interface Meta {
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
}

export interface TrnsactionApiRes {
  status: string;
  data: Data;
  meta: Meta;
}

export interface Media {
  _id: string;
  mediaType: string;
  status: string;
  mediaCustomId: string;
  description: string;
  nextAvailable: string;
  cityLga: string;
  dimension: string;
  state: string;
  createdByAdmin: string;
  favoriteCount: number;
  address: string;
  landmark: string;
  listingTitle: string;
  googleStreetlink: string;
  deletedAt: string | null;
  pictures: any[];
  __v: number;
}

export interface Favorite {
  _id: string;
  userId: string;
  mediaId: Media;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Data {
  favorites: Favorite[];
  message: string;
}

export interface FavApiRes {
  status: string;
  data: Data;
}

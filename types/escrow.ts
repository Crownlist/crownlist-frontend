export interface EscrowImage {
  url: string;
  altText: string;
  isPrimary: boolean;
  _id: string;
}

export interface EscrowDetails {
  price: {
    currentPrice: number;
    discountedPrice?: number;
  };
  name: string;
  slug: string;
  description: string;
  images: EscrowImage[];
}

export interface EscrowPerson {
  _id: string;
  fullName: string;
  email: string;
  accountType: string;
  profilePicture: string;
  phone?: string;
}

export interface EscrowItem {
  _id: string;
  detailsType: string;
  details: EscrowDetails;
  seller: EscrowPerson;
  buyer: EscrowPerson;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentReference?: string;
  paymentUrl?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default EscrowItem;

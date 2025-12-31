export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: Array<{
    url: string;
    altText?: string;
    isPrimary: boolean;
    _id: string;
  }>;
  price: {
    currentPrice: number;
    discountedPrice?: number;
  };
  seller: string;
  category: string;
  subCategory: string;
  features: string[];
  isFeatured: boolean;
  status: string;
  listingLocation: {
    country: string;
    city: string;
  };
  likes: {
    totalLikes: number;
    likedBy: string[];
  };
  ratings: {
    averageRating: number;
    totalRatings: number;
  };
  facility: string;
  createdAt: string;
  updatedAt: string;
};

export type ListingsData = {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

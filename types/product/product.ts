export interface ProductImage {
  url: string
  altText?: string
  isPrimary: boolean
  _id: string
}

export interface ProductPrice {
  currentPrice: number
  discountedPrice?: number
}

export interface ProductLikes {
  totalLikes: number
  likedBy: string[]
}

export interface ProductRatings {
  averageRating: number
  totalRatings: number
}

export interface ProductLocation {
  country: string
  city: string
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  images: ProductImage[]
  seller: string
  category: string
  subCategory: string
  features: string[]
  price: ProductPrice
  likes: ProductLikes
  ratings: ProductRatings
  listingLocation: ProductLocation
  isFeatured: boolean
  status: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ProductsResponse {
  status: string
  data: {
    products: Product[]
    totalProducts: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

/**
 * Server-side product service for fetching product data
 * Used for both server-side rendering and generating metadata
 */

import { baseURL } from "@/constants";

export interface ProductImage {
  url: string;
  altText?: string;
}

export interface Price {
  currentPrice: number;
  discountedPrice?: number;
}

export interface Category {
  _id?: string;
  name: string;
  slug: string;
}

export interface Seller {
  _id: string;
  fullName: string;
  profileImage?: string;
  rating?: number;
  reviews?: number;
}

export interface Location {
  state?: string;
  city: string;
  country?: string;
}

export interface Facility {
  label?: string;
  value?: string;
  facility?: string;
  detail?: string;
}

export interface ServerProductData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images: ProductImage[];
  category?: Category;
  subCategory?: Category;
  status: string;
  condition?: string;
  createdAt: string;
  updatedAt?: string;
  price: Price;
  facility?: {
    facilities: Facility[];
  };
  features?: string[];
  listingLocation?: Location;
  seller?: Seller;
  views?: number;
  likes?: number;
}

export interface ReviewBuyer {
  _id: string;
  fullName: string;
  profilePicture?: string;
  id: string;
}

export interface ProductReview {
  _id: string;
  product: string;
  buyer: ReviewBuyer;
  escrow: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ReviewPagination {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  limit: number;
}

export interface ReviewsResponse {
  reviews: ProductReview[];
  pagination: ReviewPagination;
}

export interface ProductServiceResponse {
  product: ServerProductData;
  [key: string]: unknown;
}

/**
 * Fetch product by slug from the server
 * Used in generateMetadata and server components
 */
export async function fetchProductBySlug(
  slug: string
): Promise<ServerProductData | null> {
  if (!slug || !baseURL) {
    console.error("Missing slug or baseURL");
    return null;
  }

  try {
    const response = await fetch(`${baseURL}products/slug/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60, // ISR: Revalidate every 60 seconds
        tags: ["product", `product-${slug}`],
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = (await response.json()) as { data: ProductServiceResponse };
    return data.data?.product || null;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch similar products for recommendations
 */
export async function fetchSimilarProducts(
  categorySlug: string,
  limit: number = 4,
  excludeProductId?: string
): Promise<ServerProductData[]> {
  if (!categorySlug || !baseURL) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      categorySlug,
      limit: limit.toString(),
      ...(excludeProductId && { exclude: excludeProductId }),
    });

    const response = await fetch(`${baseURL}products?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 120, // ISR: Revalidate every 2 minutes
        tags: ["products", `category-${categorySlug}`],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch similar products: ${response.status}`);
    }

    const data = (await response.json()) as Record<string, unknown>;
    const products =
      // @ts-expect-error no check
      (data?.data.products as { data: ServerProductData[] }) ||
      (data as unknown as ServerProductData[]) ||
      [];
    return Array.isArray(products) ? products.slice(0, limit) : [];
  } catch (error) {
    console.error(
      `Error fetching similar products for ${categorySlug}:`,
      error
    );
    return [];
  }
}

/**
 * Generate SEO metadata from product data
 */
export function generateProductMetadata(product: ServerProductData) {
  const title = `${product.name} | Crownlist - Buy & Sell Online`;
  const description =
    product.description?.slice(0, 160) ||
    `${product.name} for sale on Crownlist. ${
      product.condition || "Quality"
    } product at ₦${(product.price?.currentPrice || 0).toLocaleString()}`;

  const imageUrl = product.images?.[0]?.url || "/og-image.jpg";
  const url = `https://crownlist.com/product/${product.slug}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category?.name,
      product.subCategory?.name,
      "Crownlist",
      "Buy online",
      "Sell online",
    ]
      .filter(Boolean)
      .join(", "),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      siteName: "Crownlist",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Format product date for display
 */
export function formatProductDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    }

    const days = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(days / 365);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  } catch {
    return new Date(dateString).toLocaleDateString();
  }
}

/**
 * Fetch product reviews by product ID
 * Used for displaying ratings and reviews on product detail pages
 */
export async function fetchProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewsResponse> {
  if (!productId || !baseURL) {
    console.error("Missing productId or baseURL");
    return {
      reviews: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalReviews: 0,
        limit: 10,
      },
    };
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${baseURL}/product-reviews/product/${productId}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 120, // ISR: Revalidate every 2 minutes
          tags: ["reviews", `product-reviews-${productId}`],
        },
      }
    );
    console.log("response", response);
    if (!response.ok) {
      if (response.status === 404) {
        return {
          reviews: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalReviews: 0,
            limit: 10,
          },
        };
      }
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    const data = (await response.json()) as { data: ReviewsResponse };
    return (
      data.data || {
        reviews: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalReviews: 0,
          limit: 10,
        },
      }
    );
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return {
      reviews: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalReviews: 0,
        limit: 10,
      },
    };
  }
}

/**
 * Format price with currency
 */
export function formatPrice(price: number): string {
  return `₦${price.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

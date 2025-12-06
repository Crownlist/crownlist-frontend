import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClientPublic } from "@/lib/interceptor";

export interface ProductData {
  _id: string;
  name: string;
  description?: string;
  images: Array<{ url: string; altText?: string }>;
  category?: { name: string; slug: string };
  subCategory?: { name: string; slug: string };
  status: string;
  createdAt: string;
  price: {
    currentPrice: number;
    discountedPrice?: number;
  };
  facility?: {
    facilities: Array<{ label: string; value: string }>;
  };
  features?: string[];
  listingLocation?: {
    city: string;
  };
}

export interface CurrentProductData {
  id: string;
  title: string;
  postedDate: string;
  condition: string;
}

export interface ApiResponse {
  product: ProductData;
  [key: string]: unknown;
}

export interface ApiError {
  code?: string;
  status?: string;
  message?: string;
  response?: {
    data?: ApiError;
  };
}

export const useProductData = (productSlug: string | null) => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentProduct, setCurrentProduct] =
    useState<CurrentProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProduct = async () => {
    if (!productSlug) return;

    try {
      setIsLoading(true);
      const res = await apiClientPublic.get(`/products/slug/${productSlug}`);
      const responseData = res.data as ApiResponse;

      if (res.status === 404 || !responseData.product) {
        console.log("Redirecting to search page - product not found");
        router.push(`/search/${productSlug}`);
        return;
      }

      if (responseData.product) {
        const productData = responseData.product;
        setProduct(productData);

        // Update images from API
        const apiImages = productData.images.map((img) => img.url);
        setImages(apiImages.length > 0 ? apiImages : ["/product1.png"]);

        // Update current product for ProductDetails component
        setCurrentProduct({
          id: productData._id,
          title: productData.name,
          postedDate: new Date(productData.createdAt).toLocaleDateString(),
          condition: productData.status === "live" ? "Brand New" : "Used",
        });
      }
    } catch (e: unknown) {
      const error = e as ApiError;
      console.log(`Failed to load product: ${String(error?.message || e)}`);
      console.log("Error response:", error.response?.data);
      router.push(`/search/${productSlug}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productSlug) {
      fetchProduct();
    }
  }, [productSlug]);

  return {
    product,
    images,
    currentProduct,
    isLoading,
    refetch: fetchProduct,
  };
};

import React from "react";
import Image from "next/image";
import { ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductImageGalleryClient from "./ProductImageGalleryClient";
import { ServerProductData } from "@/lib/server/product-service";

interface ProductImageGalleryProps {
  images: string[];
  product?: ServerProductData;
  productId?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  product,
  productId,
}) => {
  if (!images.length) {
    return (
      <div className="relative h-[200px] md:h-[400px] w-full bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return <ProductImageGalleryClient images={images} productId={productId} />;
};

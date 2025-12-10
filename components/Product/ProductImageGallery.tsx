import React from "react";
import ProductImageGalleryClient from "./ProductImageGalleryClient";

interface ProductImageGalleryProps {
  images: string[];
  productId?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
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

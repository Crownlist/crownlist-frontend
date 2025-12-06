import React from "react";
import Image from "next/image";
import { ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  liked: boolean;
  toggling: boolean;
  onLike: (e: React.MouseEvent) => void;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  liked,
  toggling,
  onLike,
}) => {
  const [currentImage, setCurrentImage] = React.useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!images.length) {
    return (
      <div className="relative h-[200px] md:h-[400px] w-full bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative mb-2 md:mb-4">
        <div className="relative h-[200px] md:h-[400px] w-full">
          <Image
            src={images[currentImage] || "/placeholder.svg"}
            alt="Product"
            fill
            className="object-contain bg-white rounded-md"
          />
          <button
            onClick={onLike}
            disabled={toggling}
            aria-label={liked ? "Unlike" : "Like"}
            className="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                liked ? "fill-red-500 text-red-500" : "text-gray-500"
              )}
            />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md"
          onClick={prevImage}
          aria-label="Previous image"
        >
          <ChevronRight size={18} className="text-gray-500 rotate-180" />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md"
          onClick={nextImage}
          aria-label="Next image"
        >
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-2 mb-8">
        {images.map((image, index) => (
          <button
            key={index}
            className={`h-16 w-16 relative border-2 rounded-md overflow-hidden ${
              index === currentImage ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

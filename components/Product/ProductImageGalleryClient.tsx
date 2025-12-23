"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useLikedProductsContext } from "@/context/LikedProductsContext";
import { useToast } from "@/lib/useToastMessage";
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import { OnlyBuyerCanLikeModal } from "@/components/OnlyBuyerCanLikeModal";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

interface ProductImageGalleryClientProps {
  images: string[];
  productId?: string;
}

export default function ProductImageGalleryClient({
  images,
  productId,
}: ProductImageGalleryClientProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const router = useRouter();
  const { toggleLike, products: likedProducts } = useLikedProductsContext();
  const { handleMessage } = useToast();
  const { data: userData } = useGetAuthUser("User");

  const isBuyer = userData?.data?.loggedInAccount?.accountType === "User";
  const isSeller =
    userData?.data?.loggedInAccount?.accountType === "Seller" ||
    userData?.data?.loggedInAccount?.accountType === "Admin";

  useEffect(() => {
    if (productId) {
      const isLiked = likedProducts.some((p) => p._id === productId);
      setLiked(isLiked);
    }
  }, [likedProducts, productId]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggling) return;

    // Check authentication
    const isAuthenticated =
      typeof window !== "undefined" && !!localStorage.getItem("leoKey");
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Check if user is seller
    if (isSeller) {
      setShowSellerModal(true);
      return;
    }

    if (!productId) return;

    setToggling(true);
    const newLiked = !liked;
    setLiked(newLiked);

    try {
      await toggleLike(productId);
      const message = newLiked
        ? "Added to saved items"
        : "Removed from saved items";
      handleMessage("success", message);
    } catch (err: unknown) {
      setLiked(!newLiked); // revert
      const errorMessage =
        err instanceof Error ? err.message : "Failed to toggle like";
      handleMessage("error", errorMessage);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className="space-y-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Product images"
    >
      {/* Main Image */}
      <div className="relative bg-white rounded-lg overflow-hidden">
        <div
          className="relative w-full aspect-square sm:aspect-auto sm:h-[500px] cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => setShowLightbox(true)}
        >
          <Image
            src={images[currentImage] || "/placeholder.svg"}
            alt={`Product image ${currentImage + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
            priority={currentImage === 0}
          />

          {/* Like Button - Only show for logged-in buyers */}
          {isBuyer && (
            <button
              onClick={handleLike}
              disabled={toggling}
              className={cn(
                "absolute top-3 right-3 sm:top-4 sm:right-4 h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50",
                liked && "animate-pulse"
              )}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                className={cn(
                  "h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300",
                  liked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-400 hover:text-red-500 hover:scale-105"
                )}
              />
            </button>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {currentImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Navigation Arrows - Only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 hover:opacity-100 sm:opacity-80 sm:hover:opacity-100"
              onClick={prevImage}
              aria-label="Previous image"
              title="Previous image (or use ← arrow key)"
            >
              <ChevronRight size={20} className="text-gray-800 rotate-180" />
            </button>
            <button
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 hover:opacity-100 sm:opacity-80 sm:hover:opacity-100"
              onClick={nextImage}
              aria-label="Next image"
              title="Next image (or use → arrow key)"
            >
              <ChevronRight size={20} className="text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-lg border-2 overflow-hidden transition-all",
                index === currentImage
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setCurrentImage(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === currentImage}
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
      )}

      <OnlyBuyerCanLikeModal
        open={showSellerModal}
        onOpenChange={setShowSellerModal}
      />

      {/* Lightbox Gallery */}
      <Lightbox
        open={showLightbox}
        close={() => setShowLightbox(false)}
        slides={images.map((src) => ({ src }))}
        index={currentImage}
        plugins={[Counter]}
        on={{
          view: ({ index }) => setCurrentImage(index ?? 0),
        }}
      />
    </div>
  );
}

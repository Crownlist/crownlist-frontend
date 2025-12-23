/*eslint-disable*/
"use client";

import Image from "next/image";
import { Heart, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
//import ProductCard from "./Product-card"
import { useRouter } from "next/navigation";
import { useLikedProductsContext } from "@/context/LikedProductsContext";
import { useToast } from "@/lib/useToastMessage";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { cn } from "@/lib/utils";
import { useGetAuthUser } from "@/lib/useGetAuthUser";

interface ProductItem {
  id: string;
  slug?: string;
  title: string;
  description: string;
  location: string;
  category: string;
  price: string;
  image: string;
}

interface SponsoredPostProps {
  items: ProductItem[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

export default function SponsoredPost({
  items,
  autoSlide = true,
  autoSlideInterval = 5000,
}: SponsoredPostProps) {
  const router = useRouter();
  const { products: likedProducts, toggleLike: apiToggleLike } =
    useLikedProductsContext();
  const { handleMessage } = useToast();
  const { data: userData } = useGetAuthUser("User");
  const isBuyerLoggedIn =
    userData?.data?.loggedInAccount?.accountType === "User";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [togglingLike, setTogglingLike] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Auto slide functionality
  useEffect(() => {
    if (!autoSlide) return;

    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);

    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval, items.length]);

  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Check if item is liked
  const isItemLiked = (id: string) => {
    return likedProducts.some((product) => product._id === id);
  };

  // Handle like toggle
  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (togglingLike) return;

    // Check authentication
    const isAuthenticated =
      typeof window !== "undefined" && !!localStorage.getItem("leoKey");
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setTogglingLike(id);
    // const wasLiked = isItemLiked(id)

    try {
      await apiToggleLike(id);
      const isLiked = isItemLiked(id);
      const message = isLiked
        ? "Removed from saved items"
        : "Added to saved items";
      handleMessage("success", message);
      // Success - the likedProducts list will be updated automatically by the hook
    } catch (err: any) {
      handleMessage("error", err.message || "Failed to toggle like");
      // Reset state on error - but since we're using the hook's data, it should be reverted automatically
    } finally {
      setTogglingLike(null);
    }
  };

  const handleCardClick = (item: ProductItem) => {
    router.push(`/product/${item.slug || item.id}`);
  };

  // If no items provided, show placeholder
  if (!items || items.length === 0) {
    return <div className="w-full max-w-3xl">No sponsored posts available</div>;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="w-full  md:flex md:justify-center">
      {/* <div className="text-[#333] font-medium text-base mb-2">Sponsored post</div> */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden cursor-pointer">
        {/* Main Image */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          onClick={() => handleCardClick(currentItem)}
          role="button"
          tabIndex={0}
          aria-label={`View details for ${currentItem.title}`}
        >
          <Image
            src={currentItem.image || "/placeholder.svg"}
            alt={currentItem.title}
            fill
            className="object-cover sm:object-contain"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          aria-label="Previous item"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          aria-label="Next item"
        >
          <ChevronRight size={20} />
        </button>

        {/* Like Button - Only show for logged-in buyers */}
        {isBuyerLoggedIn && (
          <button
            className="absolute top-4 right-4 text-gray-200  transition-colors z-10 disabled:opacity-50"
            onClick={(e) => handleLike(e, currentItem.id)}
            disabled={togglingLike === currentItem.id}
            aria-label={isItemLiked(currentItem.id) ? "Unlike" : "Like"}
          >
            <Heart
              size={24}
              className={cn(
                isItemLiked(currentItem.id)
                  ? "fill-red-500 text-red-500"
                  : "none"
              )}
            />
          </button>
        )}

        {/* Content Overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white z-10"
          onClick={() => handleCardClick(currentItem)}
        >
          <h2 className="text-2xl font-bold mb-1">{currentItem.title}</h2>
          <p className="text-sm mb-2">{currentItem.description}</p>

          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-white/80" />
            <span className="text-sm text-white/90">
              {currentItem.location}
            </span>
            <div className="mx-2 text-white/50">|</div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">
              {currentItem.category}
            </span>
          </div>

          <div className="text-xl font-bold">{currentItem.price}</div>
        </div>

        {/* Slide Indicators */}
        {items.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        title="Login Required"
        description="You need to be logged in to like products."
        confirmText="Login"
        cancelText="Cancel"
        onConfirm={() => router.push("/auth/login")}
      />
    </div>
  );
}

/* eslint-disable */
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLikedProductsContext } from "@/context/LikedProductsContext";
import { useToast } from "@/lib/useToastMessage";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import { OnlyBuyerCanLikeModal } from "@/components/OnlyBuyerCanLikeModal";

interface ProductCardProps {
  id: string | number;
  slug?: string;
  image: string;
  title: string;
  price: string;
  description: string;
  location?: string;
  isSponsored?: boolean;
  condition?: string;
  viewMode?: "grid" | "list";
  labels?: string[];
  breadcrumbCat?: string;
  breadcrumbSub?: string;
  breadcrumbLabel?: string;
  useBreadcrumbRouting?: boolean;
  isLiked?: boolean;
}

export default function ProductCard({
  id,
  slug,
  image,
  title,
  price,
  description,
  location,
  isSponsored,
  condition,
  viewMode = "grid",
  labels = [],
  breadcrumbCat,
  breadcrumbSub,
  breadcrumbLabel,
  useBreadcrumbRouting = false,
  isLiked = false,
}: ProductCardProps) {
  const { toggleLike, products: likedProducts } = useLikedProductsContext();
  const { handleMessage } = useToast();
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [toggling, setToggling] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const router = useRouter();
  const { data: userData } = useGetAuthUser("User");

  useEffect(() => {
    const isLiked = likedProducts.some((p) => p._id === id);
    setLiked(isLiked);
  }, [likedProducts, id]);

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
    if (
      userData?.data?.loggedInAccount?.accountType === "Seller" ||
      userData?.data?.loggedInAccount?.accountType === "Admin"
    ) {
      setShowSellerModal(true);
      return;
    }

    if (!id) return;

    setToggling(true);
    const newLiked = !liked;
    setLiked(newLiked);

    try {
      await toggleLike(String(id));
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

  const handleClick = () => {
    if (useBreadcrumbRouting && breadcrumbCat && breadcrumbSub) {
      router.push(`/${breadcrumbCat}/${breadcrumbSub}`);
      return;
    }
    router.push(`/product/${slug || id}`);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow  cursor-pointer",
          viewMode === "list" && "flex"
        )}
      >
        <div
          className={cn(
            "relative",
            viewMode === "grid"
              ? "aspect-3/2 w-full "
              : // "h-[120px] w-[120px] sm:h-[180px] sm:w-[140px]"
                "aspect-4/3 w-[140px] sm:w-[200px]"
          )}
          //  className="relative aspect-[4/3]"
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />

          {/* Like button - Only show for logged-in buyers */}
          {userData?.data?.loggedInAccount?.accountType === "User" && (
            <button
              className={cn(
                "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-all",
                liked && "bg-red-50"
              )}
              onClick={handleLike}
              disabled={toggling}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  liked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-500 hover:scale-105"
                )}
              />
            </button>
          )}

          {isSponsored && (
            <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
              Sponsored
            </div>
          )}
        </div>

        <div className={cn("p-3", viewMode === "list" && "flex-1")}>
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {description}
          </p>

          <p className="font-semibold text-sm mt-1.5">{price}</p>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
            {location && (
              <span className="text-gray-500 text-xs">{location}</span>
            )}
            {/* {time && <span className="text-gray-500 text-xs">Used</span>} */}
            {/* {distance && (
              <span className="text-gray-500 text-xs">{distance}</span>
            )} */}
          </div>
        </div>
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

      <OnlyBuyerCanLikeModal
        open={showSellerModal}
        onOpenChange={setShowSellerModal}
      />
    </>
  );
}

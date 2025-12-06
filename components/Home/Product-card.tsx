/* eslint-disable */
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLikedProducts } from "@/hooks/useLikedProducts";
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
  time?: string;
  distance?: string;
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
  time,
  distance,
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
  const { toggleLike } = useLikedProducts();
  const { handleMessage } = useToast();
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [toggling, setToggling] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const router = useRouter();
  const { data: userData } = useGetAuthUser("User");

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggling) return;

    // Check authentication
    const isAuthenticated =
      typeof window !== "undefined" && !!localStorage.getItem("leoKey");
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // Check if user is seller
    if (userData?.data?.data?.loggedInAccount?.accountType === "Seller") {
      setShowSellerModal(true);
      return;
    }

    setToggling(true);
    const newLiked = !liked;
    setLiked(newLiked);

    try {
      await toggleLike(String(id));
    } catch (err: any) {
      setLiked(!newLiked); // revert
      handleMessage("error", err.message || "Failed to toggle like");
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
              ? "aspect-[3/2] w-full "
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
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
              onClick={handleLike}
              disabled={toggling}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  liked ? "fill-red-500 text-red-500" : "text-gray-500"
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
            {time && <span className="text-gray-500 text-xs">Used</span>}
            {distance && (
              <span className="text-gray-500 text-xs">{distance}</span>
            )}
          </div>

          {/* {labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {labels.map((label, index) => (
              <span key={index} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {label}
              </span>
            ))}
          </div>
        )} */}

          {/* {viewMode === "list" && (
          <div className="mt-2">
            <Button variant="outline" size="sm" className="text-xs h-7 px-3 rounded-full">
              See more
            </Button>
          </div>
        )} */}
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

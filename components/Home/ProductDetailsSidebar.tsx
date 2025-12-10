/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import { ServerProductData } from "@/lib/server/product-service";
import { cn } from "@/lib/utils";
import { apiClientUser } from "@/lib/interceptor";

interface ProductDetailsSidebarProps {
  product: ServerProductData;
  postedDate: string;
}

export default function ProductDetailsSidebar({
  product,
  postedDate,
}: ProductDetailsSidebarProps) {
  const [liked, setLiked] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [view, setView] = useState<
    "default" | "requestEscrow" | "confirmEscrow"
  >("default");
  const [isCreatingEscrow, setIsCreatingEscrow] = useState(false);
  const router = useRouter();
  const { data: authData } = useGetAuthUser("User");

  const isBuyerLoggedIn =
    authData?.data?.loggedInAccount?.accountType === "User";
  const isSeller =
    authData?.data?.loggedInAccount?.accountType === "Seller" ||
    authData?.data?.loggedInAccount?.accountType === "Admin";
  const isCurrentUserSeller =
    isSeller && product.seller?._id === authData?.data?.loggedInAccount?._id;

  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!(
      localStorage.getItem("leoKey") || localStorage.getItem("orionKey")
    );
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      router.push("/auth/login");
      return;
    }

    setToggling(true);
    try {
      // API call would go here
      setLiked(!liked);
      toast.success(liked ? "Removed from likes" : "Added to likes", {
        position: "bottom-center",
      });
    } catch {
      toast.error("Failed to like product", { position: "bottom-center" });
    } finally {
      setToggling(false);
    }
  };

  const handleSendMessageClick = () => {
    if (!isLoggedIn()) {
      router.push("/auth/login");
      return;
    }

    if (product?.seller?._id) {
      const params = new URLSearchParams({
        sellerId: product.seller._id,
        sellerName: product.seller.fullName || "Seller",
        sellerAvatar: product.seller.profileImage || "/profile.png",
        productId: product._id,
        productName: product.name || "Product",
      });
      router.push(`/buyer/messages?${params.toString()}`);
    } else {
      router.push("/buyer/messages");
    }
  };

  const shareOnWhatsApp = () => {
    const link = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/product/${product.slug || product._id}`;
    const text = `Check out this product: ${product.name}\n${link}`;

    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: product.name,
          text: "Found this on Crownlist",
          url: link,
        });
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
      }
    }
  };

  const copyLink = async () => {
    const link = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/product/${product.slug || product._id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!", {
        position: "bottom-center",
      });
    } catch {
      toast.error("Failed to copy link", { position: "bottom-center" });
    }
  };

  const handleRequestEscrow = async () => {
    if (!isBuyerLoggedIn) {
      const currentUrl = encodeURIComponent(
        typeof window !== "undefined" ? window.location.href : ""
      );
      router.push(`/auth/login?returnUrl=${currentUrl}&showEscrow=true`);
      return;
    }
    setView("requestEscrow");
  };

  const handleEscrowProceed = async () => {
    setView("confirmEscrow");
  };

  const handleCreateEscrow = async () => {
    if (!isBuyerLoggedIn || !authData?.data?.loggedInAccount || !product)
      return;

    setIsCreatingEscrow(true);
    try {
      // TODO: Integrate with actual API endpoint
      const escrowData = {
        detailsType: "Product",
        details: product._id,
        seller: product.seller?._id,
        buyer: authData.data.loggedInAccount._id,
        amount: product.price?.discountedPrice || product.price?.currentPrice,
      };

      // Placeholder for actual API call
      const response = await apiClientUser.post("/escrows/create", escrowData);
      router.push(`${response.data.paymentUrl}`);

      toast.success("Escrow request created successfully!", {
        position: "bottom-center",
      });
      // For now, just redirect to confirmEscrow view
      setTimeout(() => {
        setView("default");
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create escrow", {
        position: "bottom-center",
      });
    } finally {
      setIsCreatingEscrow(false);
    }
  };

  const sellerImage = product.seller?.profileImage || "/profile.png";
  const currentPrice = product.price?.currentPrice || 0;
  const discountedPrice = product.price?.discountedPrice;
  const discount = discountedPrice
    ? Math.round(((currentPrice - discountedPrice) / currentPrice) * 100)
    : null;

  return (
    <>
      <Toaster />
      {view === "default" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {/* Price Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-white">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ₦{currentPrice.toLocaleString("en-NG")}
                </span>
                {discountedPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₦{discountedPrice.toLocaleString("en-NG")}
                    </span>
                    {discount && (
                      <span className="text-sm font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">
                        Save {discount}%
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Posted {postedDate}
              </p>
            </div>
          </div>

          {/* Seller Information */}
          {product.seller && (
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={sellerImage}
                    alt={product.seller.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {product.seller.fullName}
                  </h4>
                  {product.seller.rating && (
                    <p className="text-xs text-gray-600">
                      ⭐ {product.seller.rating} ({product.seller.reviews || 0}{" "}
                      reviews)
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {!isSeller && (
                  <>
                    <Button
                      onClick={handleSendMessageClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <MessageCircle size={18} />
                      Send Message
                    </Button>
                    <Button
                      onClick={handleRequestEscrow}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      Request Escrow
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className="hidden p-4 sm:p-6 border-b border-gray-200 space-y-3">
            <div className="space-y-2">
              <p className="text-xs text-gray-600 uppercase font-semibold">
                Condition
              </p>
              <p className="text-sm sm:text-base font-medium text-gray-900">
                {product.condition || product.status || "Not specified"}
              </p>
            </div>

            {product.listingLocation && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 uppercase font-semibold">
                  Location
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  {product.listingLocation.city}
                  {product.listingLocation.state &&
                    `, ${product.listingLocation.state}`}
                </p>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 uppercase font-semibold">
                  Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      +{product.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 sm:p-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* Only show like button if user is logged in as buyer and not the seller */}
              {isBuyerLoggedIn && !isCurrentUserSeller && (
                <button
                  onClick={handleLike}
                  disabled={toggling}
                  className="py-2 sm:py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700 disabled:opacity-50"
                >
                  <Heart
                    size={18}
                    className={cn(
                      "transition-colors",
                      liked ? "fill-red-500 text-red-500" : "text-gray-600"
                    )}
                  />
                  <span className="hidden sm:inline">Like</span>
                </button>
              )}

              <button
                onClick={shareOnWhatsApp}
                className="py-2 sm:py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            <button
              onClick={copyLink}
              className="w-full py-2 sm:py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
            >
              <Copy size={18} />
              Copy Link
            </button>
          </div>

          {/* Safety Notice */}
          <div className="p-4 sm:p-6 bg-blue-50 border-t border-blue-200">
            <p className="text-xs text-blue-900">
              💡 <span className="font-semibold">Tip:</span> Meet in a safe,
              public location for in-person transactions.
            </p>
          </div>
        </div>
      )}

      {view === "requestEscrow" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6">
          <button
            onClick={() => setView("default")}
            className="text-gray-500 text-lg hover:text-gray-700 mb-3"
          >
            ←
          </button>
          <h2 className="text-xl font-bold mb-4">What is Escrow?</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold">⚖️</span>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">
                  Secure Payment Protection
                </p>
                <p className="text-xs text-gray-600">
                  Your payment is held safely until you confirm receipt
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-green-600 font-bold">🔒</span>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">
                  Buyer & Seller Protection
                </p>
                <p className="text-xs text-gray-600">
                  Both parties are protected throughout the transaction
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <span className="text-yellow-600 font-bold">⭐</span>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">
                  Trusted Process
                </p>
                <p className="text-xs text-gray-600">
                  Thousands of successful transactions completed
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Escrow is a secure payment method that protects both buyer and
            seller. The payment is held by CrownList until the buyer confirms
            receipt of the item.
          </p>
          <div className="space-y-2">
            <button
              onClick={handleEscrowProceed}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Proceed with Escrow
            </button>
            <button
              onClick={() => setView("default")}
              className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {view === "confirmEscrow" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6">
          <button
            onClick={() => setView("requestEscrow")}
            className="text-gray-500 text-lg hover:text-gray-700 mb-3"
          >
            ←
          </button>
          <h2 className="text-xl font-bold mb-4">Confirm Escrow Request</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <Image
                  src={sellerImage}
                  alt={product.seller?.fullName || "Seller"}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Seller: {product.seller?.fullName}
              </span>
            </div>
            <p className="text-sm text-gray-700">Product: {product.name}</p>
            <p className="text-sm text-gray-700">
              Amount: ₦
              {(
                product.price?.discountedPrice || product.price?.currentPrice
              )?.toLocaleString("en-NG")}
            </p>
            <p className="text-xs text-gray-600">
              You will pay this amount to escrow. Funds will be released to the
              seller only after you confirm receipt.
            </p>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleCreateEscrow}
              disabled={isCreatingEscrow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {isCreatingEscrow
                ? "Creating Escrow..."
                : "Confirm & Create Escrow"}
            </button>
            <button
              onClick={() => setView("requestEscrow")}
              className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-semibold"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}

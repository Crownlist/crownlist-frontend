/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClientAdmin } from "@/lib/interceptor";
import { PromoteProductModal } from "@/components/promote-product-modal";
import { toast } from "sonner";

// type Product = {
//   _id: string;
//   name: string;
//   description?: string;
//   images?: Array<{ url: string; altText?: string; isPrimary?: boolean }> | string[];
//   price?: { currentPrice?: number; discountedPrice?: number };
//   listingLocation?: { country?: string; city?: string };
//   features?: string[];
//   facility?: { _id?: string; facilities?: Array<{ label: string; value: any; _id?: string }> };
//   likes?: { totalLikes?: number; likedBy?: string[] };
//   ratings?: { averageRating?: number; totalRatings?: number };
//   slug?: string;
//   seller?: string;
//   category?: string;
//   subCategory?: string;
//   isFeatured?: boolean;
//   status?: string;
//   createdAt?: string;
//   updatedAt?: string;
// };

export default function SellerProductDetailsDynamic() {
  const params = useParams();
  const id = (params?.slug as string) || "";
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [reasonForDecline, setReasonForDecline] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchById = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClientAdmin.get(`/products/all?product_id=${id}`);
        console.log("res", res?.data?.data?.products)
        const p: any = res?.data?.data?.products;
        console.log("p", p)
        setData(p);
        setStatus(p?.status || '');
      } catch (e: any) {
        setError(e?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchById();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">Product not found.</div>;

  const handleStatusUpdate = async () => {
    if (!status) return;

    try {
      setIsUpdatingStatus(true);

      const payload = status === 'declined'
        ? { status, reasonForDecline }
        : { status };

      await apiClientAdmin.patch(`/products/status/${data[0]?._id}`, payload);

      // Update local data
      setData((prev: any) => prev ? { ...prev, status } : null);
      setShowStatusModal(false);
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      router.refresh();
      setIsUpdatingStatus(false);
    }
  };

  const StatusUpdateModal = () => (
    <div className="fixed inset-0 bg-black/85 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl min-h-[100px] relative">
        {isUpdatingStatus && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a0066]"></div>
          </div>
        )}
        <h3 className="text-lg font-semibold mb-4">Update Listing Status</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === 'declined' && (
            <div>
              <label className="block text-sm font-medium mb-1">Reason for Decline</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Please provide a reason for declining this listing"
                value={reasonForDecline}
                onChange={(e) => setReasonForDecline(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isUpdatingStatus}
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={!status || (status === 'declined' && !reasonForDecline.trim()) || isUpdatingStatus}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${!status || (status === 'declined' && !reasonForDecline.trim()) || isUpdatingStatus
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#1a0066] hover:bg-[#160052]'
                }`}
            >
              {isUpdatingStatus ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const imgs = Array.isArray(data[0].images)
    ? (data[0].images as any[]).map((i) => (typeof i === "string" ? { url: i } : i))
    : [];
  // current image for carousel
  const primary = imgs.length
    ? (imgs[Math.min(imgIndex, imgs.length - 1)]?.url || imgs[0]?.url || "/product1.png")
    : "/product1.png";
  const price = data[0].price?.currentPrice;
  const discount = data[0].price?.discountedPrice;
  const ngn = (val?: number) =>
    typeof val === "number" ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val) : "";

  // Helper: render facility value nicely when stored as string like ['a','b']
  const renderFacilityValue = (val: any) => {
    if (val == null) return "";
    if (Array.isArray(val)) return val.join(", ");
    const s = String(val);
    if (s.trim().startsWith("[") && s.trim().endsWith("]")) {
      try {
        const jsonish = s.replace(/'/g, '"');
        const arr = JSON.parse(jsonish);
        if (Array.isArray(arr)) return arr.join(", ");
      } catch { }
    }
    return s;
  };

  return (
    <div className="mx-auto px-6 py-6">
      {/* Basic breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4">
        <Link href="/admin/dashboard" className="hover:underline text-[#1F058F]">Dashboard</Link> &gt; <span className="text-[#1F058F]">Details</span>
      </nav>

      {/* Hero image with carousel controls when multiple images exist */}
      <div className="relative w-full h-[220px] md:h-[420px] rounded-md overflow-hidden bg-gray-100">
        <Image src={primary} alt={data.name} fill className="object-contain" />
        {imgs.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={() => setImgIndex((prev) => (prev - 1 + imgs.length) % imgs.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60"
            >
              ‹
            </button>
            <button
              aria-label="Next image"
              onClick={() => setImgIndex((prev) => (prev + 1) % imgs.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60"
            >
              ›
            </button>
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
              {imgs.slice(0, 8).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Gallery thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto mt-6">
          {imgs.slice(0, 8).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setImgIndex(idx)}
              className={`relative w-24 h-24 rounded-md overflow-hidden border ${idx === imgIndex ? 'border-[#1F058F] ring-2 ring-[#1F058F]/30' : ''}`}
            >
              <Image src={img.url} alt={`Image ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Title, Edit & price */}
      {/* {data?.map((data: any) => {
        return (
          <> */}
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h1 className="text-2xl font-semibold">{data[0]?.name}</h1>
              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  className="border-[#1F058F] text-[#1F058F] hover:bg-[#1F058F]/10"
                  onClick={() => {
                    setStatus(data[0]?.status || '');
                    setReasonForDecline('');
                    setShowStatusModal(true);
                  }}
                >
                  Update Status
                </Button>
              </div>
            </div>
            <PromoteProductModal
              isOpen={showPromoteModal}
              onClose={() => setShowPromoteModal(false)}
              productId={data[0]?._id}
            />  

            {/* Status Update Modal */}
            {showStatusModal && <StatusUpdateModal />}
            <div className="flex items-center gap-4 mt-2">
              {price != null && (
                <span className="text-xl font-bold text-[#1F058F]">{ngn(data[0]?.discount)}</span>
              )}
              {discount != null && (
                <span className="line-through text-gray-500">{ngn(data[0]?.price)}</span>
              )}
            </div>

            {/* Location */}
            {
              (data[0]?.listingLocation?.country || data[0]?.listingLocation?.city) && (
                <p className="text-sm text-gray-500 mt-1">
                  {data[0]?.listingLocation?.city || ""}
                  {data[0]?.listingLocation?.city && data[0]?.listingLocation?.country ? ", " : ""}
                  {data[0]?.listingLocation?.country || ""}
                </p>
              )
            }

            {/* Description */}
            {
              data[0]?.description && (
                <div className="mt-5">
                  <h2 className="font-medium mb-2">Description</h2>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data[0]?.description}</p>
                </div>
              )
            }

            {/* Meta info */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="border rounded-md p-3 text-sm">
                <div className="text-gray-500 text-xs mb-1">Status</div>
                <div className="font-medium capitalize">{data[0]?.status || "-"}</div>
              </div>
              <div className="border rounded-md p-3 text-sm">
                <div className="text-gray-500 text-xs mb-1">Slug</div>
                <div className="font-medium break-all">{data[0]?.slug || "-"}</div>
              </div>
              <div className="border rounded-md p-3 text-sm">
                <div className="text-gray-500 text-xs mb-1">Featured</div>
                <div className="font-medium">{data[0]?.isFeatured ? "Yes" : "No"}</div>
              </div>
            </div>

            {/* Likes & Ratings */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="border rounded-md p-3 text-center">
                <div className="text-xs text-gray-500">Total Likes</div>
                <div className="text-lg font-semibold">{data[0]?.likes?.totalLikes ?? 0}</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-xs text-gray-500">Average Rating</div>
                <div className="text-lg font-semibold">{data[0]?.ratings?.averageRating ?? 0}</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-xs text-gray-500">Total Ratings</div>
                <div className="text-lg font-semibold">{data[0]?.ratings?.totalRatings ?? 0}</div>
              </div>
              {/* <div className="border rounded-md p-3 text-center">
                <div className="text-xs text-gray-500">Liked By</div>
                <div className="text-xs break-all">{(data.likes?.likedBy || []).slice(0, 3).join(", ")}{(data.likes?.likedBy?.length || 0) > 3 ? "…" : ""}</div>
              </div> */}
            </div>

            {/* Timestamps */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="border rounded-md p-3">
                <div className="text-gray-500 text-xs mb-1">Created</div>
                <div>{data[0]?.createdAt ? new Date(data[0]?.createdAt).toLocaleString() : "-"}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-gray-500 text-xs mb-1">Last Updated</div>
                <div>{data[0]?.updatedAt ? new Date(data[0]?.updatedAt).toLocaleString() : "-"}</div>
              </div>
            </div>



            {/* Features */}
            {
              Array.isArray(data[0]?.features) && data[0]?.features.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-medium mb-2">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {data[0]?.features.map((f: any) => (
                      <span key={f} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )
            }

            {/* Facilities (Other details) */}
            {
              Array.isArray(data[0]?.facility?.facilities) && data[0]?.facility!.facilities!.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-medium mb-2">Other details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data[0]?.facility!.facilities!.map((f: any, idx: any) => (
                      <div key={`${f.label}-${f._id || idx}`} className="flex flex-col border rounded-md p-3">
                        <span className="text-xs text-gray-500">{f.label}</span>
                        <span className="text-sm text-gray-800">{renderFacilityValue(f.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
          {/* </> */}
      {/* //   ) */}
      {/* // })} */}
    </div>
  );
}

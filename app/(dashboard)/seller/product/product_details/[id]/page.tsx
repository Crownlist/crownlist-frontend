/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiClientUser } from "@/lib/interceptor";

type Product = {
  _id: string;
  name: string;
  description?: string;
  images?: Array<{ url: string; altText?: string; isPrimary?: boolean }> | string[];
  price?: { currentPrice?: number; discountedPrice?: number };
  listingLocation?: { country?: string; city?: string };
  features?: string[];
  facility?: { _id?: string; facilities?: Array<{ label: string; value: any; _id?: string }> };
  likes?: { totalLikes?: number; likedBy?: string[] };
  ratings?: { averageRating?: number; totalRatings?: number };
  slug?: string;
  seller?: string;
  category?: string;
  subCategory?: string;
  isFeatured?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function SellerProductDetailsDynamic() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState<number>(0);

  useEffect(() => {
    const fetchById = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClientUser.get(`/products/one/${id}`);
        const p: Product = (res as any)?.data?.product ?? (res as any)?.data ?? (res as any);
        setData(p || null);
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

  const imgs = Array.isArray(data.images)
    ? (data.images as any[]).map((i) => (typeof i === "string" ? { url: i } : i))
    : [];
  // current image for carousel
  const primary = imgs.length
    ? (imgs[Math.min(imgIndex, imgs.length - 1)]?.url || imgs[0]?.url || "/product1.png")
    : "/product1.png";
  const price = data.price?.currentPrice;
  const discount = data.price?.discountedPrice;
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
      } catch {}
    }
    return s;
  };

  return (
    <div className="mx-auto px-6 py-6">
      {/* Basic breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4">
        <Link href="/seller/product" className="hover:underline text-[#1F058F]">Products</Link> &gt; <span className="text-[#1F058F]">Details</span>
      </nav>

      {/* Hero image with carousel controls when multiple images exist */}
      <div className="relative w-full h-[220px] md:h-[420px] rounded-md overflow-hidden bg-gray-100">
        <Image src={primary} alt={data.name} fill className="object-cover" />
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
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <div className="flex gap-2">
          <Link href={`/seller/product/edit/${data._id}`}>
            <Button variant="outline" className="border-[#1F058F] text-[#1F058F] hover:bg-[#1F058F]/10">
              Edit product
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2">
        {price != null && (
          <span className="text-xl font-bold text-[#1F058F]">{ngn(discount)}</span>
        )}
        {discount != null && (
          <span className="line-through text-gray-500">{ngn(price)}</span>
        )}
      </div>

      {/* Location */}
      {(data.listingLocation?.country || data.listingLocation?.city) && (
        <p className="text-sm text-gray-500 mt-1">
          {data.listingLocation?.city || ""}
          {data.listingLocation?.city && data.listingLocation?.country ? ", " : ""}
          {data.listingLocation?.country || ""}
        </p>
      )}

      {/* Description */}
      {data.description && (
        <div className="mt-5">
          <h2 className="font-medium mb-2">Description</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{data.description}</p>
        </div>
      )}

      {/* Meta info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="border rounded-md p-3 text-sm">
          <div className="text-gray-500 text-xs mb-1">Status</div>
          <div className="font-medium capitalize">{data.status || "-"}</div>
        </div>
        <div className="border rounded-md p-3 text-sm">
          <div className="text-gray-500 text-xs mb-1">Slug</div>
          <div className="font-medium break-all">{data.slug || "-"}</div>
        </div>
        <div className="border rounded-md p-3 text-sm">
          <div className="text-gray-500 text-xs mb-1">Featured</div>
          <div className="font-medium">{data.isFeatured ? "Yes" : "No"}</div>
        </div>
        {/* <div className="border rounded-md p-3 text-sm">
          <div className="text-gray-500 text-xs mb-1">Seller ID</div>
          <div className="font-mono break-all">{data.seller || "-"}</div>
        </div>
        <div className="border rounded-md p-3 text-sm">
          <div className="text-gray-500 text-xs mb-1">Category ID</div>
          <div className="font-mono break-all">{data.category || "-"}</div>
        </div>
        <div className="border rounded-md p-3 text-sm">
          <div className="text-gray-500 text-xs mb-1">Subcategory ID</div>
          <div className="font-mono break-all">{data.subCategory || "-"}</div>
        </div> */}
      </div>

      {/* Likes & Ratings */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="border rounded-md p-3 text-center">
          <div className="text-xs text-gray-500">Total Likes</div>
          <div className="text-lg font-semibold">{data.likes?.totalLikes ?? 0}</div>
        </div>
        <div className="border rounded-md p-3 text-center">
          <div className="text-xs text-gray-500">Average Rating</div>
          <div className="text-lg font-semibold">{data.ratings?.averageRating ?? 0}</div>
        </div>
        <div className="border rounded-md p-3 text-center">
          <div className="text-xs text-gray-500">Total Ratings</div>
          <div className="text-lg font-semibold">{data.ratings?.totalRatings ?? 0}</div>
        </div>
        <div className="border rounded-md p-3 text-center">
          <div className="text-xs text-gray-500">Liked By</div>
          <div className="text-xs break-all">{(data.likes?.likedBy || []).slice(0, 3).join(", ")}{(data.likes?.likedBy?.length || 0) > 3 ? "…" : ""}</div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="border rounded-md p-3">
          <div className="text-gray-500 text-xs mb-1">Created</div>
          <div>{data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}</div>
        </div>
        <div className="border rounded-md p-3">
          <div className="text-gray-500 text-xs mb-1">Last Updated</div>
          <div>{data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "-"}</div>
        </div>
      </div>

      

      {/* Features */}
      {Array.isArray(data.features) && data.features.length > 0 && (
        <div className="mt-6">
          <h2 className="font-medium mb-2">Features</h2>
          <div className="flex flex-wrap gap-2">
            {data.features.map((f) => (
              <span key={f} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Facilities (Other details) */}
      {Array.isArray(data.facility?.facilities) && data.facility!.facilities!.length > 0 && (
        <div className="mt-6">
          <h2 className="font-medium mb-2">Other details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.facility!.facilities!.map((f, idx) => (
              <div key={`${f.label}-${f._id || idx}`} className="flex flex-col border rounded-md p-3">
                <span className="text-xs text-gray-500">{f.label}</span>
                <span className="text-sm text-gray-800">{renderFacilityValue(f.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

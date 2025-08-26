"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SellerProductEditRedirect() {
  const { id } = useParams() as { id?: string };
  const router = useRouter();

  useEffect(() => {
    if (id) {
      router.replace(`/seller/product/post-product?editId=${id}`);
    }
  }, [id, router]);

  return null;
}

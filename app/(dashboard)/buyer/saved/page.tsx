
"use client"

import { useLikedProducts } from "@/hooks/useLikedProducts";
import NoSavedPage from "@/components/Home/NoSaved";
import Saved from "@/components/Home/Saved";

export default function Home() {
    const { products, loading } = useLikedProducts();

    if (loading) {
        return (
            <div className="flex w-full h-full justify-center items-center align-middle">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p>Loading saved products...</p>
                </div>
            </div>
        );
    }

    const hasSaved = products && products.length > 0;

    return (
        <div className="flex w-full h-full justify-center md:items-center max-sm:px-3 align-middle">
            {!hasSaved && <NoSavedPage />}
            {hasSaved && <Saved />}
        </div>
    );
}

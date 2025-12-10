import {
  ProductCardSkeleton,
  ProductListSkeleton,
} from "@/components/ProductCardSkeleton";

interface LoadingSkeletonProps {
  viewMode: "grid" | "list";
}

export function LoadingSkeleton({ viewMode }: LoadingSkeletonProps) {
  return (
    <>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 md:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductListSkeleton key={i} />
          ))}
        </div>
      )}
    </>
  );
}

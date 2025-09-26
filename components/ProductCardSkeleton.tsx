import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Image skeleton */}
      <div className="relative h-[200px]">
        <Skeleton className="w-full h-full" />
        {/* Heart icon skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        {/* Location and features */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Feature tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded" />
          <Skeleton className="h-6 w-20 rounded" />
        </div>

        {/* Price */}
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  )
}

export function ProductListSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
      {/* Image skeleton */}
      <div className="relative h-[200px] md:h-auto md:w-[300px] flex-shrink-0">
        <Skeleton className="w-full h-full" />
        {/* Heart icon skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 flex-1 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        {/* Location and features */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Feature tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded" />
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-6 w-18 rounded" />
        </div>

        {/* Price */}
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  )
}

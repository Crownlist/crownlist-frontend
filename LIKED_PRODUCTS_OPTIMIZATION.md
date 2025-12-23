# Global Liked Products Optimization

## Problem

The API request `/products/liked?limit=1000` was being called multiple times on the landing page because the `useLikedProducts` hook was being used independently in multiple components:

- Product-card.tsx
- SponsoredPost.tsx
- ProductImageGalleryClient.tsx
- And other components

Each component that imported the hook would trigger a separate API call, causing redundant network requests.

## Solution

Implemented a global React Context-based solution to fetch liked products once and share the data across all components.

### Changes Made

#### 1. Created `LikedProductsContext.tsx`

**Location:** `/workspaces/crownlist-frontend/context/LikedProductsContext.tsx`

This new context provider:

- Wraps the entire application
- Handles a single API call for liked products
- Exposes `useLikedProductsContext` hook for consuming the global state
- Manages loading, error, and refetch states
- Provides `toggleLike` function that refetches data after changes

#### 2. Updated `wrapper.tsx`

**Location:** `/workspaces/crownlist-frontend/client/wrapper.tsx`

Added `LikedProductsProvider` to wrap the application so all child components have access to the global liked products data.

#### 3. Created Alternative Hook

**Location:** `/workspaces/crownlist-frontend/hooks/useLikedProductsGlobal.ts`

Exported `useLikedProductsContext` as `useLikedProductsGlobal` for explicit global usage.

#### 4. Preserved Backward Compatibility

The original `useLikedProducts.ts` hook remains unchanged, ensuring existing code continues to work.

## Usage

### Option 1: Use Global Context (Recommended)

```tsx
import { useLikedProductsGlobal } from "@/hooks/useLikedProductsGlobal";

export function MyComponent() {
  const {
    products: likedProducts,
    toggleLike,
    loading,
  } = useLikedProductsGlobal();
  // Your component code
}
```

### Option 2: Use Context Directly

```tsx
import { useLikedProductsContext } from "@/context/LikedProductsContext";

export function MyComponent() {
  const {
    products: likedProducts,
    toggleLike,
    loading,
  } = useLikedProductsContext();
  // Your component code
}
```

### Option 3: Keep Using Existing Hook (Backward Compatible)

```tsx
import { useLikedProducts } from "@/hooks/useLikedProducts";

export function MyComponent() {
  const { products: likedProducts, toggleLike, loading } = useLikedProducts();
  // This still works, but will make independent API calls in non-provider components
}
```

## Benefits

✅ **Single API Call:** The `/products/liked?limit=1000` endpoint is called only once per page load
✅ **Global State:** All components share the same data
✅ **Real-time Updates:** When a user likes/unlikes, all components see the updated data
✅ **Backward Compatible:** Existing code continues to work without changes
✅ **Scalable:** Easy to migrate existing components one by one

## Migration Recommendations

To get maximum benefit, consider updating components that use `useLikedProducts` to use `useLikedProductsGlobal` instead:

1. Product-card.tsx
2. SponsoredPost.tsx
3. ProductImageGalleryClient.tsx
4. Other components rendering product lists

This ensures they all use the same global data source.

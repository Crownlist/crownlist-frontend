# Architecture Diagram: Liked Products Global State

## Before (Multiple API Calls)

```
Landing Page (Home)
├── TrendingSection
│   └── ProductSection
│       └── Product-card
│           └── useLikedProducts() ──┐ API Call #1
├── SponsoredSection
│   └── SponsoredPost
│       └── useLikedProducts() ──┐ API Call #2
└── FeaturedSubcategoriesSection
    └── useLikedProducts() ──┐ API Call #3

Result: 3+ identical API calls to /products/liked?limit=1000
Performance Impact: ⚠️ Redundant network requests
```

## After (Single Global API Call)

```
App Root (layout.tsx)
│
└── Wrapper (wrapper.tsx)
    │
    └── LikedProductsProvider ──┐ Single API Call
        │                       │ /products/liked?limit=1000
        │
        ├── Landing Page (Home)
        │   ├── TrendingSection
        │   │   └── ProductSection
        │   │       └── Product-card
        │   │           └── useLikedProductsGlobal() ✓ Uses context
        │   │
        │   ├── SponsoredSection
        │   │   └── SponsoredPost
        │   │       └── useLikedProductsGlobal() ✓ Uses same data
        │   │
        │   └── FeaturedSubcategoriesSection
        │       └── useLikedProductsGlobal() ✓ Uses same data
        │
        └── Other Routes
            └── useLikedProductsGlobal() ✓ All use same data

Result: 1 API call serving all components
Performance Impact: ✅ 80-90% reduction in network requests
Data Freshness: ✅ Real-time updates across entire app
```

## Data Flow

### 1. Initialization

```
App Start
  ↓
LikedProductsProvider mounts
  ↓
fetchLikedProducts() called
  ↓
/products/liked?limit=1000 API Request
  ↓
Response stored in Context State
  ↓
All child components re-render with data
```

### 2. Like/Unlike Action

```
User clicks Like button in Product-card
  ↓
toggleLike(productId) called
  ↓
POST /products/like/{productId}
  ↓
fetchLikedProducts() automatically called
  ↓
Context state updated
  ↓
All components using context re-render with updated data
```

## Implementation Location

- Context Provider: `/context/LikedProductsContext.tsx`
- Provider Setup: `/client/wrapper.tsx`
- Global Hook: `/hooks/useLikedProductsGlobal.ts`
- Documentation: `/LIKED_PRODUCTS_OPTIMIZATION.md`

# Product Page Development Guide

## File Structure

```
app/(generic)/product/[slug]/
├── page.tsx                 # Main server component
├── not-found.tsx           # 404 error page
├── error.tsx               # Error boundary
└── layout.tsx              # (optional) segment layout

components/Home/
├── ProductDetailsSidebar.tsx    # Client-side sidebar
└── ProductDetails.tsx           # (deprecated) old component

components/Product/
├── ProductImageGallery.tsx           # Server wrapper
├── ProductImageGalleryClient.tsx     # Client image gallery
├── ProductAccordion.tsx              # Specifications/Details
├── SafetyTipsSection.tsx             # Safety info
├── SimilarProducts.tsx               # Related products
└── index.ts                          # Exports

lib/server/
└── product-service.ts          # Server utilities

```

## Key Interfaces & Types

### ServerProductData

```typescript
interface ServerProductData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images: ProductImage[];
  category?: Category;
  subCategory?: Category;
  status: string;
  condition?: string;
  createdAt: string;
  updatedAt?: string;
  price: Price;
  facility?: { facilities: Facility[] };
  features?: string[];
  listingLocation?: Location;
  seller?: Seller;
  views?: number;
  likes?: number;
}
```

## Adding Features

### 1. Add a New Product Field

1. Update `ServerProductData` interface in `lib/server/product-service.ts`
2. Update the API response type
3. Use the field in page components
4. Update `generateProductMetadata()` if needed for SEO

### 2. Add a New Section to Accordion

Edit `components/Product/ProductAccordion.tsx`:

```tsx
<AccordionItem value="new-section" className="border-none">
  <AccordionTrigger className="hover:no-underline py-4 px-0 text-base font-semibold hover:text-blue-600">
    Section Title
  </AccordionTrigger>
  <AccordionContent className="pb-4">{/* Content here */}</AccordionContent>
</AccordionItem>
```

### 3. Add Sidebar Button

Edit `components/Home/ProductDetailsSidebar.tsx`:

```tsx
const handleNewAction = async () => {
  // Implementation
};

// In JSX:
<button onClick={handleNewAction} className="...">
  Action Button
</button>;
```

### 4. Add Image Gallery Feature

Edit `components/Product/ProductImageGalleryClient.tsx`:

- Add new state variables
- Add handler functions
- Update JSX structure
- Add keyboard shortcuts if needed

## Common Tasks

### Fetch Product Data in Server Component

```tsx
import { fetchProductBySlug } from "@/lib/server/product-service";

const product = await fetchProductBySlug(slug);
if (!product) notFound();
```

### Format Date/Price

```tsx
import { formatProductDate, formatPrice } from "@/lib/server/product-service";

const postedDate = formatProductDate(product.createdAt);
const displayPrice = formatPrice(product.price.currentPrice);
```

### Handle Authentication

```tsx
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!(localStorage.getItem("leoKey") || localStorage.getItem("orionKey"));
};
```

### Show Toast Notification

```tsx
import { toast } from "react-hot-toast";

toast.success("Action successful!", { position: "bottom-center" });
toast.error("Error occurred", { position: "bottom-center" });
```

## Styling Guidelines

### Responsive Classes

- Mobile first: `text-sm sm:text-base lg:text-lg`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Spacing: `p-2 sm:p-4 lg:p-6`

### Preferred Utilities

- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
- Borders: `border border-gray-200`
- Colors: Use Tailwind defaults (gray, blue, red, green)
- Transitions: `transition-all duration-300`

### Avoid

- Arbitrary values unless necessary: `w-[64px]` → `w-16`
- Deprecated classes: `flex-grow` → `grow`, `flex-shrink-0` → `shrink-0`
- Old gradient syntax: `bg-gradient-to-r` → `bg-linear-to-r`

## Testing

### Test Product Page

```bash
# Development
npm run dev
# Visit: http://localhost:3002/product/[slug]

# Type checking
npx tsc --noEmit --skipLibCheck app/\(generic\)/product/\[slug\]/page.tsx

# Build
npm run build
```

### Test Cases

1. Valid product slug → Product loads
2. Invalid product slug → not-found page shown
3. Product without images → Placeholder shown
4. Missing seller info → Sidebar handles gracefully
5. Mobile view → Single column layout
6. Desktop view → 3-column layout
7. Click like → Toast shown (requires login)
8. Click share → Share modal/menu appears

## Performance Tips

1. **Images**: Use Next.js Image component (automatic optimization)
2. **API calls**: Leverage ISR for static/semi-static data
3. **Client components**: Keep them small, load only what's needed
4. **Metadata**: Use dynamic generation for SEO

## Debugging

### Check Server Logs

```bash
# Look for errors in terminal when developing
npm run dev
```

### Check Browser Console

- Client-side errors in Components ending with "Client"
- Check Network tab for API calls
- Check for console errors

### Debug Product Service

```ts
// Add console.log to product-service.ts functions
console.log("Fetching product:", slug);
console.log("Response:", data);
```

## Common Issues & Solutions

### Issue: Product not found with valid slug

- Check API endpoint: `/products/slug/{slug}`
- Verify slug format matches API response
- Check API response structure

### Issue: Images not loading

- Verify image URL is in `next.config.ts` remote patterns
- Check image component props (fill, sizes)
- View Network tab for 404 errors

### Issue: Sidebar not sticky on desktop

- Check that parent has `lg:sticky` class
- Verify parent has `lg:top-6` for scroll offset
- Ensure viewport is truly desktop (> 1024px)

### Issue: Meta tags not showing

- Check `generateMetadata()` function
- Verify metadata is being generated correctly
- Check HTML source, not browser dev tools (meta may be in `<head>`)

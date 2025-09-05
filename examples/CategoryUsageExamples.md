# Category Usage Examples

Now that we have Redux set up for categories, you can easily use them in any component!

## 🎯 **Basic Usage in Any Component**

```tsx
import { useCategories } from '@/hooks/useCategories'

function MyComponent() {
  const { categories, loading, getSubcategoriesForCategory } = useCategories()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {categories.map(category => (
        <div key={category._id}>
          <h3>{category.name}</h3>
          {getSubcategoriesForCategory(category._id).map(sub => (
            <div key={sub._id}>{sub.name}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
```

## 🏠 **In CategoryScroll Component**

```tsx
"use client"

import { useCategories } from '@/hooks/useCategories'
import { ChevronRight, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CategoryScroll() {
  const { categories, getSubcategoriesForCategory, loading } = useCategories()

  if (loading) return <div>Loading categories...</div>

  return (
    <div>
      {categories.map((category) => {
        const subcategories = getSubcategoriesForCategory(category._id)
        return (
          <div key={category._id}>
            <h3>{category.name}</h3>
            {subcategories.map((sub) => (
              <Link 
                key={sub._id}
                href={`/category/${category.slug}?subcategory=${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )
      })}
    </div>
  )
}
```

## 🔍 **In Search Component**

```tsx
import { useCategories } from '@/hooks/useCategories'

function SearchComponent() {
  const { categories, getCategoryBySlug } = useCategories()
  
  const handleSearch = (searchTerm: string) => {
    // Search through categories
    const results = categories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return results
  }
  
  return (
    <div>
      {/* Search implementation */}
    </div>
  )
}
```

## 📱 **In Mobile Menu**

```tsx
import { useCategories } from '@/hooks/useCategories'

function MobileMenu() {
  const { categories, loading } = useCategories()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <nav>
      {categories.map(category => (
        <a key={category._id} href={`/category/${category.slug}`}>
          {category.name}
        </a>
      ))}
    </nav>
  )
}
```

## 🎨 **In Header Navigation**

```tsx
import { useCategories } from '@/hooks/useCategories'

function HeaderNav() {
  const { categories } = useCategories()
  
  return (
    <nav>
      {categories.slice(0, 5).map(category => ( // Show only first 5
        <a key={category._id} href={`/category/${category.slug}`}>
          {category.name}
        </a>
      ))}
    </nav>
  )
}
```

## 🚀 **Key Benefits of This Approach:**

### **1. Data is Shared Everywhere**
- Categories fetched once, used everywhere
- No duplicate API calls
- Consistent data across all components

### **2. Automatic Loading States**
- All components show loading state while fetching
- Better user experience

### **3. Easy to Use**
- Just import `useCategories` hook
- Get categories, subcategories, and loading state
- Helper functions for common operations

### **4. Data Persistence**
- Data stays in Redux store
- Survives component unmounting/remounting
- Survives page navigation

## 📝 **Available Data & Functions:**

```tsx
const { 
  categories,           // Array of all categories
  subcategories,        // Array of all subcategories  
  loading,              // Boolean loading state
  getSubcategoriesForCategory,  // Get subs for a category
  getCategoryBySlug,    // Find category by slug
  fetchCategories,      // Manually fetch categories
  fetchSubcategories    // Manually fetch subcategories
} = useCategories()
```

## 🎉 **That's it!**

Now you can use categories in **any component** by just importing the hook. The data will be automatically fetched once and shared everywhere! 🚀

import { useCallback, useEffect, useState } from 'react'
import { apiClientPublic } from '@/lib/interceptor'

export interface ApiProduct {
  _id: string
  name: string
  slug: string
  description?: string
  images?: { url: string; altText?: string; isPrimary?: boolean; _id: string }[]
  price?: { currentPrice?: number; discountedPrice?: number }
  listingLocation?: { country?: string; city?: string }
  category?: string
  subCategory?: string
  isFeatured?: boolean
  createdAt?: string
}

export const useProducts = () => {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiClientPublic.get('/products')
      const list = res?.data?.data?.products || res?.data?.products || []
      setProducts(Array.isArray(list) ? list : [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (products.length === 0) fetchProducts()
  }, [products.length, fetchProducts])

  return { products, loading, fetchProducts }
}



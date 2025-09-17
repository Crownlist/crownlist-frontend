import { useState, useCallback } from 'react'
import { apiClientPublic } from '@/lib/interceptor'
import { Product, ProductsResponse } from '@/types/product/product'

export const useSubcategoryProducts = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch products for a specific subcategory
  const fetchProductsBySubcategory = useCallback(async (subcategoryId: string, isFeatured = true): Promise<Product[]> => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = isFeatured
        ? `?isFeatured=true&subCategory=${subcategoryId}`
        : `?subCategory=${subcategoryId}&limit=10`

      const response = await apiClientPublic.get(`/products${queryParams}`)
      const data: ProductsResponse = response.data

      return data.data?.products || []
    } catch (error) {
      console.log(`Error fetching products for subcategory ${subcategoryId}:`, error)
      setError('Failed to fetch products')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch products for multiple subcategories
  const fetchProductsForSubcategories = useCallback(async (subcategoryIds: string[], isFeatured = true): Promise<{ [subcategoryId: string]: Product[] }> => {
    try {
      setLoading(true)
      setError(null)
      
      const results: { [subcategoryId: string]: Product[] } = {}
      
      // Fetch products for each subcategory
      for (const subcategoryId of subcategoryIds) {
        const products = await fetchProductsBySubcategory(subcategoryId, isFeatured)
        results[subcategoryId] = products
      }
      
      return results
    } catch (error) {
      console.log('Error fetching products for subcategories:', error)
      setError('Failed to fetch products')
      return {}
    } finally {
      setLoading(false)
    }
  }, [fetchProductsBySubcategory])

  return {
    loading,
    error,
    fetchProductsBySubcategory,
    fetchProductsForSubcategories
  }
}

import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import {
  setCategories,
  setLoading,
  selectCategories,
  selectCategoriesLoading
} from '@/store/slices/general/categoriesSlice'
import { apiClientPublic } from '@/lib/interceptor'
import { Subcategory } from '@/types/category/category'

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>()
  
  // Get data from Redux store
  const categories = useSelector((state: RootState) => selectCategories(state))
  const loading = useSelector((state: RootState) => selectCategoriesLoading(state))

  const fetchCategories = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      console.log('Fetching categories...')
      const response = await apiClientPublic.get('/categories')
      console.log('Categories response:', response.data)
      const categoriesData = response.data?.data?.total || response.data?.total || response.data?.data || response.data || []
      console.log('Categories data to store:', categoriesData)

      // Log subcategories for each category
      if (Array.isArray(categoriesData)) {
        categoriesData.forEach((category, index) => {
          console.log(`Category ${index + 1}: ${category.name}`)
          console.log(`  Subcategories:`, category.subCategories || 'No subcategories')
          if (category.subCategories) {
            category.subCategories.forEach((sub: Subcategory, subIndex: number) => {
              console.log(`    ${subIndex + 1}. ${sub.name} (ID: ${sub._id})`)
            })
          }
        })
      }

      dispatch(setCategories(Array.isArray(categoriesData) ? categoriesData : []))
      console.log('Categories stored in Redux')
    } catch (error) {
      console.log('Error fetching categories:', error)
      dispatch(setCategories([]))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Fetch data if not already loaded
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [categories.length, fetchCategories])

  // Helper function to find a category by slug
  const getCategoryBySlug = (slug: string) => {
    return categories.find(cat => cat.slug === slug)
  }

  return {
    categories,
    loading,
    getCategoryBySlug,
    fetchCategories
  }
}

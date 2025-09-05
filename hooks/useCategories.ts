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

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>()
  
  // Get data from Redux store
  const categories = useSelector((state: RootState) => selectCategories(state))
  const loading = useSelector((state: RootState) => selectCategoriesLoading(state))

  const fetchCategories = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      const response = await apiClientPublic.get('/categories')
      const categoriesData = response.data?.total || response.data?.data?.total || response.data?.data || response.data || []
      dispatch(setCategories(Array.isArray(categoriesData) ? categoriesData : []))
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

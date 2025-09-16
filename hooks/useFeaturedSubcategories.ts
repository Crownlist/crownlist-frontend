import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { 
  setSubcategoryIds, 
  setFeaturedSubcategories, 
  setLoading, 
  setError,
  selectFeaturedSubcategories,
  selectSubcategoryIds,
  selectFeaturedSubcategoriesLoading,
  selectFeaturedSubcategoriesError
} from '@/store/slices/general/featuredSubcategoriesSlice'
import { selectCategories } from '@/store/slices/general/categoriesSlice'
import { apiClientPublic } from '@/lib/interceptor'
import { FeaturedSubcategory, Subcategory } from '@/types/category/category'
import { ProductsResponse } from '@/types/product/product'

export const useFeaturedSubcategories = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Ref to track if we've already fetched data to prevent infinite loops
  const hasFetchedRef = useRef(false)

  // Get data from Redux store
  const featuredSubcategories = useSelector((state: RootState) => selectFeaturedSubcategories(state))
  const subcategoryIds = useSelector((state: RootState) => selectSubcategoryIds(state))
  const loading = useSelector((state: RootState) => selectFeaturedSubcategoriesLoading(state))
  const error = useSelector((state: RootState) => selectFeaturedSubcategoriesError(state))
  const categories = useSelector((state: RootState) => selectCategories(state))

  // Extract subcategory IDs from categories
  const extractSubcategoryIds = useCallback(() => {
    console.log('Extracting subcategory IDs from categories:', categories)
    const ids: string[] = []
    categories.forEach(category => {
      console.log('Processing category:', category.name, 'subCategories:', category.subCategories)
      if (category.subCategories) {
        category.subCategories.forEach(subcategory => {
          console.log('Found subcategory:', subcategory.name, 'ID:', subcategory._id)
          ids.push(subcategory._id)
        })
      }
    })
    console.log('Final subcategory IDs array:', ids)
    return ids
  }, [categories])

  // Fetch products for a specific subcategory
  const fetchSubcategoryProducts = useCallback(async (subcategoryId: string): Promise<number> => {
    try {
      // First try with isFeatured=true
      let response = await apiClientPublic.get(`/products?isFeatured=true&subCategory=${subcategoryId}`)
      let data: ProductsResponse = response.data
      let productCount = data.data?.products?.length || 0

      // If no featured products, try without the filter to see if there are any products at all
      if (productCount === 0) {
        console.log(`No featured products for subcategory ${subcategoryId}, trying without featured filter`)
        response = await apiClientPublic.get(`/products?subCategory=${subcategoryId}&limit=1`)
        data = response.data
        productCount = data.data?.products?.length || 0
        console.log(`Subcategory ${subcategoryId} has ${productCount} total products`)
      }

      return productCount
    } catch (error) {
      console.log(`Error fetching products for subcategory ${subcategoryId}:`, error)
      return 0
    }
  }, [])

  // Fetch featured subcategories with product counts
  const fetchFeaturedSubcategories = useCallback(async () => {
    console.log('fetchFeaturedSubcategories called, categories length:', categories.length)
    if (categories.length === 0) {
      console.log('No categories available, returning early')
      return
    }

    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      // Extract all subcategory IDs
      const ids = extractSubcategoryIds()
      console.log('Extracted subcategory IDs:', ids)
      dispatch(setSubcategoryIds(ids))

      // Get all subcategories from categories
      const allSubcategories: Subcategory[] = []
      categories.forEach(category => {
        if (category.subCategories) {
          allSubcategories.push(...category.subCategories)
        }
      })

      console.log('All subcategories:', allSubcategories)

      // Fetch product counts for each subcategory
      const featuredSubcategoriesWithProducts: FeaturedSubcategory[] = []

      for (const subcategory of allSubcategories) {
        console.log(`Fetching products for subcategory: ${subcategory.name} (${subcategory._id})`)
        const productCount = await fetchSubcategoryProducts(subcategory._id)
        console.log(`Subcategory ${subcategory.name} has ${productCount} products`)

        // Include all subcategories, regardless of product count
        featuredSubcategoriesWithProducts.push({
          subcategory,
          productCount,
          hasProducts: productCount > 0
        })
      }

      console.log('Final featured subcategories with products:', featuredSubcategoriesWithProducts)
      dispatch(setFeaturedSubcategories(featuredSubcategoriesWithProducts))
    } catch (error) {
      console.log('Error fetching featured subcategories:', error)
      dispatch(setError('Failed to fetch featured subcategories'))
    } finally {
      dispatch(setLoading(false))
    }
  }, [categories, dispatch, extractSubcategoryIds, fetchSubcategoryProducts])

  // Fetch data when categories are available and featured subcategories are not loaded
  useEffect(() => {
    if (categories.length > 0 && featuredSubcategories.length === 0 && !loading && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchFeaturedSubcategories()
    }
  }, [categories.length, featuredSubcategories.length, loading])

  // Helper function to get subcategory by ID
  const getSubcategoryById = useCallback((id: string) => {
    return featuredSubcategories.find(fs => fs.subcategory._id === id)?.subcategory
  }, [featuredSubcategories])

  // Helper function to get featured subcategories by category
  const getFeaturedSubcategoriesByCategory = useCallback((categoryId: string) => {
    return featuredSubcategories.filter(fs => fs.subcategory.category === categoryId)
  }, [featuredSubcategories])

  return {
    featuredSubcategories,
    subcategoryIds,
    loading,
    error,
    getSubcategoryById,
    getFeaturedSubcategoriesByCategory,
    fetchFeaturedSubcategories
  }
}

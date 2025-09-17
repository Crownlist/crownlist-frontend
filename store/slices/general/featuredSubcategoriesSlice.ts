import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FeaturedSubcategory } from '@/types/category/category'

interface FeaturedSubcategoriesState {
  featuredSubcategories: FeaturedSubcategory[]
  subcategoryIds: string[]
  loading: boolean
  error: string | null
}

const initialState: FeaturedSubcategoriesState = {
  featuredSubcategories: [],
  subcategoryIds: [],
  loading: false,
  error: null
}

const featuredSubcategoriesSlice = createSlice({
  name: 'featuredSubcategories',
  initialState,
  reducers: {
    setSubcategoryIds: (state, action: PayloadAction<string[]>) => {
      state.subcategoryIds = action.payload
    },
    setFeaturedSubcategories: (state, action: PayloadAction<FeaturedSubcategory[]>) => {
      state.featuredSubcategories = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearFeaturedSubcategories: (state) => {
      state.featuredSubcategories = []
      state.subcategoryIds = []
      state.error = null
    }
  }
})

export const { 
  setSubcategoryIds, 
  setFeaturedSubcategories, 
  setLoading, 
  setError, 
  clearFeaturedSubcategories 
} = featuredSubcategoriesSlice.actions

// Selectors
export const selectFeaturedSubcategories = (state: { featuredSubcategories: FeaturedSubcategoriesState }) => 
  state.featuredSubcategories.featuredSubcategories

export const selectSubcategoryIds = (state: { featuredSubcategories: FeaturedSubcategoriesState }) => 
  state.featuredSubcategories.subcategoryIds

export const selectFeaturedSubcategoriesLoading = (state: { featuredSubcategories: FeaturedSubcategoriesState }) => 
  state.featuredSubcategories.loading

export const selectFeaturedSubcategoriesError = (state: { featuredSubcategories: FeaturedSubcategoriesState }) => 
  state.featuredSubcategories.error

export default featuredSubcategoriesSlice.reducer

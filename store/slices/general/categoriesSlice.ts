import { createSlice } from '@reduxjs/toolkit'
import { Category } from '@/types/category/category'

interface CategoriesState {
  categories: Category[]
  loading: boolean
}

const initialState: CategoriesState = {
  categories: [],
  loading: false
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload
      return state
    },
    setLoading: (state, action) => {
      state.loading = action.payload
      return state
    }
  }
})

export const { setCategories, setLoading } = categoriesSlice.actions

// Selectors for easy data access
export const selectCategories = (state: { categories: CategoriesState }) => state.categories.categories
export const selectCategoriesLoading = (state: { categories: CategoriesState }) => state.categories.loading

export default categoriesSlice.reducer

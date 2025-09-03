export interface Subcategory {
  _id: string
  name: string
  description?: string
  status: string
  category: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  status: string
  subCategories?: Subcategory[]
}

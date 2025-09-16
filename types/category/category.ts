export interface Facility {
  label: string
  description: string
  mandatory: boolean
  filterable: boolean
  isActive: boolean
  dataType: string
  selectType?: string | null
  dataInputType?: string
  value?: string
  _id: string
}

export interface Subcategory {
  _id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  status: string
  category?: string
  facilities?: Facility[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  status: string
  createdAt: string
  updatedAt: string
  __v: number
  subCategories?: Subcategory[]
}

export interface FeaturedSubcategory {
  subcategory: Subcategory
  productCount: number
  hasProducts: boolean
}

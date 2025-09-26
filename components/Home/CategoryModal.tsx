'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCategories } from '@/hooks/useCategories'
import { Category, Subcategory } from '@/types/category/category'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CategoryModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter()
  const { categories, loading } = useCategories()

  const handleLinkClick = (href: string) => {
    router.push(href)
    onClose() // Close the modal after navigation
  }

  // Helper function to generate category URL
  const generateCategoryUrl = (category: Category, subcategory?: Subcategory) => {
    if (subcategory) {
      return `/${category.slug}/${subcategory.slug}`
    }
    return `/category/${category.slug}`
  }

  if (loading) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-center">
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  {/* Loading Animation */}
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1F058F] border-t-transparent"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2a0bc0] animate-spin animation-delay-75"></div>
                  </div>

                  {/* Loading Text */}
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Finding your perfect categories</h3>
                    <p className="text-sm text-gray-600">Please wait while we load the latest options for you...</p>
                  </div>

                  {/* Skeleton Preview */}
                  <div className="w-full max-w-md space-y-3">
                    <div className="flex space-x-4">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop - clicking this will close the modal */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header with close */}
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex flex-col md:flex-row gap-8 mt-4">
                  {/* Left Banner */}
                  <div className="md:w-[40%]">
                    <div className="relative w-full h-[320px] rounded-lg overflow-hidden">
                      <Image src="/cat2.png" alt="Safety guide" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-end">
                        <h2 className="text-white text-md font-medium p-6">Discover more from our safety guide</h2>
                      </div>
                    </div>
                  </div>

                  {/* Right Categories */}
                  <div className="md:w-[60%] space-y-6">
                    {categories.length > 0 ? (
                      <div className="flex flex-col md:flex-row w-full justify-between gap-6">
                        {/* Column Group 1 */}
                        <div className="flex flex-col gap-6 w-full">
                          {categories.slice(0, Math.ceil(categories.length / 2)).map((category) => {
                            const categorySubcategories = category.subCategories || [];
                            return (
                              <div key={category._id} className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
                                <div className="space-y-2">
                                  {categorySubcategories.length > 0 ? (
                                    categorySubcategories.map((subcategory) => (
                                      <button 
                                        key={subcategory._id}
                                        onClick={() => handleLinkClick(generateCategoryUrl(category, subcategory))}
                                        className="block text-left text-gray-600 hover:text-gray-900 w-full cursor-pointer"
                                      >
                                        {subcategory.name}
                                      </button>
                                    ))
                                  ) : (
                                    <button 
                                      onClick={() => handleLinkClick(generateCategoryUrl(category))}
                                      className="block text-left text-gray-600 hover:text-gray-900 w-full"
                                    >
                                      Explore {category.name}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Column Group 2 */}
                        <div className="flex flex-col gap-6 w-full">
                          {categories.slice(Math.ceil(categories.length / 2)).map((category) => {
                            const categorySubcategories = category.subCategories || [];
                            return (
                              <div key={category._id} className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
                                <div className="space-y-2">
                                  {categorySubcategories.length > 0 ? (
                                    categorySubcategories.map((subcategory) => (
                                      <button 
                                        key={subcategory._id}
                                        onClick={() => handleLinkClick(generateCategoryUrl(category, subcategory))}
                                        className="block text-left text-gray-600 hover:text-gray-900 w-full"
                                      >
                                        {subcategory.name}
                                      </button>
                                    ))
                                  ) : (
                                    <button 
                                      onClick={() => handleLinkClick(generateCategoryUrl(category))}
                                      className="block text-left text-gray-600 hover:text-gray-900 w-full"
                                    >
                                      Explore {category.name}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No categories available</p>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CategoryModal

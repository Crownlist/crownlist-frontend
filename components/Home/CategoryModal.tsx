'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CategoryModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter()

  const handleLinkClick = (href: string) => {
    router.push(href)
    onClose() // Close the modal after navigation
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
                    <div className="flex flex-col md:flex-row w-full justify-between gap-6">
                      {/* Column Group 1 */}
                      <div className="flex flex-col gap-6 w-full">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-800">Property</h3>
                          <div className="space-y-2">
                            <button 
                              onClick={() => handleLinkClick("/category/property?subcategory=student")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Student
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/property?subcategory=personal")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Personal
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/property?subcategory=office")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Office
                            </button>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-800">Phone and tablets</h3>
                          <div className="space-y-2">
                            <button 
                              onClick={() => handleLinkClick("/category/phone-tablets?subcategory=mobile")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Mobile phone
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/phone-tablets?subcategory=accessories")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Accessories
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/phone-tablets?subcategory=tablets")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Tablets
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/phone-tablets?subcategory=watches")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Smart watches
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Column Group 2 */}
                      <div className="flex flex-col gap-6 w-full">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-800">Fashion</h3>
                          <div className="space-y-2">
                            <button 
                              onClick={() => handleLinkClick("/category/fashion?subcategory=bags")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Bags
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/fashion?subcategory=clothes")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Clothes
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/fashion?subcategory=jewelry")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Jewelry
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/fashion?subcategory=shoes")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Shoes
                            </button>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-800">Electronics</h3>
                          <div className="space-y-2">
                            <button 
                              onClick={() => handleLinkClick("/category/electronics?subcategory=hardware")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Hardware
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/electronics?subcategory=monitors")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Monitors
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/electronics?subcategory=laptops")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Laptops
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/electronics?subcategory=headphones")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Headphones
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/electronics?subcategory=music")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Music equipment
                            </button>
                            <button 
                              onClick={() => handleLinkClick("/category/electronics?subcategory=cameras")}
                              className="block text-left text-gray-600 hover:text-gray-900 w-full"
                            >
                              Cameras
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
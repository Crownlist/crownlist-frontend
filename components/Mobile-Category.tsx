"use client"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Search, X, Plus } from "lucide-react"

export default function MobileCategoryView({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header with logo and close button */}
      <div className="flex justify-between items-center p-4">
        <div className="w-16 h-10 bg-[#1a237e] flex items-center justify-center rounded">
          <span className="text-white font-bold text-sm">Crownlist</span>
        </div>
        <button onClick={onClose}>
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="flex rounded-full border overflow-hidden">
          <div className="flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </div>
          <input type="text" placeholder="Search" className="py-2 px-2 flex-1 outline-none text-sm" />
          <div className="flex items-center border-l border-r px-2">
            <span className="text-sm">Kwara</span>
            <ChevronDown size={16} className="ml-1 text-gray-500" />
          </div>
          <button className="bg-black text-white px-4 py-2 text-sm">Search</button>
        </div>
      </div>

      {/* Category Header */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
            </div>
          </div>
          <span className="ml-2 font-medium">Category</span>
        </div>
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {/* Properties */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" fill="#E57373" />
            </svg>
          </div>
          <div className="ml-2">
            <div className="font-medium">Properties</div>
            <div className="text-xs text-gray-500">2,392,915 post</div>
          </div>
        </div>
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {/* Phone and tablets */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="2" width="14" height="20" rx="2" fill="#64B5F6" />
              <path d="M12 18h.01" stroke="#1565C0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="ml-2">
            <div className="font-medium">Phone and tablets</div>
            <div className="text-xs text-gray-500">8,238 post</div>
          </div>
        </div>
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {/* Fashion */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12z"
                fill="#A1887F"
              />
              <path d="M15 11h-2v2h-2v-2H9v-2h2V7h2v2h2v2z" fill="#8D6E63" />
            </svg>
          </div>
          <div className="ml-2">
            <div className="font-medium">Fashion</div>
            <div className="text-xs text-gray-500">8,238 post</div>
          </div>
        </div>
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {/* Electronics */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="2" fill="#64B5F6" />
              <rect x="4" y="6" width="16" height="10" fill="#BBDEFB" />
            </svg>
          </div>
          <div className="ml-2">
            <div className="font-medium">Electronics</div>
            <div className="text-xs text-gray-500">8,238 post</div>
          </div>
        </div>
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {/* Cars */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
                fill="#FDD835"
              />
            </svg>
          </div>
          <div className="ml-2">
            <div className="font-medium">Cars</div>
            <div className="text-xs text-gray-500">0 post</div>
          </div>
        </div>
        <div className="text-xs text-gray-500"> soon</div>
      </div>

      {/* Jobs */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
                fill="#A1887F"
              />
            </svg>
          </div>
          <div className="ml-2">
            <div className="font-medium">Jobs</div>
            <div className="text-xs text-gray-500">0 post</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">soon</div>
      </div>

      {/* Services */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                fill="#FDD835"
              />
            </svg>
          </div>
          <div className="ml-2">
            <div className="font-medium">Services</div>
            <div className="text-xs text-gray-500">0 post</div>
          </div>
        </div>
        <div className="text-xs text-gray-500"> soon</div>
      </div>

      {/* Post Product */}
      <div className="px-4 py-3 border-t">
        <button className="flex items-center">
          <div className="w-6 h-6 rounded-full border flex items-center justify-center">
            <Plus size={16} />
          </div>
          <span className="ml-2 font-medium">Post product</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <Image src="/placeholder.svg?height=32&width=32" width={32} height={32} alt="User avatar" />
          </div>
          <span className="ml-2 font-medium">Jimoh Adesina</span>
        </div>
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 bg-gray-50">
        <div className="flex items-center mb-3">
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 14H2V4L10 9L18 4V14ZM10 7L2 2H18L10 7Z"
              fill="#5F6368"
            />
          </svg>
          <span className="ml-2 text-sm">info@joelist.com.ng</span>
        </div>
        <div className="flex items-center mb-4">
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 20 7 20C7 20 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 9.5C5.62 9.5 4.5 8.38 4.5 7C4.5 5.62 5.62 4.5 7 4.5C8.38 4.5 9.5 5.62 9.5 7C9.5 8.38 8.38 9.5 7 9.5Z"
              fill="#5F6368"
            />
          </svg>
          <span className="ml-2 text-sm">Kwara, Nigeria</span>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <Link href="#" className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </Link>
          <Link href="#" className="w-8 h-8 rounded-full bg-[#0077B5] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </Link>
          <Link href="#" className="w-8 h-8 rounded-full bg-[#E4405F] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </Link>
          <Link href="#" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

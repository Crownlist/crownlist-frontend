"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BillingsSettingsPage() {
    const router = useRouter()
    const handleClick = ( ) => {
        // e.preventDefault()
       router.push('/seller/settings/billings/1')
    }
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

       {/* Tabs */}
       <div className="border rounded-lg mb-8 border-[#1F058F]">
        <div className="flex">
          <Link href="/seller/settings/profile" className="px-6 py-4  text-gray-700  hover:bg-gray-50 rounded-l-lg font-medium">
            Profile
          </Link>
          <Link href="/seller/settings/billings" className="px-6 py-4  text-white bg-[#1F058F]">
            Billings
          </Link>
        </div>
      </div>

      {/* Billing Section */}
      <div className="mb-10">
        <h2 className="text-lg font-medium mb-1">Billing</h2>
        <p className="text-gray-600 mb-10">Manage your billing and payment</p>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-16 h-16 mb-4 text-gray-400">
            <Receipt className="w-full h-full" />
          </div>
          <h3 className="text-xl font-medium mb-2">No billing</h3>
          <p className="text-gray-500 mb-6">You currently have no billing history to display</p>
          <Button className="bg-[#1F058F] hover:bg-[#2a0bc0]" onClick={handleClick}>Post product</Button>
        </div>
      </div>

      {/* Support Info */}
      <div className="mt-16 text-center text-gray-600">
        <p>For further assistance reach out via our 24/7</p>
        <p>
          via email at{" "}
          <a href="mailto:support@crownlist.com" className="text-[#1F058F]">
            support@crownlist.com
          </a>
        </p>
      </div>
    </div>
  )
}

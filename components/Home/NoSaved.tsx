"use client"

import Link from "next/link"
import { HeartIcon} from "lucide-react"

export default function NoSavedPage() {
  return (
    <div className="flex flex-col md:flex-row bg-white">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <HeartIcon size={60} fill="red" color="red" className="mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">No saved post</h2>
          <p className="text-gray-500 mt-1">You currently have no message to display</p>
          <p className="text-sm text-gray-600 mt-6">
            For further assistance, reach out via our 24/7 <br />
            email at{" "}
            <Link href="mailto:support@crownlist.com" className="text-blue-600 underline">
              support@crownlist.com
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

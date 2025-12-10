import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-gray-50 to-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <FileQuestion className="mx-auto h-16 w-16 text-gray-400" />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
          >
            Search Products
          </Link>
        </div>

        <p className="text-sm text-gray-500 pt-4">
          Error Code: 404 | Product not found
        </p>
      </div>
    </div>
  );
}

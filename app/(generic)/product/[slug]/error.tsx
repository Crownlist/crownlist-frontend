"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Product page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-gray-50 to-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-gray-600">
            We encountered an error while loading the product. Please try again.
          </p>
          {error.message && (
            <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-100 rounded-lg font-mono">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center pt-4 flex-wrap">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-sm text-gray-500 pt-4">
          {error.digest && `Error ID: ${error.digest}`}
        </p>
      </div>
    </div>
  );
}

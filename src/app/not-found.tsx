"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Page Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            What you can do:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Check the URL for any typos</li>
            <li>• Go back to the previous page</li>
            <li>• Visit our homepage to find what you&apos;re looking for</li>
            <li>
              • Browse our{" "}
              <Link
                href="/developers"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                developer directory
              </Link>
            </li>
            <li>
              • Read our{" "}
              <Link
                href="/blogs"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                latest blog posts
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

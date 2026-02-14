

import Link from 'next/link';
import { ArrowRight, Home, Search, HelpCircle } from 'lucide-react';

// Friendly 404 with quick links back to primary conversion paths
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved,
          deleted, or never existed.
        </p>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/"
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <Home className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Go Home</h3>
            <p className="text-sm text-gray-600">Back to homepage</p>
          </Link>

          <Link
            href="/services"
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all group"
          >
            <Search className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Our Services</h3>
            <p className="text-sm text-gray-600">See what we offer</p>
          </Link>

          <Link
            href="/contact"
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-pink-300 transition-all group"
          >
            <HelpCircle className="w-8 h-8 text-pink-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Get Help</h3>
            <p className="text-sm text-gray-600">Contact our team</p>
          </Link>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          Back to Homepage
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>

        {/* Popular Pages */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/about"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              About Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/pricing"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Pricing
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/blog"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

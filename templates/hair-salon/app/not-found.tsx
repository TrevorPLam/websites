// [Task 0.22] Replaced hardcoded colors with semantic tokens for theme compatibility

import Link from 'next/link';
import { ArrowRight, Home, Search, HelpCircle } from 'lucide-react';

// Friendly 404 with quick links back to primary conversion paths
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Page Not Found</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved,
          deleted, or never existed.
        </p>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/"
            className="flex flex-col items-center p-6 bg-card rounded-lg shadow-xs border border-border hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <Home className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-foreground mb-1">Go Home</h3>
            <p className="text-sm text-muted-foreground">Back to homepage</p>
          </Link>

          <Link
            href="/services"
            className="flex flex-col items-center p-6 bg-card rounded-lg shadow-xs border border-border hover:shadow-md hover:border-secondary/30 transition-all group"
          >
            <Search className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-foreground mb-1">Our Services</h3>
            <p className="text-sm text-muted-foreground">See what we offer</p>
          </Link>

          <Link
            href="/contact"
            className="flex flex-col items-center p-6 bg-card rounded-lg shadow-xs border border-border hover:shadow-md hover:border-accent/30 transition-all group"
          >
            <HelpCircle className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-foreground mb-1">Get Help</h3>
            <p className="text-sm text-muted-foreground">Contact our team</p>
          </Link>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all shadow-lg hover:shadow-xl"
        >
          Back to Homepage
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>

        {/* Popular Pages */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/about"
              className="text-sm text-primary hover:text-primary/80 hover:underline"
            >
              About Us
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/pricing"
              className="text-sm text-primary hover:text-primary/80 hover:underline"
            >
              Pricing
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/blog"
              className="text-sm text-primary hover:text-primary/80 hover:underline"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

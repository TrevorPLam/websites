// Marketing component types
// Temporary placeholder types until components are fully implemented

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  credentials?: string[];
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  date?: string;
}

export interface GalleryItem {
  id: string;
  /** Image source URL */
  src: string;
  /** Image alt text */
  alt: string;
  title?: string;
  description?: string;
  caption?: string;
  href?: string;
  category?: string;
  tags?: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta?: {
    text: string;
    href: string;
  };
}

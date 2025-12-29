export interface CaseStudy {
  id: string
  slug: string
  title: string
  client: string
  industry: string
  description: string
  challenge: string
  solution: string
  results: {
    metric: string
    value: string
    description: string
  }[]
  testimonial: {
    quote: string
    author: string
    position: string
  }
  services: string[]
  duration: string
  image?: string
  featured?: boolean
}

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    slug: 'local-restaurant-chain-digital-transformation',
    title: 'Local Restaurant Chain Digital Transformation',
    client: 'Bella Vista Restaurant Group',
    industry: 'Food & Hospitality',
    description: 'How we helped a local restaurant chain increase online orders by 400% through integrated digital marketing.',
    challenge: 'Bella Vista operated 5 locations but had minimal online presence. They were losing customers to competitors with online ordering and struggled to fill tables during slow periods. Their marketing consisted of occasional social media posts with no clear strategy.',
    solution: 'We implemented a comprehensive digital marketing strategy including: local SEO optimization for all locations, social media advertising targeting nearby residents, email marketing to build a loyalty program, content marketing showcasing their chef and seasonal menu items, and integration with major delivery platforms.',
    results: [
      {
        metric: 'Online Orders',
        value: '+400%',
        description: 'Increase in monthly online orders within 6 months',
      },
      {
        metric: 'Revenue',
        value: '+$180K',
        description: 'Additional monthly revenue from digital channels',
      },
      {
        metric: 'Email List',
        value: '12,000',
        description: 'Engaged subscribers for ongoing marketing',
      },
      {
        metric: 'Social Reach',
        value: '250K+',
        description: 'Monthly social media impressions',
      },
    ],
    testimonial: {
      quote: 'Working with Your Dedicated Marketer transformed our business. We went from barely having a website to generating significant revenue online. Their team understood our local market and created strategies that actually worked.',
      author: 'Maria Santos',
      position: 'Owner, Bella Vista Restaurant Group',
    },
    services: ['SEO', 'Social Media Marketing', 'Email Marketing', 'Content Marketing'],
    duration: '6 months',
    featured: true,
  },
  {
    id: '2',
    slug: 'b2b-saas-lead-generation',
    title: 'B2B SaaS Lead Generation Success',
    client: 'CloudSync Technologies',
    industry: 'B2B SaaS',
    description: 'Scaling a B2B SaaS startup from 50 to 500 qualified leads per month through content and SEO.',
    challenge: 'CloudSync had a great product but struggled to reach their target audience of IT managers and CTOs. Their paid ads were expensive with poor conversion rates, and organic traffic was minimal. They needed a sustainable, cost-effective lead generation strategy.',
    solution: 'We developed a content-first approach focused on SEO and thought leadership: created comprehensive guides and comparison articles targeting buyer keywords, built topic clusters around their core solutions, implemented technical SEO improvements, launched a weekly newsletter with industry insights, and created case studies and whitepapers for lead magnets.',
    results: [
      {
        metric: 'Qualified Leads',
        value: '+900%',
        description: 'Growth in monthly qualified leads (50 to 500)',
      },
      {
        metric: 'Organic Traffic',
        value: '+650%',
        description: 'Increase in organic website traffic',
      },
      {
        metric: 'CAC Reduction',
        value: '-60%',
        description: 'Lower customer acquisition cost vs paid ads',
      },
      {
        metric: 'Conversion Rate',
        value: '8.5%',
        description: 'Lead to demo conversion rate',
      },
    ],
    testimonial: {
      quote: 'The team completely changed our approach to marketing. Instead of burning money on ads, we now have a sustainable content engine that brings in high-quality leads every single day. Our sales team is actually struggling to keep up!',
      author: 'James Chen',
      position: 'CEO, CloudSync Technologies',
    },
    services: ['SEO', 'Content Marketing', 'Email Marketing'],
    duration: '12 months',
    featured: true,
  },
  {
    id: '3',
    slug: 'ecommerce-revenue-growth',
    title: 'E-commerce Revenue Growth Through Multi-Channel Marketing',
    client: 'Urban Home Decor',
    industry: 'E-commerce',
    description: 'Doubling an online home decor store\'s revenue through strategic multi-channel marketing.',
    challenge: 'Urban Home Decor had a beautiful product line but inconsistent sales. They relied heavily on Instagram with sporadic results. Their website had good traffic but poor conversion rates, and they had no email marketing or retention strategy in place.',
    solution: 'We implemented a full-funnel e-commerce strategy: optimized product pages for SEO and conversions, launched targeted Pinterest and Google Shopping campaigns, created email automation for cart abandonment and post-purchase, developed seasonal content marketing campaigns, and implemented a customer loyalty program with email nurturing.',
    results: [
      {
        metric: 'Revenue',
        value: '+210%',
        description: 'Year-over-year revenue growth',
      },
      {
        metric: 'AOV',
        value: '+35%',
        description: 'Increase in average order value',
      },
      {
        metric: 'Email Revenue',
        value: '28%',
        description: 'Of total revenue from email marketing',
      },
      {
        metric: 'ROAS',
        value: '5.8x',
        description: 'Return on ad spend across all channels',
      },
    ],
    testimonial: {
      quote: 'I was skeptical about hiring a marketing agency, but these results speak for themselves. Not only did our revenue more than double, but we now have systems in place that continue generating sales on autopilot. Best investment we\'ve made.',
      author: 'Sarah Williams',
      position: 'Founder, Urban Home Decor',
    },
    services: ['SEO', 'Email Marketing', 'Social Media Marketing', 'Content Marketing'],
    duration: '9 months',
    featured: true,
  },
]

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((study) => study.featured)
}

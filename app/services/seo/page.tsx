import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import ServiceDetailLayout from '@/components/ServiceDetailLayout'

export const metadata: Metadata = {
  title: 'SEO Services | Your Dedicated Marketer',
  description: 'Professional SEO services including technical audits, on-page optimization, keyword research, and local SEO to help your business get found online.',
}

export default function SEOServicesPage() {
  return (
    <ServiceDetailLayout
      icon={Search}
      title="SEO Services"
      description="Get found by customers actively searching for your services. Our comprehensive SEO approach combines technical expertise with strategic content optimization to improve your search rankings and drive qualified traffic."
      serviceUrl="https://yourdedicatedmarketer.com/services/seo"
      included={[
        'Comprehensive technical SEO audit',
        'On-page optimization for all key pages',
        'Keyword research and competitive analysis',
        'Meta tag and structured data optimization',
        'Site structure and internal linking recommendations',
        'Local SEO setup and optimization',
        'Google Business Profile optimization',
        'Monthly ranking reports and insights',
        'Ongoing SEO monitoring and adjustments',
        'Search performance analysis',
      ]}
      process={[
        {
          title: 'Audit & Analysis',
          description: 'Complete technical SEO audit and competitive keyword research to identify opportunities.',
        },
        {
          title: 'Strategy Development',
          description: 'Create prioritized roadmap of SEO improvements based on impact and effort.',
        },
        {
          title: 'Implementation',
          description: 'Execute on-page optimizations, technical fixes, and content recommendations.',
        },
        {
          title: 'Monitor & Refine',
          description: 'Track rankings, traffic, and conversions. Continuously optimize based on data.',
        },
      ]}
      whoItsFor={[
        'Local businesses wanting to rank for "near me" searches',
        'Service providers looking to attract customers searching for their expertise',
        'E-commerce businesses wanting to improve product visibility in search',
        'B2B companies targeting decision-makers researching solutions',
        'Businesses with existing websites that need optimization',
        'Companies ready to invest in long-term organic growth',
      ]}
      pricing={[
        {
          tier: 'Starter',
          description: 'Basic SEO foundation for small businesses',
          href: '/pricing#starter',
        },
        {
          tier: 'Growth',
          description: 'Advanced SEO with ongoing optimization',
          href: '/pricing#growth',
        },
        {
          tier: 'Scale',
          description: 'Comprehensive SEO with technical implementation',
          href: '/pricing#scale',
        },
      ]}
      faqs={[
        {
          question: 'How long does it take to see SEO results?',
          answer: 'Most clients see initial improvements in 3-4 months, with significant gains by 6-12 months. SEO is a long-term investment that builds momentum over time. Quick wins like local SEO and technical fixes can show faster results.',
        },
        {
          question: 'Do you guarantee first page rankings?',
          answer: 'We don\'t guarantee specific rankings as Google\'s algorithm is constantly changing. However, we focus on proven strategies that improve visibility, drive qualified traffic, and increase conversions - which is what really matters for your business.',
        },
        {
          question: 'What\'s the difference between local and national SEO?',
          answer: 'Local SEO targets customers in your geographic area through Google Business Profile optimization and local citations. National SEO targets broader keywords across the country. Most small businesses benefit most from local SEO initially.',
        },
        {
          question: 'Will I need to update my website?',
          answer: 'Some SEO improvements require website updates (titles, meta descriptions, content). We provide clear recommendations and can either implement them directly (if you give us access) or work with your web developer to ensure proper execution.',
        },
        {
          question: 'How do you measure SEO success?',
          answer: 'We track rankings for target keywords, organic traffic growth, click-through rates, and most importantly - conversions from organic search. You\'ll receive monthly reports showing progress across all these metrics.',
        },
        {
          question: 'What if I\'m already working with another SEO company?',
          answer: 'We can conduct an audit of your current SEO efforts and provide recommendations. Many clients switch to us after not seeing results elsewhere. We focus on transparent reporting and strategies that actually drive business results.',
        },
      ]}
    />
  )
}

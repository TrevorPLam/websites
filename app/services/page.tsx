import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, FileText, Share2, Mail, TrendingUp, Database, Users, BarChart } from 'lucide-react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Marketing Services | Your Dedicated Marketer',
  description: 'Comprehensive marketing solutions for small businesses. SEO, content marketing, social media, email campaigns, and more.',
}

const coreServices = [
  {
    icon: Search,
    title: 'SEO Services',
    description: 'Technical SEO audits, on-page optimization, keyword research, and local SEO to get found by customers actively searching.',
    href: '/services/seo',
    features: ['Technical SEO', 'On-page optimization', 'Local SEO', 'Keyword research'],
  },
  {
    icon: FileText,
    title: 'Content Marketing',
    description: 'Strategic content planning, blog creation, editorial workflows, and content distribution to attract and engage your audience.',
    href: '/services/content',
    features: ['Blog posts', 'Content calendar', 'SEO optimization', 'Distribution strategy'],
  },
  {
    icon: Share2,
    title: 'Social Media Management',
    description: 'Platform strategy, content creation, post scheduling, community management, and engagement monitoring across all platforms.',
    href: '/services/social',
    features: ['Platform strategy', 'Content creation', 'Community management', 'Analytics'],
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Campaign strategy, email copywriting, list segmentation, automation setup, and performance tracking for higher conversions.',
    href: '/services/email',
    features: ['Campaign strategy', 'Automation', 'List segmentation', 'Analytics'],
  },
]

const supportServices = [
  {
    icon: TrendingUp,
    title: 'Marketing Strategy',
    description: 'Quarterly planning, channel recommendations, budget allocation, and competitive analysis.',
    href: '/services/strategy',
  },
  {
    icon: Database,
    title: 'CRM Setup & Management',
    description: 'Platform selection, workflow automation, contact organization, and reporting dashboards.',
    href: '/services/crm',
  },
  {
    icon: Users,
    title: 'Funnel Build-Out',
    description: 'Landing page optimization, lead magnets, conversion tracking, and A/B testing.',
    href: '/services/funnel',
  },
  {
    icon: BarChart,
    title: 'Marketing Reporting',
    description: 'Analytics dashboards, performance reports, KPI tracking, and ROI measurement.',
    href: '/services/reporting',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Marketing Services That Drive Growth
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Comprehensive marketing solutions designed to help small businesses scale effectively.
              No fluff, just strategies that deliver measurable results.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="large">
                Schedule Free Consultation
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Core Services */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Core Marketing Services
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Essential services to build your marketing foundation and drive consistent growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreServices.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.title} variant="service">
                  <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-teal" />
                  </div>
                  <h3 className="text-2xl font-semibold text-charcoal mb-3">{service.title}</h3>
                  <p className="text-slate mb-4 leading-relaxed">{service.description}</p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={`${service.title}-${feature}`} className="flex items-center text-slate">
                        <span className="w-1.5 h-1.5 bg-teal rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={service.href}
                    className="text-teal font-semibold hover:text-teal-dark transition-colors inline-flex items-center"
                  >
                    Learn More →
                  </Link>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Support Services */}
      <Section className="bg-off-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Support Services
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto">
              Additional services to enhance your marketing efforts and maximize ROI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportServices.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.title} variant="default">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-teal" />
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">{service.title}</h3>
                  <p className="text-sm text-slate mb-3 leading-relaxed">{service.description}</p>
                  <Link
                    href={service.href}
                    className="text-teal text-sm font-semibold hover:text-teal-dark transition-colors"
                  >
                    Learn More →
                  </Link>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-teal/10 to-teal/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Not Sure Which Services You Need?
            </h2>
            <p className="text-lg text-slate mb-8">
              Schedule a free consultation and we'll create a custom marketing plan tailored to your business goals and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="primary" size="large">
                  Schedule Consultation
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="large">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

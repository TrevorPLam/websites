import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import ServiceDetailLayout from '@/components/ServiceDetailLayout'

export const metadata: Metadata = {
  title: 'Content Marketing Services | Your Dedicated Marketer',
  description: 'Strategic content marketing services including blog creation, content calendars, SEO optimization, and distribution to attract and engage your target audience.',
}

export default function ContentMarketingPage() {
  return (
    <ServiceDetailLayout
      icon={FileText}
      title="Content Marketing"
      description="Attract and engage your audience with strategic, high-quality content. We handle everything from planning to publishing, creating content that educates, converts, and builds your brand authority."
      serviceSlug="content"
      included={[
        'Monthly content calendar planning',
        'Blog post creation (SEO-optimized)',
        'Topic research and keyword targeting',
        'Content editing and proofreading',
        'Featured image sourcing/creation',
        'Internal linking strategy',
        'Content distribution plan',
        'Social media content repurposing',
        'Performance tracking and optimization',
        'Editorial workflow management',
      ]}
      process={[
        {
          title: 'Strategy Session',
          description: 'Define content pillars, target audience, and goals aligned with your business objectives.',
        },
        {
          title: 'Calendar Planning',
          description: 'Create monthly content calendar with topics optimized for SEO and audience interest.',
        },
        {
          title: 'Content Creation',
          description: 'Write, edit, and optimize blog posts with proper formatting and keyword integration.',
        },
        {
          title: 'Publish & Promote',
          description: 'Publish content and distribute across channels to maximize reach and engagement.',
        },
      ]}
      whoItsFor={[
        'B2B companies looking to establish thought leadership',
        'Service businesses wanting to attract organic traffic through valuable content',
        'E-commerce brands building community and authority',
        'Startups needing consistent content but lacking in-house resources',
        'Companies with expertise to share but no time to write',
        'Businesses looking to support SEO efforts with quality content',
      ]}
      pricing={[
        {
          tier: 'Starter',
          description: '4 blog posts per month',
          href: '/pricing#starter',
        },
        {
          tier: 'Growth',
          description: '8 blog posts + content strategy',
          href: '/pricing#growth',
        },
        {
          tier: 'Scale',
          description: '12+ posts + advanced content hub',
          href: '/pricing#scale',
        },
      ]}
      faqs={[
        {
          question: 'Do I need to provide the topics or do you come up with them?',
          answer: 'We handle topic research based on your industry, target audience, and SEO opportunities. We\'ll present a content calendar for your approval each month. You\'re welcome to suggest topics, and we\'ll integrate them into the strategy.',
        },
        {
          question: 'How long are the blog posts?',
          answer: 'Typically 800-1,500 words depending on the topic and competition. We focus on comprehensive coverage that answers user questions rather than arbitrary word counts. Quality and usefulness matter more than length.',
        },
        {
          question: 'Can you write about technical topics in my industry?',
          answer: 'Yes! We conduct thorough research and can interview you or your team to ensure accuracy. For highly technical content, we work collaboratively - you provide the expertise, we handle the writing and optimization.',
        },
        {
          question: 'Who owns the content you create?',
          answer: 'You do! All content created for your business is 100% owned by you. You can use it however you want, even if we stop working together.',
        },
        {
          question: 'How do you optimize content for SEO?',
          answer: 'We conduct keyword research, optimize titles and meta descriptions, use proper heading structure, add internal links, optimize images, and ensure content answers user questions comprehensively. All while keeping it natural and readable.',
        },
        {
          question: 'What if I don\'t like a piece of content?',
          answer: 'We include revisions in our process. If something doesn\'t match your brand voice or needs adjustments, we\'ll revise it. We want you to be completely satisfied with every piece we publish.',
        },
      ]}
    />
  )
}

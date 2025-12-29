import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import ServiceDetailLayout from '@/components/ServiceDetailLayout'

export const metadata: Metadata = {
  title: 'Email Marketing Services | Your Dedicated Marketer',
  description: 'Professional email marketing services including campaign strategy, copywriting, list segmentation, automation setup, and performance tracking for higher conversions.',
}

export default function EmailMarketingPage() {
  return (
    <ServiceDetailLayout
      icon={Mail}
      title="Email Marketing"
      description="Nurture leads and drive conversions with targeted email campaigns. We create strategic email programs that build relationships with your audience and turn subscribers into customers."
      included={[
        'Email campaign strategy and planning',
        'Professional email copywriting',
        'Email template design and development',
        'List segmentation and targeting',
        'A/B testing for optimization',
        'Automation workflow setup',
        'Welcome series and nurture sequences',
        'Performance tracking and analytics',
        'List health management',
        'Compliance with email regulations (CAN-SPAM, GDPR)',
      ]}
      process={[
        {
          title: 'Strategy & Setup',
          description: 'Define goals, audience segments, and email program structure based on your business.',
        },
        {
          title: 'Campaign Creation',
          description: 'Write compelling copy, design templates, and set up campaigns in your email platform.',
        },
        {
          title: 'Automation Build',
          description: 'Create automated sequences for welcome, nurture, and conversion workflows.',
        },
        {
          title: 'Test & Optimize',
          description: 'Monitor performance, A/B test elements, and continuously improve results.',
        },
      ]}
      whoItsFor={[
        'E-commerce businesses wanting to increase repeat purchases',
        'B2B companies nurturing leads through the sales funnel',
        'Service providers staying top-of-mind with prospects',
        'Businesses with email lists not being used effectively',
        'Companies wanting to automate customer communication',
        'Organizations looking to increase customer lifetime value',
      ]}
      pricing={[
        {
          tier: 'Starter',
          description: '2 campaigns/month + basic automation',
          href: '/pricing#starter',
        },
        {
          tier: 'Growth',
          description: '4 campaigns/month + advanced automation',
          href: '/pricing#growth',
        },
        {
          tier: 'Scale',
          description: 'Unlimited campaigns + complex workflows',
          href: '/pricing#scale',
        },
      ]}
      faqs={[
        {
          question: 'Which email platform do you work with?',
          answer: 'We work with all major platforms including Mailchimp, Klaviyo, Constant Contact, HubSpot, ActiveCampaign, and others. If you don\'t have a platform yet, we\'ll help you choose the right one for your needs and budget.',
        },
        {
          question: 'What if I don\'t have an email list?',
          answer: 'We can help you build one! We\'ll create lead magnets, optimize signup forms, and implement strategies to grow your list organically. Building a quality email list takes time, but it\'s one of the most valuable marketing assets.',
        },
        {
          question: 'How often should I email my list?',
          answer: 'It depends on your industry and audience. Most businesses benefit from 2-4 emails per month for newsletters, plus automated sequences. We\'ll help find the right frequency that maintains engagement without causing unsubscribes.',
        },
        {
          question: 'Can you help with email deliverability issues?',
          answer: 'Yes! We follow best practices for deliverability including proper authentication (SPF, DKIM), list hygiene, engagement-based sending, and avoiding spam triggers. Good deliverability is essential for email success.',
        },
        {
          question: 'Do you provide the email content or do I?',
          answer: 'We write all email copy based on your business, offers, and goals. You\'ll review and approve before sending. If you have specific promotions or announcements, we\'ll transform those into effective email campaigns.',
        },
        {
          question: 'How do you measure email marketing success?',
          answer: 'We track open rates, click-through rates, conversion rates, list growth, and most importantly - revenue generated from email campaigns. You\'ll receive monthly reports showing these metrics and campaign performance.',
        },
      ]}
    />
  )
}

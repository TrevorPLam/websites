import type { Metadata } from 'next'
import { Share2 } from 'lucide-react'
import ServiceDetailLayout from '@/components/ServiceDetailLayout'

export const metadata: Metadata = {
  title: 'Social Media Management | Your Dedicated Marketer',
  description: 'Professional social media management services including strategy, content creation, posting, community management, and analytics across all major platforms.',
}

export default function SocialMediaPage() {
  return (
    <ServiceDetailLayout
      icon={Share2}
      title="Social Media Management"
      description="Build community and brand awareness across social platforms. We handle strategy, content creation, posting, and engagement so you can focus on running your business while maintaining an active social presence."
      serviceUrl="https://yourdedicatedmarketer.com/services/social"
      included={[
        'Platform strategy development',
        'Monthly content calendar creation',
        'Custom social media content creation',
        'Post scheduling and publishing',
        'Community management and engagement',
        'Comment monitoring and response',
        'Hashtag research and strategy',
        'Performance analytics and reporting',
        'Trend monitoring and recommendations',
        'Brand voice consistency across platforms',
      ]}
      process={[
        {
          title: 'Platform Audit',
          description: 'Analyze current social presence and identify opportunities for growth and engagement.',
        },
        {
          title: 'Strategy Creation',
          description: 'Develop platform-specific strategies aligned with your business goals and audience.',
        },
        {
          title: 'Content Production',
          description: 'Create engaging posts, graphics, and captions scheduled throughout the month.',
        },
        {
          title: 'Engage & Optimize',
          description: 'Monitor engagement, respond to comments, and refine strategy based on performance.',
        },
      ]}
      whoItsFor={[
        'Local businesses wanting to build community awareness',
        'B2C brands looking to engage directly with customers',
        'Service providers building thought leadership',
        'E-commerce businesses driving traffic to their store',
        'Companies lacking time to maintain consistent social presence',
        'Businesses wanting professional, on-brand social content',
      ]}
      pricing={[
        {
          tier: 'Starter',
          description: '2 platforms, 12 posts/month',
          href: '/pricing#starter',
        },
        {
          tier: 'Growth',
          description: '3 platforms, 20 posts/month + engagement',
          href: '/pricing#growth',
        },
        {
          tier: 'Scale',
          description: '4+ platforms, 30+ posts + community management',
          href: '/pricing#scale',
        },
      ]}
      faqs={[
        {
          question: 'Which social media platforms do you manage?',
          answer: 'We manage all major platforms: Facebook, Instagram, LinkedIn, Twitter/X, TikTok, and Pinterest. We recommend focusing on 2-3 platforms where your target audience is most active rather than spreading too thin.',
        },
        {
          question: 'Do I need to provide content or do you create it?',
          answer: 'We create all content including graphics, captions, and hashtags. Occasionally we may request photos of your products/services or team for authentic content. You\'ll approve the content calendar before we post.',
        },
        {
          question: 'How quickly do you respond to comments and messages?',
          answer: 'We monitor and respond to comments typically within 24 hours during business days. For direct messages, we can either respond on your behalf (for general inquiries) or forward to you for specific questions requiring your expertise.',
        },
        {
          question: 'Can you run social media ads?',
          answer: 'Yes! Social media advertising is available as an add-on service. We handle ad creative, targeting, budget management, and optimization. This is separate from organic social media management.',
        },
        {
          question: 'What if I want to post something spontaneous?',
          answer: 'Absolutely! We\'ll provide you with posting guidelines to maintain brand consistency. You can post anytime, and we\'ll work around your posts in our content calendar. We recommend a collaborative approach.',
        },
        {
          question: 'How do you measure social media success?',
          answer: 'We track follower growth, engagement rate, reach, clicks, and conversions. Success metrics vary by platform and goals. We focus on meaningful engagement and traffic rather than vanity metrics like follower count alone.',
        },
      ]}
    />
  )
}

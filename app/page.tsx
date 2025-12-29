import Hero from '@/components/Hero'
import ValueProps from '@/components/ValueProps'
import ServicesOverview from '@/components/ServicesOverview'
import SocialProof from '@/components/SocialProof'
import CaseStudyHighlight from '@/components/CaseStudyHighlight'
import FinalCTA from '@/components/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <ServicesOverview />
      <SocialProof />
      <CaseStudyHighlight />
      <FinalCTA />
    </>
  )
}

import { describe, expect, it } from 'vitest'
import { caseStudies, getCaseStudyBySlug, getFeaturedCaseStudies } from '@/lib/case-studies'

describe('case study utilities', () => {
  it('exposes case study data', () => {
    expect(caseStudies.length).toBeGreaterThan(0)
    expect(caseStudies[0]).toEqual(
      expect.objectContaining({
        slug: expect.any(String),
        title: expect.any(String),
        results: expect.any(Array),
      })
    )
  })

  it('returns a case study by slug', () => {
    const study = getCaseStudyBySlug(caseStudies[0].slug)

    expect(study?.slug).toBe(caseStudies[0].slug)
  })

  it('returns featured case studies', () => {
    const featured = getFeaturedCaseStudies()

    expect(featured.length).toBeGreaterThan(0)
    expect(featured.every((study) => study.featured)).toBe(true)
  })
})

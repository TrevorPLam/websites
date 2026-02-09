export interface SearchItem {
  title: string
  description: string
  url: string
}

export function getSearchIndex(): SearchItem[] {
  return [
    {
      title: 'Haircuts & Styling',
      description: 'Precision cuts and styling for women, men, and children',
      url: '/services/haircuts',
    },
    {
      title: 'Coloring Services',
      description: 'Full color, highlights, balayage, and color correction',
      url: '/services/coloring',
    },
    {
      title: 'Hair Treatments',
      description: 'Deep conditioning, keratin, and scalp treatments',
      url: '/services/treatments',
    },
    {
      title: 'Special Occasions',
      description: 'Bridal hair, updos, and styling for special events',
      url: '/services/special-occasions',
    },
    {
      title: 'Pricing',
      description: 'View our service menu and pricing',
      url: '/pricing',
    },
    {
      title: 'Contact Us',
      description: 'Book an appointment or get in touch',
      url: '/contact',
    },
    {
      title: 'About Us',
      description: 'Learn more about our salon and team',
      url: '/about',
    },
    {
      title: 'Blog',
      description: 'Read our latest hair care tips and trends',
      url: '/blog',
    },
  ]
}

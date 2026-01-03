# Your Dedicated Marketer - Marketing Website

A modern, SEO-optimized marketing website built with Next.js 14, featuring a blog system, case studies, and comprehensive service pages.

## ✨ Features

- **Modern Stack**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Blog System**: MDX-powered blog with syntax highlighting and rich formatting
- **Case Studies**: Detailed client success stories with metrics and testimonials
- **SEO Optimized**: Comprehensive meta tags, structured data, sitemap, and robots.txt
- **Contact Form**: Functional form with email integration via Resend
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Performance**: Static site generation for optimal load times
- **Type Safe**: Full TypeScript coverage for reliability

## 📋 Pages

- **Home** (`/`) - Hero, value propositions, services overview, social proof
- **About** (`/about`) - Company story, values, approach, track record
- **Services** (`/services`) - Service overview with dedicated pages for:
  - SEO Services (`/services/seo`)
  - Content Marketing (`/services/content`)
  - Social Media Marketing (`/services/social`)
  - Email Marketing (`/services/email`)
- **Pricing** (`/pricing`) - Tiered pricing with features and FAQs
- **Contact** (`/contact`) - Contact form with validation
- **Case Studies** (`/case-studies`) - Client success stories
- **Blog** (`/blog`) - MDX-powered blog with 5 initial posts

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Your-Dedicated-Marketer
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

   Edit `.env.local` and add your configuration:
   ```env
   # Application
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Your Dedicated Marketer

   # Email Service (Resend)
   RESEND_API_KEY=your_resend_api_key_here
   CONTACT_EMAIL=contact@yourdedicatedmarketer.com

   # Optional Analytics
   NEXT_PUBLIC_ANALYTICS_ID=

   # Environment
   NODE_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

### Project Structure

```
├── app/                    # Next.js 14 App Router pages
│   ├── about/             # About page
│   ├── blog/              # Blog system
│   ├── case-studies/      # Case studies
│   ├── contact/           # Contact page
│   ├── pricing/           # Pricing page
│   ├── services/          # Service pages
│   ├── layout.tsx         # Root layout with SEO
│   ├── page.tsx           # Homepage
│   ├── not-found.tsx      # 404 page
│   ├── loading.tsx        # Loading state
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Navigation.tsx    # Main navigation
│   └── Footer.tsx        # Site footer
├── content/              # Content files
│   └── blog/            # MDX blog posts
├── lib/                  # Utility functions and data
│   ├── actions.ts        # Server actions (contact form)
│   ├── blog.ts          # Blog utilities
│   └── case-studies.ts  # Case study data
├── public/               # Static assets
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## 📝 Content Management

### Adding Blog Posts

1. Create a new MDX file in `content/blog/`
2. Add frontmatter:
   ```mdx
   ---
   title: "Your Post Title"
   description: "Brief description for SEO"
   date: "2025-01-15"
   author: "Author Name"
   category: "Category Name"
   featured: true
   ---

   Your content here...
   ```

3. Blog posts automatically appear on the blog page and in the sitemap

### Adding Case Studies

1. Edit `lib/case-studies.ts`
2. Add a new case study object to the `caseStudies` array
3. Follow the existing structure for consistency

## 🔧 Configuration

### Email Integration (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
   CONTACT_EMAIL=your-email@domain.com
   ```

4. For production, verify your domain in Resend and update the `from` address in `lib/actions.ts`

### SEO Configuration

Update SEO settings in `app/layout.tsx`:
- `metadataBase` - Your production URL
- Social media links in structured data
- Google verification code (optional)
- OG image path

### Analytics (Optional)

To add analytics:
1. Get your analytics ID (Google Analytics, Plausible, etc.)
2. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
   ```
3. Add tracking script to `app/layout.tsx`

## 🚢 Deployment

### Deploy to Cloudflare Pages

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Connect to Cloudflare Pages**
   - Sign in to Cloudflare Dashboard
   - Go to Pages > Create a project
   - Connect your Git repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/`
   - Node version: `18`

4. **Set environment variables**
   Add all variables from `.env.local` in Cloudflare Pages settings

5. **Deploy**
   Push to your main branch to trigger automatic deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables**
   Use the Vercel dashboard to add production environment variables

4. **Production deployment**
   ```bash
   vercel --prod
   ```

## 📊 SEO Features

- ✅ Optimized meta tags (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD) for organization
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ Canonical URLs
- ✅ Semantic HTML structure
- ✅ Image optimization via Next.js
- ✅ Mobile-responsive design

## 🎨 Customization

### Colors and Branding

Update the color scheme in `tailwind.config.ts`:
```typescript
colors: {
  primary: '#your-color',
  secondary: '#your-color',
  // ... other colors
}
```

### Content

- Homepage: `app/page.tsx`
- About page: `app/about/page.tsx`
- Service pages: `app/services/[service]/page.tsx`
- Footer links: `components/Footer.tsx`
- Navigation: `components/Navigation.tsx`

## 🧪 Testing

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Contact form submits successfully
- [ ] Email delivery works (check spam folder)
- [ ] All links work (internal and external)
- [ ] Mobile responsive on various devices
- [ ] Images load and display correctly
- [ ] Blog posts render properly
- [ ] Case studies display correctly
- [ ] 404 page shows for invalid URLs
- [ ] SEO meta tags present on all pages
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`

## 📈 Performance

Current Lighthouse scores (target):
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 95+

### Optimization Tips

1. **Images**: Use WebP format and Next.js Image component
2. **Fonts**: Fonts are optimized via `next/font`
3. **Code splitting**: Automatic via Next.js
4. **Static generation**: All pages pre-rendered at build time
5. **Caching**: Configure CDN caching for static assets

## 🐛 Troubleshooting

### Build Errors

**ESLint warnings about config**:
- These are warnings, not errors. Build still succeeds.
- Can be fixed by updating ESLint config in the future.

**MDX parsing errors**:
- Check frontmatter syntax in blog posts
- Ensure all required fields are present

**Contact form not sending emails**:
- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard for error logs
- Ensure sending domain is verified (production)

## 📄 License

This project is proprietary and confidential.

## 🤝 Support

For support, email contact@yourdedicatedmarketer.com or visit our [contact page](https://yourdedicatedmarketer.com/contact).

## 📚 Additional Resources

### Documentation
- [Documentation Index](docs/DOCS_INDEX.md) - Complete documentation navigation
- [Repository Map](docs/REPO_MAP.md) - Repository structure overview
- [Contributing Guide](docs/workflows/CONTRIBUTING.md) - Contribution guidelines
- [Setup Guide](docs/workflows/SETUP.md) - Detailed setup instructions

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Resend API Documentation](https://resend.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

---

Built with ❤️ by Your Dedicated Marketer

# Deployment Guide

This guide covers deploying Your Dedicated Marketer website to production.

## Pre-Deployment Checklist

Before deploying, ensure you've completed these steps:

### 1. Content Review
- [ ] All pages reviewed for typos and accuracy
- [ ] Blog posts proofread and formatted correctly
- [ ] Case studies have real client data (or approved examples)
- [ ] About page reflects your actual business
- [ ] Contact information is correct

### 2. Configuration
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production URL
- [ ] Set production `RESEND_API_KEY`
- [ ] Verify `CONTACT_EMAIL` is correct
- [ ] Update social media links in `app/layout.tsx`
- [ ] Add real business address to structured data (if applicable)

### 3. Assets
- [ ] Create and add OG image at `public/og-image.jpg` (1200x630px)
- [ ] Add favicon files to `public/`
- [ ] Optimize all images in `public/`
- [ ] Add logo file if referenced

### 4. Testing
- [ ] Run `npm run build` successfully
- [ ] Test contact form locally
- [ ] Check all pages in production build (`npm run start`)
- [ ] Verify SEO tags with browser dev tools
- [ ] Test on mobile devices

## Deployment Options

### Option 1: Cloudflare Pages (Recommended)

Cloudflare Pages offers excellent performance, unlimited bandwidth, and automatic HTTPS.

#### Initial Setup

1. **Push code to GitHub** (if not already)
   ```bash
   git push origin main
   ```

2. **Create Cloudflare Pages Project**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages
   - Click "Create a project"
   - Click "Connect to Git"
   - Select your repository

3. **Configure Build Settings**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   Root directory: /
   Environment variables: (see below)
   ```

4. **Add Environment Variables**
   In Cloudflare Pages > Settings > Environment variables, add:
   ```
   NEXT_PUBLIC_SITE_URL=https://yourdedicatedmarketer.com
   NEXT_PUBLIC_SITE_NAME=Your Dedicated Marketer
   RESEND_API_KEY=your_production_key_here
   CONTACT_EMAIL=contact@yourdedicatedmarketer.com
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (2-5 minutes)
   - Your site will be live at `*.pages.dev`

#### Custom Domain Setup

1. **Add Custom Domain**
   - In Cloudflare Pages, go to Custom domains
   - Click "Set up a custom domain"
   - Enter your domain (e.g., `yourdedicatedmarketer.com`)

2. **Update DNS**
   - If domain is on Cloudflare: Automatically configured
   - If domain elsewhere: Add CNAME record pointing to your `*.pages.dev` domain

3. **SSL Certificate**
   - Cloudflare automatically provisions SSL certificate
   - Usually ready within 24 hours

4. **Update Environment Variables**
   - Update `NEXT_PUBLIC_SITE_URL` to your custom domain
   - Redeploy to apply changes

#### Continuous Deployment

- Cloudflare Pages automatically deploys when you push to main branch
- Preview deployments created for pull requests
- Rollback to previous deployments anytime

### Option 2: Vercel

Vercel is built by the Next.js team and offers seamless integration.

#### Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow prompts to link project
   - Choose default settings

4. **Add Environment Variables**
   ```bash
   vercel env add RESEND_API_KEY production
   vercel env add CONTACT_EMAIL production
   vercel env add NEXT_PUBLIC_SITE_URL production
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Deploy via GitHub

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository

2. **Configure**
   - Framework: Next.js (auto-detected)
   - Build command: `npm run build` (default)
   - Install command: `npm install --legacy-peer-deps`

3. **Add Environment Variables**
   - Add all variables from `.env.example`
   - Mark as production environment

4. **Deploy**
   - Click Deploy
   - Automatic deployments on push to main

### Option 3: Netlify

1. **Connect Repository**
   - Go to [app.netlify.com](https://app.netlify.com)
   - New site from Git
   - Choose your repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Site settings > Environment variables
   - Add all production variables

4. **Deploy**
   - Netlify builds and deploys automatically

## Post-Deployment Tasks

### 1. Verify Deployment

- [ ] Visit your production URL
- [ ] Test all major pages
- [ ] Submit contact form and verify email receipt
- [ ] Check mobile responsiveness
- [ ] Test all navigation links

### 2. SEO Configuration

#### Submit Sitemap to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

#### Submit to Bing

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Verify ownership
4. Submit sitemap

#### Schema Validation

1. Test structured data: [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Fix any errors or warnings
3. Verify organization schema appears correctly

### 3. Performance Testing

Run Lighthouse audit:
```bash
# Using Chrome DevTools
# Open DevTools > Lighthouse tab > Generate report
```

Or use online tools:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 95+

### 4. Set Up Monitoring

#### Uptime Monitoring (Free Options)

- [UptimeRobot](https://uptimerobot.com/) - Free for 50 monitors
- [Pingdom](https://www.pingdom.com/) - Free tier available
- [StatusCake](https://www.statuscake.com/) - Free tier available

#### Error Tracking (Optional)

- [Sentry](https://sentry.io/) - Application error tracking
- Add to `app/layout.tsx` for production errors

#### Analytics

If using Google Analytics:
1. Create GA4 property
2. Get Measurement ID
3. Add to `.env.local`: `NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX`
4. Add tracking script to `app/layout.tsx`

### 5. Set Up Email

#### Verify Resend Domain

For production email delivery:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain
3. Add DNS records (SPF, DKIM)
4. Verify domain
5. Update `from` address in `lib/actions.ts`:
   ```typescript
   from: 'contact@yourdomain.com'
   ```

#### Test Email Delivery

1. Submit contact form
2. Check inbox (and spam folder)
3. Verify email formatting
4. Test reply functionality

## Maintenance

### Regular Updates

**Weekly:**
- Review form submissions
- Check error logs
- Monitor site performance

**Monthly:**
- Update dependencies: `npm update`
- Review analytics
- Add new blog content
- Check for broken links

**Quarterly:**
- Update Next.js: `npm install next@latest react@latest react-dom@latest`
- Security audit: `npm audit`
- Performance review
- Content refresh

### Backup Strategy

**Git Repository:**
- Always serves as code backup
- Tag releases: `git tag v1.0.0`

**Database/CMS:**
- No database required (static site)
- Content in Git is backed up

**Build Artifacts:**
- Hosting platforms keep deployment history
- Can rollback anytime

## Troubleshooting

### Build Failures

**Out of memory:**
```bash
# Increase Node memory limit
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

**Dependency conflicts:**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps
```

### Email Not Sending

1. Check Resend API key is correct
2. Verify domain is verified (production)
3. Check Resend dashboard for errors
4. Ensure sending from verified email

### 404 Errors

1. Verify build completed successfully
2. Check routing in `app/` directory
3. Clear CDN cache (Cloudflare: Purge everything)

### SEO Issues

**Sitemap not updating:**
- Rebuild and redeploy
- Dynamic sitemap regenerates on each build

**Meta tags not showing:**
- Check page-specific metadata
- Verify Open Graph debuggers (Facebook, Twitter)

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Use platform-specific env vars in production
   - Rotate API keys regularly

2. **Dependencies**
   - Run `npm audit` regularly
   - Update dependencies monthly
   - Review security advisories

3. **Form Security**
   - Rate limiting via Resend (built-in)
   - Input validation (Zod schema)
   - HTTPS only (enforced by hosting)

4. **Headers**
   - Content Security Policy (optional)
   - X-Frame-Options (set by Next.js)
   - X-Content-Type-Options (set by Next.js)

## Rollback Procedure

### Cloudflare Pages
1. Go to Deployments
2. Find last working deployment
3. Click three dots > Rollback to this deployment

### Vercel
1. Go to Deployments
2. Find previous deployment
3. Click Promote to Production

### Manual Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## Performance Optimization

### After Initial Deployment

1. **Enable Compression**
   - Cloudflare: Automatic
   - Vercel: Automatic
   - Others: Check provider settings

2. **Configure Caching**
   - Set cache headers for static assets
   - CDN caching for images
   - Browser caching for fonts

3. **Image Optimization**
   - Use WebP format
   - Compress images (TinyPNG, Squoosh)
   - Use Next.js Image component

4. **Font Optimization**
   - Already optimized via `next/font`
   - Consider font subsetting if needed

## Support

For deployment issues:
- Check hosting provider documentation
- Review build logs carefully
- Search GitHub issues
- Contact support if needed

---

Last updated: 2025-01-15

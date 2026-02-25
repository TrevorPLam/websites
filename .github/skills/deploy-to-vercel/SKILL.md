---
name: deploy-to-vercel
description: Deploy Next.js application to Vercel with proper configuration and environment setup. Use this when asked to deploy or publish a site to Vercel.
---

To deploy a Next.js application to Vercel:

1. **Check Vercel CLI installation**

   ```bash
   vercel --version
   ```

   If not installed, run: `npm i -g vercel`

2. **Verify project structure**
   - Ensure `package.json` has build script: `"build": "next build"`
   - Check `next.config.js` or `next.config.ts` exists
   - Verify environment variables in `.env.local`

3. **Deploy to preview**

   ```bash
   vercel --confirm
   ```

   This creates a preview URL for testing

4. **Deploy to production**

   ```bash
   vercel --prod --confirm
   ```

   This deploys to the main production domain

5. **Environment variables**
   - Set sensitive vars in Vercel dashboard: `vercel env add`
   - Or use `.env.production` for client-side vars
   - Never commit secrets to git

6. **Custom domain setup**

   ```bash
   vercel domains add yourdomain.com
   ```

   Follow DNS instructions provided

7. **Verify deployment**
   - Check build logs for errors
   - Test critical functionality
   - Monitor Core Web Vitals

8. **Rollback if needed**
   ```bash
   vercel rollback [deployment-url]
   ```

**Common Issues:**

- Build failures: Check `next.config.js` and environment variables
- Missing dependencies: Ensure all packages are in package.json
- Large bundle: Use `next build --debug` to analyze

**Multi-tenant sites:**

- Use `VERCEL_ENV` for tenant-specific configurations
- Implement proper tenant routing in middleware
- Set up custom domains per tenant

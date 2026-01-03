# PWA Icons Guide

> **Last Updated:** 2026-01-03  
> **Canonical Status:** Canonical  
> **Purpose:** PWA icon specifications and setup instructions  
> **See Also:** [DOCS_INDEX.md](./DOCS_INDEX.md)

## Overview

This project is configured as a Progressive Web App (PWA). To complete the setup, you need to generate and add the following icon files to the `/public` directory.

## Required Icons

### 1. **icon-192.png** (192x192 pixels)
- **Purpose**: Standard PWA icon for Android devices
- **Location**: `/public/icon-192.png`
- **Format**: PNG with transparent background
- **Design**: Should contain your logo or brand mark
- **Note**: This will be used as the app icon when users add your site to their home screen

### 2. **icon-512.png** (512x512 pixels)
- **Purpose**: High-resolution PWA icon for larger displays and splash screens
- **Location**: `/public/icon-512.png`
- **Format**: PNG with transparent background
- **Design**: Same as 192px version, just higher resolution
- **Note**: Required for Android and Chrome

### 3. **apple-touch-icon.png** (180x180 pixels)
- **Purpose**: iOS/Safari app icon
- **Location**: `/public/apple-touch-icon.png`
- **Format**: PNG (no transparency recommended for iOS)
- **Design**: Your logo centered on a solid background color
- **Note**: iOS will automatically round the corners, so don't pre-round them

## How to Generate Icons

### Option 1: Using Design Tools
1. Create your icon design in Figma, Sketch, or Adobe Illustrator
2. Export at the required sizes (192x192, 512x512, 180x180)
3. Optimize using tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
4. Save to the `/public` directory

### Option 2: Using Online Generators
1. **[PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)**
   - Upload a high-res square image (at least 512x512)
   - Download the generated icon pack
   - Extract and use the required sizes

2. **[RealFaviconGenerator](https://realfavicongenerator.net/)**
   - Upload your master image
   - Customize appearance for different platforms
   - Download and extract the icons

### Option 3: Using Command Line (ImageMagick)
```bash
# Install ImageMagick (if not installed)
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Convert from a source image (master.png should be at least 512x512)
convert master.png -resize 192x192 public/icon-192.png
convert master.png -resize 512x512 public/icon-512.png
convert master.png -resize 180x180 public/apple-touch-icon.png
```

## Design Guidelines

### Best Practices
- **Keep it simple**: Icons should be recognizable at small sizes
- **Use solid colors**: Avoid gradients that may not render well at small sizes
- **Avoid text**: Small text becomes unreadable
- **Test on devices**: View on actual mobile devices to ensure clarity
- **Brand consistency**: Use your brand colors and logo

### Recommended Design
- **Primary color**: #0ea5e9 (teal, matches theme-color in manifest)
- **Background**: White (#ffffff) or teal
- **Logo**: Your "YDM" brand mark or full logo
- **Padding**: Leave 10-20% padding around the edges

## Testing Your PWA

### Desktop (Chrome/Edge)
1. Open your site in Chrome/Edge
2. Open DevTools (F12)
3. Go to Application > Manifest
4. Verify all icons are loading correctly
5. Click "Add to Home Screen" to test installation

### Mobile (Android)
1. Open your site in Chrome
2. Tap the three-dot menu
3. Select "Add to Home Screen"
4. Verify the icon appears correctly

### Mobile (iOS/Safari)
1. Open your site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Verify the icon appears correctly

## Lighthouse PWA Audit

Run a Lighthouse audit to verify PWA setup:

```bash
npm install -g lighthouse
lighthouse https://yourdedicatedmarketer.com --view
```

Or use Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Click "Generate report"

## Current Status

✅ PWA manifest created (`/public/manifest.json`)
✅ Meta tags added to HTML head
✅ Manifest linked in layout
⚠️ **Icons need to be generated** - See instructions above

## Additional Enhancements (Optional)

### Service Worker for Offline Support
Consider adding a service worker for offline functionality:
- Cache static assets
- Enable offline browsing
- Improve load performance

See Next.js documentation for implementing service workers:
https://nextjs.org/docs/pages/building-your-application/configuring/progressive-web-apps

### Install Prompt
Add a custom install prompt to encourage users to install the app:
```typescript
// Example: components/InstallPrompt.tsx
// Show a banner prompting users to install the PWA
```

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Next.js PWA Guide](https://nextjs.org/docs/pages/building-your-application/configuring/progressive-web-apps)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Add to Home Screen Guide](https://web.dev/customize-install/)

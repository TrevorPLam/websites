# Design System

## Core Color System (Authoritative)

### Primary Base (Authority & Trust)
```
Charcoal / Near-Black:  #0F1115
```

**Used for:**
- Headers
- Primary backgrounds
- Navigation
- Footer
- Anchor UI elements

This anchors YDM visually with seriousness and credibility.

---

### Primary Neutral (Canvas)
```
Soft Off-White:  #F6F7F9
```

**Used for:**
- Main page backgrounds
- Cards
- Sections
- Documents

**Important:** Avoid pure white. This reduces eye fatigue and keeps things premium.

---

### Secondary Neutral (Structure)
```
Cool Slate Gray:  #6B7280
```

**Used for:**
- Subheadlines
- Metadata
- Form labels
- Secondary text

This supports hierarchy without noise.

---

### Accent Color (Action & Focus)
```
Deep Teal / Steel Cyan:  #0EA5A4
```

**Used sparingly for:**
- Primary CTAs
- Active states
- Key highlights
- Icons that indicate action

This color signals movement, not excitement.

---

### Optional Secondary Accent (Limited Use)
```
Muted Amber:  #F59E0B
```

**Used ONLY for:**
- Warnings
- Emphasis callouts
- Metrics highlights

**Never** for branding dominance.

---

### Additional Functional Colors
```
Success Green:  #10B981  (Success states only)
Error Red:      #EF4444  (Error states only)
```

---

## Color Usage Rules (Non-Negotiable)

1. **One accent per screen** - Never stack accents
2. **CTAs are always teal** - No exceptions
3. **Headers are always charcoal** - Establishes authority
4. **Body text is slate on off-white** - Optimal readability
5. **Never use pure white** - Always use #F6F7F9

**If a designer breaks these rules, they are designing against the brand.**

---

## Typography System

### Primary Typeface (System-First)

**Inter** (Default choice)

**Why Inter:**
- Neutral
- Highly legible
- Designed for UI & dashboards
- Works across marketing + app surfaces

**Usage:**
- Headings
- Body
- UI
- Documentation

### Optional Alternative (If You Want More Authority)

**IBM Plex Sans**

More "enterprise system" feel, slightly colder. Use if you need to emphasize authority over approachability.

---

### Font Stack
```css
/* Primary */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Alternative (Authority) */
font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace (code, if needed) */
font-family: 'JetBrains Mono', 'Courier New', monospace;
```

---

### Type Hierarchy (Simple)

**No decorative fonts. Ever.**

```
H1: Bold / 48-56px       - line-height: 1.1
H2: Semibold / 36-40px   - line-height: 1.2
H3: Medium / 24-28px     - line-height: 1.3
Body: Regular / 16-18px  - line-height: 1.7
Small/Meta: Regular / 14px - line-height: 1.5
```

---

## Spacing System

Based on 4px base unit:

```
0:    0px
1:    4px
2:    8px
3:    12px
4:    16px
5:    20px
6:    24px
8:    32px
10:   40px
12:   48px
16:   64px
20:   80px
24:   96px
32:   128px
```

### Spacing Usage
- **Component padding**: 4 (16px) or 6 (24px)
- **Section padding**: 12 (48px) or 16 (64px)
- **Element margins**: 2 (8px), 4 (16px), or 6 (24px)
- **Layout gaps**: 6 (24px) or 8 (32px)

---

## Component Library

### Buttons

#### Primary Button (Teal - Action)
```html
<button class="bg-[#0EA5A4] hover:bg-[#0d8f8e] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
  Get Started
</button>
```

**Usage**: Main CTAs, primary actions only
**Color**: Always teal (#0EA5A4)
**States**: Default, Hover, Active, Disabled

---

#### Secondary Button (Outlined)
```html
<button class="bg-transparent hover:bg-[#F6F7F9] text-[#0F1115] font-semibold py-3 px-6 rounded-lg border-2 border-[#0F1115] transition-colors">
  Learn More
</button>
```

**Usage**: Secondary actions, alternative CTAs
**Color**: Charcoal outline on transparent background

---

#### Text Button
```html
<button class="text-[#0EA5A4] hover:text-[#0d8f8e] font-semibold py-2 px-4 transition-colors">
  View Details →
</button>
```

**Usage**: Tertiary actions, inline links
**Color**: Teal text only

### Button Sizes
- **Large**: py-4 px-8 text-lg (Hero CTAs)
- **Medium**: py-3 px-6 text-base (Standard buttons)
- **Small**: py-2 px-4 text-sm (Secondary actions)

---

### Cards

#### Basic Card
```html
<div class="bg-[#F6F7F9] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
  <h3 class="text-xl font-semibold text-[#0F1115] mb-3">Card Title</h3>
  <p class="text-[#6B7280]">Card content goes here.</p>
</div>
```

**Background**: Soft Off-White (#F6F7F9)
**Text**: Charcoal headings, Slate Gray body

---

#### Service Card
```html
<div class="bg-[#F6F7F9] rounded-xl shadow-md p-8 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200">
  <div class="w-12 h-12 bg-[#0EA5A4]/10 rounded-lg flex items-center justify-center mb-4">
    <!-- Icon in Teal -->
    <svg class="w-6 h-6 text-[#0EA5A4]">...</svg>
  </div>
  <h3 class="text-2xl font-semibold text-[#0F1115] mb-3">Service Name</h3>
  <p class="text-[#6B7280] mb-4">Service description</p>
  <a href="#" class="text-[#0EA5A4] font-semibold hover:text-[#0d8f8e]">Learn More →</a>
</div>
```

**Icon background**: Teal at 10% opacity
**Icon color**: Full teal
**Text**: Charcoal headings, Slate body, Teal links

---

#### Testimonial Card
```html
<div class="bg-[#F6F7F9] rounded-xl p-8 border border-gray-200">
  <p class="text-[#6B7280] mb-6 italic">"Testimonial quote here."</p>
  <div class="flex items-center">
    <img src="avatar.jpg" class="w-12 h-12 rounded-full mr-4" />
    <div>
      <p class="font-semibold text-[#0F1115]">Client Name</p>
      <p class="text-[#6B7280] text-sm">Company, Title</p>
    </div>
  </div>
</div>
```

**Background**: Soft Off-White
**Quote**: Slate Gray
**Name**: Charcoal

---

### Forms

#### Input Field
```html
<div class="mb-4">
  <label class="block text-[#6B7280] font-semibold mb-2">
    Label
  </label>
  <input 
    type="text" 
    class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-[#F6F7F9] text-[#0F1115] focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20 transition-all placeholder:text-[#6B7280]"
    placeholder="Placeholder text"
  />
</div>
```

**Label**: Slate Gray
**Input background**: Soft Off-White
**Input text**: Charcoal
**Focus state**: Teal border and ring

---

#### Textarea
```html
<textarea 
  class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-[#F6F7F9] text-[#0F1115] focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20 transition-all placeholder:text-[#6B7280]"
  rows="4"
  placeholder="Message"
></textarea>
```

---

#### Select Dropdown
```html
<select class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-[#F6F7F9] text-[#0F1115] focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20">
  <option>Select an option</option>
</select>
```

---

### Navigation

#### Desktop Navigation
```html
<nav class="bg-[#0F1115] shadow-sm sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <div class="text-2xl font-bold text-white">YD Marketer</div>
    <div class="flex items-center gap-8">
      <a href="#" class="text-white/80 hover:text-white font-medium transition-colors">Services</a>
      <a href="#" class="text-white/80 hover:text-white font-medium transition-colors">Pricing</a>
      <a href="#" class="text-white/80 hover:text-white font-medium transition-colors">About</a>
      <a href="#" class="text-white/80 hover:text-white font-medium transition-colors">Blog</a>
      <button class="bg-[#0EA5A4] hover:bg-[#0d8f8e] text-white px-6 py-2 rounded-lg font-semibold transition-colors">
        Get Started
      </button>
    </div>
  </div>
</nav>
```

**Background**: Charcoal (#0F1115)
**Links**: White at 80% opacity, 100% on hover
**CTA**: Teal button

#### Mobile Menu
- Hamburger icon (right side)
- Slide-in menu from right
- Full-height overlay
- Large tap targets (min 44px)

---

### Layout Containers

#### Max Width Container
```html
<div class="max-w-7xl mx-auto px-6">
  <!-- Content -->
</div>
```

**Usage**: All page sections
**Max width**: 1280px
**Padding**: 24px (1.5rem) on mobile, 24px (1.5rem) on desktop

#### Section Spacing
```html
<section class="py-16 md:py-24">
  <!-- Section content -->
</section>
```

**Vertical padding**: 64px mobile, 96px desktop

---

## Iconography

### Icon Library
Use Lucide React or Heroicons for consistent icon style.

### Icon Sizes
- **Small**: 16px (inline text)
- **Medium**: 24px (buttons, navigation)
- **Large**: 32px (feature highlights)
- **Hero**: 48px (section headers)

### Icon Usage
- Use stroke icons for consistency
- Match icon weight to surrounding text
- Align icons with text baseline
- Add aria-label for accessibility

---

## Images & Media

### Image Guidelines
- **Hero images**: 1920x1080px minimum
- **Service cards**: 800x600px
- **Blog thumbnails**: 1200x630px (Open Graph)
- **Team photos**: 400x400px (square)
- **Format**: WebP with JPEG fallback
- **Optimization**: Use next/image for automatic optimization

### Image Styles
```css
/* Rounded corners */
.rounded-lg: border-radius: 0.5rem (8px)
.rounded-xl: border-radius: 0.75rem (12px)
.rounded-2xl: border-radius: 1rem (16px)

/* Shadows */
.shadow-md: 0 4px 6px rgba(0,0,0,0.1)
.shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
.shadow-xl: 0 20px 25px rgba(0,0,0,0.1)
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Small laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

### Responsive Design Patterns

**Navigation**
- Mobile: Hamburger menu
- Desktop: Horizontal navigation

**Grid Layouts**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

**Typography**
- Mobile: Scale down 10-20%
- Desktop: Full type scale

**Spacing**
- Mobile: Reduce section padding by ~30%
- Desktop: Full spacing scale

---

## Accessibility

### Color Contrast
With the YDM color system:

- **Charcoal (#0F1115) on Off-White (#F6F7F9)**: 15.8:1 ratio ✅ (Excellent)
- **Slate Gray (#6B7280) on Off-White (#F6F7F9)**: 4.6:1 ratio ✅ (AA compliant)
- **Teal (#0EA5A4) on Off-White (#F6F7F9)**: 3.8:1 ratio ⚠️ (Use for accents only, not body text)
- **White text on Charcoal (#0F1115)**: 15.8:1 ratio ✅ (Excellent for navigation)

**Requirements:**
- Body text: Minimum 4.5:1 ratio (use Slate on Off-White)
- Large text (18px+): Minimum 3:1 ratio
- UI elements: Minimum 3:1 ratio

### Focus States
```css
focus:ring-2 focus:ring-[#0EA5A4] focus:ring-offset-2
```

Use teal for all focus indicators to maintain brand consistency.

### ARIA Labels
- Add aria-label to icon-only buttons
- Use alt text for all images
- Mark up forms with proper labels
- Use semantic HTML (nav, main, footer, article)

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Skip navigation link
- Visible focus indicators

---

## Animation & Transitions

### Transition Timing
```css
transition-all: all 150ms ease-in-out
transition-colors: color, background-color 150ms
transition-transform: transform 200ms
```

### Hover Effects
- **Buttons**: Background color change + slight scale
- **Cards**: Shadow increase + slight lift
- **Links**: Color change + underline
- **Images**: Slight scale or overlay

### Loading States
```html
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

---

## Design Tokens (Tailwind Config)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand Colors
        charcoal: '#0F1115',
        'off-white': '#F6F7F9',
        slate: '#6B7280',
        teal: {
          DEFAULT: '#0EA5A4',
          dark: '#0d8f8e',
          light: '#10b5b4',
        },
        amber: '#F59E0B',
        
        // Functional Colors
        success: '#10B981',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        authority: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'h1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['1.75rem', { lineHeight: '1.3', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        'meta': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
}
```

## Color Usage Summary

| Element | Color | Hex Code |
|---------|-------|----------|
| Headers | Charcoal | #0F1115 |
| Body Text | Slate Gray | #6B7280 |
| Backgrounds | Off-White | #F6F7F9 |
| Primary CTAs | Teal | #0EA5A4 |
| Navigation | Charcoal | #0F1115 |
| Footer | Charcoal | #0F1115 |
| Links | Teal | #0EA5A4 |
| Warnings | Amber | #F59E0B |
| Success | Green | #10B981 |
| Errors | Red | #EF4444 |

**Remember:** One accent per screen. CTAs are always teal. Headers are always charcoal.

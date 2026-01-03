# Component Specifications

## Homepage Components

### Hero Section
**Location**: Top of homepage (above fold)

**Structure**:
- Full-width container with max-width constraint
- Left: Headline + subheadline + CTA buttons
- Right: Hero image or illustration (optional)
- Background: White or subtle gradient

**Content**:
- **H1 Headline**: "Growth-Focused Marketing for Small Businesses"
- **Subheadline**: "Strategic marketing services that drive real results - without the agency overhead"
- **Primary CTA**: "Schedule Free Consultation"
- **Secondary CTA**: "View Services"
- **Hero Image**: Professional marketing illustration or abstract

**Responsive**:
- Desktop: 2-column layout (text left, image right)
- Mobile: Stacked (text on top, image below or hidden)

**File**: `app/components/Hero.tsx`

---

### Value Propositions
**Location**: Below hero section

**Structure**:
- 3-column grid (desktop) / 1-column stack (mobile)
- Icon + heading + description for each value prop
- Equal height cards with hover effects

**Content**:
1. **Strategic Approach**
   - Icon: Target or lightbulb
   - Heading: "Data-Driven Strategy"
   - Description: "Marketing strategies tailored to your business goals and backed by analytics"

2. **Transparent Pricing**
   - Icon: Dollar sign or calculator
   - Heading: "No Surprise Costs"
   - Description: "Clear, predictable monthly pricing with no hidden fees or unexpected charges"

3. **Hands-On Execution**
   - Icon: Gears or hands
   - Heading: "We Execute, Not Just Plan"
   - Description: "From strategy to implementation, we handle every aspect of your marketing"

**File**: `app/components/ValueProps.tsx`

---

### Services Overview
**Location**: Mid-homepage

**Structure**:
- Section header with title and description
- 4-card grid (2x2 on desktop, stack on mobile)
- Each card: Icon + title + short description + "Learn More" link

**Services**:
1. **SEO Services**
   - Icon: Search/magnifying glass
   - Description: "Get found by customers actively searching for your services"
   
2. **Content Marketing**
   - Icon: Document/pencil
   - Description: "Attract and engage your audience with strategic content"

3. **Social Media**
   - Icon: Share/social icons
   - Description: "Build community and brand awareness across platforms"

4. **Email Marketing**
   - Icon: Envelope
   - Description: "Nurture leads and drive conversions with targeted campaigns"

**Interaction**:
- Hover: Card lifts slightly with shadow increase
- Click: Navigates to service detail page

**File**: `app/components/ServicesOverview.tsx`

---

### Social Proof Section
**Location**: Below services overview

**Structure**:
- Carousel or grid of testimonials
- Each testimonial: Quote + client name + company + photo (optional)
- Trust indicators: Certifications, tools, years in business

**Content**:
- 3-6 client testimonials
- Metrics showcase: "X% average growth", "X clients served"
- Optional: Company logos of clients

**File**: `app/components/SocialProof.tsx`

---

### Case Study Highlight
**Location**: Near bottom of homepage

**Structure**:
- Full-width section with background color
- Left: Case study details
- Right: Key metrics visualization

**Content**:
- **Headline**: "How [Client] Increased Revenue 250% in 6 Months"
- **Description**: 2-3 sentence overview
- **Metrics**: 3 key results with icons
- **CTA**: "View Full Case Study"

**File**: `app/components/CaseStudyHighlight.tsx`

---

### Final CTA Section
**Location**: Bottom of homepage (before footer)

**Structure**:
- Centered content with background color
- Headline + supporting text + CTA button
- Optional: Contact form or calendar embed

**Content**:
- **Headline**: "Ready to Grow Your Business?"
- **Text**: "Schedule a free 30-minute consultation to discuss your marketing goals"
- **CTA**: "Schedule Free Consultation"
- **Secondary**: "View Pricing"

**File**: `app/components/FinalCTA.tsx`

---

## Services Page Components

### Services Grid
**Location**: Main content area of /services

**Structure**:
- Grid of service cards (3 columns on desktop)
- Filterable by service type (Core/Support/Advisory)
- Expandable cards for more details

**Content**: Each service card includes:
- Service icon
- Service name
- 1-sentence description
- "Learn More" link to detail page
- Price tier indicator (if applicable)

**Interaction**:
- Filter buttons: "All", "Core Services", "Add-Ons", "Advisory"
- Smooth animations when filtering
- Hover effects on cards

**File**: `app/services/components/ServicesGrid.tsx`

---

### Service Detail Template
**Location**: Individual service pages (e.g., /services/seo)

**Structure**:
- Hero section with service name
- What's Included section (bulleted list)
- Process overview (steps with icons)
- Who It's For section
- Pricing information
- FAQ accordion
- CTA section

**Reusable Template Variables**:
- `serviceName`: string
- `description`: string
- `included`: string[]
- `process`: {step: string, description: string}[]
- `pricing`: {tier: string, price: string}[]
- `faqs`: {question: string, answer: string}[]

**File**: `app/services/[slug]/ServiceDetailTemplate.tsx`

---

## Pricing Page Components

### Pricing Table
**Location**: Main content of /pricing page

**Structure**:
- 3-column pricing table (stack on mobile)
- Feature comparison rows
- Highlight "most popular" tier

**Tiers**:
1. **Starter**: $1,500/month
2. **Growth**: $3,500/month (highlighted)
3. **Scale**: $6,000+/month

**Features to Compare**:
- Monthly content pieces
- SEO level
- Social media management
- Email campaigns
- Reporting frequency
- Strategy calls
- Account management

**Interactive Elements**:
- Toggle: Monthly vs Annual pricing (if offering)
- "Get Started" button for each tier
- Expandable feature descriptions

**File**: `app/pricing/components/PricingTable.tsx`

---

### Add-Ons Section
**Location**: Below pricing table

**Structure**:
- Grid of add-on service cards
- Each card: Name + description + starting price
- "Learn More" link to service details

**Add-Ons**:
- PPC Management: $1,000+/month
- Website Redesign: $5,000+ project
- Advanced SEO: $2,000+/month
- Video Content: $500+/video

**File**: `app/pricing/components/AddOns.tsx`

---

### Pricing FAQ
**Location**: Bottom of pricing page

**Structure**:
- Accordion-style FAQ
- 6-8 common questions
- Expandable answers

**Questions**:
1. What's included in each tier?
2. Can I switch tiers?
3. What payment methods do you accept?
4. Is there a contract?
5. What's not included in these prices?
6. How do we measure success?
7. Do you work with businesses in my industry?
8. What if I need custom services?

**File**: `app/pricing/components/PricingFAQ.tsx`

---

## Blog Components

### Blog Grid
**Location**: Main /blog page

**Structure**:
- Grid layout (3 columns desktop, 1 mobile)
- Featured post at top (larger card)
- Standard post cards below
- Pagination at bottom

**Post Card Contents**:
- Thumbnail image
- Category tag
- Post title
- Excerpt (2 sentences)
- Read time
- Author info (optional)
- Publish date
- "Read More" link

**File**: `app/blog/components/BlogGrid.tsx`

---

### Blog Post Template
**Location**: Individual blog posts (/blog/[slug])

**Structure**:
- Article header (title, meta info, featured image)
- Table of contents (for long posts)
- Article body (MDX rendered)
- Author bio section
- Related posts
- CTA section

**Meta Info**:
- Author name and photo
- Publish date
- Read time
- Category
- Share buttons

**File**: `app/blog/[slug]/BlogPost.tsx`

---

### Category Filter
**Location**: Blog page sidebar or top

**Structure**:
- List or dropdown of categories
- Active state styling
- Post count per category

**Categories** (based on content pillars):
- All Posts
- SEO & Organic Growth
- Content Marketing
- Social Media
- Email Marketing
- Marketing Strategy

**File**: `app/blog/components/CategoryFilter.tsx`

---

## Contact Page Components

### Contact Form
**Location**: Main /contact page

**Structure**:
- 2-column layout (form left, info right on desktop)
- Form fields with validation
- Submit button with loading state
- Success/error messages

**Form Fields**:
- Name (required)
- Email (required)
- Company name
- Phone (optional)
- Current marketing spend (dropdown)
- Message (required, textarea)
- How did you hear about us? (dropdown)

**Validation**:
- Real-time validation on blur
- Error messages below fields
- Disable submit until valid
- Email format validation
- Phone format validation (if provided)

**File**: `app/contact/components/ContactForm.tsx`

---

### Contact Information
**Location**: Right side of contact page

**Structure**:
- Contact details card
- Office hours
- Alternative contact methods
- Map or location (optional)

**Content**:
- Email: contact@yourdedicatedmarketer.com
- Phone: (XXX) XXX-XXXX
- Hours: Monday-Friday, 9am-5pm EST
- Calendar booking link
- Social media links

**File**: `app/contact/components/ContactInfo.tsx`

---

## Shared Components

### Navigation Bar
**Location**: Top of every page (sticky)

**Structure**:
- Logo (left)
- Navigation links (center)
- CTA button (right)
- Mobile: Hamburger menu

**Links**:
- Services (dropdown with submenu)
- Pricing
- Case Studies
- Blog
- About
- Contact

**Mobile Menu**:
- Slide-in from right
- Full-screen overlay
- Large tap targets
- Close button

**File**: `app/components/Navigation.tsx`

---

### Footer
**Location**: Bottom of every page

**Structure**:
- 4-column layout (stack on mobile)
- Logo and tagline
- Quick links
- Services list
- Contact info
- Social media icons
- Copyright and legal links

**Columns**:
1. **Brand**: Logo, tagline, social icons
2. **Services**: Links to service pages
3. **Company**: About, Case Studies, Blog, Careers
4. **Legal**: Privacy Policy, Terms of Service, Contact

**File**: `app/components/Footer.tsx`

---

### CTA Banner
**Reusable component for section CTAs**

**Props**:
- `headline`: string
- `description`: string (optional)
- `primaryCTA`: {text: string, href: string}
- `secondaryCTA`: {text: string, href: string} (optional)
- `backgroundColor`: string (optional)

**Usage**:
Can be placed anywhere to drive conversions

**File**: `app/components/CTABanner.tsx`

---

### Testimonial Carousel
**Reusable testimonial component**

**Props**:
- `testimonials`: Array of testimonial objects
- `autoplay`: boolean (optional)
- `showNavigation`: boolean (optional)

**Testimonial Object**:
```typescript
{
  quote: string;
  author: string;
  company: string;
  title: string;
  avatar?: string;
}
```

**File**: `app/components/TestimonialCarousel.tsx`

---

## Form Components

### Input Field
**Reusable input component**

**Props**:
- `label`: string
- `type`: "text" | "email" | "tel" | "number"
- `name`: string
- `placeholder`: string (optional)
- `required`: boolean
- `error`: string (optional)
- `onChange`: function
- `value`: string

**File**: `app/components/forms/Input.tsx`

---

### Select Dropdown
**Reusable select component**

**Props**:
- `label`: string
- `name`: string
- `options`: {value: string, label: string}[]
- `required`: boolean
- `error`: string (optional)
- `onChange`: function
- `value`: string

**File**: `app/components/forms/Select.tsx`

---

### Textarea
**Reusable textarea component**

**Props**:
- `label`: string
- `name`: string
- `placeholder`: string (optional)
- `rows`: number
- `required`: boolean
- `error`: string (optional)
- `onChange`: function
- `value`: string

**File**: `app/components/forms/Textarea.tsx`

---

## State Management

### Form State
Use React Hook Form for all forms:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;
```

### Loading States
- Show loading spinner on async operations
- Disable form submission during processing
- Display success/error messages

### Error Handling
- Display validation errors inline
- Show API errors as toast notifications
- Log errors to error tracking service

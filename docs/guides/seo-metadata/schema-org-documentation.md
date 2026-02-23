# schema-org-documentation.md


# Schema.org Documentation

> Schema.org is a collaborative, community-driven vocabulary for structured data on the web. It provides a standardized way to markup HTML content with machine-readable metadata, enabling search engines and other applications to better understand and display web content.

## Overview

Schema.org is an initiative founded in 2011 by Google, Microsoft, Yahoo, and Yandex to create a shared vocabulary for structured data markup. The project is now managed by the Schema.org Community Group under the W3C and has become the de facto standard for semantic markup on the web.

### Key Concepts

- **Structured Data**: Standardized format for providing information about a page and classifying the page content
- **Vocabulary**: Collection of types and properties that define the relationships between entities
- **Markup Formats**: JSON-LD (recommended), Microdata, and RDFa
- **Rich Results**: Enhanced search features enabled by structured data

## Implementation Formats

### JSON-LD (Recommended)

JSON-LD (JavaScript Object Notation for Linked Data) is Google's recommended format for structured data:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Understanding Schema.org",
    "author": {
      "@type": "Person",
      "name": "John Doe"
    },
    "datePublished": "2026-01-15T10:00:00+00:00"
  }
</script>
```

### Microdata

HTML attributes that embed structured data within existing content:

```html
<div itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">Understanding Schema.org</h1>
  <div itemprop="author" itemscope itemtype="https://schema.org/Person">
    <span itemprop="name">John Doe</span>
  </div>
  <meta itemprop="datePublished" content="2026-01-15T10:00:00+00:00" />
</div>
```

### RDFa

Extends HTML to support linked data:

```html
<div vocab="https://schema.org/" typeof="Article">
  <h1 property="headline">Understanding Schema.org</h1>
  <div property="author" typeof="Person">
    <span property="name">John Doe</span>
  </div>
  <meta property="datePublished" content="2026-01-15T10:00:00+00:00" />
</div>
```

## Core Schema Types

### Article Types

#### Article

The base type for all article content.

**Required Properties**: None (all are recommended)
**Recommended Properties**:

- `author`: Person or Organization
- `datePublished`: DateTime (ISO 8601 format)
- `dateModified`: DateTime (ISO 8601 format)
- `headline`: Text
- `image`: ImageObject or URL

**Example**:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Future of Web Development",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://example.com/author/jane-smith"
  },
  "datePublished": "2026-01-15T10:00:00+00:00",
  "dateModified": "2026-01-16T14:30:00+00:00",
  "image": [
    "https://example.com/photos/1x1/article.jpg",
    "https://example.com/photos/4x3/article.jpg",
    "https://example.com/photos/16x9/article.jpg"
  ]
}
```

#### NewsArticle

Extends Article for news content.

**Additional Properties**:

- `dateline`: Text
- `printColumn`: Text
- `printEdition`: Text
- `printPage`: Text
- `publisher`: Organization

#### BlogPosting

Extends Article for blog posts.

**Additional Properties**:

- `blogPost`: Blog (parent blog)

### FAQPage

For pages containing frequently asked questions.

**Required Properties**:

- `mainEntity`: Array of Question objects

**Question Properties**:

- `name`: Text (the question)
- `acceptedAnswer`: Answer object

**Answer Properties**:

- `text`: Text (the answer, supports limited HTML)

**Example**:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does shipping take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days."
      }
    },
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 30-day return policy for all unused items in original packaging."
      }
    }
  ]
}
```

### Product

For product information and e-commerce.

**Required Properties**:

- `name`: Text
- One of: `review`, `aggregateRating`, or `offers`

**Recommended Properties**:

- `image`: ImageObject or URL
- `description`: Text
- `brand`: Brand or Organization
- `sku`: Text
- `mpn`: Text

**Offer Properties** (when using offers):

- `price`: Number
- `priceCurrency`: Text (ISO 4217 format)
- `availability`: ItemAvailability
- `seller`: Organization or Person

**Example**:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wireless Bluetooth Headphones",
  "image": "https://example.com/photos/headphones.jpg",
  "description": "Premium noise-cancelling wireless headphones with 30-hour battery life.",
  "brand": {
    "@type": "Brand",
    "name": "AudioTech"
  },
  "sku": "ATH-001",
  "offers": {
    "@type": "Offer",
    "price": 299.99,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "TechStore"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "1247"
  }
}
```

### SoftwareApplication

For software, mobile apps, and web applications.

**Key Properties**:

- `name`: Text
- `applicationCategory`: Text or URL
- `operatingSystem`: Text
- `offers`: Offer
- `aggregateRating`: AggregateRating
- `author`: Organization
- `downloadUrl`: URL
- `screenshot`: ImageObject

**Example**:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Productivity Manager",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "ANDROID, iOS",
  "offers": {
    "@type": "Offer",
    "price": "9.99",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.2",
    "reviewCount": "8921"
  },
  "author": {
    "@type": "Organization",
    "name": "Productivity Apps Inc."
  },
  "downloadUrl": "https://play.google.com/store/apps/details?id=com.productivity.manager"
}
```

## Implementation Best Practices

### General Guidelines

1. **Use Specific Types**: Choose the most specific type available
2. **Complete Required Properties**: Ensure all required properties are included
3. **Provide Rich Details**: Include recommended properties for better results
4. **Validate Markup**: Use testing tools to verify implementation
5. **Keep Content Accurate**: Ensure structured data matches visible content

### Content Guidelines

- **Accuracy**: Structured data must accurately represent the page content
- **Relevance**: Mark up only content that's visible to users
- **Completeness**: Provide comprehensive information for each entity
- **Consistency**: Use consistent values across related properties

### Technical Guidelines

- **JSON-LD Placement**: Place in `<head>` or `<body>` section
- **Multiple Entities**: Use arrays for multiple instances of the same type
- **Nested Objects**: Properly nest related entities
- **URL Formats**: Use absolute URLs for all link properties

## Testing and Validation

### Google Rich Results Test

- URL: `https://search.google.com/test/rich-results`
- Tests for rich result eligibility
- Provides detailed error reporting

### Schema.org Validator

- URL: `https://validator.schema.org/`
- Validates against Schema.org specifications
- Checks for syntax and structural errors

### Google Search Console

- Monitor structured data performance
- Identify and fix implementation errors
- Track rich result impressions and clicks

## Rich Results and Features

### Search Features Enabled by Schema.org

- **Rich Snippets**: Enhanced search results with additional information
- **Knowledge Graph**: Entity information in search results
- **Carousel Results**: Horizontal scrolling results
- **Breadcrumbs**: Navigation path in search results
- **FAQ Rich Results**: Expandable FAQ sections
- **Product Information**: Price, availability, and reviews
- **Recipe Information**: Cooking time, ingredients, and ratings
- **Event Information**: Dates, locations, and ticket availability

### Eligibility Requirements

- **Content Guidelines**: Follow Google's content policies
- **Technical Requirements**: Proper markup structure
- **Quality Standards**: High-quality, user-focused content
- **Data Accuracy**: Up-to-date and accurate information

## Advanced Features

### Multiple Entity Markup

Pages can contain multiple entities:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Product Review: iPhone 15",
      "author": {
        "@type": "Person",
        "name": "Tech Reviewer"
      }
    },
    {
      "@type": "Product",
      "name": "iPhone 15",
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4.5"
        }
      }
    }
  ]
}
```

### Extensions and Vocabularies

Schema.org supports extensions for specific domains:

- **Bib Extension**: Bibliographic information
- **Auto Extension**: Automotive industry
- **Health-Lifesci Extension**: Healthcare and life sciences

### Custom Properties

While Schema.org provides extensive vocabularies, sometimes custom properties are needed:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "custom": "https://example.com/vocab/"
  },
  "@type": "Product",
  "name": "Custom Product",
  "custom:specialFeature": "Unique selling point"
}
```

## Common Implementation Patterns

### Local Business

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Coffee Shop",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Anytown",
    "addressRegion": "CA",
    "postalCode": "12345"
  },
  "openingHours": "Mo-Fr 06:00-22:00",
  "telephone": "+1-555-123-4567"
}
```

### Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tech Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service"
  }
}
```

### Event

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Tech Conference 2026",
  "startDate": "2026-06-15T09:00:00+00:00",
  "endDate": "2026-06-17T18:00:00+00:00",
  "location": {
    "@type": "Place",
    "name": "Convention Center",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "456 Event Blvd",
      "addressLocality": "Tech City",
      "addressRegion": "TX"
    }
  }
}
```

## Performance Considerations

### Page Load Impact

- **JSON-LD**: Minimal impact, loaded asynchronously
- **Microdata/RDFa**: Increases HTML size
- **Caching**: Browser caching applies to structured data
- **Compression**: Gzip compression reduces markup size

### SEO Benefits

- **Enhanced Visibility**: Rich results stand out in search
- **Click-Through Rates**: Rich snippets typically have higher CTR
- **User Experience**: Better information presentation
- **Voice Search**: Optimized for voice search queries

## Maintenance and Updates

### Regular Tasks

1. **Validate New Content**: Test structured data on new pages
2. **Monitor Errors**: Check Search Console for issues
3. **Update Outdated Data**: Keep information current
4. **Review Guidelines**: Stay updated on best practices

### Common Issues and Solutions

- **Missing Required Properties**: Add all required fields
- **Invalid Data Types**: Use correct data types for properties
- **Content Mismatch**: Ensure structured data matches visible content
- **Syntax Errors**: Validate JSON syntax and structure

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Schema.org Official Site](https://schema.org/)
- [Google Search Central - Struct Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org Getting Started Guide](https://schema.org/docs/gs.html)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Schema.org Full Type Hierarchy](https://schema.org/docs/full.html)
- [Schema.org Style Guide](https://schema.org/docs/styleguide.html)
- [Schema.org Extension Mechanism](https://schema.org/docs/extension.html)


## Best Practices

[Add content here]
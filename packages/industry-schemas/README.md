# @repo/industry-schemas

JSON-LD schema generators for Organization/LocalBusiness from SiteConfig. Supports 12 industries.

## Usage

```typescript
import { generateOrganizationJsonLd } from '@repo/industry-schemas';

const jsonLd = generateOrganizationJsonLd(siteConfig);
```

## Output Fields

- `name`, `description`, `url` - always included
- `seo.ogImage` - image
- `seo.schemaType` - @type override
- `contact.address` - PostalAddress
- `contact.email`/`phone` - ContactPoint
- `contact.hours` - openingHoursSpecification

Validate at validator.schema.org.

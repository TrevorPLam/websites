# Reference Documentation

*Information-oriented technical descriptions and specifications*

## API Documentation

### Core APIs
- [Authentication API](./api/auth.md) - User authentication and authorization
- [User Management API](./api/users.md) - User CRUD operations
- [Tenant Management API](./api/tenants.md) - Multi-tenant operations
- [Content Management API](./api/content.md) - Content CRUD operations

### Integration APIs
- [Stripe API](./api/stripe.md) - Payment processing
- [Google Maps API](./api/google-maps.md) - Location services
- [Email Service API](./api/email.md) - Transactional emails
- [Calendar API](./api/calendar.md) - Scheduling integration

### Webhooks
- [Stripe Webhooks](./webhooks/stripe.md) - Payment event handling
- [Cal.com Webhooks](./webhooks/cal.md) - Booking event handling
- [Custom Webhooks](./webhooks/custom.md) - Custom event handling

## Configuration Reference

### Application Configuration
- [Environment Variables](./config/environment.md) - All environment variables
- [Database Configuration](./config/database.md) - Database connection settings
- [Security Configuration](./config/security.md) - Security settings and policies
- [Performance Configuration](./config/performance.md) - Performance optimization settings

### Package Configuration
- [Next.js Configuration](./config/nextjs.md) - Next.js framework settings
- [TypeScript Configuration](./config/typescript.md) - TypeScript compiler options
- [ESLint Configuration](./config/eslint.md) - Code linting rules
- [Testing Configuration](./config/testing.md) - Test framework settings

## CLI Reference

### Development Commands
- [pnpm Commands](./cli/pnpm.md) - Package management commands
- [Turbo Commands](./cli/turbo.md) - Build system commands
- [Development Scripts](./cli/dev-scripts.md) - Custom development scripts

### Deployment Commands
- [Build Commands](./cli/build.md) - Application build commands
- [Deploy Commands](./cli/deploy.md) - Deployment automation
- [Migration Commands](./cli/migrations.md) - Database migration commands

## Database Schema

### Core Tables
- [Users Table](./schema/users.md) - User data structure
- [Tenants Table](./schema/tenants.md) - Tenant data structure
- [Content Table](./schema/content.md) - Content data structure
- [Audit Logs Table](./schema/audit-logs.md) - Audit trail structure

### Integration Tables
- [Stripe Integration](./schema/stripe.md) - Payment data structure
- [Google Reviews](./schema/google-reviews.md) - Review data structure
- [Calendar Events](./schema/calendar.md) - Booking data structure

## Error Codes

### Application Errors
- [Authentication Errors](./errors/auth.md) - Authentication error codes
- [Validation Errors](./errors/validation.md) - Input validation errors
- [Business Logic Errors](./errors/business.md) - Business rule violations
- [System Errors](./errors/system.md) - System-level errors

### Integration Errors
- [Stripe Errors](./errors/stripe.md) - Payment service errors
- [Google Services Errors](./errors/google.md) - Google service errors
- [Email Service Errors](./errors/email.md) - Email delivery errors

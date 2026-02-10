# Template Documentation

This directory contains detailed documentation for each industry-specific template and shared template components.

## Available Template Guides

### [Hair Salon Template](./hair-salon.md)

Complete documentation for the hair salon template (service business example) including:

- Feature overview
- Setup and configuration
- Customization guide
- Content management
- Deployment instructions

### Service Business Templates _(Coming Soon)_

- **[Nail Salon Template](./nail-salon.md)** - Similar to hair salon, optimized for nail services
- **[Tanning Salon Template](./tanning-salon.md)** - Service booking focused

### Other Industry Templates _(Planned)_

- **Restaurant/Hospitality** - Menu, reservations, online ordering
- **Law Firm/Professional Services** - Practice areas, case studies, consultations
- **Dental Practice** - Services, insurance, patient portal
- **Real Estate** - Property listings, agent profiles, market data
- **Fitness Center** - Class schedules, membership, trainer profiles

### [Shared Components Guide](./shared-components.md)

Guide to using and contributing to shared template components

## Template Development

### Creating a New Template

1. **Plan the template** - Identify unique features and requirements
2. **Set up structure** - Create directory in `templates/`
3. **Copy base template** - Start from most similar template
4. **Customize features** - Adapt for specific business type
5. **Extract shared code** - Move common features to `templates/shared/`
6. **Document thoroughly** - Create template-specific documentation
7. **Test completely** - Verify all features work
8. **Create example** - Build example client in `clients/`

### Template Versioning

Templates use semantic versioning:

- **Major (X.0.0)** - Breaking changes, significant rewrites
- **Minor (0.X.0)** - New features, backwards compatible
- **Patch (0.0.X)** - Bug fixes, minor improvements

Track version in template's `package.json` and document changes in `CHANGELOG.md`.

### Template Best Practices

1. **Industry-agnostic architecture** - Build reusable patterns that work across industries
2. **Generic by default** - Avoid hardcoded business data
3. **Configurable** - Use environment variables and config files
4. **Well-documented** - Clear README and inline comments
5. **Tested** - Include tests for critical features
6. **Performant** - Optimize for speed and Core Web Vitals
7. **Accessible** - Follow WCAG guidelines
8. **Secure** - Implement security best practices
9. **SEO-friendly** - Proper metadata and structured data
10. **Conversion-focused** - Marketing-first design and features

## Template Feature Matrix

**Service Industry Templates**

| Feature           | Hair Salon | Nail | Restaurant | Dental | Fitness |
| ----------------- | ---------- | ---- | ---------- | ------ | ------- |
| Booking/Reserv.   | ✅         | 🔄   | 🔄         | 🔄     | 🔄      |
| Service/Menu      | ✅         | 🔄   | 🔄         | 🔄     | 🔄      |
| Team Profiles     | ✅         | 🔄   | 🔄         | 🔄     | 🔄      |
| Blog/Content      | ✅         | 🔄   | 🔄         | 🔄     | 🔄      |
| Gallery/Portfolio | ✅         | 🔄   | 🔄         | 🔄     | 🔄      |
| Contact Forms     | ✅         | 🔄   | 🔄         | 🔄     | 🔄      |
| Pricing Display   | ✅         | 🔄   | 🔄         | 🔄     | 🔄      |
| Online Store      | ❌         | 🔄   | 🔄         | ❌     | 🔄      |
| Membership        | ❌         | ❌   | 🔄         | 🔄     | 🔄      |

**Professional Services Templates**

| Feature         | Law Firm | Real Estate | Consulting |
| --------------- | -------- | ----------- | ---------- |
| Practice Areas  | 🔄       | 🔄          | 🔄         |
| Case Studies    | 🔄       | 🔄          | 🔄         |
| Team Profiles   | 🔄       | 🔄          | 🔄         |
| Contact/Consult | 🔄       | 🔄          | 🔄         |
| Resource Center | 🔄       | 🔄          | 🔄         |

Legend: ✅ Available | 🔄 Planned | ❌ Not Planned

## Contributing to Templates

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for general contribution guidelines.

For template-specific contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in at least one client project
5. Update documentation
6. Submit a pull request

## Support

For template-related questions:

- Check template-specific documentation
- Review shared components guide
- See [docs/architecture/](../architecture/) for system architecture
- Contact the development team

---

**Last Updated:** 2026-02-10

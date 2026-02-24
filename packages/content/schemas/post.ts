import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'tenantId',
      title: 'Tenant ID',
      type: 'string',
      readOnly: true,
      hidden: ({ currentUser }) => {
        return !currentUser?.roles?.some((role) => role.name === 'administrator');
      },
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule: any) => rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        defineField({ name: 'name', type: 'string', title: 'Name' }),
        defineField({ name: 'role', type: 'string', title: 'Role' }),
        defineField({ name: 'avatar', type: 'image', title: 'Avatar' }),
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule: any) => rule.required(),
        }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Tips & Guides', value: 'tips-guides' },
          { title: 'Company News', value: 'company-news' },
          { title: 'Industry News', value: 'industry-news' },
          { title: 'Case Studies', value: 'case-studies' },
          { title: 'FAQs', value: 'faqs' },
        ],
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Used in post cards and meta description (max 160 chars)',
      validation: (rule: any) => rule.max(160),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              validation: (rule: any) => rule.required(),
            }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
        {
          name: 'cta',
          title: 'Call to Action',
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Button text' },
            { name: 'href', type: 'url', title: 'URL' },
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Meta title (override)' },
        { name: 'description', type: 'text', title: 'Meta description (override)', rows: 2 },
        { name: 'noIndex', type: 'boolean', title: 'Hide from search engines' },
      ],
    }),
    defineField({
      name: 'estimatedReadingTime',
      title: 'Reading time (minutes)',
      type: 'number',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'mainImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle as string).toLocaleDateString() : 'Draft',
        media,
      };
    },
  },
});

/**
 * @file packages/seo/src/generate-metadata.ts
 * @summary SEO metadata generation function exports.
 * @description Re-exports metadata generation functions for SEO optimization.
 * @security No direct security concerns; metadata generation only.
 * @adr none
 * @requirements DOMAIN-5 / seo-optimization
 */
export { buildHomepageMetadata, buildMetadata, buildServiceMetadata } from './metadata-factory';

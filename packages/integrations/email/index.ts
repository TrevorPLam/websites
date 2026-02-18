/**
 * @file packages/integrations/email/index.ts
 * Task: [4.1] Export email marketing adapters
 */
export * from './contract';
export { MailchimpAdapter } from '../mailchimp/src';
export { SendGridAdapter } from '../sendgrid/src';
export { ConvertKitAdapter } from '../convertkit/src';

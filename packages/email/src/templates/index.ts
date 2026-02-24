// Placeholder templates - to be implemented according to domain plan

export { LeadDigest } from './LeadDigest';
export const LeadDigestEmail = ({ date, tenantName }: any) => {
  return `Lead digest for ${tenantName} on ${date}`;
};

export { BillingReceipt } from './BillingReceipt';
export const BillingReceiptEmail = ({ tenantName }: any) => {
  return `Billing receipt for ${tenantName}`;
};

export { BillingFailed } from './BillingFailed';
export const BillingFailedEmail = ({ tenantName }: any) => {
  return `Billing failed for ${tenantName}`;
};

export { AccountSuspended } from './AccountSuspended';
export const AccountSuspendedEmail = ({ tenantName }: any) => {
  return `Account suspended for ${tenantName}`;
};

export { WelcomeClient } from './WelcomeClient';
export const WelcomeClientEmail = ({ tenantName }: any) => {
  return `Welcome ${tenantName}!`;
};

export { BillingCancelled } from './BillingCancelled';
export const BillingCancelledEmail = ({ tenantName }: any) => {
  return `Billing cancelled for ${tenantName}`;
};

export { PlanChanged } from './PlanChanged';
export const PlanChangedEmail = ({ tenantName }: any) => {
  return `Plan changed for ${tenantName}`;
};

export { UpcomingInvoice } from './UpcomingInvoice';
export const UpcomingInvoiceEmail = ({ tenantName }: any) => {
  return `Upcoming invoice for ${tenantName}`;
};

export { BookingReminder } from './BookingReminder';
export const BookingReminderEmail = ({ businessName }: any) => {
  return `Booking reminder for ${businessName}`;
};

export { WelcomeAgency } from './WelcomeAgency';
export const WelcomeAgencyEmail = ({ tenantName }: any) => {
  return `Welcome agency ${tenantName}`;
};

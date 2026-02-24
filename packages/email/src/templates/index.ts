// Placeholder templates - to be implemented according to domain plan

export const LeadDigestEmail = ({ leads, date, tenantName }: any) => {
  return `Lead digest for ${tenantName} on ${date}`;
};

export const BillingReceiptEmail = ({ tenantName, ...data }: any) => {
  return `Billing receipt for ${tenantName}`;
};

export const BillingFailedEmail = ({ tenantName, ...data }: any) => {
  return `Billing failed for ${tenantName}`;
};

export const AccountSuspendedEmail = ({ tenantName, ...data }: any) => {
  return `Account suspended for ${tenantName}`;
};

export const WelcomeClientEmail = ({ tenantName }: any) => {
  return `Welcome ${tenantName}!`;
};

export const BillingCancelledEmail = ({ tenantName, ...data }: any) => {
  return `Billing cancelled for ${tenantName}`;
};

export const PlanChangedEmail = ({ tenantName, ...data }: any) => {
  return `Plan changed for ${tenantName}`;
};

export const UpcomingInvoiceEmail = ({ tenantName, ...data }: any) => {
  return `Upcoming invoice for ${tenantName}`;
};

export const BookingReminderEmail = ({ booking, reminderType, businessName }: any) => {
  return `Booking reminder for ${businessName}`;
};

export const WelcomeAgencyEmail = ({ tenantName, clientEmail, plan }: any) => {
  return `Welcome agency ${tenantName}`;
};

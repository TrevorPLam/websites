export interface UpcomingInvoiceProps {
  tenantName: string;
  customerName: string;
  amount: number;
  currency: string;
  planName: string;
  billingDate: string;
  paymentMethod: string;
  invoiceUrl: string;
}

export function UpcomingInvoice({
  tenantName,
  customerName,
  amount,
  currency,
  planName,
  billingDate,
  paymentMethod,
  invoiceUrl,
}: UpcomingInvoiceProps) {
  return (
    <div>
      <h1>Upcoming Invoice</h1>
      <h2>{tenantName}</h2>

      <p>Dear {customerName},</p>
      <p>This is a friendly reminder that your upcoming invoice will be processed soon.</p>

      <div>
        <h3>Invoice Details</h3>
        <p>
          <strong>Amount:</strong> {currency} {amount.toFixed(2)}
        </p>
        <p>
          <strong>Plan:</strong> {planName}
        </p>
        <p>
          <strong>Billing Date:</strong> {billingDate}
        </p>
        <p>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
      </div>

      <div>
        <h3>Action Required</h3>
        <p>Please ensure your payment method is up to date to avoid any service interruption.</p>
        <p>You can review and update your billing information here:</p>
        <p>
          <a href={invoiceUrl}>View Invoice Details</a>
        </p>
      </div>

      <div>
        <h3>Need to Make Changes?</h3>
        <ul>
          <li>Update your payment method in your account settings</li>
          <li>Change your plan if needed</li>
          <li>Cancel your subscription (we're sorry to see you go)</li>
        </ul>
      </div>

      <p>
        If you have any questions about your invoice or need assistance, please don't hesitate to
        contact our support team.
      </p>

      <p>Thank you for your continued business!</p>

      <p>
        Best regards,
        <br />
        The {tenantName} Team
      </p>
    </div>
  );
}

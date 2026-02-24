export interface BillingFailedProps {
  tenantName: string;
  customerName: string;
  amount: number;
  currency: string;
  planName: string;
  billingDate: string;
  errorMessage: string;
}

export function BillingFailed({
  tenantName,
  customerName,
  amount,
  currency,
  planName,
  billingDate,
  errorMessage,
}: BillingFailedProps) {
  return (
    <div>
      <h1>Payment Failed</h1>
      <h2>{tenantName}</h2>

      <p>Dear {customerName},</p>
      <p>We were unable to process your recent payment. Here are the details:</p>

      <div>
        <h3>Payment Details</h3>
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
          <strong>Error:</strong> {errorMessage}
        </p>
      </div>

      <p>Please update your payment information or contact support to resolve this issue.</p>
      <p>Your account may be suspended if payment is not completed.</p>

      <p>Thank you for your understanding.</p>
    </div>
  );
}

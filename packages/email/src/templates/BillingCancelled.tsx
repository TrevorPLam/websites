export interface BillingCancelledProps {
  tenantName: string;
  customerName: string;
  cancellationDate: string;
  planName: string;
  reason?: string;
  refundAmount?: number;
  currency?: string;
}

export function BillingCancelled({
  tenantName,
  customerName,
  cancellationDate,
  planName,
  reason,
  refundAmount,
  currency,
}: BillingCancelledProps) {
  return (
    <div>
      <h1>Subscription Cancelled</h1>
      <h2>{tenantName}</h2>

      <p>Dear {customerName},</p>
      <p>
        We're sorry to see you go. Your subscription has been cancelled effective {cancellationDate}
        .
      </p>

      <div>
        <h3>Cancellation Details</h3>
        <p>
          <strong>Plan:</strong> {planName}
        </p>
        <p>
          <strong>Cancellation Date:</strong> {cancellationDate}
        </p>
        {reason && (
          <p>
            <strong>Reason:</strong> {reason}
          </p>
        )}
        {refundAmount && currency && (
          <p>
            <strong>Refund Amount:</strong> {currency} {refundAmount.toFixed(2)}
          </p>
        )}
      </div>

      <div>
        <h3>What happens next?</h3>
        <ul>
          <li>
            Your access to premium features will end at the end of your current billing period
          </li>
          <li>Your data will be retained for 30 days, then permanently deleted</li>
          <li>You can reactivate your account at any time within the retention period</li>
        </ul>
      </div>

      <div>
        <h3>Feedback Welcome</h3>
        <p>
          We'd love to hear your feedback to help us improve. Please consider sharing your
          experience with us.
        </p>
      </div>

      <p>Thank you for giving {tenantName} a try. We hope to see you again in the future!</p>

      <p>
        Best regards,
        <br />
        The {tenantName} Team
      </p>
    </div>
  );
}

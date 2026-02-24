export interface AccountSuspendedProps {
  tenantName: string;
  customerName: string;
  suspensionDate: string;
  reason: string;
  outstandingAmount?: number;
  currency?: string;
}

export function AccountSuspended({
  tenantName,
  customerName,
  suspensionDate,
  reason,
  outstandingAmount,
  currency,
}: AccountSuspendedProps) {
  return (
    <div>
      <h1>Account Suspended</h1>
      <h2>{tenantName}</h2>

      <p>Dear {customerName},</p>
      <p>Your account has been suspended effective {suspensionDate}.</p>

      <div>
        <h3>Suspension Details</h3>
        <p>
          <strong>Reason:</strong> {reason}
        </p>
        <p>
          <strong>Suspension Date:</strong> {suspensionDate}
        </p>
        {outstandingAmount && currency && (
          <p>
            <strong>Outstanding Amount:</strong> {currency} {outstandingAmount.toFixed(2)}
          </p>
        )}
      </div>

      <p>To reactivate your account, please:</p>
      <ol>
        <li>Update your payment information if applicable</li>
        <li>Contact our support team to resolve any outstanding issues</li>
        <li>Ensure compliance with our terms of service</li>
      </ol>

      <p>We value your business and hope to resolve this matter quickly.</p>
      <p>Please contact support if you have any questions.</p>
    </div>
  );
}

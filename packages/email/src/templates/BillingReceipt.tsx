export interface BillingReceiptProps {
  tenantName: string;
  customerName: string;
  amount: number;
  currency: string;
  planName: string;
  billingDate: string;
  nextBillingDate: string;
  invoiceNumber: string;
}

export function BillingReceipt({
  tenantName,
  customerName,
  amount,
  currency,
  planName,
  billingDate,
  nextBillingDate,
  invoiceNumber,
}: BillingReceiptProps) {
  return (
    <div>
      <h1>Payment Receipt</h1>
      <h2>{tenantName}</h2>

      <p>Dear {customerName},</p>
      <p>Thank you for your payment. Here's your receipt:</p>

      <div>
        <h3>Invoice Details</h3>
        <p>
          <strong>Invoice Number:</strong> {invoiceNumber}
        </p>
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
          <strong>Next Billing Date:</strong> {nextBillingDate}
        </p>
        <p>
          <strong>Email:</strong> {customerName}
        </p>
      </div>

      <p>Thank you for your continued business!</p>
    </div>
  );
}

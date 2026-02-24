export interface PlanChangedProps {
  tenantName: string;
  customerName: string;
  oldPlanName: string;
  newPlanName: string;
  effectiveDate: string;
  priceChange?: number;
  currency?: string;
  isUpgrade: boolean;
}

export function PlanChanged({
  tenantName,
  customerName,
  oldPlanName,
  newPlanName,
  effectiveDate,
  priceChange,
  currency,
  isUpgrade,
}: PlanChangedProps) {
  return (
    <div>
      <h1>Plan {isUpgrade ? 'Upgraded' : 'Changed'}</h1>
      <h2>{tenantName}</h2>

      <p>Dear {customerName},</p>
      <p>Your subscription plan has been {isUpgrade ? 'upgraded' : 'changed'}.</p>

      <div>
        <h3>Plan Change Details</h3>
        <p>
          <strong>Previous Plan:</strong> {oldPlanName}
        </p>
        <p>
          <strong>New Plan:</strong> {newPlanName}
        </p>
        <p>
          <strong>Effective Date:</strong> {effectiveDate}
        </p>
        {priceChange && currency && (
          <p>
            <strong>Price Change:</strong> {priceChange > 0 ? '+' : ''}
            {currency} {Math.abs(priceChange).toFixed(2)}
          </p>
        )}
      </div>

      <div>
        <h3>What's {isUpgrade ? 'New' : 'Different'}?</h3>
        <p>You now have access to all features included in the {newPlanName} plan.</p>
        {isUpgrade ? (
          <p>Explore your new features and capabilities in your dashboard!</p>
        ) : (
          <p>Your features and limits have been adjusted to match your new plan.</p>
        )}
      </div>

      <div>
        <h3>Next Steps</h3>
        <ul>
          <li>Review your new plan features in your dashboard</li>
          <li>Update any team member access if needed</li>
          <li>Check your billing information</li>
        </ul>
      </div>

      <p>Thank you for continuing with {tenantName}!</p>

      <p>
        Best regards,
        <br />
        The {tenantName} Team
      </p>
    </div>
  );
}

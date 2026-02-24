export interface WelcomeClientProps {
  tenantName: string;
  clientName: string;
  planName: string;
  setupUrl: string;
  supportEmail: string;
}

export function WelcomeClient({
  tenantName,
  clientName,
  planName,
  setupUrl,
  supportEmail,
}: WelcomeClientProps) {
  return (
    <div>
      <h1>Welcome to {tenantName}!</h1>

      <p>Dear {clientName},</p>
      <p>Thank you for choosing {tenantName}. We're excited to have you on board!</p>

      <div>
        <h3>Your Account Details</h3>
        <p>
          <strong>Plan:</strong> {planName}
        </p>
        <p>
          <strong>Name:</strong> {clientName}
        </p>
      </div>

      <div>
        <h3>Next Steps</h3>
        <ol>
          <li>
            Complete your account setup by visiting: <a href={setupUrl}>{setupUrl}</a>
          </li>
          <li>Configure your business information and preferences</li>
          <li>Explore our features and tools</li>
          <li>Check out our documentation and tutorials</li>
        </ol>
      </div>

      <div>
        <h3>Need Help?</h3>
        <p>Our support team is here to help you succeed. Contact us at:</p>
        <p>
          <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </p>
      </div>

      <p>We're committed to helping you achieve your goals. Welcome aboard!</p>

      <p>
        Best regards,
        <br />
        The {tenantName} Team
      </p>
    </div>
  );
}

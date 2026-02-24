export interface WelcomeAgencyProps {
  tenantName: string;
  clientName: string;
  planName: string;
  setupUrl: string;
}

export function WelcomeAgency({ tenantName, clientName, planName, setupUrl }: WelcomeAgencyProps) {
  return (
    <div>
      <h1>Welcome to {tenantName} Agency Portal!</h1>

      <p>Dear {clientName},</p>
      <p>
        Thank you for choosing {tenantName} for your agency needs. We're excited to partner with
        you!
      </p>

      <div>
        <h3>Your Agency Account</h3>
        <p>
          <strong>Plan:</strong> {planName}
        </p>
        <p>
          <strong>Agency:</strong> {tenantName}
        </p>
      </div>

      <div>
        <h3>Next Steps</h3>
        <ol>
          <li>
            Complete your agency setup by visiting: <a href={setupUrl}>{setupUrl}</a>
          </li>
          <li>Add your team members and clients</li>
          <li>Configure your agency branding and settings</li>
          <li>Explore our agency management tools</li>
        </ol>
      </div>

      <div>
        <h3>Agency Benefits</h3>
        <ul>
          <li>Manage multiple client accounts from one dashboard</li>
          <li>Access advanced analytics and reporting</li>
          <li>White-label solutions for your clients</li>
          <li>Dedicated support and resources</li>
        </ul>
      </div>

      <p>We're committed to helping your agency succeed. Welcome aboard!</p>

      <p>
        Best regards,
        <br />
        The {tenantName} Team
      </p>
    </div>
  );
}

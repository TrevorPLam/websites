export interface LeadDigestProps {
  tenantName: string;
  leads: Array<{
    name: string;
    email: string;
    score: number;
    source: string;
    message: string;
    createdAt: string;
  }>;
  period: string;
}

export function LeadDigest({ tenantName, leads, period }: LeadDigestProps) {
  return (
    <div>
      <h1>Lead Digest - {period}</h1>
      <h2>{tenantName}</h2>
      <p>You received {leads.length} new leads this period.</p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
            <th>Source</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={index}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.score}</td>
              <td>{lead.source}</td>
              <td>{lead.message}</td>
              <td>{lead.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

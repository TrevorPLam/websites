'use client';

import { useState, useTransition } from 'react';

import { addDomainAction, removeDomainAction, verifyDomainAction } from '../model/domain-actions';

type DNSInstruction = {
  type: string;
  name: string;
  value: string;
  note?: string;
};

type DomainSettingsProps = {
  tenantId: string;
  currentDomain: string | null;
  isVerified: boolean;
  defaultSubdomain: string;
  initialDnsInstructions: DNSInstruction[] | null;
};

export function DomainSettings({
  tenantId: _tenantId,
  currentDomain,
  isVerified,
  defaultSubdomain,
  initialDnsInstructions,
}: DomainSettingsProps) {
  const [domain, setDomain] = useState(currentDomain ?? '');
  const [dnsInstructions, setDnsInstructions] = useState<DNSInstruction[] | null>(initialDnsInstructions);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'verified' | 'pending' | null>(
    isVerified ? 'verified' : currentDomain ? 'pending' : null
  );

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalized = domain.trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!normalized || !normalized.includes('.')) {
      setError('Please enter a valid domain name (e.g. johnsplumbing.com)');
      return;
    }

    startTransition(async () => {
      const result = await addDomainAction({ domain: normalized });

      if (!result.success || !result.data) {
        setError(result.error ?? 'Failed to add domain. Please try again.');
        return;
      }

      const { status, dnsInstructions: instructions, error: addError } = result.data as {
        status: 'added' | 'already_exists' | 'conflict' | 'error';
        dnsInstructions?: DNSInstruction[];
        error?: string;
      };

      if (status === 'added' || status === 'already_exists') {
        setDomain(normalized);
        setDnsInstructions(instructions ?? null);
        setVerificationResult('pending');
        return;
      }

      setError(addError ?? 'Failed to add domain. Please try again.');
    });
  };

  const handleVerify = () => {
    setVerifying(true);

    startTransition(async () => {
      const result = await verifyDomainAction({ domain });

      if (result.success && (result.data as { activated?: boolean } | undefined)?.activated) {
        setVerificationResult('verified');
      } else {
        setVerificationResult('pending');
      }

      setVerifying(false);
    });
  };

  const handleRemove = () => {
    if (!window.confirm('Remove this custom domain? Your site will return to the default subdomain.')) {
      return;
    }

    startTransition(async () => {
      await removeDomainAction({});
      setDomain('');
      setDnsInstructions(null);
      setVerificationResult(null);
      setError(null);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-lg font-bold text-gray-900">Custom Domain</h2>
        <p className="text-sm text-gray-500">
          Connect your own domain to replace{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{defaultSubdomain}</code>
        </p>
      </div>

      {domain && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 ${
            verificationResult === 'verified' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                verificationResult === 'verified' ? 'bg-green-500' : 'animate-pulse bg-yellow-500'
              }`}
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-gray-900">{domain}</p>
              <p className="text-sm text-gray-500">
                {verificationResult === 'verified' ? 'Active — SSL certificate issued' : 'Pending DNS verification'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="text-sm font-medium text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      )}

      {!domain && (
        <form onSubmit={handleAdd} className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="custom-domain" className="sr-only">
              Custom domain
            </label>
            <input
              id="custom-domain"
              type="text"
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              placeholder="johnsplumbing.com"
              disabled={isPending}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              aria-describedby={error ? 'domain-error' : undefined}
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !domain.trim()}
            className="whitespace-nowrap rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? 'Adding…' : 'Add Domain'}
          </button>
        </form>
      )}

      {error && (
        <p id="domain-error" role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {dnsInstructions && verificationResult === 'pending' && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">DNS Configuration Required</h3>
            <p className="mt-0.5 text-xs text-gray-500">Add these records at your DNS provider to verify your domain.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-white text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Value</th>
                  <th className="px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dnsInstructions.map((record) => (
                  <tr key={`${record.type}-${record.name}-${record.value}`} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{record.type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{record.name}</td>
                    <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-gray-700" title={record.value}>
                      {record.value}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(record.value)}
                        className="text-xs text-gray-400 hover:text-primary"
                        aria-label={`Copy ${record.type} record value`}
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-yellow-100 bg-yellow-50 px-4 py-3">
            <p className="text-xs text-yellow-700">DNS propagation can take 5 minutes to 48 hours</p>
            <button
              type="button"
              onClick={handleVerify}
              disabled={isPending || verifying}
              className="text-sm font-semibold text-primary hover:underline disabled:opacity-50"
            >
              {verifying ? 'Checking…' : 'Check Verification'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

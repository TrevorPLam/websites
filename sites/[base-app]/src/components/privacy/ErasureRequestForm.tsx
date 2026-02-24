'use client';

import { useState } from 'react';

export function ErasureRequestForm() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch('/api/privacy/erasure', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, reason: reason || undefined }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to submit request. Please try again.');
      setLoading(false);
      return;
    }

    setMessage(payload.message ?? 'Request submitted successfully.');
    setEmail('');
    setReason('');
    setLoading(false);
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-gray-900">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-gray-900">Reason (optional)</span>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          maxLength={500}
          rows={4}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Submitting…' : 'Submit request'}
      </button>
      {message ? <p className="text-sm text-gray-700">{message}</p> : null}
    </form>
  );
}

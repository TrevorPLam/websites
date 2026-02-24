'use client';

import { useState, useTransition } from 'react';

import { updateWhiteLabelSettings } from '../model/settings-actions';

type WhiteLabelSettingsFormProps = {
  isEnterprise: boolean;
  initialValues: {
    enabled: boolean;
    portalName: string;
    portalLogoUrl?: string;
    portalFaviconUrl?: string;
    portalPrimaryColor: string;
    portalDomain?: string;
    hideAgencyBranding: boolean;
    hideSupportLink: boolean;
    privacyPolicyUrl?: string;
    termsOfServiceUrl?: string;
    supportEmail?: string;
    supportPhone?: string;
  };
};

export function WhiteLabelSettingsForm({ isEnterprise, initialValues }: WhiteLabelSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialValues);

  if (!isEnterprise) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-base font-semibold text-blue-900">Enterprise plan required</h2>
        <p className="mt-1 text-sm text-blue-700">
          Upgrade to Enterprise to unlock white-label portal branding, attribution controls, and custom support details.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(false);
        setError(null);

        startTransition(async () => {
          const result = await updateWhiteLabelSettings(form);

          if (!result.success) {
            setError(result.error ?? 'Failed to save white-label settings.');
            return;
          }

          setSaved(true);
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Portal name</span>
          <input
            value={form.portalName}
            onChange={(event) => setForm((prev) => ({ ...prev, portalName: event.target.value }))}
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Primary color</span>
          <input
            type="color"
            value={form.portalPrimaryColor}
            onChange={(event) => setForm((prev) => ({ ...prev, portalPrimaryColor: event.target.value }))}
            className="h-10 w-full rounded-xl border border-gray-300 p-1"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Portal logo URL</span>
          <input
            value={form.portalLogoUrl ?? ''}
            onChange={(event) => setForm((prev) => ({ ...prev, portalLogoUrl: event.target.value }))}
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Favicon URL</span>
          <input
            value={form.portalFaviconUrl ?? ''}
            onChange={(event) => setForm((prev) => ({ ...prev, portalFaviconUrl: event.target.value }))}
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="space-y-2 rounded-xl border border-gray-200 p-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) => setForm((prev) => ({ ...prev, enabled: event.target.checked }))}
          />
          Enable white-label branding
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.hideAgencyBranding}
            onChange={(event) => setForm((prev) => ({ ...prev, hideAgencyBranding: event.target.checked }))}
          />
          Hide agency branding in footer
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.hideSupportLink}
            onChange={(event) => setForm((prev) => ({ ...prev, hideSupportLink: event.target.checked }))}
          />
          Hide support link
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? 'Saving…' : 'Save White-Label Settings'}
      </button>
      {saved ? <p className="text-sm text-green-600">✓ Settings saved</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

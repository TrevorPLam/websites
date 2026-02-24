import type { Metadata } from 'next';
import { ErasureRequestForm } from '@/components/privacy/ErasureRequestForm';

export const metadata: Metadata = {
  title: 'Data Deletion Request',
  description: 'Request deletion of your personal data.',
  robots: { index: false, follow: false },
};

export default function ErasureRequestPage() {
  return (
    <main id="main-content" className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-gray-900">Request Data Deletion</h1>
      <p className="mb-8 text-gray-600">
        Under GDPR Article 17 and CCPA, you have the right to request deletion of your personal data. Submit your
        request below and we will process it within 30 days.
      </p>
      <ErasureRequestForm />
    </main>
  );
}

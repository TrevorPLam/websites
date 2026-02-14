import type { Metadata } from 'next';
import siteConfig from '@/site.config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Review how ${siteConfig.name} collects, uses, and protects information shared through the website.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-white/70">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-3">Privacy Policy</h1>
            <p className="mt-4 text-lg text-white/80">
              This policy explains what we collect, how we use it, and the choices you have.
            </p>
            <div className="mt-6 text-sm text-white/70">
              <p>
                <span className="font-semibold text-white">Effective Date:</span> January 1, 2026
              </p>
              <p>
                <span className="font-semibold text-white">Last Updated:</span> January 11, 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg max-w-4xl text-slate-700">
            <h2>Overview</h2>
            <p>
              {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website or book an appointment.
            </p>

            <h2>Information We Collect</h2>
            <h3>Information You Provide</h3>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Appointment preferences and history</li>
              <li>Hair history and preferences (for consultations)</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <ul>
              <li>Browser type and version</li>
              <li>IP address</li>
              <li>Pages visited and time spent</li>
              <li>Device information</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <ul>
              <li>Schedule and manage your appointments</li>
              <li>Send appointment reminders and confirmations</li>
              <li>Respond to your inquiries and requests</li>
              <li>Provide customer service</li>
              <li>Send salon updates and promotions (with consent)</li>
              <li>Improve our website and services</li>
            </ul>

            <h2>Information Storage and Sharing</h2>
            <h3>Storage</h3>
            <p>
              Your information is stored securely in our appointment scheduling system and customer
              database.
            </p>

            <h3>Third-Party Services</h3>
            <ul>
              <li>
                <strong>Scheduling Software:</strong> For booking and calendar management.
              </li>
              <li>
                <strong>Payment Processors:</strong> For secure transaction processing.
              </li>
              <li>
                <strong>Analytics providers:</strong> To help us understand website usage.
              </li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>Data Retention</h2>
            <p>
              We retain your information for as long as necessary to fulfill the purposes outlined
              in this policy, comply with legal obligations, and provide you with ongoing service.
            </p>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have rights to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p>To exercise these rights, please contact us.</p>

            <h2>Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no
              method of transmission over the internet is 100% secure.
            </p>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Our services are available to children with parental consent. We do not knowingly
              collect personal information from children under 13 without verified parental consent.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page
              with an updated &quot;Last Updated&quot; date.
            </p>

            <h2>Contact Us</h2>
            <p>For questions about this Privacy Policy, please contact us at the salon directly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

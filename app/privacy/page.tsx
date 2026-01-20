import type { Metadata } from 'next'

/**
 * Privacy Policy page
 *
 * Meta-note: This page mirrors the placeholder copy in /docs/PRIVACY_POLICY_TEMPLATE.md
 * so legal review can map each section back to the template.
 */
export const metadata: Metadata = {
  title: 'Privacy Policy | Your Dedicated Marketer',
  description:
    'Review how Your Dedicated Marketer collects, uses, and protects information shared through the website.',
}

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
                <span className="font-semibold text-white">Effective Date:</span> [TO BE UPDATED]
              </p>
              <p>
                <span className="font-semibold text-white">Last Updated:</span> January 11, 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy content mapped to template sections for traceability. */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg max-w-4xl">
            <p>
              <strong>⚠️ Placeholder:</strong> This is a template. Customize before launch with your
              specific practices and legal requirements.
            </p>

            <h2>Overview</h2>
            <p>
              Your Dedicated Marketer ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website.
            </p>

            <h2>Information We Collect</h2>
            <h3>Information You Provide</h3>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Message content (optional)</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <ul>
              <li>Browser type and version</li>
              <li>IP address</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>Device information</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <ul>
              <li>Respond to your inquiries and requests</li>
              <li>Provide customer service</li>
              <li>Send marketing communications (with consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
              <li>Analyze website usage and trends</li>
            </ul>

            <h2>Information Storage and Sharing</h2>
            <h3>Storage</h3>
            <p>Your information is stored securely in our database (Supabase) and CRM system (HubSpot).</p>

            <h3>Third-Party Services</h3>
            <ul>
              <li>
                <strong>HubSpot:</strong> CRM and marketing automation
              </li>
              <li>
                <strong>Analytics providers:</strong> [TO BE SPECIFIED based on T-064]
              </li>
              <li>
                <strong>Hosting provider:</strong> Cloudflare
              </li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>Data Retention</h2>
            <p>
              We retain your information for as long as necessary to fulfill the purposes outlined in
              this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have rights to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your information</li>
            </ul>
            <p>To exercise these rights, contact us at: [CONTACT EMAIL TO BE ADDED]</p>

            <h2>Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method
              of transmission over the internet is 100% secure.
            </p>

            <h2>Cookies and Tracking</h2>
            <p>[TO BE CUSTOMIZED based on analytics provider selection in T-064]</p>
            <ul>
              <li>Remember your preferences</li>
              <li>Analyze website traffic</li>
              <li>Improve user experience</li>
            </ul>
            <p>You can control cookies through your browser settings.</p>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under 18. We do not knowingly collect
              information from children.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page with
              an updated &quot;Last Updated&quot; date.
            </p>

            <h2>Contact Us</h2>
            <p>For questions about this Privacy Policy, contact:</p>
            <p>
              <strong>Your Dedicated Marketer</strong>
              <br />
              Email: [TO BE ADDED]
              <br />
              Address: [TO BE ADDED]
            </p>

            <p>
              <strong>⚠️ Legal notice:</strong> This is a placeholder template. Before launch, consult
              with a legal professional to ensure compliance with GDPR, CCPA, CAN-SPAM Act, and other
              applicable privacy laws.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'

/**
 * Terms of Service page
 *
 * Meta-note: Content is adapted from /docs/TERMS_OF_SERVICE_TEMPLATE.md so legal review
 * can align each section with the approved placeholder language.
 */
export const metadata: Metadata = {
  title: 'Terms of Service | Your Dedicated Marketer',
  description: 'Review the terms that govern use of the Your Dedicated Marketer website.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-white/70">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-3">Terms of Service</h1>
            <p className="mt-4 text-lg text-white/80">
              These terms outline how the site can be used and the responsibilities of all parties.
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

      {/* Template-aligned content for traceability. */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg max-w-4xl">
            <p>
              <strong>⚠️ Placeholder:</strong> This is a template. Customize before launch with your
              specific terms and legal requirements.
            </p>

            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using the Your Dedicated Marketer website (&quot;Site&quot;), you agree to be
              bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these Terms,
              you may not access the Site.
            </p>

            <h2>Use of the Site</h2>
            <h3>Permitted Use</h3>
            <p>You may use this Site for lawful purposes only. You agree not to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Transmit harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Site</li>
              <li>Impersonate any person or entity</li>
              <li>Harvest or collect user information</li>
            </ul>

            <h3>Intellectual Property</h3>
            <p>
              All content on this Site (text, images, logos, graphics) is owned by Your Dedicated
              Marketer and protected by copyright and trademark laws. You may not reproduce, distribute,
              or create derivative works without written permission.
            </p>

            <h2>Services</h2>
            <h3>Description</h3>
            <p>Your Dedicated Marketer provides [TO BE CUSTOMIZED: describe your marketing services].</p>

            <h3>No Guarantees</h3>
            <p>
              We strive to provide high-quality services but do not guarantee specific results. Services
              are provided &quot;as is&quot; without warranties of any kind.
            </p>

            <h3>Service Modifications</h3>
            <p>We reserve the right to modify or discontinue services at any time without notice.</p>

            <h2>User Submissions</h2>
            <p>When you submit information through contact forms:</p>
            <ul>
              <li>You grant us permission to use the information as described in our Privacy Policy</li>
              <li>You represent that all information provided is accurate</li>
              <li>You consent to being contacted regarding your inquiry</li>
            </ul>

            <h2>Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites. We are not responsible for the
              content, privacy policies, or practices of third-party sites.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>THE SITE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, INCLUDING BUT NOT LIMITED TO:</p>
            <ul>
              <li>Warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy or completeness of content</li>
            </ul>

            <h2>Limitation of Liability</h2>
            <p>TO THE FULLEST EXTENT PERMITTED BY LAW:</p>
            <ul>
              <li>We are not liable for any indirect, incidental, special, or consequential damages</li>
              <li>Our total liability shall not exceed the amount you paid to us (if any)</li>
              <li>We are not responsible for damages from website downtime, errors, or security breaches</li>
            </ul>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Your Dedicated Marketer from any claims, damages,
              or expenses arising from your use of the Site, your violation of these Terms, or your
              violation of any rights of another party.
            </p>

            <h2>Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to the Site at any time, without
              notice, for violation of these Terms, fraudulent or illegal activity, or any reason at our
              sole discretion.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of [TO BE SPECIFIED: your jurisdiction], without
              regard to conflict of law provisions. Any disputes shall be resolved in the courts of
              [TO BE SPECIFIED: your jurisdiction].
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Changes will be posted on this page with an updated
              &quot;Last Updated&quot; date. Your continued use of the Site constitutes acceptance of the revised
              Terms.
            </p>

            <h2>Contact Information</h2>
            <p>For questions about these Terms, contact:</p>
            <p>
              <strong>Your Dedicated Marketer</strong>
              <br />
              Email: [TO BE ADDED]
              <br />
              Address: [TO BE ADDED]
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions
              shall remain in full effect.
            </p>

            <p>
              <strong>⚠️ Legal notice:</strong> This is a placeholder template. Before launch, consult
              with a legal professional to ensure compliance with applicable laws and customize terms
              based on your specific service offerings, jurisdiction, industry-specific regulations,
              and risk management needs.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

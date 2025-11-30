import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 pb-8 border-b-2 border-gray-300">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Last Updated: January 2025</p>
            <p className="text-gray-600 mt-4">
              CareerBoost (&quot;we,&quot; &quot;us,&quot; or
              &quot;Company&quot;) is committed to protecting your privacy and
              ensuring transparency in how we handle your personal data. This
              Privacy Policy outlines our practices.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12 prose prose-sm max-w-none">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Information We Collect
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1.1 Personal Information
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Name and email address</li>
                    <li>Login credentials (securely encrypted and hashed)</li>
                    <li>Contact information provided during registration</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1.2 Career &amp; Application Data
                  </h3>
                  <p className="text-gray-700 mb-3">
                    When you use CareerBoost, we process:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Resume content (when uploaded or pasted)</li>
                    <li>Job descriptions you analyze</li>
                    <li>
                      AI-generated outputs (enhanced resumes, cover letters, job
                      match insights)
                    </li>
                    <li>Your saved documents and files</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1.3 Usage Data
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>IP address and device information</li>
                    <li>Browser type and operating system</li>
                    <li>Pages visited and features used</li>
                    <li>Session duration and interaction patterns</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1.4 Cookies &amp; Tracking
                  </h3>
                  <p className="text-gray-700">
                    We use essential cookies for account authentication and
                    session management. We do not use cookies for advertising or
                    third-party tracking.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use your information solely to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Provide and improve our AI-powered features</li>
                <li>
                  Process your resume enhancements, cover letters, and job
                  analyses
                </li>
                <li>Maintain account security and prevent fraud</li>
                <li>Send important service updates and notifications</li>
                <li>Improve product quality and user experience</li>
              </ul>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 font-medium">
                  We do NOT sell, share, or distribute your personal data to
                  advertisers, recruiters, or third parties for marketing
                  purposes.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Data Storage &amp; Security
              </h2>
              <p className="text-gray-700 mb-4">
                Your data is stored on secure, encrypted servers using
                industry-standard security practices.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Resume Content:</strong> Stored only in your secure
                  account; never used to train public AI models
                </li>
                <li>
                  <strong>Passwords:</strong> Encrypted with one-way hashing;
                  inaccessible even to our team
                </li>
                <li>
                  <strong>Data Transmission:</strong> Protected with SSL/TLS
                  encryption
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Data Sharing
              </h2>
              <p className="text-gray-700 mb-4">
                We share your data only in these limited circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Service Providers:</strong> Hosting, AI processing,
                  and analytics platforms (bound by confidentiality agreements)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> Only if legally compelled
                  (court order, law enforcement)
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>We never:</strong> Sell data to third parties, share
                with recruiters or employers, use for training public models, or
                provide to advertisers.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. AI Processing
              </h2>
              <p className="text-gray-700 mb-4">
                When you use our AI features (Resume Enhancement, Tailored
                Resume, Cover Letter, Job Fit Analysis):
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Your inputs are processed through secure, encrypted AI systems
                </li>
                <li>
                  Processing occurs only to generate your requested output
                </li>
                <li>Your resume is NOT used for training any public model</li>
                <li>Results remain in your account and are never shared</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Your Privacy Rights
              </h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Access your personal data and download it</li>
                <li>Delete your account and all associated data</li>
                <li>Update or correct your personal information</li>
                <li>Request a detailed data deletion report</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, contact us at:{" "}
                <a
                  href="mailto:privacy@careerboost.ai"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  privacy@careerboost.ai
                </a>
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Data is retained only while your account is active</li>
                <li>
                  Upon account deletion, your data is permanently removed within
                  30 days
                </li>
                <li>You can request data deletion at any time</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Children&apos;s Privacy
              </h2>
              <p className="text-gray-700">
                CareerBoost is not intended for users under 16 years of age. We
                do not knowingly collect data from children. If we discover we
                have collected data from a child, we will immediately delete it.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-700">
                If you access CareerBoost from outside your country of
                residence, your data may be transferred and processed in
                different jurisdictions. By using CareerBoost, you consent to
                such transfers under applicable law.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Third-Party Links
              </h2>
              <p className="text-gray-700">
                CareerBoost may contain links to third-party websites. We are
                not responsible for their privacy practices. We recommend
                reviewing their privacy policies before sharing personal
                information.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy periodically. Significant
                changes will be announced via email or a notice on our website.
                Your continued use constitutes acceptance of updates.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Contact Us
              </h2>
              <div className="p-6 rounded-lg bg-gray-50 border border-gray-300">
                <p className="text-gray-700 mb-3">
                  For privacy inquiries, data requests, or concerns:
                </p>
                <p className="text-gray-900 font-semibold">
                  📧 Email:{" "}
                  <a
                    href="mailto:privacy@careerboost.ai"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@careerboost.ai
                  </a>
                </p>
                <p className="text-gray-700 mt-3 text-sm">
                  We respond to all privacy requests within 7 business days.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-16 p-6 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 flex gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 mb-2">
                Privacy is Not Negotiable
              </p>
              <p className="text-yellow-800 text-sm">
                This policy is reviewed and updated regularly to comply with
                global privacy standards (GDPR, CCPA, and others). Your trust is
                our responsibility.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

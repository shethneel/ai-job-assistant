import { FileText, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 pb-8 border-b-2 border-gray-300">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Terms of Service
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Last Updated: January 2025</p>
            <p className="text-gray-600 mt-4">
              These Terms of Service (&quot;Terms&quot;) govern your use of
              CareerBoost (&quot;Platform,&quot; &quot;Service,&quot;
              &quot;we,&quot; &quot;us,&quot; or &quot;Company&quot;). By
              accessing or using CareerBoost, you agree to be bound by these
              Terms and our Privacy Policy.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12 prose prose-sm max-w-none">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700">
                By accessing, browsing, or using CareerBoost, you acknowledge
                that you have read, understood, and agree to be bound by these
                Terms and our Privacy Policy. If you do not agree, you may not
                use the Platform.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-700 mb-4">
                CareerBoost provides AI-powered tools to assist with career
                development:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Resume enhancement and improvement suggestions</li>
                <li>Tailored resume generation based on job descriptions</li>
                <li>AI-powered cover letter creation</li>
                <li>Job match analysis and fit assessment</li>
                <li>Document storage and management</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. User Accounts &amp; Responsibilities
              </h2>
              <p className="text-gray-700 mb-4">
                When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide accurate, complete, and current information</li>
                <li>Maintain the confidentiality of your login credentials</li>
                <li>Be responsible for all activities under your account</li>
                <li>Notify us immediately of unauthorized access</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Account Termination:</strong> We reserve the right to
                suspend or terminate accounts that violate these Terms or engage
                in fraudulent, abusive, or harmful activity.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. User Content &amp; Ownership
              </h2>
              <p className="text-gray-700 mb-4">
                When you upload or paste content (resumes, job descriptions,
                etc.):
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>
                  You confirm that the content belongs to you and doesn&apos;t
                  infringe on others&apos; rights
                </li>
                <li>You retain full ownership of your original content</li>
                <li>
                  You grant us permission to process your content solely to
                  generate outputs for you
                </li>
              </ul>
              <p className="text-gray-700">
                <strong>Important:</strong> You are solely responsible for
                ensuring your content is lawful and does not violate copyright,
                privacy, or other laws.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. AI-Generated Content
              </h2>
              <p className="text-gray-700 mb-4">
                CareerBoost provides AI-generated suggestions and outputs,
                including enhanced resumes, tailored resumes, cover letters, and
                job match insights.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Not Guarantees:</strong> AI outputs are suggestions
                  only. We do not guarantee job placements, interviews, or
                  employment.
                </li>
                <li>
                  <strong>Your Responsibility:</strong> You must review all
                  AI-generated content and edit as needed before use.
                </li>
                <li>
                  <strong>Accuracy:</strong> While we strive for accuracy, AI
                  may contain errors. You are responsible for verification.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Prohibited Use
              </h2>
              <p className="text-gray-700 mb-4">
                You agree NOT to use CareerBoost to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Create false, misleading, or fraudulent resumes</li>
                <li>Falsify experience, degrees, or qualifications</li>
                <li>Upload malicious files or attempt system attacks</li>
                <li>Violate laws or engage in unlawful activity</li>
                <li>
                  Harass, threaten, or defame individuals or organizations
                </li>
                <li>Reverse engineer or misuse our technology</li>
                <li>Infringe on intellectual property or copyright</li>
                <li>Spam or engage in fraudulent activity</li>
              </ul>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 font-medium">
                  <strong>Honesty First:</strong> CareerBoost is built on the
                  principle that resumes should be truthful. We take ethical job
                  searching seriously.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Service Availability &amp; Modifications
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  We aim for high uptime but cannot guarantee uninterrupted
                  service
                </li>
                <li>
                  We may modify, suspend, or discontinue features for
                  maintenance, updates, or improvements
                </li>
                <li>
                  We are not liable for service interruptions or data loss
                  beyond our control
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Payments &amp; Subscriptions
              </h2>
              <p className="text-gray-700 mb-4">
                If premium plans are introduced in the future:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>All pricing will be clearly stated before purchase</li>
                <li>Subscriptions will renew automatically unless canceled</li>
                <li>
                  Cancellation can be done anytime through account settings
                </li>
                <li>Refunds will follow the posted refund policy</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Current Status:</strong> CareerBoost offers a 1-week
                free trial to all users. Premium plans are coming soon.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                CareerBoost is provided &quot;as is&quot; without warranties.
                We are NOT responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Hiring decisions made by employers</li>
                <li>Loss of job opportunities or interviews</li>
                <li>Errors caused by user input or misuse</li>
                <li>AI output accuracy or quality</li>
                <li>Third-party actions or decisions</li>
              </ul>
              <p className="text-gray-700">
                <strong>Disclaimer:</strong> CareerBoost provides tools, not
                guarantees. Success in job searching depends on many factors
                beyond our control.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Indemnification
              </h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless CareerBoost from any
                claims, damages, or costs arising from your violation of these
                Terms, misuse of the Platform, or infringement of others&apos;
                rights.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Account Termination
              </h2>
              <p className="text-gray-700 mb-4">
                We may suspend or terminate your account for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Violations of these Terms</li>
                <li>Abusive, fraudulent, or harmful behavior</li>
                <li>Legal or regulatory requirements</li>
                <li>Security threats or suspicious activity</li>
              </ul>
              <p className="text-gray-700">
                <strong>Your Right:</strong> You may delete your account anytime
                through account settings. Upon deletion, your data will be
                removed within 30 days.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Intellectual Property
              </h2>
              <p className="text-gray-700">
                CareerBoost technology, design, and AI algorithms are owned by
                CareerBoost and protected by copyright and intellectual property
                laws. You may not reproduce, distribute, or reverse engineer our
                Platform without permission.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Changes to Terms
              </h2>
              <p className="text-gray-700">
                We may update these Terms periodically. Significant changes will
                be announced via email or notification. Your continued use of
                CareerBoost constitutes acceptance of updated Terms.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14. Governing Law &amp; Dispute Resolution
              </h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by applicable law. Any disputes shall
                be resolved through good-faith negotiation. If unresolved,
                disputes may be subject to arbitration or legal proceedings as
                determined by law.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                15. Contact Us
              </h2>
              <div className="p-6 rounded-lg bg-gray-50 border border-gray-300">
                <p className="text-gray-700 mb-3">
                  For questions, concerns, or inquiries regarding these Terms:
                </p>
                <p className="text-gray-900 font-semibold">
                  📧 Email:{" "}
                  <a
                    href="mailto:legal@careerboost.ai"
                    className="text-blue-600 hover:underline"
                  >
                    legal@careerboost.ai
                  </a>
                </p>
                <p className="text-gray-700 mt-3 text-sm">
                  We respond to all inquiries within 7 business days.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-16 p-6 rounded-lg bg-blue-50 border-l-4 border-blue-400 flex gap-4">
            <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-2">
                Our Commitment to Fairness
              </p>
              <p className="text-blue-800 text-sm">
                These Terms are designed to protect both CareerBoost and our
                users. We believe in transparency, ethical practices, and fair
                dealing. If you have concerns about any term, please reach out.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

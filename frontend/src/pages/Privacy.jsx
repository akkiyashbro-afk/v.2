import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#fafafa] font-body">
      <div className="mx-auto max-w-3xl px-6 py-24 md:px-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-[13px] uppercase tracking-[0.22em] text-white/40 mb-12">
          Effective Date: September 2026
        </p>

        <div className="space-y-10 text-[15px] leading-relaxed text-white/70">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Introduction
            </h2>
            <p>
              WinsAble ("we," "us," or "our") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our account
              recovery services and interact with our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">We may collect the following categories of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Personal Identification:</strong>{" "}
                Full name, email address, phone number, and government-issued
                identification when required for account verification.
              </li>
              <li>
                <strong className="text-white">Account Information:</strong>{" "}
                Platform username, profile URLs, follower counts, and account
                history relevant to the recovery case.
              </li>
              <li>
                <strong className="text-white">Case Documentation:</strong>{" "}
                Screenshots, correspondence, and any materials submitted as part
                of a recovery appeal.
              </li>
              <li>
                <strong className="text-white">Technical Data:</strong> IP
                address, browser type, device information, and usage analytics
                collected automatically when you visit our website.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                To provide, manage, and improve our account recovery services.
              </li>
              <li>
                To communicate with you regarding your case status, updates, and
                recovery outcomes.
              </li>
              <li>
                To prepare and submit recovery appeals and documentation to
                relevant platforms on your behalf.
              </li>
              <li>
                To comply with legal obligations and protect our legal rights.
              </li>
              <li>
                To maintain the security and integrity of our systems.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. Information Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information. Your
              data may be shared only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
              <li>
                With the relevant platform(s) as part of your recovery appeal
                process.
              </li>
              <li>
                With third-party service providers who assist in our operations,
                under strict confidentiality agreements.
              </li>
              <li>
                When required by law, regulation, or valid legal process.
              </li>
              <li>
                To protect the rights, property, or safety of WinsAble, our
                clients, or the public.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Data Security
            </h2>
            <p>
              We implement industry-standard security measures including
              encryption in transit (TLS), encryption at rest, access controls,
              and regular security audits. All case files are stored in encrypted
              databases with strict access limitations. Despite our measures, no
              method of transmission or storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Data Retention
            </h2>
            <p>
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this policy, typically for the
              duration of your engagement and up to 24 months after case
              closure. Case documentation may be retained longer where required
              for legal or compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Your Rights
            </h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your personal data.</li>
              <li>Object to or restrict certain processing activities.</li>
              <li>Request data portability.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:recovery@winsable.io"
                className="text-white underline underline-offset-4 hover:text-white/80 transition-colors"
              >
                recovery@winsable.io
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Cookies and Tracking
            </h2>
            <p>
              Our website uses essential cookies to maintain functionality. We
              may also use analytics tools to understand usage patterns and
              improve our service. You can control cookie settings through your
              browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              9. Children's Privacy
            </h2>
            <p>
              The Service is not intended for individuals under the age of 18.
              We do not knowingly collect personal information from children. If
              we become aware that a child has provided us with personal data, we
              will take steps to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Material
              changes will be communicated via email to active clients and posted
              on this page with an updated effective date. Your continued use of
              the Service after changes are posted constitutes acceptance of the
              revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              11. Contact Us
            </h2>
            <p>
              For questions about this Privacy Policy or to exercise your data
              rights, contact our Data Protection team at{" "}
              <a
                href="mailto:recovery@winsable.io"
                className="text-white underline underline-offset-4 hover:text-white/80 transition-colors"
              >
                recovery@winsable.io
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

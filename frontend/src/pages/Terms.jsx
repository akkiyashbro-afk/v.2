import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#fafafa] font-body">
      <div className="mx-auto max-w-3xl px-6 py-24 md:px-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-[13px] uppercase tracking-[0.22em] text-white/40 mb-12">
          Effective Date: September 2026
        </p>

        <div className="space-y-10 text-[15px] leading-relaxed text-white/70">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using WinsAble ("the Service"), you agree to be
              bound by these Terms of Service. If you do not agree, do not use
              the Service. WinsAble is a private recovery firm assisting
              creators, founders, and public figures with account recovery.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. Eligibility
            </h2>
            <p>
              The Service is available exclusively to individuals who are the
              rightful owners of the account or platform in question. By
              submitting a recovery appeal, you confirm that you are the
              legitimate owner and have the legal authority to seek recovery of
              the account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. Service Description
            </h2>
            <p>
              WinsAble provides account recovery advisory and advocacy services.
              We assist clients in navigating platform-specific recovery
              processes, preparing documentation, and communicating with
              platform support teams. We do not guarantee successful recovery of
              any account, as final decisions rest with the respective platforms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Provide accurate and truthful information in all communications
                and recovery appeals.
              </li>
              <li>
                Cooperate promptly with requests for documentation or
                verification.
              </li>
              <li>
                Maintain the confidentiality of any case credentials or
                reference numbers provided by WinsAble.
              </li>
              <li>
                Not use the Service for any unlawful purpose or to recover
                accounts you do not legitimately own.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Fees and Payment
            </h2>
            <p>
              WinsAble operates on a results-based model where applicable.
              Specific fee structures, retainer terms, and payment schedules
              will be communicated in writing prior to engagement. No fees are
              charged without explicit prior agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Confidentiality
            </h2>
            <p>
              All client information, case details, and communications are
              treated as strictly confidential. WinsAble will not disclose your
              information to any third party without your explicit consent,
              except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              WinsAble provides services on an "as-is" basis. While we employ
              industry-leading expertise, we do not guarantee specific outcomes.
              WinsAble shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our Service,
              including but not limited to loss of data, revenue, or account
              access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Intellectual Property
            </h2>
            <p>
              All content, methodology, frameworks, and materials provided by
              WinsAble — including the Playbook, recovery templates, and
              communication scripts — are proprietary and may not be reproduced,
              distributed, or shared without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              9. Termination
            </h2>
            <p>
              Either party may terminate the engagement at any time by providing
              written notice. Upon termination, WinsAble will deliver any
              completed work product and cease further activity on your behalf.
              Outstanding fees for completed work remain payable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              10. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              applicable laws. Any disputes arising under these Terms shall be
              resolved through good-faith negotiation before resorting to formal
              proceedings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              11. Changes to Terms
            </h2>
            <p>
              WinsAble reserves the right to modify these Terms at any time.
              Continued use of the Service following changes constitutes
              acceptance of the updated Terms. Material changes will be
              communicated via email to active clients.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              12. Contact
            </h2>
            <p>
              For questions regarding these Terms, contact us at{" "}
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

export default Terms;

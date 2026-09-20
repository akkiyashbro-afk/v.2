import React from "react";

const Disclosures = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#fafafa] font-body">
      <div className="mx-auto max-w-3xl px-6 py-24 md:px-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Disclosures
        </h1>
        <p className="text-[13px] uppercase tracking-[0.22em] text-white/40 mb-12">
          Effective Date: September 2026
        </p>

        <div className="space-y-10 text-[15px] leading-relaxed text-white/70">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Nature of Services
            </h2>
            <p>
              WinsAble is a private account recovery advisory and advocacy firm.
              We are not a law firm, government agency, or authorized
              representative of any social media platform, tech company, or
              online service. Our services consist of professional guidance,
              documentation preparation, and communication advocacy to assist
              clients in recovering access to their accounts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. No Guarantee of Outcome
            </h2>
            <p>
              Account recovery decisions are made solely by the respective
              platform or service provider. WinsAble cannot and does not
              guarantee the success of any recovery effort. Past case outcomes
              are not indicative of future results. Each case is evaluated
              independently by the relevant platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. Client Testimonials
            </h2>
            <p>
              Testimonials and case studies presented on this website reflect
              real experiences of past clients. However, individual results may
              vary. Testimonials are not intended to represent or guarantee that
              anyone will achieve the same or similar results.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. Fees Disclosure
            </h2>
            <p>
              WinsAble's fee structure is communicated in writing prior to
              engagement. Where applicable, our results-based model means fees
              are contingent upon successful recovery milestones. Any retainer
              or upfront fees are disclosed during the intake process. WinsAble
              does not charge hidden fees.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Platform Relationships
            </h2>
            <p>
              WinsAble operates independently and is not affiliated with,
              endorsed by, or formally partnered with any social media platform
              or technology company. Any references to platforms (including but
              not limited to Instagram, X/Twitter, YouTube, TikTok, and others)
              are for identification purposes only and do not imply any
              official relationship.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Professional Standards
            </h2>
            <p>
              WinsAble adheres to the highest standards of professional conduct
              in all client engagements. We maintain strict confidentiality
              regarding all case details and client information. Our
              communication practices are designed to be transparent, ethical,
              and in compliance with applicable regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Risk Disclosure
            </h2>
            <p>
              Account recovery inherently involves certain risks, including but
              not limited to: potential delays in platform response, additional
              verification requirements, and the possibility that recovery may
              not be achievable. WinsAble will communicate these risks
              transparently during the engagement process.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Contact
            </h2>
            <p>
              For questions about these disclosures, contact us at{" "}
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

export default Disclosures;

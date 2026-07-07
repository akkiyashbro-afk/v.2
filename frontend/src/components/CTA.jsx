import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";

export const CTA = ({ onOpenAppeal }) => {
  return (
    <section
      id="cta"
      data-testid="cta-section"
      className="relative py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[32px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl overflow-hidden px-8 sm:px-14 py-20 sm:py-24 text-center"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute -top-48 -left-48 h-[28rem] w-[28rem] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(59,130,246,0.25),transparent_70%)]" />
            <div className="absolute -bottom-48 -right-48 h-[28rem] w-[28rem] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(124,58,237,0.2),transparent_70%)]" />
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 mb-8">
              <Lock className="h-3.5 w-3.5 text-white/70" strokeWidth={2} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-body font-medium">
                Encrypted intake · 24/7
              </span>
            </span>
            <h2
              className="font-display font-black text-[40px] sm:text-[56px] lg:text-[72px] leading-[0.98] text-white"
              style={{ letterSpacing: "-0.045em" }}
            >
              Your identity is your
              <br />
              <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                life&apos;s work.
              </span>
            </h2>
            <p className="mt-8 text-white/55 max-w-xl mx-auto leading-[1.75] font-body">
              Speak to a recovery officer. No forms, no queues — a real,
              named professional will reach out within one hour.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenAppeal}
                data-testid="cta-primary"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.14] hover:border-white/40 px-6 py-3.5 text-[14px] font-medium text-white overflow-hidden transition-all"
                style={{ boxShadow: "0 0 36px -8px rgba(255,255,255,0.22)" }}
              >
                <span className="relative">Submit Recovery Appeal</span>
                <ArrowUpRight
                  className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </button>
              <a
                href="#reviews"
                data-testid="cta-secondary"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl px-6 py-3.5 text-[14px] font-medium text-white/80 hover:bg-white/[0.05] hover:text-white transition-colors"
              >
                Read case studies
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;

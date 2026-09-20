import React from "react";
import { motion } from "framer-motion";
import { Lock, Radar, Fingerprint, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Radar,
    title: "01 · Silent Intake",
    body:
      "Encrypted, name-blind onboarding. Our forensic officers assess exposure without your identity ever touching a public system.",
  },
  {
    icon: Fingerprint,
    title: "02 · Chain of Custody",
    body:
      "We reconstruct the digital chain of ownership using notarized signals — device history, biometric echoes, verified metadata.",
  },
  {
    icon: Lock,
    title: "03 · Recovery Protocol",
    body:
      "Direct escalations across platform trust teams. Zero automated scripts. Every step signed by a human recovery officer.",
  },
  {
    icon: ShieldCheck,
    title: "04 · Hardened Return",
    body:
      "Your account returns armored — hardware-key enforced, session-audited, and monitored for 90 days at no additional cost.",
  },
];

export const Playbook = () => {
  return (
    <section
      id="playbook"
      data-testid="playbook-section"
      className="relative py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <span className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-body font-medium">
              The Foundation Playbook
            </span>
            <h2
              className="mt-4 font-display font-black text-[36px] md:text-[54px] leading-[1.02] text-white"
              style={{ letterSpacing: "-0.04em" }}
            >
              Four movements.
              <br />
              <span className="text-white/50">Zero noise.</span>
            </h2>
            <p className="mt-6 text-white/50 leading-[1.75] font-body">
              A protocol used by founders, artists, and heads of state. Every
              recovery is human-run, cryptographically logged, and impossibly
              private.
            </p>
          </div>

          <div className="md:col-span-8 grid sm:grid-cols-2 gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                data-testid={`playbook-step-${i + 1}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-white/20 hover:bg-white/[0.04] transition-colors overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-16 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)",
                  }}
                />
                <s.icon
                  className="h-6 w-6 text-white/70 mb-4"
                  strokeWidth={1.6}
                />
                <div className="text-white font-medium tracking-tight font-body">
                  {s.title}
                </div>
                <p className="mt-2 text-sm text-white/55 leading-[1.75] font-body">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Playbook;

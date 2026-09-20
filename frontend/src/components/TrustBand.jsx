import React from "react";
import { motion } from "framer-motion";
import { Shield, Cpu, KeyRound, Eye } from "lucide-react";

const badges = [
  { icon: Shield, label: "SOC 2 · Type II" },
  { icon: KeyRound, label: "FIDO2 · Hardware-Key Only" },
  { icon: Cpu, label: "ISO 27001 Aligned" },
  { icon: Eye, label: "Zero-Log Intake" },
];

export const TrustBand = () => {
  return (
    <section
      id="trust"
      data-testid="trust-band"
      className="relative py-24 border-y border-white/[0.06]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-body font-medium">
            Trust, engineered
          </span>
          <h3
            className="mt-4 font-display font-black text-[28px] md:text-[38px] leading-[1.08] text-white max-w-2xl"
            style={{ letterSpacing: "-0.035em" }}
          >
            The invisible infrastructure holding your comeback together.
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 backdrop-blur-xl"
            >
              <b.icon className="h-5 w-5 text-white/70" strokeWidth={1.7} />
              <span className="text-sm text-white/75 font-body">{b.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBand;

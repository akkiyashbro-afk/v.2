import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Aurora from "./Aurora";
import Particles from "./Particles";
import { galaxyStats } from "../data/recoveredProfiles";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const line = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export const Hero = ({ onOpenAppeal }) => {
  // Mouse parallax for headline
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.4 });
  const tx = useTransform(sx, [-1, 1], [-8, 8]);
  const ty = useTransform(sy, [-1, 1], [-6, 6]);

  const sectionRef = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mx.set(nx);
      my.set(ny);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      id="top"
      ref={sectionRef}
      data-testid="hero-section"
      className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 pb-24"
    >
      <Aurora intensity={0.75} />
      <div className="absolute inset-0 opacity-60">
        <Particles count={55} color="#93C5FD" />
      </div>

      <motion.div
        initial={{ scale: 1.03, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-16 w-full"
      >
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col items-start"
          >
            <motion.div
              variants={line}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 mb-10 backdrop-blur-xl"
              data-testid="hero-eyebrow"
            >
              <Sparkles className="h-3.5 w-3.5 text-white/70" strokeWidth={1.9} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-body font-medium">
                Foundation Edition · v2
              </span>
            </motion.div>

            <motion.h1
              variants={line}
              data-testid="hero-headline"
              className="font-display font-black text-[42px] leading-[0.98] sm:text-[60px] lg:text-[96px] text-white max-w-4xl"
              style={{ letterSpacing: "-0.045em", x: tx, y: ty }}
            >
              Protecting
              <br />
              what
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  you built.
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -inset-4 -z-10 blur-3xl rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(255,255,255,0.08), transparent 70%)",
                  }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={line}
              data-testid="hero-sub"
              className="mt-10 text-[15px] md:text-[17px] text-white/55 max-w-xl leading-[1.75] font-body"
            >
              A private, forensic recovery team for compromised digital
              identities. We restore accounts, brands, and reputations —
              quietly, precisely, and with a discretion your audience will
              never notice.
            </motion.p>

            <motion.div
              variants={line}
              className="mt-12 flex flex-wrap items-center gap-3"
            >
              <button
                type="button"
                onClick={onOpenAppeal}
                data-testid="hero-primary-cta"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] hover:border-white/40 px-6 py-3.5 text-[14px] font-medium text-white overflow-hidden transition-all"
                style={{ boxShadow: "0 0 30px -8px rgba(255,255,255,0.18)" }}
              >
                <span className="relative">Start Recovery Case</span>
                <ArrowUpRight
                  className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </button>
              <a
                href="#galaxy"
                data-testid="hero-secondary-cta"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl px-6 py-3.5 text-[14px] font-medium text-white/80 hover:bg-white/[0.05] hover:text-white transition-colors"
              >
                See recovered profiles
              </a>
            </motion.div>

            <motion.div
              variants={line}
              data-testid="hero-stats"
              className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl border-t border-white/[0.06] pt-8 font-body"
            >
              {[
                { v: `${galaxyStats.recovered.toLocaleString()}+`, l: "Identities recovered" },
                { v: `${galaxyStats.successRate}%`, l: "Success rate" },
                { v: `${galaxyStats.avgHours}h`, l: "Median recovery" },
                { v: `${galaxyStats.countries}`, l: "Countries served" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col">
                  <span className="font-display text-[26px] md:text-[32px] font-extrabold tracking-[-0.03em] text-white">
                    {s.v}
                  </span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.24em] text-white/40">
                    {s.l}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column — intentionally clean space */}
          <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />
        </div>
      </motion.div>

      {/* Premium scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-white/40">
        <span className="text-[10px] uppercase tracking-[0.4em] font-body font-medium">
          Scroll
        </span>
        <div className="relative h-10 w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent overflow-hidden">
          <div className="absolute top-0 left-0 h-3 w-full bg-white/80"
            style={{
              animation: "scrollHint 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes scrollHint {
          0% { transform: translateY(-100%); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;

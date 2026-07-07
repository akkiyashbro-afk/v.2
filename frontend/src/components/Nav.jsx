import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { WinsAbleWordmark } from "./WinsAbleMark";

export const Nav = ({ onOpenAppeal }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Galaxy", href: "#galaxy" },
    { label: "Wall", href: "#reviews" },
    { label: "Playbook", href: "#playbook" },
    { label: "Trust", href: "#trust" },
  ];

  return (
    <motion.header
      data-testid="site-nav"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(96%,1200px)]"
    >
      <div
        className={`flex items-center justify-between h-14 px-4 sm:px-6 rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
            : "bg-transparent border border-transparent"
        }`}
      >
        <a href="#top" data-testid="nav-logo" className="group">
          <WinsAbleWordmark />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="text-[12px] uppercase tracking-[0.22em] font-medium text-white/60 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={onOpenAppeal}
          data-testid="nav-cta"
          className="group relative hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] hover:border-white/40 hover:bg-white/[0.06] transition-all overflow-hidden"
          style={{ boxShadow: "0 0 24px -8px rgba(255,255,255,0.15)" }}
        >
          <span className="relative text-[13px] font-medium text-white">
            Start Recovery Case
          </span>
          <ArrowUpRight
            className="relative h-3.5 w-3.5 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </button>
      </div>
    </motion.header>
  );
};

export default Nav;

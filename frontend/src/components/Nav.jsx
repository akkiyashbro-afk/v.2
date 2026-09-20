import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { WinsAbleWordmark } from "./WinsAbleMark";

const links = [
  { label: "Galaxy", href: "#galaxy" },
  { label: "Wall", href: "#reviews" },
  { label: "Playbook", href: "#playbook" },
  { label: "Trust", href: "#trust" },
];

export const Nav = ({ onOpenAppeal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on Escape + outside click.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Full-screen frosted backdrop (portal escapes the header's transform). */}
      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              data-testid="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-xl"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      <motion.header
        ref={headerRef}
        data-testid="site-nav"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 inset-x-0 mx-auto z-40 w-[min(96%,1200px)]"
      >
      <div
        className={`flex items-center justify-between h-14 px-4 sm:px-6 rounded-full transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
            : "bg-transparent border border-transparent"
        }`}
      >
        <a href="#top" data-testid="nav-logo" className="group">
          <WinsAbleWordmark />
        </a>

        {/* Desktop navigation — unchanged (visible on large screens). */}
        <nav className="hidden lg:flex items-center gap-8">
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

        <div className="flex items-center gap-2">
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

          {/* Glass hamburger — tablet + mobile only. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            data-testid="nav-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] hover:border-white/40 hover:bg-white/[0.08] active:scale-95 transition-all text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="h-5 w-5" strokeWidth={2} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Slide-down glass menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden absolute left-0 right-0 mt-3 origin-top rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.1] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)] p-3 overflow-hidden"
          >
            <div className="flex flex-col">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.3 }}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[13px] uppercase tracking-[0.2em] font-medium text-white/75 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  {l.label}
                  <ArrowUpRight
                    className="h-4 w-4 text-white/40"
                    strokeWidth={2}
                  />
                </motion.a>
              ))}
            </div>

            <button
              type="button"
              data-testid="mobile-nav-cta"
              onClick={() => {
                setMenuOpen(false);
                onOpenAppeal?.();
              }}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white/[0.07] border border-white/[0.15] hover:border-white/40 hover:bg-white/[0.1] active:scale-[0.98] px-4 py-3.5 text-[14px] font-medium text-white transition-all"
            >
              Start Recovery Case
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
    </>
  );
};

export default Nav;

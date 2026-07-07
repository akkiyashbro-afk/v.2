import React from "react";
import { WinsAbleWordmark } from "./WinsAbleMark";

export const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-white/[0.06] py-16 font-body"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-sm">
            <WinsAbleWordmark />
            <p className="mt-5 text-white/45 text-sm leading-relaxed">
              A private recovery firm for creators, founders, and public
              figures. Foundation Edition · v2.
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-white/35">
              Protecting What You Built
            </p>
          </div>

          <nav
            data-testid="footer-nav-links"
            className="grid grid-cols-2 sm:grid-cols-3 gap-x-14 gap-y-3 text-[13px] text-white/55"
          >
            <a href="#galaxy" className="hover:text-white transition-colors">
              Galaxy
            </a>
            <a href="#reviews" className="hover:text-white transition-colors">
              Wall
            </a>
            <a href="#playbook" className="hover:text-white transition-colors">
              Playbook
            </a>
            <a href="#trust" className="hover:text-white transition-colors">
              Trust
            </a>
            <a href="#cta" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="mailto:recovery@winsable.io" className="hover:text-white transition-colors">
              Encrypted Intake
            </a>
          </nav>
        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-white/35">
          <span>© 2026 WinsAble. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Disclosures
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

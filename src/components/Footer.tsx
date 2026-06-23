"use client";

/**
 * FOOTER
 * ─────────────────────────────────────────────────────────────────
 * Clean, trustworthy corporate footer.
 *
 * Structure:
 *  - Top row: Logo + tagline on left, 4 link columns on right
 *  - Bottom row: Copyright on left, social/secondary links on right
 *  - Background: Deep Navy (#0F172A) — creates a strong visual anchor
 *    at the bottom of the page
 *
 * Why dark footer?
 *  - Classic SaaS pattern: light page → dark footer
 *  - Creates a clear "end of page" signal for the user
 *  - Emerald brand color pops against navy
 */

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

// ─── LINK DATA ────────────────────────────────────────────────────
const FOOTER_LINKS = [
  {
    heading: "Product",
    links: ["Features", "Pricing", "Roadmap", "Changelog"],
  },
  {
    heading: "Security",
    links: ["Data Privacy", "SOC 2 Report", "Encryption", "Audit Logs"],
  },
  {
    heading: "Compliance",
    links: ["FCRA Guide", "12A & 80G", "Form 10BD", "DARPAN Portal"],
  },
  {
    heading: "Legal",
    links: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Disclaimer"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-400">

      {/* ── MAIN FOOTER CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* ── BRAND COLUMN (takes 1 out of 5 columns) ── */}
          <div className="md:col-span-1 flex flex-col gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#10B981] rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="text-xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Trust<span className="text-[#10B981]">Saathi</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm leading-relaxed text-slate-500">
              The AI Operating System for India&apos;s 30 Lakh Trusts & NGOs.
            </p>

            {/* WhatsApp CTA */}
            <a
              href="#whatsapp"
              id="footer-whatsapp-link"
              className="
                self-start mt-2
                text-xs font-semibold
                text-[#25D366] hover:text-white
                flex items-center gap-1.5
                transition-colors duration-200
              "
            >
              {/* WhatsApp green dot */}
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              Chat with us on WhatsApp
            </a>
          </div>

          {/* ── LINK COLUMNS ── */}
          {/*
            The remaining 4 columns of the 5-column grid.
            Each column maps over its links array.
          */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              {/* Column heading */}
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                {col.heading}
              </h4>
              {/* Links */}
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      {/*
        A thin horizontal line separates the main footer from the bottom bar.
        border-slate-800 = a very subtle dark border against the navy background.
      */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-xs text-slate-600 text-center sm:text-left">
            © 2026 TrustSaathi. Built for India&apos;s Social and Spiritual Economy.
          </p>

          {/* Secondary links */}
          <div className="flex items-center gap-6">
            {["Status", "Contact", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
            {/* DPDP / CERT-IN compliance badge */}
            <span className="
              text-[10px] font-bold uppercase tracking-wider
              px-2.5 py-1 rounded-full
              bg-emerald-900/50 text-[#10B981]
              border border-emerald-800/60
            ">
              DPDP Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

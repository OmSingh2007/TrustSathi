"use client";

/**
 * CTA SECTION — "Secure Your Trust's Legacy Today"
 * ─────────────────────────────────────────────────────────────────
 * Full-width centered block with a soft gradient background.
 * Premium feel through:
 *  - Large, impactful heading with gradient text
 *  - Decorative floating orbs behind the card
 *  - Framer Motion scale + opacity entrance
 *  - Two CTAs: primary (emerald button) + secondary (text link)
 *  - Trust badges row below the CTAs
 */

import { motion } from "framer-motion";
import { CalendarDays, MessageSquare, ShieldCheck, Star, Users } from "lucide-react";

// Trust badges shown beneath the CTA buttons
const TRUST_BADGES = [
  { icon: ShieldCheck, text: "SOC 2 Type II" },
  { icon: Star,        text: "4.9 / 5 Rating" },
  { icon: Users,       text: "500+ NGOs" },
];

export default function CTASection() {
  return (
    <section id="cta" className="relative py-28 px-6 overflow-hidden bg-[#FAFAFA]">

      {/* ── DECORATIVE BACKGROUND ORBS ── */}
      {/*
        These are large, blurred circles positioned off-center.
        They create a soft ambient glow without being intrusive.
        pointer-events-none = they never interfere with user interaction.
      */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Emerald orb — top left */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-100/50 blur-3xl" />
        {/* Slate orb — bottom right */}
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-slate-200/40 blur-3xl" />
      </div>

      {/* ── CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="
          relative max-w-3xl mx-auto text-center
          bg-white rounded-3xl
          border border-slate-200
          shadow-2xl shadow-slate-200/60
          px-8 sm:px-16 py-16
        "
      >
        {/* Subtle inner gradient border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-50/30 via-transparent to-slate-50/30 pointer-events-none" />

        {/* Top eyebrow badge */}
        <span className="
          inline-flex items-center gap-2 px-4 py-1.5 mb-6
          rounded-full text-xs font-semibold tracking-wider uppercase
          bg-emerald-50 text-[#059669] border border-emerald-200
        ">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          Limited Early Access — Join the Waitlist
        </span>

        {/* Main Heading */}
        <h2
          style={{ fontFamily: "var(--font-jakarta)" }}
          className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4"
        >
          Secure Your Trust&apos;s{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
            Legacy Today.
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-[#64748B] text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Join 500+ trusts and NGOs already on TrustSaathi. Go from paper chaos to
          government-ready compliance in under a week.
        </p>

        {/* ── CTA BUTTONS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Primary: Schedule Demo */}
          <motion.a
            id="cta-schedule-demo-btn"
            href="#demo"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 48px rgba(16,185,129,0.30)",
            }}
            whileTap={{ scale: 0.97 }}
            className="
              flex items-center gap-2.5
              px-8 py-4 rounded-2xl
              font-bold text-white text-base
              bg-[#10B981] hover:bg-[#059669]
              shadow-xl shadow-emerald-200
              transition-colors duration-200
            "
          >
            <CalendarDays className="w-5 h-5" />
            Schedule a Guided Demo
          </motion.a>

          {/* Secondary: Talk to Expert */}
          <motion.a
            id="cta-expert-link"
            href="#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="
              flex items-center gap-2
              px-6 py-4 rounded-2xl
              font-semibold text-[#475569] text-base
              hover:text-[#0F172A]
              border-2 border-slate-200 hover:border-slate-300
              transition-all duration-200
            "
          >
            <MessageSquare className="w-4 h-4" />
            Talk to a Compliance Expert
          </motion.a>
        </div>

        {/* ── TRUST BADGES ── */}
        <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-8 flex-wrap">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.text} className="flex items-center gap-2 text-sm text-[#64748B]">
                <Icon className="w-4 h-4 text-[#10B981]" />
                <span className="font-medium">{badge.text}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

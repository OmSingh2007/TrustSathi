"use client";

/**
 * HERO SECTION
 * ─────────────────────────────────────────────────────────────────
 * Two-column layout (desktop) / stacked (mobile).
 * Left: Staggered text reveal with Framer Motion
 * Right: 3D Tilt card showing Bahi-Khata → Digital Dashboard split
 *
 * Animation Strategy:
 * - containerVariants: parent animation container that staggers children
 * - itemVariants: each text block fades up from y=30 to y=0
 * - The card "floats" using a CSS keyframe-like animation via motion
 */

import { motion, type Variants } from "framer-motion";
import { Play, FileText, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import TiltCard from "./TiltCard";

// ─── FRAMER MOTION VARIANTS ───────────────────────────────────────
// Variants are named animation states. We define them once and reuse.

/**
 * containerVariants controls the PARENT element.
 * "staggerChildren: 0.15" means each child animates 0.15s after the previous.
 * This creates the cascading text reveal effect.
 */
// Typed as Variants so TypeScript understands the shape Framer Motion expects.
// Without this, TS would underline the object with a type mismatch error.
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,  // delay between each child animation
      delayChildren: 0.3,     // wait 0.3s before starting the first child
    },
  },
};

/**
 * itemVariants defines what each individual child does:
 * - hidden: invisible (opacity 0) and 30px below its natural position
 * - visible: fully visible (opacity 1) at its natural position (y=0)
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    // 'as const' tells TypeScript this is a fixed-length tuple [n,n,n,n]
    // not a plain number[] — required for Framer Motion's Easing type
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function HeroSection() {
  return (
    /**
     * Section styling:
     * - pt-32: padding-top to clear the sticky navbar (which is ~64px)
     * - pb-24: bottom padding for breathing room
     * - overflow-hidden: prevents the floating card from causing scrollbar
     */
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden px-6">

      {/* ── BACKGROUND DECORATIONS ── */}
      {/* Large green blob — purely decorative, blurred radial gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-emerald-100/40 to-transparent rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      {/* Subtle grid lines pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── MAIN CONTAINER ── */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ──────────────────────────────────────────
            LEFT COLUMN: Staggered Text Reveal
        ────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Pill badge — small label above headline */}
          <motion.div variants={itemVariants}>
            <span className="
              inline-flex items-center gap-2 px-4 py-1.5
              rounded-full text-xs font-semibold tracking-wider uppercase
              bg-emerald-50 text-[#059669] border border-emerald-200
            ">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              AI-Powered • Compliance-Ready • India-First
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            style={{ fontFamily: "var(--font-jakarta)" }}
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-[#0F172A] leading-[1.1] tracking-tight"
          >
            The AI Operating System for India&apos;s{" "}
            <span className="relative">
              {/* Text with gradient fill */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
                30 Lakh
              </span>
              {/* Decorative underline SVG below "30 Lakh" */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 4 100 2 150 6C200 10 250 8 298 4"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </span>{" "}
            Trusts & NGOs.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-[#64748B] leading-relaxed max-w-xl"
          >
            Digitize <strong className="text-[#0F172A] font-semibold">Bahi-Khatas.</strong>{" "}
            Automate <strong className="text-[#0F172A] font-semibold">Compliance.</strong>{" "}
            Protect Your <strong className="text-[#0F172A] font-semibold">Impact.</strong>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-2">
            {/* Primary CTA */}
            <motion.a
              id="hero-watch-demo-btn"
              href="#demo"
              whileHover={{ scale: 1.04, boxShadow: "0 20px 40px rgba(16,185,129,0.25)" }}
              whileTap={{ scale: 0.97 }}
              className="
                flex items-center gap-2.5 px-7 py-3.5
                rounded-xl font-semibold text-white
                bg-[#10B981] hover:bg-[#059669]
                shadow-lg shadow-emerald-200
                transition-colors duration-200
              "
            >
              {/* Play icon with a circular background */}
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-3 h-3 fill-white text-white ml-0.5" />
              </span>
              Watch Demo
            </motion.a>

            {/* Secondary CTA — outline style */}
            <motion.a
              id="hero-whitepaper-btn"
              href="#whitepaper"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="
                flex items-center gap-2 px-7 py-3.5
                rounded-xl font-semibold text-[#0F172A]
                border-2 border-[#CBD5E1] hover:border-[#10B981] hover:text-[#10B981]
                transition-all duration-200
              "
            >
              <FileText className="w-4 h-4" />
              Read the Whitepaper
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Social Proof Row */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 pt-2"
          >
            {/* Stacked avatars — simulated with colored circles */}
            <div className="flex -space-x-2">
              {["#4F46E5", "#F59E0B", "#EF4444", "#10B981"].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-sm text-[#64748B]">
              Trusted by <strong className="text-[#0F172A]">200+</strong> NGOs already onboarded in early access
            </p>
          </motion.div>
        </motion.div>

        {/* ──────────────────────────────────────────
            RIGHT COLUMN: 3D Floating Tilt Card
        ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          // "Float" animation: continuously move up and down by 12px
          // This creates the premium "hovering" product card effect
          // We use CSS animation via Tailwind's animate-bounce alternative
        >
          {/* Floating wrapper — keyframe animation using inline style */}
          <motion.div
            animate={{ y: [0, -12, 0] }}  // moves from 0 → -12px → back to 0
            transition={{
              duration: 4,              // one full float cycle = 4 seconds
              repeat: Infinity,         // loop forever
              ease: "easeInOut",        // smooth acceleration/deceleration
            }}
          >
            <TiltCard className="w-full max-w-lg mx-auto">
              <HeroDashboardCard />
            </TiltCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * HERO DASHBOARD CARD (Inner Visual)
 * ─────────────────────────────────────────────────────────────────
 * Simulates the "Bahi-Khata to Digital" transformation:
 * - Left half: paper ledger aesthetic (sepia, handwritten look)
 * - Right half: clean digital chart UI
 * - A glowing divider separates the two worlds
 */
function HeroDashboardCard() {
  // Fake chart bar heights — simulates an animated bar chart
  const chartBars = [40, 65, 45, 80, 55, 90, 70, 95];

  return (
    <div className="
      bg-white rounded-2xl shadow-2xl shadow-slate-200/80
      border border-slate-100 overflow-hidden
    ">
      {/* Top bar — like a browser chrome / app header */}
      <div className="bg-[#0F172A] px-4 py-3 flex items-center gap-2">
        {/* Traffic light dots */}
        {["#EF4444", "#F59E0B", "#10B981"].map((c) => (
          <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
        ))}
        <span className="ml-3 text-xs text-slate-400 font-mono">TrustSaathi Dashboard — FY 2024-25</span>
      </div>

      {/* Split content: 2-column grid */}
      <div className="grid grid-cols-2 divide-x divide-slate-200">

        {/* LEFT: Bahi-Khata (Paper Ledger) Simulation */}
        <div className="p-5 bg-amber-50/60">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Bahi-Khata</span>
          </div>
          {/* Simulated handwritten ledger lines */}
          <div className="space-y-2">
            {[
              { label: "10 Jan", amount: "₹ ४५,०००", type: "income" },
              { label: "12 Jan", amount: "₹ १२,५००", type: "expense" },
              { label: "15 Jan", amount: "₹ ७८,०००", type: "income" },
              { label: "18 Jan", amount: "₹ ५,२००", type: "expense" },
              { label: "20 Jan", amount: "₹ ९२,०००", type: "income" },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-amber-200/60">
                {/* Date label — uses a monospace handwritten-feel style */}
                <span className="text-xs text-amber-800 font-mono">{row.label}</span>
                {/* Amount — Devanagari numerals for authenticity */}
                <span className={`text-xs font-bold font-mono ${row.type === "income" ? "text-emerald-700" : "text-red-500"}`}>
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
          {/* AI Scan indicator */}
          <div className="mt-3 flex items-center gap-1.5">
            {/* Pulsing dot — represents active AI scanning */}
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] text-emerald-700 font-medium">AI Scanning...</span>
          </div>
        </div>

        {/* RIGHT: Digital Dashboard Simulation */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider">Digital Ledger</span>
          </div>

          {/* Summary KPIs */}
          <div className="mb-3 space-y-1.5">
            <div className="bg-emerald-50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-slate-500">Total Receipts</p>
              <p className="text-sm font-bold text-[#0F172A]">₹2,15,000</p>
            </div>
            <div className="bg-red-50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-slate-500">Total Payments</p>
              <p className="text-sm font-bold text-[#0F172A]">₹17,700</p>
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="flex items-end gap-1 h-16">
            {chartBars.map((height, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-[#059669] to-[#10B981]"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.08 + 0.5, duration: 0.5, ease: "easeOut" }}
              />
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 text-center">Monthly Cash Flow</p>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between border-t border-slate-100">
        <span className="text-[10px] text-slate-500">✓ Audit-ready  •  FCRA Compliant</span>
        <span className="text-[10px] font-semibold text-[#10B981]">Auto-synced ↗</span>
      </div>
    </div>
  );
}

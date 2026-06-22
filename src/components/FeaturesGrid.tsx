"use client";

/**
 * FEATURES GRID — "The Three Pillars"
 * ─────────────────────────────────────────────────────────────────
 * Three static feature cards in a responsive grid.
 * Each card uses whileInView to stagger-animate as it enters the viewport.
 *
 * Design:
 *  - Ivory (#FAFAFA) background
 *  - Cards: white with a subtle border + shadow
 *  - Icon: coloured pill background, Lucide icon
 *  - On hover: card lifts slightly (y: -8px) with a stronger shadow
 */

import { motion, type Variants } from "framer-motion";
import { Camera, ShieldCheck, FileSpreadsheet } from "lucide-react";

// ─── FEATURE DATA ─────────────────────────────────────────────────
const FEATURES = [
  {
    id: "feature-digitization",
    icon: Camera,
    // Colour palette for the icon badge
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
    // Pill badge above the heading
    badgeText: "Vision AI",
    badgeBg: "#ECFDF5",
    badgeColor: "#059669",
    heading: "Zero-Touch Digitization",
    body: "Snap a photo of any handwritten regional Bahi-Khata. Our Vision AI automatically structures, sanitizes, and converts it into a digital ledger — in Hindi, Marathi, Gujarati, or Tamil.",
  },
  {
    id: "feature-compliance",
    icon: ShieldCheck,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    badgeText: "Always-On",
    badgeBg: "#EFF6FF",
    badgeColor: "#2563EB",
    heading: "Proactive Compliance Guard",
    body: "Continuous background monitoring tracks your global and cash inflows. Get instant WhatsApp warnings before you approach critical FCRA or 12A statutory thresholds.",
  },
  {
    id: "feature-filing",
    icon: FileSpreadsheet,
    iconBg: "#FFF7ED",
    iconColor: "#F59E0B",
    badgeText: "One-Click",
    badgeBg: "#FFF7ED",
    badgeColor: "#B45309",
    heading: "One-Click Government Filing",
    body: "Completely eliminate manual data transcription. Compile all processed donor records into perfectly formatted Form 10BD CSV files ready for direct Income Tax portal upload.",
  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────
// Container staggers the three children so they cascade in left → right
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function FeaturesGrid() {
  return (
    <section id="features-grid" className="relative py-28 px-6 bg-[#FAFAFA]">

      {/* ── SECTION HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-2xl mx-auto"
      >
        {/* Eyebrow label */}
        <span className="
          inline-flex items-center gap-2 px-4 py-1.5 mb-4
          rounded-full text-xs font-semibold tracking-wider uppercase
          bg-emerald-50 text-[#059669] border border-emerald-200
        ">
          The Three Pillars
        </span>

        {/* Heading */}
        <h2
          style={{ fontFamily: "var(--font-jakarta)" }}
          className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 leading-tight"
        >
          Everything a Trust needs.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
            Nothing it doesn&apos;t.
          </span>
        </h2>
        <p className="text-[#64748B] mt-4 leading-relaxed">
          Built ground-up for the realities of India&apos;s non-profit ecosystem — regional scripts,
          cash economies, and complex multi-regulation compliance.
        </p>
      </motion.div>

      {/* ── THREE CARDS ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.id}
              id={feat.id}
              variants={cardVariants}
              // Hover: card lifts + shadow intensifies
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="
                group bg-white rounded-2xl p-8
                border border-slate-200/60
                shadow-sm hover:shadow-2xl hover:shadow-slate-200/70
                transition-shadow duration-300
                flex flex-col gap-5
              "
            >
              {/* Icon badge */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: feat.iconBg }}
              >
                <Icon className="w-7 h-7" style={{ color: feat.iconColor }} strokeWidth={1.8} />
              </div>

              {/* Pill badge */}
              <span
                className="self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ backgroundColor: feat.badgeBg, color: feat.badgeColor }}
              >
                {feat.badgeText}
              </span>

              {/* Copy */}
              <div className="flex flex-col gap-2">
                <h3
                  style={{ fontFamily: "var(--font-jakarta)" }}
                  className="text-xl font-bold text-[#0F172A]"
                >
                  {feat.heading}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {feat.body}
                </p>
              </div>

              {/* "Learn more" subtle link — appears on hover */}
              <p className="
                mt-auto text-sm font-semibold text-[#10B981]
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                flex items-center gap-1
              ">
                Learn more →
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

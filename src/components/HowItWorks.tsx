"use client";

/**
 * HOW IT WORKS — 3-Step Horizontal Timeline
 * ─────────────────────────────────────────────────────────────────
 * A clean horizontal process timeline on a pale blue (#F1F5F9) background.
 *
 * Layout:
 *  - Centered heading + subtitle
 *  - Three step cards connected by animated dashed connector lines
 *  - Each card: number pill → icon → bold heading → body text
 *
 * Animations:
 *  - Section heading fades in on scroll
 *  - Steps stagger in left → right
 *  - The connector line draws itself left → right using scaleX on a
 *    motion.div with transformOrigin: "left center"
 */

import { motion, type Variants } from "framer-motion";
import { Upload, Cpu, Lock } from "lucide-react";

// ─── STEP DATA ────────────────────────────────────────────────────
const STEPS = [
  {
    id: "step-upload",
    number: "01",
    icon: Upload,
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
    numberColor: "#10B981",
    heading: "Upload",
    body: "Take a picture or drop a file of your daily journal — a handwritten Bahi-Khata page, a receipt bundle, or a bank statement.",
  },
  {
    id: "step-process",
    number: "02",
    icon: Cpu,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    numberColor: "#3B82F6",
    heading: "Process",
    body: "TrustSaathi's AI handles accounting entries, categorizes every transaction, and silently checks compliance in the background.",
  },
  {
    id: "step-secure",
    number: "03",
    icon: Lock,
    iconBg: "#FFF7ED",
    iconColor: "#F59E0B",
    numberColor: "#F59E0B",
    heading: "Secure",
    body: "Instantly access audit-ready ledgers, donor certificates, Form 10BD exports, and WhatsApp compliance alerts — all in one dashboard.",
  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-6 bg-[#F1F5F9]">

      {/* ── SECTION HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20 max-w-xl mx-auto"
      >
        <span className="
          inline-flex items-center gap-2 px-4 py-1.5 mb-4
          rounded-full text-xs font-semibold tracking-wider uppercase
          bg-white text-[#0F172A] border border-slate-300
        ">
          How It Works
        </span>
        <h2
          style={{ fontFamily: "var(--font-jakarta)" }}
          className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 leading-tight"
        >
          From chaos to compliance{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
            in three steps.
          </span>
        </h2>
        <p className="text-[#64748B] mt-4 leading-relaxed">
          No training. No migration headaches. No accountant fees. Just results.
        </p>
      </motion.div>

      {/* ── STEPS ── */}
      <div className="max-w-5xl mx-auto relative">

        {/*
          CONNECTOR LINE — a horizontal dashed line that sits behind the step cards.
          We use a motion.div that starts at scaleX=0 (invisible, collapsed at left)
          and animates to scaleX=1 (full width) when it enters the viewport.
          transformOrigin: "left center" makes it grow from left to right.
        */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: "easeInOut", delay: 0.3 }}
          style={{ transformOrigin: "left center" }}
          className="
            hidden md:block
            absolute top-10 left-[16.67%] right-[16.67%]
            h-px border-t-2 border-dashed border-[#CBD5E1]
          "
        />

        {/* Step cards in a responsive grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                id={step.id}
                variants={stepVariants}
                className="flex flex-col items-center text-center gap-5"
              >
                {/* Step number + icon circle stacked */}
                <div className="relative">
                  {/* Outer icon circle */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: step.iconBg }}
                  >
                    <Icon className="w-9 h-9" style={{ color: step.iconColor }} strokeWidth={1.6} />
                  </div>

                  {/* Step number pill — positioned top-right of the icon circle */}
                  <div
                    className="
                      absolute -top-2 -right-2
                      w-7 h-7 rounded-full
                      flex items-center justify-center
                      text-[11px] font-extrabold text-white
                      shadow-md
                    "
                    style={{ backgroundColor: step.iconColor }}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <h3
                    style={{ fontFamily: "var(--font-jakarta)" }}
                    className="text-xl font-bold text-[#0F172A]"
                  >
                    {step.heading}
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed max-w-xs mx-auto">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── BOTTOM TAGLINE ── */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center text-sm text-[#64748B] mt-16"
      >
        Average onboarding time: <strong className="text-[#0F172A]">under 7 minutes.</strong>{" "}
        No CA required.
      </motion.p>
    </section>
  );
}

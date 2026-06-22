"use client";


/**
 * STATS SECTION — "The Ticking Time Bomb"
 * ─────────────────────────────────────────────────────────────────
 * Full-width section on a pale blue (#F1F5F9) background.
 * Three stats with animated scroll-triggered counters.
 * A bold centered statement below.
 *
 * Animation:
 * - Section uses whileInView (Framer Motion) — triggers when visible
 * - Each stat card staggers in with scale + opacity
 * - Numbers count up via AnimatedCounter (Intersection Observer)
 */



import { motion, type Variants } from "framer-motion";
import { AlertTriangle, Building2, FileX2, Receipt } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

// ─── STATS DATA ───────────────────────────────────────────────────
const STATS = [
  {
    id: "stat-institutions",
    icon: Building2,
    iconBg: "#EFF6FF",       // pale blue
    iconColor: "#3B82F6",    // blue
    prefix: "",
    target: 30,              // we'll show "30" then suffix "Lakh+"
    suffix: " Lakh+",
    label: "Registered Trusts & NGOs",
    sublabel: "Across India — the world's largest non-profit ecosystem",
  },
  {
    id: "stat-paper",
    icon: FileX2,
    iconBg: "#FFF7ED",
    iconColor: "#F59E0B",
    prefix: "",
    target: 90,
    suffix: "%",
    label: "Still Using Paper Ledgers",
    sublabel: "Handwritten Bahi-Khatas with zero digital backup or audit trail",
  },
  {
    id: "stat-penalty",
    icon: Receipt,
    iconBg: "#FFF1F2",
    iconColor: "#EF4444",
    prefix: "",
    target: 30,
    suffix: "%",
    label: "Face Penalty Risk",
    sublabel: "On anonymous donations above ₹2,000 — most don't even know",
  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────
// Typed as Variants so TypeScript doesn't underline these objects.
// Without the type annotation, TS infers the object too narrowly.
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    // 'as const' narrows number[] to [n,n,n,n] tuple — required by Framer Motion
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="relative py-24 px-6 bg-[#F1F5F9]"
    >
      {/* Top edge decoration — a subtle wave divider effect via clip-path */}
      <div
        className="absolute top-0 left-0 right-0 h-16 bg-[#FAFAFA]"
        style={{ clipPath: "ellipse(55% 100% at 50% 0%)" }}
      />

      <div className="max-w-7xl mx-auto">

        {/* ── TOP LABEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}  // trigger 100px before section enters viewport
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="
            inline-flex items-center gap-2 px-4 py-1.5 mb-4
            rounded-full text-xs font-semibold tracking-wider uppercase
            bg-red-50 text-red-600 border border-red-200
          ">
            <AlertTriangle className="w-3.5 h-3.5" />
            The Crisis in Numbers
          </span>

          {/* Bold centerpiece statement */}
          <h2
            style={{ fontFamily: "var(--font-jakarta)" }}
            className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 max-w-3xl mx-auto"
          >
            Traditional accounting is a{" "}
            <span className="relative inline-block">
              {/* Red underline scratch — emphasizes "danger" */}
              <span className="relative z-10">regulatory ticking</span>
              <span
                className="absolute bottom-0 left-0 w-full h-3 bg-red-200/60 -z-0"
                style={{ transform: "skewX(-3deg)" }}
              />
            </span>{" "}
            time bomb.
          </h2>
          <p className="text-[#64748B] mt-4 max-w-xl mx-auto">
            The FCRA 2020 amendments and IT Act Section 80G crackdowns have turned
            paper-based compliance into an existential risk.
          </p>
        </motion.div>

        {/* ── THREE STAT CARDS ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          // once: true = animation fires once, not every time it enters viewport
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                id={stat.id}
                variants={cardVariants}
                // Hover effect: slight lift + stronger shadow
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="
                  bg-white rounded-2xl p-8
                  border border-slate-200/60
                  shadow-sm hover:shadow-xl hover:shadow-slate-200/80
                  transition-shadow duration-300
                  flex flex-col gap-4
                "
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.iconColor }} />
                </div>

                {/* Counter number — uses our AnimatedCounter */}
                <div>
                  <p
                    style={{ fontFamily: "var(--font-jakarta)" }}
                    className="text-5xl font-extrabold text-[#0F172A] leading-none"
                  >
                    <AnimatedCounter
                      target={stat.target}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={2}
                    />
                  </p>
                </div>

                {/* Label */}
                <div>
                  <p className="font-bold text-[#0F172A] text-lg">{stat.label}</p>
                  <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{stat.sublabel}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── BOTTOM CTA STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
        >
          <p className="text-[#64748B] text-sm">
            Don&apos;t wait for a notice from the Income Tax Department.
          </p>
          <motion.a
            id="stats-cta-btn"
            href="#demo"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="
              px-6 py-3 rounded-xl text-sm font-semibold text-white
              bg-[#10B981] hover:bg-[#059669]
              shadow-md shadow-emerald-100
              transition-colors duration-200
            "
          >
            Get Compliant in 7 Days →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

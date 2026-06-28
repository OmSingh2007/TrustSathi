"use client";

/**
 * DASHBOARD HOME PAGE - TrustSaathi
 * Route: /dashboard
 *
 * Design after refinement:
 *  1. Welcome header - Ivory/white canvas, no heavy dark banner.
 *     Pure typography-led greeting with emerald accent badges.
 *  2. Single row of 3 combined "Telemetry Grid Cards" - merges the
 *     old stats row + quick-access row into one high-impact grid.
 *     Each card shows: large metric, sub-context, description label,
 *     and a status badge. All three are clickable Next.js Links.
 *  3. Hover: Framer Motion whileHover lifts the card (-4px Y) and adds
 *     a soft emerald glow on the border via a CSS box-shadow.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  ShieldCheck,
  FileText,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

// ---- TELEMETRY CARD DATA ---------------------------------------------------
// This single array replaces both the old STATS array and the MODULES array.
// Each object now holds: metric, context, description, badge, href, etc.
const TELEMETRY_CARDS = [
  {
    // Card 1 - Digital Ledgers
    metric: "1,248",              // Large hero number shown prominently
    metricContext: "+23 this month", // Small supportive context below the number
    title: "Digital Ledgers",
    description: "AI-powered Bahi-Khata digitization",
    badge: "1,248 entries",       // Status pill shown at card bottom
    badgeType: "success",         // Controls badge color: success=emerald
    href: "/digital-ledgers",
    icon: BookOpen,
    accent: "#10B981",            // Emerald - primary brand color
    trendIcon: TrendingUp,
    trendColor: "#10B981",
  },
  {
    // Card 2 - Compliance Radar
    metric: "94%",
    metricContext: "2 alerts active",
    title: "Compliance Radar",
    description: "Real-time FCRA & statutory monitoring",
    badge: "2 active alerts",
    badgeType: "warn",            // warn=amber
    href: "/compliance-radar",
    icon: ShieldCheck,
    accent: "#F59E0B",            // Amber for compliance/warning state
    trendIcon: AlertTriangle,
    trendColor: "#F59E0B",
  },
  {
    // Card 3 - Government Filings
    metric: "3",
    metricContext: "FCRA due in 12 days",
    title: "Government Filings",
    description: "End-to-end statutory tax filing portal",
    badge: "3 pending",
    badgeType: "info",            // info=blue
    href: "/filings",
    icon: FileText,
    accent: "#3B82F6",            // Blue for government/official filings
    trendIcon: AlertTriangle,
    trendColor: "#3B82F6",
  },
];

// ---- BADGE COLOR MAP -------------------------------------------------------
// Maps badgeType string -> Tailwind/inline color values.
// Keeps the card data clean by abstracting color logic here.
const BADGE_STYLES: Record<string, { color: string; bg: string }> = {
  success: { color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  warn:    { color: "#F59E0B", bg: "rgba(245,158,11,0.10)"  },
  info:    { color: "#3B82F6", bg: "rgba(59,130,246,0.10)"  },
};

// ---- FRAMER MOTION VARIANTS ------------------------------------------------
// Defines reusable animation states for card entrance and hover.

// containerVariants: orchestrates stagger across child cards.
// staggerChildren: each child starts animating 0.1s after the previous one.
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// cardVariants: individual card entrance animation (fades + slides up).
const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ---- COMPONENT -------------------------------------------------------------
export default function DashboardHome() {
  return (
    /*
     * space-y-10: 40px gap between the welcome section and the card grid.
     * pt-2: small top nudge so content doesn't feel cramped under the header.
     */
    <div className="space-y-10 pt-2">

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1: WELCOME HEADER                                           */}
      {/* ------------------------------------------------------------------ */}
      {/*
       * DESIGN DECISION: No more dark navy banner card.
       * The welcome section now sits directly on the ivory (#FAFAFA) background.
       * This removes visual heaviness and lets the page breathe.
       *
       * Structure: Two-column flex row.
       *   LEFT  -> greeting text + health status line
       *   RIGHT -> "All systems active" badge + sparkle icon
       */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        {/* LEFT: Greeting text */}
        <div>
          {/*
           * Welcome back label:
           *  - text-slate-400: muted secondary text, not loud
           *  - text-sm: small and unobtrusive
           *  - flex items-center gap-2: the wave emoji sits beside the text
           */}
          <p className="text-slate-400 text-sm font-medium">
            Welcome back
          </p>

          {/*
           * Name heading:
           *  - text-[#0F172A]: Deep Navy - maximum contrast on ivory background
           *  - text-3xl font-bold: large and commanding
           *  - font-jakarta: our premium Plus Jakarta Sans heading font
           *  - mt-1: small gap below "Welcome back"
           */}
          <h2
            className="text-[#0F172A] text-3xl font-bold mt-1 tracking-tight"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Om Singh
          </h2>

          {/*
           * Compliance health line:
           *  - text-slate-500: secondary, not competing with the name
           *  - The emerald span stands out as an accent inline within the text
           *  - font-semibold on the percentage makes it scannable at a glance
           */}
          <p className="text-slate-500 text-sm mt-1.5">
            Your NGO compliance health is{" "}
            <span className="text-[#10B981] font-semibold">
              94% - Good Standing
            </span>
          </p>
        </div>

        {/* RIGHT: Status badge + icon */}
        {/*
         * "All systems active" pill badge:
         *  - border border-[#10B981]/25: very subtle emerald border
         *  - bg-white: white fill so it lifts off the ivory bg slightly
         *  - shadow-sm: tiny shadow for a floating card feel
         *  - rounded-2xl: softly rounded pill/card hybrid shape
         *  - px-5 py-3: generous padding for a premium feel
         */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center gap-3 bg-white border border-[#10B981]/25 shadow-sm rounded-2xl px-5 py-3"
        >
          {/*
           * Sparkles icon: represents "AI / live" status, more premium
           * than a plain CheckCircle - visually matches the NGO AI OS brand.
           */}
          <Sparkles className="w-4 h-4 text-[#10B981]" />

          <div>
            <p className="text-[#0F172A] text-sm font-semibold leading-none">
              All systems active
            </p>
            <p className="text-slate-400 text-xs mt-0.5">Live data sync on</p>
          </div>

          {/*
           * Live indicator dot (same sonar-ping trick from the header):
           *  relative flex + animate-ping inner span = pulsing radar dot
           */}
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
        </motion.div>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2: TELEMETRY GRID CARDS (combined stats + module cards)     */}
      {/* ------------------------------------------------------------------ */}
      {/*
       * Section header: "Overview" label above the 3-card grid.
       * Keeps it clear that this is the at-a-glance data layer.
       */}
      <div>
        <p className="text-slate-400 text-[11px] uppercase tracking-widest font-semibold mb-4">
          Overview
        </p>

        {/*
         * motion.div with containerVariants:
         *  - initial="hidden" / animate="visible": triggers the stagger chain
         *  - grid grid-cols-3 gap-5: 3-column responsive grid, 20px gaps
         *
         * Each child card uses cardVariants and staggerChildren (0.1s apart)
         * so they cascade in from left to right beautifully.
         */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-5"
        >
          {TELEMETRY_CARDS.map((card) => {
            // Destructure the component type from card.icon (capital I = React component)
            const Icon = card.icon;
            const TrendIcon = card.trendIcon;

            // Look up badge colors using the badgeType key
            const badge = BADGE_STYLES[card.badgeType];

            return (
              // motion.div with cardVariants handles the entrance animation.
              // key={card.href}: unique key for React list reconciliation.
              // whileHover: Framer Motion prop applied when element is hovered.
              //  - y: -4 lifts the card 4px upward (subtle float effect)
              //  - boxShadow: adds a soft accent glow ring around the card border
              // transition: spring physics for the lift
              //  - type: "spring" = realistic bounce instead of linear easing
              //  - stiffness: 300 = snappy but not jarring
              //  - damping: 20 = controls how quickly the bounce settles
              <motion.div
                key={card.href}
                variants={cardVariants}
                whileHover={{
                  y: -4,
                  boxShadow: `0 12px 40px -8px ${card.accent}30, 0 0 0 1px ${card.accent}25`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/*
                 * Next.js Link wraps the entire card, making it fully clickable.
                 * block: makes it fill the motion.div (which fills the grid cell).
                 * group: Tailwind group - child elements can react to hover via group-hover:
                 *
                 * Base card style:
                 *  bg-white              - white card surface on ivory background
                 *  rounded-2xl           - 16px rounded corners (modern card style)
                 *  p-6                   - 24px padding, generous breathing room
                 *  border border-slate-100 - barely-visible border at rest
                 *  shadow-sm             - minimal shadow, lifts on hover via whileHover
                 *  transition-colors     - smooth border color transition on hover
                 *  overflow-hidden       - clips the decorative corner blob inside
                 *  relative              - positioning context for the decorative blob
                 */}
                <Link
                  href={card.href}
                  className="block bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-colors overflow-hidden relative group"
                >
                  {/*
                   * DECORATIVE CORNER ACCENT:
                   * A large, blurred, low-opacity circle placed at the top-right
                   * corner of each card. Uses the card's accent color.
                   * -right-8 -top-8: partially outside the card (clipped by overflow-hidden)
                   * blur-3xl: very heavy blur, making it a soft ambient glow patch
                   * opacity-0 group-hover:opacity-100: invisible at rest, fades in on hover
                   * pointer-events-none: doesn't interfere with click events
                   */}
                  <div
                    className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: `${card.accent}18` }}
                  />

                  {/* TOP ROW: Icon badge (left) + Trend icon (right) */}
                  <div className="flex items-start justify-between mb-5">
                    {/*
                     * Module icon badge:
                     *  w-10 h-10: 40px square container
                     *  rounded-xl: 12px rounded corners
                     *  backgroundColor: card's accent color at 12% opacity
                     *  Icon inside uses the full accent color
                     */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${card.accent}18` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: card.accent }} />
                    </div>

                    {/*
                     * Trend icon (top-right corner of the card):
                     *  TrendIcon is a Lucide icon component (TrendingUp or AlertTriangle)
                     *  w-4 h-4: small, 16px
                     *  opacity-50: subtle, doesn't compete with the metric
                     */}
                    <TrendIcon
                      className="w-4 h-4 opacity-50"
                      style={{ color: card.trendColor }}
                    />
                  </div>

                  {/* METRIC BLOCK: Hero number + context */}
                  {/*
                   * The large metric number is the visual anchor of each card.
                   * text-4xl font-bold: very large, bold, commanding
                   * tracking-tight: tightened letter spacing looks more premium
                   * text-[#0F172A]: deep navy for max contrast on white card bg
                   */}
                  <p
                    className="text-4xl font-bold text-[#0F172A] tracking-tight"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    {card.metric}
                  </p>

                  {/*
                   * Metric context (e.g. "+23 this month", "FCRA due in 12 days"):
                   *  text-xs: small supporting text
                   *  mt-1: tight to the metric
                   *  font-medium: slightly heavier than regular for readability
                   *  Using the accent color to tie this text to the card's theme
                   */}
                  <p
                    className="text-xs font-medium mt-1"
                    style={{ color: card.accent }}
                  >
                    {card.metricContext}
                  </p>

                  {/* DIVIDER: thin horizontal rule between metric and bottom section */}
                  <div className="border-t border-slate-100 my-4" />

                  {/* BOTTOM SECTION: Title + description + badge + arrow */}
                  <div>
                    {/*
                     * Module title:
                     *  text-sm font-bold: medium size, strong weight
                     *  text-[#0F172A]: navy for strong readability
                     */}
                    <p
                      className="text-sm font-bold text-[#0F172A]"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {card.title}
                    </p>

                    {/*
                     * Description label:
                     *  text-xs: secondary, small
                     *  text-slate-400: muted, doesn't compete with title
                     *  mt-0.5: very tight to title (they form one visual unit)
                     *  leading-relaxed: slightly open line-height for readability
                     */}
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {card.description}
                    </p>

                    {/* STATUS BADGE + ARROW ROW */}
                    {/*
                     * justify-between: badge on the left, arrow on the right
                     * items-center: vertically align both to the center
                     * mt-3: a bit of space above this row
                     */}
                    <div className="flex items-center justify-between mt-3">
                      {/*
                       * Status badge pill:
                       *  px-2.5 py-1: small pill padding
                       *  rounded-full: full pill shape
                       *  text-[11px]: very small text (11px) for the badge
                       *  font-semibold: heavier weight keeps it readable at small size
                       *  inline style used for accent-specific colors (can't use Tailwind
                       *    arbitrary colors on dynamically derived values at runtime)
                       */}
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          color: badge.color,
                          backgroundColor: badge.bg,
                        }}
                      >
                        {card.badge}
                      </span>

                      {/*
                       * Arrow icon (right side):
                       *  Starts as text-slate-300 (barely visible at rest).
                       *  group-hover:text-slate-600: darkens when card is hovered.
                       *  group-hover:translate-x-1: nudges right on hover - a common
                       *    "go here" micro-interaction that signals this is clickable.
                       *  transition-all duration-200: fast, snappy animation.
                       */}
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

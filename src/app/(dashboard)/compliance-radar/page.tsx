"use client";

/**
 * COMPLIANCE RADAR WORKSPACE — TrustSaathi
 * ─────────────────────────────────────────────────────────────────
 * Route: /compliance-radar
 *
 * Three interactive tracking widgets in a responsive grid:
 *
 *  Card 1 — FCRA Foreign Funding Monitor
 *    SVG circular progress ring at 85% with animated stroke-dashoffset.
 *    Amber alert banner with pulse animation near statutory threshold.
 *
 *  Card 2 — Section 115BBC Anonymous Donation Tracker
 *    Split balance display for Gupt Daan (anonymous donations).
 *    Left: Purely Religious (tax-exempt).
 *    Right: Charitable (subject to 5% cap) with a warning gauge at 4.7%.
 *
 *  Card 3 — Section 80G Cash Violation Filter
 *    Mini transaction flag list scanning for cash donations > ₹2,000 limit.
 *    Flagged row in soft red with "Action" chip.
 *
 * Animation strategy:
 *  - Cards stagger in on mount (Framer Motion containerVariants)
 *  - SVG ring animates from 0 → 85% on mount (spring physics)
 *  - Numeric counters count up from 0 using useEffect + requestAnimationFrame
 *  - Gauge bar slides in from left (width 0 → target%)
 *  - Flagged rows flash in with a red shimmer on first render
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  AlertTriangle,
  Landmark,
  Flag,
  CheckCircle2,
  XCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────
const FCRA_RECEIVED  = 1700000;  // ₹17,00,000 received
const FCRA_THRESHOLD = 2000000;  // ₹20,00,000 statutory threshold
const FCRA_PCT       = Math.round((FCRA_RECEIVED / FCRA_THRESHOLD) * 100); // 85

// Section 115BBC amounts
const RELIGIOUS_GUPT_DAAN  = 342000;  // purely religious box (exempt)
const CHARITABLE_GUPT_DAAN = 58000;   // charitable box (taxable above 5%)
const TOTAL_INCOME         = 1234000; // total organisational income
const GUPT_DAAN_PCT        = parseFloat(((CHARITABLE_GUPT_DAAN / TOTAL_INCOME) * 100).toFixed(1)); // 4.7%
const CAP_LIMIT_PCT        = 5;       // 5% cap; above this = 30% flat tax

// 80G flagged transactions
const FLAGGED_TRANSACTIONS = [
  {
    id: 1,
    donor:  "Anonymous Donor",
    amount: 5000,
    mode:   "Cash",
    status: "flagged",
    action: "Flagged for splitting or digital re-routing",
  },
  {
    id: 2,
    donor:  "Ramesh Prasad",
    amount: 2500,
    mode:   "Cash",
    status: "flagged",
    action: "Exceeds ₹2,000 cash limit — convert to UPI",
  },
  {
    id: 3,
    donor:  "Sunita Kumari",
    amount: 1500,
    mode:   "Cash",
    status: "clear",
    action: "Compliant — within ₹2,000 limit",
  },
  {
    id: 4,
    donor:  "Mandir Trust Fund",
    amount: 8000,
    mode:   "Cash",
    status: "flagged",
    action: "High-value anonymous cash — requires Form 10BD",
  },
];

// ─────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────

// Parent: staggers its children in sequence
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.05 },
  },
};

// Each card slides up from y:24 while fading in
const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Flagged row: slides in from left
const rowVariants = {
  hidden:  { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ─────────────────────────────────────────────────────────────────
// HELPER: Format number as Indian Rupee string
// 1700000 → "₹17,00,000"
// ─────────────────────────────────────────────────────────────────
const formatRupee = (n: number) => "₹" + n.toLocaleString("en-IN");

// ─────────────────────────────────────────────────────────────────
// HOOK: useCountUp
// Animates a number from 0 to `target` over `duration` ms.
// Uses requestAnimationFrame for smooth 60fps counting.
// Returns the current display value as a number.
// ─────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1500, startOnMount = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!startOnMount) return;

    let startTime: number | null = null;
    const startValue = 0;

    // requestAnimationFrame callback — called ~60 times per second
    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      // progress: 0.0 → 1.0 over `duration` milliseconds
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOut: slows down as it approaches the target
      // Math.sin with PI/2 maps 0→1 into a smooth easing curve
      const eased = Math.sin(progress * Math.PI * 0.5);
      setValue(Math.round(startValue + (target - startValue) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }

    // Small delay so card entrance animation finishes first
    const timer = setTimeout(() => requestAnimationFrame(step), 400);
    return () => clearTimeout(timer);
  }, [target, duration, startOnMount]);

  return value;
}

// ─────────────────────────────────────────────────────────────────
// HOOK: useSVGProgress
// Returns an animated stroke-dashoffset value for SVG circular rings.
// `circumference` = total perimeter of the circle (2πr)
// dashoffset = how much of the ring is "hidden" (undrawn)
// 0 offset = fully drawn; circumference = hidden (empty)
// ─────────────────────────────────────────────────────────────────
function useSVGProgress(targetPct: number, circumference: number, delay = 600) {
  const [offset, setOffset] = useState(circumference); // start empty

  useEffect(() => {
    // Calculate the offset for the target percentage
    const targetOffset = circumference - (targetPct / 100) * circumference;
    const timer = setTimeout(() => {
      setOffset(targetOffset);
    }, delay);
    return () => clearTimeout(timer);
  }, [targetPct, circumference, delay]);

  return offset;
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SectionLabel
// A small decorative label used as a card section header.
// ─────────────────────────────────────────────────────────────────
function SectionLabel({ children, color = "emerald" }: { children: React.ReactNode; color?: string }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-200",
    amber:   "text-amber-700 bg-amber-50 border-amber-200",
    red:     "text-red-700 bg-red-50 border-red-200",
    violet:  "text-violet-700 bg-violet-50 border-violet-200",
    sky:     "text-sky-700 bg-sky-50 border-sky-200",
  };
  return (
    <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border " + (colorMap[color] || colorMap.emerald)}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// CARD 1: FCRA Foreign Funding Monitor
//
// SVG circular progress ring technique:
//   - <circle> with r=54, so circumference = 2 * π * 54 ≈ 339.3
//   - stroke-dasharray = circumference (defines the dash pattern length)
//   - stroke-dashoffset = how much is offset (hidden) from the start
//     0 → full ring drawn, circumference → ring completely hidden
//   - We animate dashoffset from circumference → target offset using CSS transition
// ─────────────────────────────────────────────────────────────────
function FCRACard() {
  const r = 54;                                // circle radius in SVG units
  const cx = 68;                               // center x
  const cy = 68;                               // center y
  const circumference = 2 * Math.PI * r;       // 339.29...
  const offset = useSVGProgress(FCRA_PCT, circumference, 700);
  const countedPct = useCountUp(FCRA_PCT, 1200);

  // Colour changes to amber when above 75%
  const isWarning = FCRA_PCT >= 75;

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
    >
      {/* ── Card header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <SectionLabel color="sky">FCRA Compliance</SectionLabel>
          </div>
          <h3
            className="text-base font-extrabold text-[#0F172A] leading-snug"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Foreign Funding Monitor
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">Foreign Contribution (Regulation) Act, 2010</p>
        </div>
        {/* Status chip */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider shrink-0">
          <AlertTriangle className="w-3 h-3" />
          Near Limit
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="px-6 py-5 flex flex-col gap-5 flex-1">

        {/* Circular progress ring + center text */}
        <div className="flex items-center gap-6">
          {/*
            SVG viewBox: 0 0 136 136 (diameter is 136 = 2*(cx+r padding))
            The ring is drawn as two overlapping circles:
              1. Track circle (slate-100): always full, shows the "empty" path
              2. Progress circle (color): animated via stroke-dashoffset
          */}
          <div className="relative shrink-0">
            <svg width={136} height={136} viewBox="0 0 136 136">
              {/* Track ring — always shows full circle as background */}
              <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke="#F1F5F9"
                strokeWidth={12}
              />
              {/*
                Progress ring — animated.
                rotate(-90deg) around center so 0% starts at the top (12 o'clock).
                Without rotation, SVG draws starting from 3 o'clock (right).
                transition: CSS transition on stroke-dashoffset for smooth animation.
              */}
              <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={isWarning ? "#F59E0B" : "#10B981"}
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: "stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              />
              {/* Glow dot at the progress tip */}
              {/* Center text: animated percentage */}
              <text
                x={cx} y={cy - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-extrabold"
                style={{ fontSize: 26, fontFamily: "var(--font-jakarta)", fontWeight: 800, fill: isWarning ? "#D97706" : "#0F172A" }}
              >
                {countedPct}%
              </text>
              <text
                x={cx} y={cy + 16}
                textAnchor="middle"
                style={{ fontSize: 9.5, fontFamily: "var(--font-inter)", fill: "#94A3B8", fontWeight: 600 }}
              >
                OF THRESHOLD
              </text>
            </svg>
          </div>

          {/* Metric details to the right of the ring */}
          <div className="flex flex-col gap-3 flex-1">
            <div>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Foreign Capital Received</p>
              <p
                className="text-xl font-extrabold text-[#0F172A] mt-0.5"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {formatRupee(FCRA_RECEIVED)}
              </p>
            </div>
            {/* Divider */}
            <div className="w-full h-px bg-slate-100" />
            <div>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Statutory Threshold</p>
              <p className="text-lg font-bold text-[#475569] mt-0.5">{formatRupee(FCRA_THRESHOLD)}</p>
            </div>
            {/* Remaining headroom */}
            <div className="flex items-center gap-1.5 mt-auto">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: FCRA_PCT + "%" }}
                  transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.8 }}
                />
              </div>
              <span className="text-[10px] font-bold text-amber-600">{formatRupee(FCRA_THRESHOLD - FCRA_RECEIVED)} left</span>
            </div>
          </div>
        </div>

        {/* ── Amber warning banner ── */}
        {/*
          The pulsing border is achieved by:
          - animate-pulse on the left border accent div
          - The whole alert uses amber colour tokens
        */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="relative flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 overflow-hidden"
        >
          {/* Pulsing left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 animate-pulse rounded-l-xl" />
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">
              Alert: Nearing 12A Revision Limits
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
              Next compliance assessment required within{" "}
              <span className="font-bold underline decoration-dashed">14 days</span>.
              Foreign receipts at 85% of FCRA threshold. Schedule CA review now.
            </p>
          </div>
        </motion.div>

        {/* Quick action row */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#94A3B8]">Last sync: Today, 4:12 PM</span>
          <button className="flex items-center gap-1 text-[#10B981] font-semibold hover:text-[#059669] transition-colors">
            View FC-4 Filing <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CARD 2: Section 115BBC Anonymous Donation Tracker
//
// "Gupt Daan" = anonymous/secret donation in Hindu temple tradition.
// Under Section 115BBC:
//   - Anonymous donations to purely religious trusts: TAX EXEMPT
//   - Anonymous donations to charitable trusts: taxed at 30% FLAT
//     if they exceed 5% of total receipts OR ₹1 lakh (whichever is higher)
//
// This card shows a split display + a warning gauge nearing the 5% cap.
// ─────────────────────────────────────────────────────────────────
function Sec115BBCCard() {
  // Count-up animations for both box amounts
  const religiousCount = useCountUp(RELIGIOUS_GUPT_DAAN, 1400);
  const charitableCount = useCountUp(CHARITABLE_GUPT_DAAN, 1200);

  // Animate the gauge bar for charitable %
  // We clamp max at 100% so it never overflows visually
  const gaugeWidth = Math.min((GUPT_DAAN_PCT / CAP_LIMIT_PCT) * 100, 100);

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
    >
      {/* ── Card header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-violet-600" />
            </div>
            <SectionLabel color="violet">Sec. 115BBC</SectionLabel>
          </div>
          <h3
            className="text-base font-extrabold text-[#0F172A] leading-snug"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Anonymous Donation Tracker
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">Gupt Daan — Mandir Feature</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-bold uppercase tracking-wider shrink-0">
          <Info className="w-3 h-3" />
          Active Scan
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="px-6 py-5 flex flex-col gap-5 flex-1">

        {/* Split balance display */}
        {/*
          Two side-by-side "boxes" represent the two types of anonymous donation:
          Left  = Purely Religious (tax-exempt under 115BBC)
          Right = Charitable (subject to the 5% cap rule)
          They use a dotted vertical separator line between them.
        */}
        <div className="grid grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-slate-200">
          {/* Left: Purely Religious Box (EXEMPT) */}
          <div className="p-4 bg-emerald-50/60 border-r border-dashed border-slate-300 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider leading-tight">
                Purely Religious Box
              </span>
            </div>
            <p className="text-[10px] text-emerald-600 leading-tight">
              Tax-Exempt Cash
            </p>
            {/* Animated count-up rupee amount */}
            <p
              className="text-xl font-extrabold text-emerald-700 leading-none"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {formatRupee(religiousCount)}
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold border border-emerald-200 w-fit">
              <CheckCircle2 className="w-2.5 h-2.5" /> Sec 115BBC(2) Exempt
            </span>
          </div>

          {/* Right: Charitable Cash Box (TAXABLE if > 5%) */}
          <div className="p-4 bg-amber-50/50 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider leading-tight">
                Charitable Cash Box
              </span>
            </div>
            <p className="text-[10px] text-amber-600 leading-tight">
              Subject to 5% Cap
            </p>
            <p
              className="text-xl font-extrabold text-amber-700 leading-none"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {formatRupee(charitableCount)}
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-bold border border-red-200 w-fit">
              <AlertTriangle className="w-2.5 h-2.5" /> 30% Flat Tax If Breached
            </span>
          </div>
        </div>

        {/* Warning gauge: charitable donations as % of total income */}
        {/*
          This is the critical indicator — if the charitable anonymous
          donations exceed 5% of total income, the entire amount
          gets taxed at 30% flat rate (the "tax trap").
          At 4.7% we are dangerously close.
        */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#0F172A]">
                Charitable Gupt Daan vs. Total Income
              </p>
              <p className="text-[10px] text-[#64748B]">
                30% Flat Tax Trap activates above{" "}
                <span className="font-bold text-red-600">{CAP_LIMIT_PCT}%</span>
              </p>
            </div>
            {/* Warning pill — flashes because it's near the edge */}
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold shrink-0"
            >
              <AlertTriangle className="w-3 h-3" />
              {GUPT_DAAN_PCT}% — Near Edge!
            </motion.span>
          </div>

          {/* Gauge track */}
          <div className="relative h-4 rounded-full bg-slate-100 overflow-hidden">
            {/*
              The gauge bar fills from left to right.
              gaugeWidth = (4.7/5) * 100 = 94% — very close to the red zone.
              The bar is amber; the danger zone (beyond 5%) would be red.
            */}
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: gaugeWidth + "%" }}
              transition={{ duration: 1.3, ease: [0.34, 1.56, 0.64, 1], delay: 0.7 }}
            />
            {/*
              The 100% marker shows where the 5% cap line is.
              Since our gauge maps 0-5% to 0-100% width, the full width = the cap.
            */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-red-400" />
          </div>

          {/* Gauge labels */}
          <div className="flex items-center justify-between text-[10px] font-medium text-[#94A3B8]">
            <span>0%</span>
            <span className="text-amber-600 font-bold">{GUPT_DAAN_PCT}% now</span>
            <span className="text-red-600 font-bold">5% cap</span>
          </div>
        </div>

        {/* Total income context */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5">
          <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Total Org. Income</div>
          <div
            className="text-sm font-extrabold text-[#0F172A]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {formatRupee(TOTAL_INCOME)}
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex gap-3 rounded-xl border border-violet-200 bg-violet-50 p-3.5">
          <Info className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-violet-800 leading-relaxed">
            <span className="font-bold">Recommendation:</span> Reduce charitable anonymous cash receipts by{" "}
            <span className="font-bold">{formatRupee(CHARITABLE_GUPT_DAAN - Math.floor((CAP_LIMIT_PCT / 100) * TOTAL_INCOME * 0.95))}</span>{" "}
            to stay safely below the 5% threshold and avoid the 30% flat tax trap.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CARD 3: Section 80G Cash Violation Filter
//
// Under Section 80G, a donor can only claim tax deduction if their
// cash donation is BELOW ₹2,000. Donations ≥ ₹2,000 must be via
// non-cash (UPI, cheque, NEFT, etc.) for the receipt to be valid.
//
// This card shows a mini transaction scanner that flags violations.
// ─────────────────────────────────────────────────────────────────
function Sec80GCard() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Counts for the stats row
  const flaggedCount = FLAGGED_TRANSACTIONS.filter(t => t.status === "flagged").length;
  const clearCount   = FLAGGED_TRANSACTIONS.filter(t => t.status === "clear").length;

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
    >
      {/* ── Card header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <Flag className="w-4 h-4 text-red-500" />
            </div>
            <SectionLabel color="red">Sec. 80G</SectionLabel>
          </div>
          <h3
            className="text-base font-extrabold text-[#0F172A] leading-snug"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Cash Violation Filter
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Scanning for donations above the{" "}
            <span className="font-bold text-red-600">{formatRupee(2000)}</span> cash threshold
          </p>
        </div>
        {/* Flagged count badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider shrink-0">
          <XCircle className="w-3 h-3" />
          {flaggedCount} Flagged
        </span>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 border-b border-slate-100">
        {[
          { label: "Scanned", value: FLAGGED_TRANSACTIONS.length, color: "text-[#0F172A]",    bg: "bg-slate-50" },
          { label: "Flagged", value: flaggedCount,                color: "text-red-600",      bg: "bg-red-50/50" },
          { label: "Clear",   value: clearCount,                  color: "text-emerald-600",  bg: "bg-emerald-50/50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={"flex flex-col items-center py-3 " + bg + " border-r border-slate-100 last:border-r-0"}>
            <span className={"text-xl font-extrabold " + color} style={{ fontFamily: "var(--font-jakarta)" }}>
              {value}
            </span>
            <span className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Transaction list ── */}
      <div className="flex flex-col divide-y divide-slate-50 flex-1">
        {/*
          containerVariants staggers each row in sequentially.
          key="txn-list" ensures the animation plays on mount.
        */}
        <motion.div
          key="txn-list"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
          initial="hidden"
          animate="visible"
        >
          {FLAGGED_TRANSACTIONS.map((txn) => {
            const isFlagged   = txn.status === "flagged";
            const isExpanded  = expandedId === txn.id;

            return (
              /*
                Each row is clickable — clicking toggles the expanded "action" panel.
                isFlagged rows have a soft red tint; clear rows are neutral.
              */
              <motion.div
                key={txn.id}
                variants={rowVariants}
                className={"cursor-pointer transition-colors duration-150 " +
                  (isFlagged
                    ? "bg-red-50/30 hover:bg-red-50/60"
                    : "bg-white hover:bg-slate-50")
                }
                onClick={() => setExpandedId(isExpanded ? null : txn.id)}
              >
                <div className="px-5 py-3.5 flex items-center gap-3">
                  {/* Status icon */}
                  {isFlagged
                    ? <XCircle    className="w-4 h-4 text-red-500 shrink-0" />
                    : <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  }

                  {/* Donor name */}
                  <div className="flex-1 min-w-0">
                    <p className={"text-sm font-semibold truncate " + (isFlagged ? "text-red-700" : "text-[#0F172A]")}>
                      {txn.donor}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {/* Mode tag */}
                      <span className={"text-[10px] font-bold px-1.5 py-0.5 rounded " +
                        (txn.mode === "Cash"
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600")
                      }>
                        {txn.mode}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">Click to see action</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <span className={"text-sm font-extrabold font-mono " + (isFlagged ? "text-red-600" : "text-emerald-600")}>
                    {formatRupee(txn.amount)}
                  </span>

                  {/* Flagged chip */}
                  {isFlagged && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-600 text-[9px] font-bold uppercase shrink-0">
                      <Flag className="w-2.5 h-2.5" /> Flagged
                    </span>
                  )}
                </div>

                {/* Expanded action panel — slides down when clicked */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key={"action-" + txn.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className={"px-5 pb-3.5 pt-1 " + (isFlagged ? "bg-red-50/40" : "bg-emerald-50/40")}>
                        <div className={"flex items-start gap-2 rounded-xl p-3 border " +
                          (isFlagged
                            ? "border-red-200 bg-red-50"
                            : "border-emerald-200 bg-emerald-50")
                        }>
                          <Info className={"w-3.5 h-3.5 shrink-0 mt-0.5 " + (isFlagged ? "text-red-500" : "text-emerald-600")} />
                          <p className={"text-[11px] leading-relaxed font-medium " + (isFlagged ? "text-red-700" : "text-emerald-700")}>
                            <span className="font-bold">Action: </span>{txn.action}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <p className="text-[10px] text-[#94A3B8]">
          Threshold: <span className="font-bold text-[#475569]">{formatRupee(2000)}</span> per Section 80G(5D)
        </p>
        <button className="flex items-center gap-1 text-[11px] text-[#10B981] font-semibold hover:text-[#059669] transition-colors">
          Generate Report <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}



// ─────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function ComplianceRadarPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* ════════════════════════════════════════════════════════
          STICKY HEADER
      ════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-[#10B981] rounded-lg flex items-center justify-center shadow shadow-emerald-200">
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span
              className="text-base font-bold text-[#0F172A] tracking-tight"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Trust<span className="text-[#10B981]">Saathi</span>
            </span>
          </Link>

          {/* Page title */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
              <span className="text-white text-[10px]">&#9679;</span>
            </div>
            <h1
              className="text-sm font-semibold text-[#0F172A]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Compliance Radar
            </h1>
          </div>

          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#64748B]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Live Compliance Scan</span>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">

        {/* ── Page heading ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-3">
            <Link href="/" className="hover:text-[#10B981] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#0F172A] font-medium">Compliance Radar</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2
                className="text-3xl font-extrabold text-[#0F172A] leading-tight"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Compliance Radar
                <span className="text-[#10B981]"> Workspace</span>
              </h2>
              <p className="text-sm text-[#64748B] mt-1.5 max-w-xl">
                Real-time monitoring of FCRA thresholds, anonymous donation limits, and 80G cash violations
                — all in one view. Built for India&#39;s 30 lakh Trusts &amp; NGOs.
              </p>
            </div>

            {/* Compliance score pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm shrink-0"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-amber-500" style={{ fontFamily: "var(--font-jakarta)" }}>72</span>
                <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Score</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-xs font-bold text-[#0F172A]">Compliance Score</p>
                <p className="text-[10px] text-amber-600 font-semibold">Moderate Risk · Action Required</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── 3-column card grid ── */}
        {/*
          grid-cols-1: single column on mobile
          lg:grid-cols-3: three equal columns on large screens
          items-stretch: cards stretch to equal height in each row
        */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
        >
          <FCRACard />
          <Sec115BBCCard />
          <Sec80GCard />
        </motion.div>

        {/* ── Bottom notice ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#94A3B8]"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>
            Compliance data refreshed daily. Not a substitute for professional CA / legal advice.
          </span>
        </motion.div>
      </main>
    </div>
  );
}

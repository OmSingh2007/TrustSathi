"use client";

/**
 * GOVERNMENT FILINGS PORTAL — TrustSaathi
 * ─────────────────────────────────────────────────────────────────
 * Route: /filings
 *
 * Sections:
 *  1. Sticky glassmorphism header with logo + live badge
 *  2. Page hero: "Tax Compliance & Statutory Filing" heading,
 *     "FY 2025-26 | Current Assessment Period" subtitle, compliance score
 *  3. Summary stat strip (Active Forms, Due Soon, Compliant, Archived)
 *  4. Active Forms Grid — 3 cards:
 *       Card A: Form 10BD  → "Ready to Compile" → Generate CSV button
 *       Card B: Form 10A / 12A Renewal → "Compliant"
 *       Card C: FC-3 Return (FCRA) → "Drafting"
 *  5. CSV-generation interaction:
 *       Click → loading spinner + "Validating Schema..."
 *       After 2.4s → slide-in success toast with download link
 *  6. Filing Calendar sidebar strip
 *  7. Recent Submissions log table
 *
 * Design language:
 *  - Off-white #FAFAFA background
 *  - Deep Navy #0F172A text
 *  - Emerald #10B981 accent
 *  - Framer Motion: card stagger, toast slide-in, progress fills
 *  - Premium enterprise fintech typography and spacing
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  ChevronRight,
  X,
  Calendar,
  BarChart3,
  Zap,
  FileCheck2,
  Globe,
  ArrowUpRight,
  Sparkles,
  Lock,
  Info,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

// The three possible status states a filing card can be in
type FilingStatus = "ready" | "compliant" | "drafting" | "overdue" | "submitted";

// Represents one row in the recent submissions log
interface Submission {
  id: string;
  form: string;
  period: string;
  submittedOn: string;
  ackNo: string;
  status: "Accepted" | "Processing" | "Rejected";
}

// ─────────────────────────────────────────────────────────────────
// STATIC DATA — Recent Submission Log
// ─────────────────────────────────────────────────────────────────
const SUBMISSIONS: Submission[] = [
  { id: "1", form: "Form 10BD",     period: "FY 2024-25", submittedOn: "31 May 2025", ackNo: "ITD-10BD-2025-00482", status: "Accepted"   },
  { id: "2", form: "Form 9A",       period: "FY 2024-25", submittedOn: "15 Apr 2025", ackNo: "ITD-9A-2025-00291",  status: "Accepted"   },
  { id: "3", form: "Form 10",       period: "FY 2024-25", submittedOn: "02 Apr 2025", ackNo: "ITD-10-2025-00104",  status: "Accepted"   },
  { id: "4", form: "FC-4 (FCRA)",   period: "FY 2024-25", submittedOn: "28 Dec 2024", ackNo: "FCRA-FC4-2024-87321", status: "Accepted"  },
  { id: "5", form: "Form 10A",      period: "AY 2022-23", submittedOn: "10 Mar 2023", ackNo: "ITD-10A-2023-00551", status: "Accepted"   },
];

// ─────────────────────────────────────────────────────────────────
// STATIC DATA — Upcoming Filing Deadlines
// ─────────────────────────────────────────────────────────────────
const DEADLINES = [
  { form: "Form 10BD",     due: "31 May 2026",  daysLeft: 338, urgency: "normal"  },
  { form: "FC-3 (FCRA)",   due: "31 Dec 2025",  daysLeft: 187, urgency: "normal"  },
  { form: "Form 9A / 10",  due: "30 Sep 2025",  daysLeft: 95,  urgency: "caution" },
  { form: "IT Return",     due: "31 Oct 2025",  daysLeft: 126, urgency: "normal"  },
];

// ─────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const toastVariants = {
  // Toast slides in from the right side of the screen
  hidden:  { opacity: 0, x: 80, scale: 0.95 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 28 },
  },
  exit:    { opacity: 0, x: 80, transition: { duration: 0.2 } },
};

// ─────────────────────────────────────────────────────────────────
// HELPER: StatusBadge
// Renders a crisp pill badge for a filing status.
// Each status has its own color palette.
// ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: FilingStatus }) {
  const map: Record<FilingStatus, { label: string; cls: string; icon: React.ReactNode }> = {
    ready:     { label: "Ready to Compile",  cls: "bg-amber-50 text-amber-700 border-amber-200",    icon: <Zap          className="w-3 h-3" /> },
    compliant: { label: "Compliant",         cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
    drafting:  { label: "Drafting",          cls: "bg-slate-100 text-slate-600 border-slate-200",   icon: <FileText     className="w-3 h-3" /> },
    overdue:   { label: "Overdue",           cls: "bg-red-50 text-red-600 border-red-200",          icon: <AlertTriangle className="w-3 h-3" /> },
    submitted: { label: "Submitted",         cls: "bg-blue-50 text-blue-700 border-blue-200",       icon: <FileCheck2   className="w-3 h-3" /> },
  };
  const { label, cls, icon } = map[status];
  return (
    <span className={"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border " + cls}>
      {icon}{label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SuccessToast
// Slides in from the right after CSV generation completes.
// Renders an animated checkmark ring, success message, and download link.
// Auto-dismisses after 7 seconds; also has a manual X close button.
// ─────────────────────────────────────────────────────────────────
function SuccessToast({ onClose }: { onClose: () => void }) {
  // Auto-dismiss after 7 seconds
  useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="
        fixed bottom-6 right-6 z-50
        w-[420px] max-w-[calc(100vw-3rem)]
        bg-white rounded-2xl
        border border-emerald-200
        shadow-2xl shadow-emerald-100/40
        overflow-hidden
      "
    >
      {/* Top progress bar — animates from 0 to 100% over 7 seconds matching auto-dismiss */}
      <motion.div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-2xl"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 7, ease: "linear" }}
      />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Animated success checkmark ring */}
          <div className="shrink-0 mt-0.5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.25 }}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </motion.div>
            </motion.div>
          </div>

          {/* Toast content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p
                className="text-sm font-extrabold text-[#0F172A]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Form 10BD CSV Generated
              </p>
              <button
                onClick={onClose}
                className="shrink-0 w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-[#475569] mt-1 leading-relaxed">
              Generated exactly to{" "}
              <span className="font-semibold text-[#0F172A]">
                Income Tax Department schema specifications.
              </span>{" "}
              <span className="text-emerald-600 font-bold">0 data validation errors</span> found.
            </p>

            {/* Validation summary chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { label: "142 Records",   color: "bg-slate-100 text-slate-600" },
                { label: "Schema v2.1",   color: "bg-blue-50 text-blue-700"    },
                { label: "0 Errors",      color: "bg-emerald-50 text-emerald-700" },
                { label: "PAN Verified",  color: "bg-violet-50 text-violet-700" },
              ].map(({ label, color }) => (
                <span key={label} className={"px-2 py-0.5 rounded-full text-[10px] font-bold " + color}>
                  {label}
                </span>
              ))}
            </div>

            {/* Download button */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                inline-flex items-center gap-2 mt-4
                px-4 py-2 rounded-xl
                bg-[#10B981] hover:bg-[#059669]
                text-white text-xs font-bold
                transition-colors duration-200
                shadow-md shadow-emerald-100
              "
            >
              <Download className="w-3.5 h-3.5" />
              Download Form10BD_FY2025-26.csv
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: Form10BDCard (Card A)
//
// The centrepiece card of the portal. Shows:
//  - Form name, section reference, transaction count
//  - "Ready to Compile" status badge
//  - A schema validation checklist (static, pre-validated)
//  - The prominent emerald "Generate Form 10BD CSV" button
//  - Loading state: spinner + "Validating Schema..." text
//
// State machine:
//   "idle" → click → "loading" (2.4s) → triggers onSuccess callback
// ─────────────────────────────────────────────────────────────────
function Form10BDCard({ onSuccess }: { onSuccess: () => void }) {
  // "idle" | "loading" — tracks the button state
  const [genState, setGenState] = useState<"idle" | "loading">("idle");

  // Simulated loading steps — cycle through these during the 2.4s loading phase
  const loadingSteps = [
    "Validating Schema…",
    "Cross-checking PAN records…",
    "Applying IT Dept. format…",
    "Generating CSV output…",
  ];
  const [loadingStep, setLoadingStep] = useState(0);

  // Pre-validation checks shown in the card before the button is clicked
  const checks = [
    { label: "142 donor transactions indexed",   done: true  },
    { label: "PAN validation complete",           done: true  },
    { label: "Section 80G eligibility confirmed", done: true  },
    { label: "Form 10BE receipts linked",         done: true  },
    { label: "Schema v2.1 compatibility",         done: true  },
  ];

  const handleGenerate = () => {
    if (genState === "loading") return;
    setGenState("loading");
    setLoadingStep(0);

    // Cycle through loading step labels every 600ms
    // setInterval fires a function repeatedly every N milliseconds
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval); // stop cycling when we reach the last step
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    // After 2.4s total, complete and fire onSuccess
    setTimeout(() => {
      clearInterval(interval);
      setGenState("idle");
      onSuccess(); // tells the parent page to show the success toast
    }, 2400);
  };

  return (
    <motion.div
      variants={cardVariants}
      className="
        bg-white rounded-2xl border border-slate-200 shadow-sm
        flex flex-col overflow-hidden
        ring-1 ring-[#10B981]/10
      "
      style={{ boxShadow: "0 0 0 1px rgba(16,185,129,0.08), 0 4px 24px rgba(15,23,42,0.06)" }}
    >
      {/* Card top accent bar — signals this is the priority action */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />

      {/* ── Header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* Form icon badge */}
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <FileCheck2 className="w-4.5 h-4.5 text-emerald-600" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Income Tax Act</p>
                <p className="text-[10px] font-semibold text-[#64748B]">Section 80G(5)(viii)</p>
              </div>
            </div>
            <h3
              className="text-lg font-extrabold text-[#0F172A]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Form 10BD
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Statement of Particulars of Donations Received
            </p>
          </div>
          <StatusBadge status="ready" />
        </div>

        {/* Transaction count highlight */}
        <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
          <BarChart3 className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-800">Ready to Compile</p>
            <p className="text-[11px] text-amber-700">
              <span className="font-extrabold text-amber-900">142 transactions</span> indexed and pre-validated for this filing period
            </p>
          </div>
        </div>
      </div>

      {/* ── Pre-validation checklist ── */}
      <div className="px-6 py-4 flex-1">
        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">
          Pre-Validation Status
        </p>
        <div className="flex flex-col gap-2">
          {checks.map(({ label, done }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
              className="flex items-center gap-2.5"
            >
              <CheckCircle2 className={"w-3.5 h-3.5 shrink-0 " + (done ? "text-emerald-500" : "text-slate-300")} />
              <span className={"text-xs " + (done ? "text-[#475569]" : "text-slate-400")}>
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Deadline notice */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-[#64748B] bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
          <Calendar className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
          <span>Filing deadline: <span className="font-bold text-[#0F172A]">31 May 2026</span> &mdash; 338 days remaining</span>
        </div>
      </div>

      {/* ── Generate Button ── */}
      {/*
        The button has two states:
        "idle"    → vibrant emerald button with Download icon
        "loading" → spinner icon + cycling loading step text

        The outer <div> wraps both states with AnimatePresence so
        the transition between them is animated.
      */}
      <div className="px-6 pb-6 pt-2">
        <motion.button
          onClick={handleGenerate}
          disabled={genState === "loading"}
          whileHover={genState === "idle" ? { scale: 1.015, y: -1 } : {}}
          whileTap={genState === "idle" ? { scale: 0.98 } : {}}
          className={
            "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 " +
            "transition-all duration-200 shadow-lg " +
            (genState === "loading"
              ? "bg-emerald-600 text-white cursor-wait shadow-emerald-100"
              : "bg-[#10B981] hover:bg-[#059669] text-white shadow-emerald-200/60")
          }
        >
          <AnimatePresence mode="wait">
            {genState === "idle" ? (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5"
              >
                <Download className="w-4 h-4" />
                Generate Form 10BD CSV
              </motion.span>
            ) : (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5"
              >
                {/* RefreshCw with animate-spin = CSS rotation animation */}
                <RefreshCw className="w-4 h-4 animate-spin" />
                {/* Animated step label — slides up as each step changes */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={loadingStep}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {loadingSteps[loadingStep]}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Helper text below button */}
        <p className="text-center text-[10px] text-[#94A3B8] mt-2.5 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Exported in IT Dept.-prescribed CSV format · Schema v2.1
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: Form10ACard (Card B)
//
// Shows the 10A / 12A renewal status as "Compliant".
// Includes certificate details, renewal date, and a "View Certificate"
// action link. This is a "green light" card — no action needed.
// ─────────────────────────────────────────────────────────────────
function Form10ACard() {
  const details = [
    { label: "Registration No.",   value: "AAALR0025CF20221" },
    { label: "Registered Under",   value: "Sec. 12AB"         },
    { label: "Registration Date",  value: "14 Mar 2023"       },
    { label: "Valid Until",        value: "13 Mar 2028"       },
    { label: "Assessment Officer", value: "DCIT, Exemptions, Delhi" },
  ];

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Income Tax Act</p>
                <p className="text-[10px] font-semibold text-[#64748B]">Section 12AB</p>
              </div>
            </div>
            <h3
              className="text-lg font-extrabold text-[#0F172A]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Form 10A / 12A Renewal
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Charitable Trust Registration Certificate
            </p>
          </div>
          <StatusBadge status="compliant" />
        </div>

        {/* Compliant banner */}
        <div className="mt-4 flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-xs text-emerald-800">
            <span className="font-bold">Registration active and valid.</span>{" "}
            No action required until{" "}
            <span className="font-bold">March 2028</span>.
          </p>
        </div>
      </div>

      {/* ── Certificate details table ── */}
      <div className="px-6 py-4 flex-1">
        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">
          Certificate Details
        </p>
        <div className="flex flex-col divide-y divide-slate-50">
          {details.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2">
              <span className="text-xs text-[#94A3B8] font-medium">{label}</span>
              <span className="text-xs font-bold text-[#0F172A] font-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="px-6 pb-5 pt-2 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Download Certificate
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#10B981] border-2 border-emerald-200 hover:bg-emerald-50 transition-all"
        >
          View <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: FC3Card (Card C)
//
// FCRA Annual Return — currently in "Drafting" state.
// Shows a progress bar indicating how much of the draft is complete,
// a list of pending sections, and a "Continue Drafting" CTA.
// ─────────────────────────────────────────────────────────────────
function FC3Card() {
  // Each section of the FCRA filing and its completion state
  const sections = [
    { name: "Part A — Trust Details",        done: true  },
    { name: "Part B — Foreign Receipts",      done: true  },
    { name: "Part C — Utilisation Details",   done: false },
    { name: "Part D — Purpose-wise Break-up", done: false },
    { name: "Part E — Auditor Certificate",   done: false },
  ];
  const completedSections = sections.filter(s => s.done).length;
  const progressPct = Math.round((completedSections / sections.length) * 100); // 40%

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <Globe className="w-4.5 h-4.5 text-blue-600" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">FCRA 2010</p>
                <p className="text-[10px] font-semibold text-[#64748B]">Rule 17 Annual Return</p>
              </div>
            </div>
            <h3
              className="text-lg font-extrabold text-[#0F172A]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              FC-3 Annual Return
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Foreign Contribution (Regulation) Act Filing
            </p>
          </div>
          <StatusBadge status="drafting" />
        </div>

        {/* Progress indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[#0F172A]">Draft Progress</span>
            <span className="font-extrabold text-[#0F172A]">{progressPct}% complete</span>
          </div>
          {/*
            The progress bar uses a motion.div that animates its width from 0
            to progressPct% when the component mounts.
          */}
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-slate-400 to-slate-500"
              initial={{ width: 0 }}
              animate={{ width: progressPct + "%" }}
              transition={{ duration: 1.0, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }}
            />
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-1.5">
            {completedSections} of {sections.length} sections completed
          </p>
        </div>
      </div>

      {/* ── Section checklist ── */}
      <div className="px-6 py-4 flex-1">
        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">
          Filing Sections
        </p>
        <div className="flex flex-col gap-2">
          {sections.map(({ name, done }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={"flex items-center gap-2.5 p-2.5 rounded-lg " + (done ? "bg-slate-50" : "bg-amber-50/40")}
            >
              {done
                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                : <Clock        className="w-3.5 h-3.5 text-amber-400 shrink-0"   />
              }
              <span className={"text-xs " + (done ? "text-[#64748B] line-through" : "text-[#0F172A] font-medium")}>
                {name}
              </span>
              {!done && (
                <span className="ml-auto text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                  Pending
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Deadline */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-[#64748B] bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
          <Calendar className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
          <span>Filing deadline: <span className="font-bold text-[#0F172A]">31 Dec 2025</span> &mdash; 187 days remaining</span>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-6 pb-5 pt-2">
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#0F172A] hover:bg-[#1E293B] flex items-center justify-center gap-2 transition-colors shadow-md shadow-slate-900/10"
        >
          <FileText className="w-4 h-4" />
          Continue Drafting FC-3
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SubmissionRow
// One row in the Recent Submissions table.
// ─────────────────────────────────────────────────────────────────
function SubmissionRow({ sub, index }: { sub: Submission; index: number }) {
  const statusMap = {
    Accepted:   { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
    Processing: { cls: "bg-blue-50 text-blue-700 border-blue-200",          icon: <RefreshCw    className="w-3 h-3 animate-spin" /> },
    Rejected:   { cls: "bg-red-50 text-red-600 border-red-200",             icon: <AlertTriangle className="w-3 h-3" /> },
  };
  const { cls, icon } = statusMap[sub.status];

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.07, duration: 0.3 }}
      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="text-sm font-semibold text-[#0F172A]">{sub.form}</span>
        </div>
      </td>
      <td className="px-5 py-3.5 text-xs text-[#64748B]">{sub.period}</td>
      <td className="px-5 py-3.5 text-xs text-[#64748B]">{sub.submittedOn}</td>
      <td className="px-5 py-3.5">
        <span className="text-[11px] font-mono text-[#475569] bg-slate-100 px-2 py-0.5 rounded">
          {sub.ackNo}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className={"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border " + cls}>
          {icon}{sub.status}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <button className="flex items-center gap-1 text-[11px] text-[#10B981] font-semibold hover:text-[#059669] transition-colors">
          View <ArrowUpRight className="w-3 h-3" />
        </button>
      </td>
    </motion.tr>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function FilingsPage() {
  // Controls whether the success toast is visible
  const [showToast, setShowToast] = useState(false);

  // Summary stats for the strip below the hero
  const stats = [
    { label: "Active Forms",    value: "3", sub: "FY 2025-26",     color: "text-[#0F172A]",    bg: "bg-white"          },
    { label: "Due Within 90d", value: "1", sub: "Form 9A / 10",    color: "text-amber-600",    bg: "bg-amber-50"       },
    { label: "Compliant",      value: "2", sub: "Fully up to date", color: "text-emerald-600", bg: "bg-emerald-50"     },
    { label: "Submissions",    value: "5", sub: "Last 12 months",   color: "text-blue-600",    bg: "bg-blue-50"        },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* ════════════════════════════════════════════════════════
          STICKY HEADER
      ════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
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

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#10B981]" />
            <h1
              className="text-sm font-semibold text-[#0F172A]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Government Filings Portal
            </h1>
          </div>

          {/* FY badge */}
          <div className="hidden sm:flex items-center gap-2 bg-[#0F172A] rounded-xl px-3 py-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">FY</span>
            <span className="text-xs font-extrabold text-white" style={{ fontFamily: "var(--font-jakarta)" }}>
              2025-26
            </span>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">

        {/* ── Page Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-3">
            <Link href="/" className="hover:text-[#10B981] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#0F172A] font-medium">Filings Portal</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div>
              {/* Period badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F172A] mb-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  FY 2025-26 &nbsp;&bull;&nbsp; Current Assessment Period
                </span>
              </div>

              <h2
                className="text-3xl font-extrabold text-[#0F172A] leading-tight"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Tax Compliance &amp;
                <br />
                <span className="text-[#10B981]">Statutory Filing</span>
              </h2>
              <p className="text-sm text-[#64748B] mt-2 max-w-lg">
                Centralised portal for Income Tax, FCRA, and Ministry of Corporate Affairs filings.
                Schema-compliant exports generated automatically from your live ledger data.
              </p>
            </div>

            {/* Quick-action strip */}
            <div className="flex flex-col gap-2 shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0F172A] shadow-sm hover:border-slate-300 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                AI Compliance Scan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0F172A] shadow-sm hover:border-slate-300 transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                Filing Calendar
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Summary stat strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {stats.map(({ label, value, sub, color, bg }) => (
            <div
              key={label}
              className={"rounded-2xl border border-slate-200 px-5 py-4 flex flex-col gap-1 " + bg}
            >
              <span
                className={"text-3xl font-extrabold " + color}
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {value}
              </span>
              <span className="text-xs font-bold text-[#0F172A]">{label}</span>
              <span className="text-[10px] text-[#94A3B8]">{sub}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Section heading ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3
              className="text-lg font-extrabold text-[#0F172A]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Active Statutory Forms
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">FY 2025-26 — All filings tracked in real time</p>
          </div>
          <span className="text-xs text-[#94A3B8]">3 active forms</span>
        </div>

        {/* ════════════════════════════════════════════════════════
            ACTIVE FORMS GRID — 3 CARDS
            3 equal columns on large screens; stacks on mobile.
        ════════════════════════════════════════════════════════ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
        >
          {/* Card A: Form 10BD */}
          <Form10BDCard onSuccess={() => setShowToast(true)} />

          {/* Card B: Form 10A / 12A */}
          <Form10ACard />

          {/* Card C: FC-3 Annual Return */}
          <FC3Card />
        </motion.div>

        {/* ── Filing Deadlines strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[#10B981]" />
            <h3
              className="text-base font-bold text-[#0F172A]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Upcoming Deadlines
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DEADLINES.map(({ form, due, daysLeft, urgency }) => (
              <div
                key={form}
                className={
                  "rounded-xl border px-4 py-3 flex flex-col gap-1 " +
                  (urgency === "caution"
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-white")
                }
              >
                <span className={"text-[10px] font-bold uppercase tracking-widest " + (urgency === "caution" ? "text-amber-600" : "text-[#94A3B8]")}>
                  {form}
                </span>
                <span className="text-xs font-bold text-[#0F172A]">{due}</span>
                <span className={"text-[10px] font-semibold " + (urgency === "caution" ? "text-amber-600" : "text-emerald-600")}>
                  {daysLeft} days left
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Recent Submissions Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#10B981]" />
              <h3
                className="text-base font-bold text-[#0F172A]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Recent Submissions
              </h3>
            </div>
            <button className="text-xs text-[#10B981] font-semibold hover:text-[#059669] flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="bg-slate-50/80 border-b border-slate-100">
              <table className="w-full">
                <thead>
                  <tr>
                    {["Form", "Period", "Submitted On", "Acknowledgement No.", "Status", "Action"].map(col => (
                      <th key={col} className="px-5 py-3 text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
            {/* Table body */}
            <table className="w-full">
              <tbody>
                {SUBMISSIONS.map((sub, i) => (
                  <SubmissionRow key={sub.id} sub={sub} index={i} />
                ))}
              </tbody>
            </table>
            {/* Table footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <p className="text-[10px] text-[#94A3B8]">
                Showing <span className="font-semibold text-[#475569]">{SUBMISSIONS.length}</span> of{" "}
                <span className="font-semibold text-[#475569]">{SUBMISSIONS.length}</span> submissions
              </p>
              <span className="text-[10px] text-[#94A3B8]">
                Connected to Income Tax e-Filing Portal · TRACES
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom disclaimer ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center text-[11px] text-[#94A3B8] flex items-center justify-center gap-1.5"
        >
          <Lock className="w-3 h-3 text-[#10B981]" />
          All exports comply with Income Tax Department &amp; MCA schema specifications. Consult a CA before final submission.
        </motion.p>
      </main>

      {/* ════════════════════════════════════════════════════════
          SUCCESS TOAST — slides in from the right
          AnimatePresence watches showToast: when it becomes true,
          SuccessToast animates in; when false, it animates out.
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showToast && (
          <SuccessToast onClose={() => setShowToast(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

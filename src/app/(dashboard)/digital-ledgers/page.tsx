"use client";

/**
 * DIGITAL LEDGERS PAGE — TrustSaathi
 * Route: /digital-ledgers
 *
 * Layout: 2-column workspace
 *   LEFT  → Bahi-Khata source document viewer (AI Parsed Sync glow border)
 *   RIGHT → Structured digital data table (filters, search, status badges)
 *
 * Features:
 *  - Framer Motion stagger animation for table rows
 *  - Interactive fund-type filter tabs (All / Religious / Charitable)
 *  - Live text search bar with Lucide Search icon
 *  - "Manually Add Entry" slide-up modal
 *  - StatusBadge and FundTypePill sub-components
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  BookOpen,
  Sparkles,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  X,
  ShieldCheck,
  TrendingUp,
  FileText,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────

// "all" shows every entry; "religious" or "charitable" filters by fund type
type FundFilter = "all" | "religious" | "charitable";

// The three possible audit statuses
type EntryStatus = "Audited" | "Pending" | "Flagged";

// Shape of a structured digital ledger row
interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  fundType: "Religious" | "Charitable";
  amount: number;
  status: EntryStatus;
}

// Shape of a Bahi-Khata (handwritten) row in the left column
interface BahiKhataRow {
  text: string;       // Hindi script description
  amount: string;     // Formatted amount string e.g. "₹45,000"
  type: "credit" | "debit";
}

// ─────────────────────────────────────────────────────────────────
// STATIC DATA — Bahi-Khata rows (left column)
// Simulates scanned handwritten entries from a physical ledger.
// ─────────────────────────────────────────────────────────────────
const bahiKhataRows: BahiKhataRow[] = [
  { text: "दान प्राप्त — राम जी से",       amount: "₹45,000",   type: "credit" },
  { text: "लंगर व्यय — अन्नप्रसाद",   amount: "₹12,000",   type: "debit"  },
  { text: "पूजा सामग्री खरीद",                           amount: "₹8,500",    type: "debit"  },
  { text: "दान — श्रीमती सुमन देवी", amount: "₹25,000",   type: "credit" },
  { text: "बाल शिक्षा निधि व्यय",             amount: "₹15,000",   type: "debit"  },
  { text: "मंदिर जीर्णोद्धार दान",  amount: "₹1,10,000", type: "credit" },
];

// ─────────────────────────────────────────────────────────────────
// STATIC DATA — Structured ledger entries (right column table)
// AI-parsed equivalents of the Bahi-Khata rows plus extra entries.
// ─────────────────────────────────────────────────────────────────
const LEDGER_DATA: LedgerEntry[] = [
  { id: "TXN-001", date: "12 Jun 2025", description: "दान प्राप्त — राम जी से",     category: "Donation Receipt",  fundType: "Religious",  amount: 45000,  status: "Audited"  },
  { id: "TXN-002", date: "13 Jun 2025", description: "लंगर व्यय — अन्नप्रसाद", category: "Langar Expense",    fundType: "Charitable", amount: 12000,  status: "Audited"  },
  { id: "TXN-003", date: "14 Jun 2025", description: "पूजा सामग्री खरीद",                         category: "Ritual Supplies",   fundType: "Religious",  amount: 8500,   status: "Pending"  },
  { id: "TXN-004", date: "15 Jun 2025", description: "दान — श्रीमती सुमन देवी", category: "Donation Receipt",  fundType: "Religious",  amount: 25000,  status: "Audited"  },
  { id: "TXN-005", date: "16 Jun 2025", description: "बाल शिक्षा निधि व्यय",             category: "Education Fund",    fundType: "Charitable", amount: 15000,  status: "Audited"  },
  { id: "TXN-006", date: "17 Jun 2025", description: "मंदिर जीर्णोद्धार दान",  category: "Temple Renovation", fundType: "Religious",  amount: 110000, status: "Flagged"  },
  { id: "TXN-007", date: "18 Jun 2025", description: "Medical Aid - Village Camp",                                                                                           category: "Healthcare",        fundType: "Charitable", amount: 32000,  status: "Pending"  },
  { id: "TXN-008", date: "20 Jun 2025", description: "Gaushala Maintenance",                                                                                                 category: "Animal Welfare",    fundType: "Religious",  amount: 9800,   status: "Audited"  },
  { id: "TXN-009", date: "22 Jun 2025", description: "Widow Welfare Distribution",                                                                                           category: "Social Welfare",    fundType: "Charitable", amount: 18500,  status: "Audited"  },
  { id: "TXN-010", date: "24 Jun 2025", description: "Diya & Flower Decoration",                                                                                             category: "Festival Expense",  fundType: "Religious",  amount: 5200,   status: "Pending"  },
];

// ─────────────────────────────────────────────────────────────────
// STATUS BADGE VISUAL CONFIG
// Maps each status to: background color, text color, border, icon.
// We use this record to avoid a chain of if/else statements.
// Record<K, V> = an object where every key K maps to value type V.
// ─────────────────────────────────────────────────────────────────
const statusConfig: Record<EntryStatus, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  Audited: {
    bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Pending: {
    bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200",
    icon: <Clock className="w-3 h-3" />,
  },
  Flagged: {
    bg: "bg-red-50", text: "text-red-600", border: "border-red-200",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

// ─────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS
//
// Variants are named animation states that Framer Motion coordinates.
// The parent (containerVariants) triggers children to animate one
// after another via "staggerChildren: 0.07" (70ms delay each).
// ─────────────────────────────────────────────────────────────────

// Parent container: controls the stagger timing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,  // 70ms between each child starting its animation
      delayChildren: 0.1,     // 100ms before the first child begins
    },
  },
};

// Each row: slides up 16px while fading in
const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    // Custom cubic-bezier easing — same as used in login page for consistency
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─────────────────────────────────────────────────────────────────
// HELPER — Format number as Indian Rupee string
// toLocaleString("en-IN") uses India's numbering system:
// 45000 → "45,000"  |  110000 → "1,10,000" (lakhs grouping)
// ─────────────────────────────────────────────────────────────────
const formatRupee = (n: number) => "₹" + n.toLocaleString("en-IN");

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: StatusBadge
// Renders a pill with a color-coded background, text, border + icon.
// ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EntryStatus }) {
  const cfg = statusConfig[status]; // look up the visual config for this status
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-1
        rounded-full text-xs font-semibold border
        ${cfg.bg} ${cfg.text} ${cfg.border}
      `}
    >
      {cfg.icon}
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: FundTypePill
// Violet = Religious, Sky Blue = Charitable.
// A tiny colored dot precedes the text for quick visual scanning.
// ─────────────────────────────────────────────────────────────────
function FundTypePill({ type }: { type: "Religious" | "Charitable" }) {
  const isReligious = type === "Religious";
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5
        rounded-full text-[11px] font-semibold
        ${isReligious
          ? "bg-violet-50 text-violet-700 border border-violet-200"
          : "bg-sky-50 text-sky-700 border border-sky-200"
        }
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isReligious ? "bg-violet-500" : "bg-sky-500"}`} />
      {type}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: BahiKhataViewer (Left Column)
//
// Simulates a scanned handwritten Bahi-Khata physical ledger.
//
// Visual tricks used:
// 1. Glowing emerald border: achieved via box-shadow with multiple layers —
//    - A 1px solid ring at rgba(16,185,129,0.15)
//    - A blurred 28px aura at rgba(16,185,129,0.14)
//    Together they look like an AI has highlighted the parsed region.
//
// 2. Notebook ruled lines: repeating-linear-gradient CSS draws a 1px
//    horizontal line every 36px to mimic lined paper.
//
// 3. Hindi text uses Georgia/serif font to feel handwritten.
//
// 4. animate-ping creates the live sync pulsing dot.
// ─────────────────────────────────────────────────────────────────
function BahiKhataViewer() {
  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Column label */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-base font-bold text-[#0F172A]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Source Document
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">Bahi-Khata · Scanned Upload</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          AI Parsed
        </span>
      </div>

      {/*
        The Bahi-Khata card with AI Parsed Sync glowing boundary box.

        box-shadow breakdown:
          "0 0 0 1px rgba(16,185,129,0.15)"  → thin 1px emerald ring
          "0 0 28px rgba(16,185,129,0.14)"   → blurred glow aura
          "0 4px 24px rgba(15,23,42,0.06)"   → soft elevation drop shadow
      */}
      <div
        className="relative flex-1 rounded-2xl overflow-hidden border border-[#10B981]/50 bg-white"
        style={{
          boxShadow:
            "0 0 0 1px rgba(16,185,129,0.15), 0 0 28px rgba(16,185,129,0.14), 0 4px 24px rgba(15,23,42,0.06)",
        }}
      >
        {/* AI Sync status bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50/60 border-b border-emerald-100">
          {/*
            animate-ping: Tailwind animation that scales the element to 2x
            its size while fading to transparent, then resets. Creates a
            "radar pulse" effect. The outer span is relative, inner is absolute.
          */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 tracking-wide">
            AI Parsed Sync · 6 entries detected
          </span>
        </div>

        {/* Paper texture area */}
        <div className="relative p-5 pt-4">
          {/*
            Notebook ruled lines via repeating-linear-gradient:
            "transparent, transparent 35px" = invisible for 35px
            "#CBD5E133 35px, #CBD5E133 36px" = 1px slate-200 line at position 35-36px
            This repeats every 36px, creating evenly spaced ruled lines.
            backgroundPositionY: "24px" shifts the pattern down 24px from the top.
          */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 35px, #CBD5E133 35px, #CBD5E133 36px)",
              backgroundPositionY: "24px",
            }}
          />

          {/* Trust name / ledger header */}
          <div className="relative mb-5 text-center border-b-2 border-dashed border-slate-200 pb-3">
            <p
              className="text-lg font-bold text-[#0F172A]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              श्री राम मंदिर ट्रस्ट
            </p>
            <p className="text-[11px] text-[#64748B] mt-0.5 font-mono">
              बही-खाता · जून 2025
            </p>
          </div>

          {/* Handwritten rows with stagger animation */}
          <motion.div
            className="flex flex-col gap-3.5 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {bahiKhataRows.map((row, i) => (
              <motion.div key={i} variants={rowVariants} className="flex items-center justify-between gap-3">
                {/* Row number like a ledger */}
                <span className="text-[10px] text-slate-300 font-mono w-4 shrink-0">{i + 1}.</span>
                {/* Hindi description text in serif to feel handwritten */}
                <p
                  className="flex-1 text-[13px] text-[#1E293B] leading-snug"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {row.text}
                </p>
                {/* Green for credit, red for debit */}
                <span className={`text-sm font-bold font-mono shrink-0 ${row.type === "credit" ? "text-emerald-600" : "text-red-500"}`}>
                  {row.type === "credit" ? "+" : "-"}{row.amount}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Rotated "AI Verified" stamp — low opacity for authenticity */}
          <div className="absolute bottom-4 right-4 opacity-25 rotate-[-12deg]">
            <div className="flex items-center gap-1 border-2 border-emerald-500 rounded px-2 py-0.5">
              <span className="text-[9px] font-black text-emerald-600 tracking-widest uppercase">
                AI Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini stat cards below the Bahi-Khata */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Inflow",  value: "₹1,80,000", icon: TrendingUp, color: "text-emerald-600" },
          { label: "Total Outflow", value: "₹35,500",   icon: FileText,   color: "text-red-500"    },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3">
            <div className={`${color} opacity-80`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider">{label}</p>
              <p className={`text-sm font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENT: AddEntryModal
//
// A bottom-sheet modal that slides up from below the screen.
// Uses AnimatePresence to play an exit animation before unmounting.
//
// Animation type "spring" creates a natural, physics-based motion:
//   stiffness: 300 = fast, snappy spring
//   damping: 30   = oscillation dies quickly (not bouncy)
// ─────────────────────────────────────────────────────────────────
function AddEntryModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: LedgerEntry) => void;
}) {
  const [form, setForm] = useState({
    date: "",
    description: "",
    category: "",
    fundType: "Religious" as "Religious" | "Charitable",
    amount: "",
    status: "Pending" as EntryStatus,
  });

  const handleSubmit = () => {
    if (!form.date || !form.description || !form.amount) return;
    onAdd({
      id: "TXN-" + Date.now(), // unique ID via Unix timestamp
      date: form.date,
      description: form.description,
      category: form.category || "General",
      fundType: form.fundType,
      amount: parseFloat(form.amount), // "45000" string → 45000 number
      status: form.status,
    });
    onClose();
    setForm({ date: "", description: "", category: "", fundType: "Religious", amount: "", status: "Pending" });
  };

  // Shared Tailwind class string for form inputs — avoids repetition
  const inputCls =
    "px-3 py-2.5 text-sm text-[#0F172A] rounded-xl border border-slate-200 outline-none " +
    "focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all bg-white placeholder:text-slate-400 w-full";

  // appearance-none removes the browser's default dropdown arrow (we use our own ChevronDown icon)
  const selectCls = inputCls + " appearance-none pr-8";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Semi-transparent backdrop — clicking it closes the modal */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-40"
          />

          {/* Modal panel — slides up like a bottom sheet */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }}
            exit={{ opacity: 0, y: 40, transition: { duration: 0.2 } }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-white rounded-t-3xl border border-slate-200 shadow-2xl p-6"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className="text-lg font-bold text-[#0F172A]"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Add Ledger Entry
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Fill in the transaction details below.</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Date + Fund Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider">Fund Type</label>
                  <div className="relative">
                    <select
                      value={form.fundType}
                      onChange={e => setForm({ ...form, fundType: e.target.value as "Religious" | "Charitable" })}
                      className={selectCls}
                    >
                      <option value="Religious">Religious</option>
                      <option value="Charitable">Charitable</option>
                    </select>
                    {/* Custom dropdown chevron overlaid on the select */}
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  placeholder="e.g. दान प्राप्त — राम जी से"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* Category + Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Donation"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider">Amount (₹)</label>
                  {/*
                    Icon is absolutely positioned; pl-8 on the input
                    pushes text right so it doesn't overlap the icon.
                  */}
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      placeholder="0"
                      value={form.amount}
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                      className={inputCls + " pl-8"}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider">Status</label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as EntryStatus })}
                    className={selectCls}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Audited">Audited</option>
                    <option value="Flagged">Flagged</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm bg-[#10B981] hover:bg-[#059669] shadow-lg shadow-emerald-100 transition-colors duration-200 flex items-center justify-center gap-2 mt-1"
              >
                <Plus className="w-4 h-4" />
                Add to Ledger
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT — DigitalLedgersPage
// ─────────────────────────────────────────────────────────────────
export default function DigitalLedgersPage() {
  // Which fund filter tab is selected
  const [activeFilter, setActiveFilter] = useState<FundFilter>("all");

  // The search query typed in the search bar
  const [searchQuery, setSearchQuery] = useState("");

  // Whether the Add Entry modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);

  // The full list of entries (mutable — user can add entries)
  const [entries, setEntries] = useState<LedgerEntry[]>(LEDGER_DATA);

  // ── Filtered + searched entries ─────────────────────────────
  /*
    useMemo: this computation only re-runs when entries, activeFilter,
    or searchQuery changes. React skips it on unrelated re-renders.
    This is a performance optimization for lists that could grow large.
  */
  const filteredEntries = useMemo(
    () =>
      entries.filter(entry => {
        // Step 1: Check if entry passes the fund type filter
        const passesFilter =
          activeFilter === "all" ||
          (activeFilter === "religious"  && entry.fundType === "Religious") ||
          (activeFilter === "charitable" && entry.fundType === "Charitable");

        // Step 2: Check if entry passes the text search
        // .toLowerCase() makes the search case-insensitive
        const q = searchQuery.toLowerCase();
        const passesSearch =
          q === "" ||
          entry.description.toLowerCase().includes(q) ||
          entry.category.toLowerCase().includes(q) ||
          entry.date.toLowerCase().includes(q);

        return passesFilter && passesSearch;
      }),
    [entries, activeFilter, searchQuery]
  );

  // Prepend new entry so it appears at the top of the table
  const handleAddEntry = (newEntry: LedgerEntry) =>
    setEntries(prev => [newEntry, ...prev]);

  // Filter tab data
  const filterTabs: { id: FundFilter; label: string }[] = [
    { id: "all",        label: "All Funds"        },
    { id: "religious",  label: "Purely Religious"  },
    { id: "charitable", label: "Charitable/Social" },
  ];

  // Summary stats for the nav bar
  const totalAmount  = entries.reduce((sum, e) => sum + e.amount, 0);
  const auditedCount = entries.filter(e => e.status === "Audited").length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* ════════════════════════════════════════════════════════
          STICKY HEADER NAVIGATION BAR
          - sticky top-0 z-30 = stays fixed at viewport top
          - bg-white/80 backdrop-blur-md = glassmorphism effect
      ════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
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
            <BookOpen className="w-4 h-4 text-[#10B981]" />
            <h1
              className="text-sm font-semibold text-[#0F172A]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Digital Ledgers
            </h1>
          </div>

          {/* Live stats */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-[#64748B]">
            <span><span className="font-bold text-[#0F172A]">{entries.length}</span> Entries</span>
            <span><span className="font-bold text-[#10B981]">{auditedCount}</span> Audited</span>
            <span><span className="font-bold text-[#0F172A]">{formatRupee(totalAmount)}</span> Total</span>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-6">

        {/* Page heading + search/add action bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"
        >
          <div>
            <h2
              className="text-2xl font-extrabold text-[#0F172A] leading-tight"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              बही-खाता → Digital Ledger
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              AI-parsed records from your uploaded source documents. Verify, filter &amp; export.
            </p>
          </div>

          {/* Search + Add Entry button */}
          <div className="flex items-center gap-3 shrink-0">
            {/*
              Search bar: Search icon is absolutely positioned inside a relative wrapper.
              pl-10 on the input creates left padding so text doesn't overlap the icon.
              pointer-events-none on the icon means clicks pass through to the input.
            */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="ledger-search"
                type="text"
                placeholder="Search entries…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 text-sm text-[#0F172A] bg-white border border-slate-200 rounded-xl outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all duration-200 placeholder:text-slate-400 w-52"
              />
            </div>

            <motion.button
              id="add-entry-btn"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-semibold transition-colors duration-200 shadow-md shadow-slate-900/10 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Manually Add Entry
            </motion.button>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            2-COLUMN WORKSPACE GRID
            xl:grid-cols-[380px_1fr]:
              - Column 1 = fixed 380px (Bahi-Khata viewer)
              - Column 2 = fluid remaining width (data table)
            On smaller screens: single column stack
        ════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 items-start">

          {/* LEFT COLUMN: Bahi-Khata Document Viewer */}
          {/*
            xl:sticky xl:top-20: On large screens, this column sticks to
            the top (offset by 80px = header height + padding) while the
            user scrolls the right column.
          */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="xl:sticky xl:top-20"
          >
            <BahiKhataViewer />
          </motion.div>

          {/* RIGHT COLUMN: Digital Data Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-4"
          >

            {/* Filter tabs */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 w-fit">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 shrink-0" />
              {filterTabs.map(({ id, label }) => (
                <button
                  key={id}
                  id={"filter-" + id}
                  onClick={() => setActiveFilter(id)}
                  className={
                    "px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 " +
                    (activeFilter === id
                      ? "bg-[#0F172A] text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50")
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Data table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

              {/* Table column headers */}
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 grid grid-cols-[90px_1fr_130px_120px_100px_90px] gap-4 items-center">
                {["Date", "Description", "Category", "Fund Type", "Amount", "Status"].map(col => (
                  <span key={col} className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    {col}
                  </span>
                ))}
              </div>

              {/* Table rows with stagger animation */}
              {filteredEntries.length > 0 ? (
                /*
                  key changes when filter/search/entries change, forcing React to
                  unmount+remount this element — which re-triggers the stagger animation.
                */
                <motion.div
                  key={activeFilter + searchQuery + entries.length}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-slate-50"
                >
                  {filteredEntries.map(entry => (
                    <motion.div
                      key={entry.id}
                      variants={rowVariants}
                      className="px-5 py-4 grid grid-cols-[90px_1fr_130px_120px_100px_90px] gap-4 items-center hover:bg-slate-50/70 transition-colors duration-150"
                    >
                      {/* Date */}
                      <span className="text-xs text-[#64748B] font-mono">{entry.date}</span>

                      {/* Description + transaction ID */}
                      <div>
                        {/*
                          truncate: clips overflowing text with "..."
                          title: shows full text as a native browser tooltip on hover
                        */}
                        <p
                          className="text-sm text-[#0F172A] font-medium leading-snug truncate"
                          title={entry.description}
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {entry.description}
                        </p>
                        <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">{entry.id}</p>
                      </div>

                      {/* Category */}
                      <span className="text-xs text-[#475569] truncate">{entry.category}</span>

                      {/* Fund Type pill */}
                      <FundTypePill type={entry.fundType} />

                      {/* Amount in Indian number format */}
                      <span className="text-sm font-bold text-[#0F172A] font-mono">
                        {formatRupee(entry.amount)}
                      </span>

                      {/* Status badge */}
                      <StatusBadge status={entry.status} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                /* Empty state when nothing matches */
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-[#475569]">No entries found</p>
                  <p className="text-xs text-[#94A3B8]">Try adjusting your search or filter.</p>
                </div>
              )}

              {/* Footer: entry count */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <p className="text-xs text-[#94A3B8]">
                  Showing{" "}
                  <span className="font-semibold text-[#475569]">{filteredEntries.length}</span>
                  {" "}of{" "}
                  <span className="font-semibold text-[#475569]">{entries.length}</span>
                  {" "}entries
                </p>
                <span className="text-[10px] text-[#94A3B8] hidden sm:block">
                  CSV · PDF export available in Pro plan
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEntry}
      />
    </div>
  );
}

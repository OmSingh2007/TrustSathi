"use client";

/**
 * TAB 2 — GUPT DAAN FUND SPLITTER
 * ─────────────────────────────────────────────────────────────────
 * Simulates the AI parsing a handwritten Hundi collection note and
 * splitting it into two regulatory buckets.
 *
 * 4 Animation Phases:
 *   idle      → paper ledger on left, two empty buckets on right
 *   scanning  → green laser line sweeps the paper (1.2s)
 *   splitting → coloured particles fly toward the buckets (0.5s)
 *   done      → buckets count up, "Optimized" badge slides in
 *
 * Key techniques:
 *  - motion.div with animate top "0%" → "110%" = laser sweep
 *  - animate() imperative API drives count-up inside useEffect
 *  - AnimatePresence for the badge entrance/exit
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate, useMotionValue } from "framer-motion";
import { BookOpen, Sparkles, RefreshCw, CheckCircle2, ScanLine, ArrowRight } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────
const BUCKET_A_FINAL = 110000; // ₹1,10,000
const BUCKET_B_FINAL = 40000;  // ₹40,000

/** Formats a number in Indian currency grouping: 110000 → ₹1,10,000 */
function formatINR(value: number): string {
  return "₹" + new Intl.NumberFormat("en-IN").format(Math.floor(value));
}

/**
 * useCountUp — custom hook
 * Uses Framer Motion's animate() to drive a motionValue from 0 → target.
 * We read it with onUpdate and push it into React state so the JSX re-renders.
 * shouldRun = false resets the value back to 0.
 */
function useCountUp(target: number, shouldRun: boolean) {
  const [display, setDisplay] = useState(0);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    if (!shouldRun) {
      motionVal.set(0);
      setDisplay(0);
      return;
    }
    const controls = animate(motionVal, target, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [shouldRun, target, motionVal]);

  return display;
}

// ─── Types ────────────────────────────────────────────────────────
type Phase = "idle" | "scanning" | "splitting" | "done";

interface Particle { id: number; bucket: "A" | "B"; delay: number; color: string; }

// 8 green particles → Bucket A, 4 indigo → Bucket B (proportional to amounts)
const PARTICLES: Particle[] = [
  ...Array.from({ length: 8 }, (_, i) => ({ id: i,     bucket: "A" as const, delay: i * 0.07, color: "#10B981" })),
  ...Array.from({ length: 4 }, (_, i) => ({ id: i + 8, bucket: "B" as const, delay: i * 0.1 + 0.1, color: "#6366F1" })),
];

export default function FundSplitterTab() {
  const [phase, setPhase]               = useState<Phase>("idle");
  const [countA, setCountA]             = useState(false);
  const [countB, setCountB]             = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showBadge, setShowBadge]       = useState(false);

  const displayA = useCountUp(BUCKET_A_FINAL, countA);
  const displayB = useCountUp(BUCKET_B_FINAL, countB);

  // Guard against setting state on unmounted component
  const isMounted = useRef(true);
  useEffect(() => { return () => { isMounted.current = false; }; }, []);

  /**
   * handleRunParser — sequences the 4 phases with setTimeout:
   *   0ms    → scanning (laser sweeps)
   *   1200ms → splitting (particles fly)
   *   1700ms → done (buckets count up)
   *   3500ms → badge appears
   */
  const handleRunParser = () => {
    if (phase !== "idle") return;
    setPhase("scanning");
    setTimeout(() => { if (isMounted.current) { setPhase("splitting"); setShowParticles(true); } }, 1200);
    setTimeout(() => { if (isMounted.current) { setPhase("done"); setCountA(true); setCountB(true); } }, 1700);
    setTimeout(() => { if (isMounted.current) setShowBadge(true); }, 3500);
  };

  const handleReset = () => {
    setPhase("idle");
    setCountA(false);
    setCountB(false);
    setShowParticles(false);
    setShowBadge(false);
  };

  return (
    <div className="h-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      {/* ── LEFT: Paper Ledger ── */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">Source Document</p>
          <h3 style={{ fontFamily: "var(--font-jakarta)" }} className="text-lg font-bold text-[#0F172A]">
            Hundi Collection Register
          </h3>
        </div>

        {/*
          relative + overflow-hidden keeps the scan laser clipped inside.
          Sepia/amber palette simulates aged paper.
        */}
        <div className="relative bg-amber-50 rounded-xl border border-amber-200 p-5 overflow-hidden shadow-inner">
          {/* Ruled lines decoration */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #92400E 27px, #92400E 28px)",
            backgroundPositionY: "36px",
          }} />

          {/* Header stamp */}
          <div className="relative flex items-center gap-2 mb-4 pb-3 border-b border-amber-300/60">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <div>
              <p className="text-xs font-bold text-amber-900">Shri Ram Mandir Trust</p>
              <p className="text-[10px] text-amber-600">Box Collection — Makar Sankranti 2025</p>
            </div>
            <span className="ml-auto text-[9px] font-bold border-2 border-red-400 text-red-500 px-2 py-0.5 rounded rotate-3 uppercase tracking-wide">
              Unprocessed
            </span>
          </div>

          {/* Ledger text */}
          <div className="relative space-y-3 text-sm">
            <p className="font-semibold text-amber-900 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              Total Box Collection (Hundi): <span className="font-extrabold">₹1,50,000/-</span>
            </p>
            <p className="text-amber-800 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              Spent ₹40,000 on Free Kitchen (Annakshetra) — Daily prasad distribution to 500 pilgrims.
            </p>
            <p className="text-[11px] text-amber-600 italic">
              Note: Balance ₹1,10,000 retained for Mandir upkeep (deity sewa, cleaning, electricity).
            </p>
          </div>

          {/* ── SCAN LASER ── animates top from -5% → 110% linearly */}
          {phase === "scanning" && (
            <motion.div
              className="absolute left-0 right-0 h-8 pointer-events-none z-10"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.3) 40%, rgba(16,185,129,0.5) 50%, rgba(16,185,129,0.3) 60%, transparent)" }}
              initial={{ top: "-5%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 1.0, ease: "linear" }}
            />
          )}
          {phase === "scanning" && (
            <motion.div className="absolute inset-0 bg-emerald-50/20 pointer-events-none z-0"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }} />
          )}
          {phase === "done" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-emerald-50/30 rounded-xl pointer-events-none" />
          )}
        </div>

        {/* Action button */}
        {phase === "idle" ? (
          <motion.button id="fund-splitter-run-btn" onClick={handleRunParser}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-xl font-bold text-white text-sm cursor-pointer
              bg-gradient-to-r from-[#10B981] to-[#059669] shadow-lg shadow-emerald-100
              flex items-center justify-center gap-2">
            <ScanLine className="w-4 h-4" />
            Run AI Parser
            <Sparkles className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button id="fund-splitter-reset-btn" onClick={handleReset}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-xl font-bold border-2 border-slate-200 text-[#64748B]
              hover:border-slate-300 text-sm flex items-center justify-center gap-2 cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            Reset Parser
          </motion.button>
        )}
      </div>

      {/* ── RIGHT: Buckets + Particles ── */}
      <div className="relative flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">AI Split Output</p>
          <h3 style={{ fontFamily: "var(--font-jakarta)" }} className="text-lg font-bold text-[#0F172A]">
            Regulatory Allocation
          </h3>
        </div>

        {/* Bucket A */}
        <motion.div
          animate={{
            borderColor: phase === "done" ? "#10B981" : "#E2E8F0",
            boxShadow: phase === "done" ? "0 0 0 2px rgba(16,185,129,0.15), 0 4px 20px rgba(16,185,129,0.08)" : "none",
          }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl border p-4 space-y-3" id="bucket-a">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Bucket A — Purely Religious</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Tax-Exempt
            </span>
          </div>
          <p className="text-[11px] text-[#64748B]">
            Deity sewa, temple maintenance, puja materials — exempt under Sec. 11(1).
          </p>
          <div className="bg-emerald-50 rounded-lg px-4 py-3">
            <p className="text-[10px] text-emerald-700 mb-1">Allocated Amount</p>
            <p style={{ fontFamily: "var(--font-jakarta)" }} className="text-2xl font-extrabold text-[#0F172A]">
              {phase === "idle" ? "₹—" : formatINR(displayA)}
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#10B981] rounded-full"
              animate={{ width: phase === "done" ? "73.3%" : "0%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} />
          </div>
          <p className="text-[10px] text-[#64748B]">73.3% of total collection</p>
        </motion.div>

        {/* Bucket B */}
        <motion.div
          animate={{
            borderColor: phase === "done" ? "#6366F1" : "#E2E8F0",
            boxShadow: phase === "done" ? "0 0 0 2px rgba(99,102,241,0.12), 0 4px 20px rgba(99,102,241,0.06)" : "none",
          }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl border p-4 space-y-3" id="bucket-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Bucket B — Social / Charitable</p>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              Sec 115BBC
            </span>
          </div>
          <p className="text-[11px] text-[#64748B]">
            Free kitchen (Annakshetra) — subject to 115BBC 5% limit on anonymous donations.
          </p>
          <div className="bg-indigo-50 rounded-lg px-4 py-3">
            <p className="text-[10px] text-indigo-700 mb-1">Allocated Amount</p>
            <p style={{ fontFamily: "var(--font-jakarta)" }} className="text-2xl font-extrabold text-[#0F172A]">
              {phase === "idle" ? "₹—" : formatINR(displayB)}
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-indigo-500 rounded-full"
              animate={{ width: phase === "done" ? "26.7%" : "0%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }} />
          </div>
          <p className="text-[10px] text-[#64748B]">26.7% of total collection</p>

          {/* Optimized badge — springs in after count-up finishes */}
          <AnimatePresence>
            {showBadge && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-[11px] font-semibold text-[#0F172A]">
                  ✅ <span className="text-emerald-700">Optimized:</span>{" "}
                  Safely below the flat 30% anonymous donation tax threshold.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Particle Layer ──
            Absolutely positioned dots that animate from the left edge
            toward either bucket A (top) or bucket B (bottom).
            pointer-events-none so they don't block button clicks. */}
        <AnimatePresence>
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {PARTICLES.map((p) => (
                <motion.div key={p.id}
                  className="absolute w-2 h-2 rounded-full shadow-sm"
                  style={{ backgroundColor: p.color }}
                  initial={{ left: "-5%", top: "30%", scale: 0, opacity: 0 }}
                  animate={{ left: "45%", top: p.bucket === "A" ? "30%" : "70%", scale: [0, 1.5, 1], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.7, delay: p.delay, ease: "easeOut" }}
                />
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: [0, 1, 1, 0], x: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute left-1/4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <ArrowRight className="w-4 h-4 text-[#10B981]" />
                <span className="text-[10px] font-bold text-[#10B981]">AI Parsing</span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

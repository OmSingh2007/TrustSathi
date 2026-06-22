"use client";

/**
 * TAB 2 — GUPT DAAN FUND SPLITTER
 * ─────────────────────────────────────────────────────────────────
 * Simulates the AI parsing a handwritten Hundi collection note and
 * splitting it into two regulatory buckets.
 *
 * States:
 *   idle      → paper ledger on left, two empty buckets on right
 *   scanning  → laser line sweeps across the paper (1s)
 *   splitting → animated "particles" fly from ledger to buckets (0.5s)
 *   done      → buckets count up to their final values, badge appears
 *
 * Key Techniques:
 *  - CSS clip-path on the scan laser to make it sweep top→bottom
 *  - Absolute-positioned "particle" divs that fly from source to target
 *    via `animate` with `top/left` transitions (approximated with transforms)
 *  - AnimatedCounter-style logic using useMotionValue + animate()
 *  - AnimatePresence for the "Optimized" badge appearing
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate, useMotionValue } from "framer-motion";
import { BookOpen, Sparkles, RefreshCw, CheckCircle2, ScanLine, ArrowRight } from "lucide-react";

// Final bucket values
const BUCKET_A_FINAL = 110000; // ₹1,10,000 — Religious (Tax-Exempt)
const BUCKET_B_FINAL = 40000;  // ₹40,000  — Social/Charitable

/** Formats a number to Indian currency style: e.g. 110000 → ₹1,10,000 */
function formatINR(value: number): string {
  // Intl.NumberFormat with locale "en-IN" handles Indian comma grouping automatically
  // e.g. 110000 → "1,10,000"
  return "₹" + new Intl.NumberFormat("en-IN").format(Math.floor(value));
}

/** Custom hook: returns a rounded display value that counts up to `target` */
function useCountUp(target: number, shouldRun: boolean) {
  const [display, setDisplay] = useState(0);
  const motionVal = useMotionValue(0); // Framer Motion reactive number

  useEffect(() => {
    if (!shouldRun) {
      // Reset when shouldRun goes false
      motionVal.set(0);
      setDisplay(0);
      return;
    }

    // animate() smoothly drives motionVal from 0 → target over 1.8 seconds
    const controls = animate(motionVal, target, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v), // update React state with the latest raw value
    });

    return () => controls.stop(); // cleanup if component unmounts mid-animation
  }, [shouldRun, target, motionVal]);

  return display;
}

// ─── Phase type for the simulation flow ───────────────────────────
type Phase = "idle" | "scanning" | "splitting" | "done";

// ─── Particle data type ────────────────────────────────────────────
// Each "particle" is a small colored dot that flies from the ledger to a bucket
interface Particle {
  id: number;
  bucket: "A" | "B";    // Which bucket does this particle go to?
  delay: number;        // Start delay in seconds
  color: string;        // Visual color
}

// Pre-generate particles (8 to bucket A, 4 to bucket B — proportion reflects amounts)
const PARTICLES: Particle[] = [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i,
    bucket: "A" as const,
    delay: i * 0.07,
    color: "#10B981",
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 8,
    bucket: "B" as const,
    delay: i * 0.1 + 0.1,
    color: "#6366F1",
  })),
];

export default function FundSplitterTab() {
  // Tracks the current simulation phase
  const [phase, setPhase] = useState<Phase>("idle");

  // Whether to run the count-up animation for each bucket
  const [countA, setCountA] = useState(false);
  const [countB, setCountB] = useState(false);

  // Live count-up values from our custom hook
  const displayA = useCountUp(BUCKET_A_FINAL, countA);
  const displayB = useCountUp(BUCKET_B_FINAL, countB);

  // Whether to show particles flying across the screen
  const [showParticles, setShowParticles] = useState(false);

  // Whether to show the "Optimized" badge on Bucket B
  const [showBadge, setShowBadge] = useState(false);

  // Ref so we can check if component is still mounted before setting state
  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  /**
   * handleRunParser — sequences the animation phases:
   *  0ms:   → scanning phase (laser sweeps the paper)
   *  1200ms: → splitting phase (particles fly)
   *  1400ms: → done phase (buckets count up)
   *  3500ms: → badge appears
   */
  const handleRunParser = () => {
    if (phase !== "idle") return;

    setPhase("scanning");

    setTimeout(() => {
      if (!isMounted.current) return;
      setPhase("splitting");
      setShowParticles(true);
    }, 1200);

    setTimeout(() => {
      if (!isMounted.current) return;
      setPhase("done");
      setCountA(true);
      setCountB(true);
    }, 1700);

    setTimeout(() => {
      if (!isMounted.current) return;
      setShowBadge(true);
    }, 3500);
  };

  /** handleReset — resets everything to idle */
  const handleReset = () => {
    setPhase("idle");
    setCountA(false);
    setCountB(false);
    setShowParticles(false);
    setShowBadge(false);
  };

  return (
    <div className="h-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      {/* ──────────────────────────────────────────
          LEFT: Paper Ledger Input
      ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
            Source Document
          </p>
          <h3
            style={{ fontFamily: "var(--font-jakarta)" }}
            className="text-lg font-bold text-[#0F172A]"
          >
            Hundi Collection Register
          </h3>
        </div>

        {/* ── PAPER LEDGER CARD ── */}
        {/*
          relative + overflow-hidden so the scan laser is clipped inside the card.
          The sepia/amber tones simulate aged paper.
        */}
        <div className="relative bg-amber-50 rounded-xl border border-amber-200 p-5 overflow-hidden shadow-inner">

          {/* Paper texture lines (purely decorative) */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #92400E 27px, #92400E 28px)",
            backgroundPositionY: "36px",
          }} />

          {/* Ledger header stamp */}
          <div className="relative flex items-center gap-2 mb-4 pb-3 border-b border-amber-300/60">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <div>
              <p className="text-xs font-bold text-amber-900">Shri Ram Mandir Trust</p>
              <p className="text-[10px] text-amber-600">Box Collection — Makar Sankranti 2025</p>
            </div>
            {/* Red stamp */}
            <span className="ml-auto text-[9px] font-bold border-2 border-red-400 text-red-500 px-2 py-0.5 rounded rotate-3 uppercase tracking-wide">
              Unprocessed
            </span>
          </div>

          {/* The main ledger text content */}
          <div className="relative space-y-3 text-sm">
            <p className="font-semibold text-amber-900 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              Total Box Collection (Hundi):{" "}
              <span className="font-extrabold">₹1,50,000/-</span>
            </p>
            <p className="text-amber-800 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              Spent ₹40,000 on Free Kitchen (Annakshetra) — Daily prasad distribution to 500 pilgrims.
            </p>
            <p className="text-[11px] text-amber-600 italic">
              Note: Balance ₹1,10,000 retained for Mandir upkeep (deity sewa, cleaning, electricity).
            </p>
          </div>

          {/* ── SCAN LASER LINE ── */}
          {/*
            This div sweeps from top to bottom when phase === "scanning".
            We use motion.div with animate top from "-10%" → "110%".
            The gradient creates a realistic scanner beam glow.
          */}
          {phase === "scanning" && (
            <motion.div
              className="absolute left-0 right-0 h-8 pointer-events-none z-10"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.3) 40%, rgba(16,185,129,0.5) 50%, rgba(16,185,129,0.3) 60%, transparent)",
              }}
              initial={{ top: "-5%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 1.0, ease: "linear" }}
            />
          )}

          {/* Scanning overlay shimmer */}
          {phase === "scanning" && (
            <motion.div
              className="absolute inset-0 bg-emerald-50/20 pointer-events-none z-0"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}

          {/* Done overlay — slight green tint when parsed */}
          {(phase === "done") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-emerald-50/30 rounded-xl pointer-events-none"
            />
          )}
        </div>

        {/* ── ACTION BUTTON ── */}
        {phase === "idle" ? (
          <motion.button
            id="fund-splitter-run-btn"
            onClick={handleRunParser}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="
              w-full py-4 rounded-xl font-bold text-white text-sm
              bg-gradient-to-r from-[#10B981] to-[#059669]
              shadow-lg shadow-emerald-100 cursor-pointer
              flex items-center justify-center gap-2
            "
          >
            <ScanLine className="w-4 h-4" />
            Run AI Parser
            <Sparkles className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            id="fund-splitter-reset-btn"
            onClick={handleReset}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="
              w-full py-4 rounded-xl font-bold border-2 border-slate-200
              text-[#64748B] hover:border-slate-300 text-sm
              flex items-center justify-center gap-2 cursor-pointer
            "
          >
            <RefreshCw className="w-4 h-4" />
            Reset Parser
          </motion.button>
        )}
      </div>

      {/* ──────────────────────────────────────────
          RIGHT: Output Buckets + Particles
      ────────────────────────────────────────── */}
      <div className="relative flex flex-col gap-4">

        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
            AI Split Output
          </p>
          <h3
            style={{ fontFamily: "var(--font-jakarta)" }}
            className="text-lg font-bold text-[#0F172A]"
          >
            Regulatory Allocation
          </h3>
        </div>

        {/* ── BUCKET A — Religious / Tax-Exempt ── */}
        <motion.div
          animate={{
            // Glows green when done
            borderColor: phase === "done" ? "#10B981" : "#E2E8F0",
            boxShadow: phase === "done"
              ? "0 0 0 2px rgba(16,185,129,0.15), 0 4px 20px rgba(16,185,129,0.08)"
              : "none",
          }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl border p-4 space-y-3"
          id="bucket-a"
        >
          {/* Bucket header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Color-coded bucket indicator */}
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
                Bucket A — Purely Religious
              </p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Tax-Exempt
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-[#64748B]">
            Deity sewa, temple maintenance, electricity, puja materials — exempt under Sec. 11(1).
          </p>

          {/* Amount display */}
          <div className="bg-emerald-50 rounded-lg px-4 py-3">
            <p className="text-[10px] text-emerald-700 mb-1">Allocated Amount</p>
            <p
              style={{ fontFamily: "var(--font-jakarta)" }}
              className="text-2xl font-extrabold text-[#0F172A]"
            >
              {/* Show the count-up value, or dashes if not yet running */}
              {phase === "idle" ? "₹—" : formatINR(displayA)}
            </p>
          </div>

          {/* Progress fill bar — fills proportionally to BUCKET_A / total */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#10B981] rounded-full"
              animate={{ width: phase === "done" ? "73.3%" : "0%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
          </div>
          <p className="text-[10px] text-[#64748B]">73.3% of total collection</p>
        </motion.div>

        {/* ── BUCKET B — Social / Charitable ── */}
        <motion.div
          animate={{
            borderColor: phase === "done" ? "#6366F1" : "#E2E8F0",
            boxShadow: phase === "done"
              ? "0 0 0 2px rgba(99,102,241,0.12), 0 4px 20px rgba(99,102,241,0.06)"
              : "none",
          }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl border p-4 space-y-3"
          id="bucket-b"
        >
          {/* Bucket header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
                Bucket B — Social / Charitable
              </p>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              Sec 115BBC
            </span>
          </div>

          <p className="text-[11px] text-[#64748B]">
            Free kitchen (Annakshetra) — Subject to 115BBC 5% limit on anonymous donations.
          </p>

          {/* Amount display */}
          <div className="bg-indigo-50 rounded-lg px-4 py-3">
            <p className="text-[10px] text-indigo-700 mb-1">Allocated Amount</p>
            <p
              style={{ fontFamily: "var(--font-jakarta)" }}
              className="text-2xl font-extrabold text-[#0F172A]"
            >
              {phase === "idle" ? "₹—" : formatINR(displayB)}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              animate={{ width: phase === "done" ? "26.7%" : "0%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
            />
          </div>
          <p className="text-[10px] text-[#64748B]">26.7% of total collection</p>

          {/* ── "Optimized" Badge ── slides in after count-up finishes */}
          <AnimatePresence>
            {showBadge && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="
                  flex items-center gap-2 p-3 rounded-xl
                  bg-gradient-to-r from-indigo-50 to-emerald-50
                  border border-indigo-100
                "
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-[11px] font-semibold text-[#0F172A]">
                  ✅ <span className="text-emerald-700">Optimized:</span>{" "}
                  Safely below the flat 30% anonymous donation tax threshold.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── PARTICLE LAYER ── */}
        {/*
          Particles are absolutely positioned over the right column.
          Each particle animates from its starting spot (near the ledger)
          toward either bucket A or bucket B using x/y transforms.

          We use `pointer-events-none` so particles don't block button clicks.
        */}
        <AnimatePresence>
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute w-2 h-2 rounded-full shadow-sm"
                  style={{ backgroundColor: p.color }}
                  // Start: cluster at the left edge (as if coming from the ledger)
                  initial={{
                    left: "-5%",
                    top: "30%",
                    scale: 0,
                    opacity: 0,
                  }}
                  // End: scatter toward bucket A (top) or bucket B (bottom)
                  animate={{
                    left: "45%",
                    top: p.bucket === "A" ? "30%" : "70%",
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 0.7,
                    delay: p.delay,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* "Flying" label that bridges the gap — visual polish */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: [0, 1, 1, 0], x: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute left-1/4 top-1/2 -translate-y-1/2 flex items-center gap-1"
              >
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

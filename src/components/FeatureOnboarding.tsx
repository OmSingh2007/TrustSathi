"use client";

/**
 * FEATURE SECTION 1 — "Zero-Touch Onboarding / Voice & Vision Bahi-Khata"
 * ─────────────────────────────────────────────────────────────────
 * Layout: Sticky text on left + scrollable visual on right (for desktop).
 * On mobile: stacked vertically.
 *
 * Key animations:
 * 1. Text column: fades in from left as section enters viewport
 * 2. Feature pills: stagger in below the heading
 * 3. AI Scanner visual: a pulsing + scanning line animation
 * 4. Language badges: float and pulse gently
 *
 * How sticky works:
 * - The left column has `position: sticky; top: 120px` — it locks in place
 *   as the user scrolls through the right column's taller content.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Camera,
  Languages,
  CheckCircle2,
  Sparkles,
  ScanLine,
} from "lucide-react";

// Feature bullet points
const FEATURES = [
  { icon: Camera, text: "Snap a photo — no typing required" },
  { icon: Mic, text: "Voice entry in Hindi, Marathi, Gujarati, Tamil" },
  { icon: Languages, text: "Reads handwritten regional scripts natively" },
  { icon: CheckCircle2, text: "Instantly audited digital ledger entry" },
];

// Script labels for the "floating language pills" visual
const LANGUAGE_PILLS = [
  { label: "हिन्दी", color: "#F97316" },
  { label: "मराठी", color: "#8B5CF6" },
  { label: "ગુજરાતી", color: "#0EA5E9" },
  { label: "தமிழ்", color: "#EC4899" },
  { label: "বাংলা", color: "#10B981" },
];

export default function FeatureOnboarding() {
  // Ref for the overall section — used to track scroll position within it
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * useScroll: tracks scroll progress as a 0→1 value
   * - target: the element to watch
   * - offset: ["start end", "end start"] means:
   *   → start tracking when element's START enters viewport's END
   *   → stop tracking when element's END exits viewport's START
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /**
   * useTransform maps scrollYProgress (0→1) to a Y translation.
   * As user scrolls down through the section, the visual moves UP slightly.
   * This creates a parallax depth effect — the visual feels like it's
   * on a different z-layer than the text.
   */
  const visualY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background accent blob */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-emerald-50/60 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* ── SECTION LABEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="
            inline-flex items-center gap-2 px-4 py-1.5
            rounded-full text-xs font-semibold tracking-wider uppercase
            bg-emerald-50 text-[#059669] border border-emerald-200
          ">
            <Sparkles className="w-3.5 h-3.5" />
            Feature 01 — Zero-Touch Onboarding
          </span>
        </motion.div>

        {/* ── TWO COLUMN LAYOUT ── */}
        {/*
          lg:items-start = align both columns to the top of the grid
          We use min-h to ensure the sticky effect has enough room to work
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:items-start">

          {/* ──────────────────────────────────────────
              LEFT: Sticky Text Column
          ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            // sticky: this div stays pinned as you scroll through the section
            // top-32: 128px from top (clears the navbar height)
            className="lg:sticky lg:top-32 flex flex-col gap-6"
          >
            {/* Heading */}
            <h2
              style={{ fontFamily: "var(--font-jakarta)" }}
              className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-[#0F172A] leading-tight"
            >
              The Voice &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
                Vision
              </span>{" "}
              Bahi-Khata
            </h2>

            {/* Body Copy */}
            <p className="text-lg text-[#64748B] leading-relaxed">
              Don&apos;t type.{" "}
              <strong className="text-[#0F172A] font-semibold">Just snap.</strong>{" "}
              Our Multilingual Vision AI reads{" "}
              <strong className="text-[#0F172A] font-semibold">
                handwritten regional scripts
              </strong>{" "}
              (Hindi, Marathi, Gujarati) and instantly converts them into an{" "}
              <strong className="text-[#0F172A] font-semibold">
                audited digital ledger.
              </strong>
            </p>

            {/* Feature Bullet List */}
            <div className="flex flex-col gap-3 mt-2">
              {FEATURES.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    // Each pill delays a bit more than the previous
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <span className="text-[#0F172A] font-medium">{feat.text}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <motion.a
              id="feature1-cta-btn"
              href="#demo"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="
                mt-4 self-start flex items-center gap-2
                px-6 py-3 rounded-xl font-semibold text-white
                bg-[#10B981] hover:bg-[#059669]
                shadow-lg shadow-emerald-100
                transition-colors duration-200
              "
            >
              <ScanLine className="w-4 h-4" />
              See It In Action
            </motion.a>
          </motion.div>

          {/* ──────────────────────────────────────────
              RIGHT: Parallax Visual Column
          ────────────────────────────────────────── */}
          {/* The motion.div applies the parallax Y transform from useScroll */}
          <motion.div style={{ y: visualY }}>
            <AIScannerVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * AI SCANNER VISUAL
 * ─────────────────────────────────────────────────────────────────
 * Simulates a document being scanned by AI:
 * - A "paper" with handwritten text lines
 * - A moving scan line that sweeps top to bottom (repeating)
 * - Floating language recognition badges that pop in around the document
 * - Glowing emerald frame around recognized text regions
 */
function AIScannerVisual() {
  /**
   * isMounted: tracks whether we are on the client side.
   * - On server (SSR): isMounted is false → language badges are NOT rendered.
   * - After hydration (client): isMounted becomes true → badges render.
   * 
   * WHY: Math.cos/sin produce floating-point numbers that differ
   * slightly between server render and client render, causing React's
   * hydration mismatch warning. By skipping SSR for badges entirely,
   * we eliminate this mismatch completely.
   */
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <div className="relative flex items-center justify-center py-8">

      {/* Language Floating Badges — orbit around the document (client-only) */}
      {isMounted && LANGUAGE_PILLS.map((pill, i) => {
        // Compute angle and radius to place badges in a rough circle
        const angle = (i / LANGUAGE_PILLS.length) * 2 * Math.PI;
        const radius = 180; // distance from center in pixels
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * (radius * 0.6); // slightly oval

        return (
          <motion.div
            key={pill.label}
            // Position each badge via absolute + translate
            className="absolute z-20 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
            style={{
              backgroundColor: pill.color,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
            // Floating animation — each badge bobs at a slightly different rate
            animate={{
              y: [0, -8, 0, 8, 0],    // move up 8px, back, down 8px, back
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 3 + i * 0.5,   // each badge has a unique float speed
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {pill.label}
          </motion.div>
        );
      })}

      {/* ── MAIN DOCUMENT CARD ── */}
      <div className="relative w-72 bg-amber-50 rounded-2xl shadow-2xl shadow-amber-100/50 border border-amber-200 overflow-hidden p-6">

        {/* Document header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-200">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <span className="text-sm">📋</span>
          </div>
          <div>
            <p className="text-xs font-bold text-amber-900">Ledger — Jan 2025</p>
            <p className="text-[10px] text-amber-600">Rameshwar Seva Trust</p>
          </div>
        </div>

        {/* Simulated handwritten lines */}
        <div className="space-y-3">
          {[
            { hindi: "दान प्राप्त — राम जी से", amount: "₹ ४५,०००" },
            { hindi: "पुजा सामग्री खरीद", amount: "₹ ८,२००" },
            { hindi: "बिजली बिल भुगतान", amount: "₹ ३,५००" },
            { hindi: "लंगर व्यय", amount: "₹ १२,०००" },
            { hindi: "दान — अज्ञात दानी", amount: "₹ ५०,०००" },
          ].map((row, i) => (
            <motion.div
              key={i}
              className="flex justify-between items-start gap-2"
              // Each line fades in with a delay — simulates AI reading line by line
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.3 + 0.5, duration: 0.4 }}
            >
              {/* Hindi text — uses system font for Devanagari */}
              <p className="text-xs text-amber-900 font-medium leading-tight flex-1"
                style={{ fontFamily: "system-ui, sans-serif" }}>
                {row.hindi}
              </p>
              {/* Amount */}
              <p className="text-xs font-bold text-amber-800 font-mono shrink-0">{row.amount}</p>
              {/* Green checkmark — appears after "AI reads" the line */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.3 + 0.9, duration: 0.3, type: "spring" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ── SCANNING LINE ── */}
        {/*
          This sweeps from top to bottom repeatedly.
          - initial: starts at top (y = -30px, inside the card)
          - animate: moves to bottom (y = "105%" = just below the card)
          - transition: repeats infinitely with no gap between loops
        */}
        <motion.div
          className="absolute left-0 right-0 h-8 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.15), rgba(16,185,129,0.25), rgba(16,185,129,0.15), transparent)",
          }}
          initial={{ top: -30 }}
          animate={{ top: ["0%", "100%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",      // constant speed = realistic scanner beam
            repeatDelay: 0.5,    // tiny pause before restarting
          }}
        />

        {/* "AI Reading" Status Badge */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="
            absolute bottom-4 right-4
            flex items-center gap-1.5 px-2.5 py-1
            rounded-full bg-[#10B981] text-white text-[10px] font-bold
            shadow-lg shadow-emerald-200
          "
        >
          <ScanLine className="w-3 h-3" />
          AI Reading
        </motion.div>
      </div>
    </div>
  );
}

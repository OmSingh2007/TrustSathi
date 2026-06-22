"use client";

/**
 * INTERACTIVE CAPABILITY SHOWCASE
 * ─────────────────────────────────────────────────────────────────
 * A pitch-ready, tab-based simulator with two live demos:
 *   Tab 1 — FCRA & Compliance Radar (foreign donation breach simulation)
 *   Tab 2 — Gupt Daan Fund Splitter (AI parsing of Hundi collections)
 *
 * Architecture:
 *  - One parent manages the active tab state.
 *  - AnimatePresence from Framer Motion handles smooth exit/enter transitions
 *    when switching tabs (the old panel animates OUT, the new one IN).
 *  - Each tab panel is its own self-contained component with local state.
 */

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ShieldAlert, Landmark, Zap } from "lucide-react";
import FCRATab from "./FCRATab";
import FundSplitterTab from "./FundSplitterTab";

// ─── TAB CONFIG ───────────────────────────────────────────────────
const TABS = [
  {
    id: "fcra",
    label: "FCRA Compliance Radar",
    icon: ShieldAlert,
    description: "Live foreign donation breach simulation",
  },
  {
    id: "fundsplit",
    label: "Gupt Daan Fund Splitter",
    icon: Landmark,
    description: "AI-powered Hundi collection parser",
  },
];

// ─── PANEL ANIMATION VARIANTS ─────────────────────────────────────
// Used by AnimatePresence to animate the outgoing and incoming tab panels.
// initial: panel starts slightly to the right and invisible
// animate: slides to its natural position and becomes visible
// exit:    slides to the left and fades out
const panelVariants: Variants = {
  initial: { opacity: 0, x: 40, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    x: -30,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function InteractiveShowcase() {
  // activeTab holds which tab is currently selected ("fcra" or "fundsplit")
  const [activeTab, setActiveTab] = useState("fcra");

  return (
    <section id="simulator" className="relative py-28 px-6 bg-[#FAFAFA] overflow-hidden">

      {/* ── BACKGROUND DECORATIONS ── */}
      {/* Soft emerald gradient blob — top right */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-emerald-50/80 to-transparent rounded-full blur-3xl pointer-events-none" />
      {/* Soft blue blob — bottom left */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-blue-50/60 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          {/* Pill badge */}
          <span className="
            inline-flex items-center gap-2 px-4 py-1.5 mb-4
            rounded-full text-xs font-semibold tracking-wider uppercase
            bg-emerald-50 text-[#059669] border border-emerald-200
          ">
            <Zap className="w-3.5 h-3.5" />
            Live Interactive Demo
          </span>

          {/* Heading */}
          <h2
            style={{ fontFamily: "var(--font-jakarta)" }}
            className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2"
          >
            See TrustSaathi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">
              think in real-time.
            </span>
          </h2>
          <p className="text-[#64748B] mt-3 max-w-xl mx-auto">
            Click through the scenarios below — this is exactly how our AI handles
            your most complex compliance and allocation challenges.
          </p>
        </motion.div>

        {/* ── SIMULATOR SHELL ── */}
        {/*
          The "app window" chrome — mimics a desktop application.
          Rounded corners, shadow, and a dark titlebar = premium feel.
        */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="
            bg-white rounded-2xl
            border border-slate-200
            shadow-2xl shadow-slate-200/60
            overflow-hidden
          "
        >
          {/* ── TITLE BAR ── (fake OS window chrome) */}
          <div className="bg-[#0F172A] px-5 py-3 flex items-center gap-3">
            {/* Traffic light dots */}
            {["#EF4444", "#F59E0B", "#10B981"].map((c) => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
            ))}
            <span className="ml-2 text-xs text-slate-400 font-mono tracking-wide">
              TrustSaathi OS — Compliance & Intelligence Suite v2.1
            </span>
            {/* Live indicator */}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">LIVE SIM</span>
            </div>
          </div>

          {/* ── TAB BAR ── */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 pt-4 flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-5 py-3 rounded-t-xl
                    text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${isActive
                      ? "bg-white text-[#0F172A] border border-b-0 border-slate-200 -mb-px shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#10B981]" : ""}`} />
                  {tab.label}
                  {/* Active tab underline dot */}
                  {isActive && (
                    <motion.span
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#10B981]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── TAB CONTENT PANEL ── */}
          {/*
            AnimatePresence: Framer Motion's component that watches its children.
            When a child is removed from the React tree (tab changes),
            it lets the child play its `exit` animation before unmounting.
            mode="wait" = wait for the exit animation to finish before mounting
            the new panel. This prevents both panels being visible at once.
          */}
          <div className="relative min-h-[480px] overflow-hidden bg-white">
            <AnimatePresence mode="wait">
              {activeTab === "fcra" ? (
                // key must be unique per panel — AnimatePresence uses it to
                // detect when a child is swapped in/out.
                <motion.div
                  key="fcra"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <FCRATab />
                </motion.div>
              ) : (
                <motion.div
                  key="fundsplit"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <FundSplitterTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── SIMULATOR FOOTER ── */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">
              All scenarios use synthetic demo data. Live system connects to your actual books.
            </span>
            <span className="text-[10px] font-semibold text-[#10B981]">
              © TrustSaathi AI Engine
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

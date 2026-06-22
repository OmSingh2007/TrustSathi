"use client";

/**
 * TAB 1 — FCRA COMPLIANCE RADAR
 * ─────────────────────────────────────────────────────────────────
 * Simulates a foreign donation inflow breaching the FCRA limit.
 *
 * States:
 *   idle     → progress bar at 75% (safe, green)
 *   simulating → progress bar animates to 97% (danger, amber→red)
 *              → warning border flashes on the container
 *              → WhatsApp alert notification slides in from the bottom
 *
 * All animation is driven by Framer Motion using `animate` prop and
 * the `useAnimate` hook for programmatic sequencing.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Globe,
  MessageCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

// Threshold above which we consider the donation "at risk"
const DANGER_THRESHOLD = 90; // percent

export default function FCRATab() {
  // Tracks the current simulated percentage of the FCRA limit used
  const [fillPercent, setFillPercent] = useState(75);

  // Whether the simulation has been triggered
  const [isSimulating, setIsSimulating] = useState(false);

  // Whether we are in the "danger" state (above threshold)
  const [isDanger, setIsDanger] = useState(false);

  // Whether the WhatsApp notification is visible
  const [showAlert, setShowAlert] = useState(false);

  // Whether the animation is currently running (disables the button)
  const [isRunning, setIsRunning] = useState(false);

  /**
   * handleSimulate — runs a 3-phase animation sequence:
   *  Phase 1 (0ms):    Show "simulating" state, start progress bar rising
   *  Phase 2 (600ms):  Cross the threshold → flash danger border
   *  Phase 3 (1200ms): Slide in the WhatsApp notification
   */
  const handleSimulate = () => {
    if (isRunning) return; // prevent double-click during animation
    setIsRunning(true);
    setIsSimulating(true);
    setFillPercent(97); // Framer Motion will animate to this value smoothly

    // After 700ms (bar has crossed threshold), trigger danger state
    setTimeout(() => {
      setIsDanger(true);
    }, 700);

    // After 1300ms, slide in the WhatsApp alert notification
    setTimeout(() => {
      setShowAlert(true);
      setIsRunning(false);
    }, 1300);
  };

  /** handleReset — resets all state back to the idle/initial state */
  const handleReset = () => {
    setFillPercent(75);
    setIsSimulating(false);
    setIsDanger(false);
    setShowAlert(false);
    setIsRunning(false);
  };

  // Color for the progress bar — green when safe, amber when warning
  const barColor = isDanger ? "#F59E0B" : "#10B981";

  return (
    <div className="h-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      {/* ──────────────────────────────────────────
          LEFT: Control Panel
      ────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">

        {/* Panel title */}
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
            Simulation Controls
          </p>
          <h3
            style={{ fontFamily: "var(--font-jakarta)" }}
            className="text-lg font-bold text-[#0F172A]"
          >
            Incoming Foreign Donation
          </h3>
        </div>

        {/* Donation detail card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
          {/* Donor info row */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Foreign Donor</p>
              <p className="text-sm font-semibold text-[#0F172A]">Global Humanity Foundation, UK</p>
            </div>
          </div>

          {/* Amount detail */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg px-3 py-2 border border-slate-100">
              <p className="text-[10px] text-[#64748B]">Amount (INR)</p>
              <p className="text-sm font-bold text-[#0F172A]">₹15,00,000</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-slate-100">
              <p className="text-[10px] text-[#64748B]">SWIFT Code</p>
              <p className="text-sm font-bold text-[#0F172A]">BARCGB22</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            {/* Pulsing dot changes color based on state */}
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: isDanger ? "#F59E0B" : "#10B981" }}
            />
            <span className="text-xs font-medium" style={{ color: isDanger ? "#B45309" : "#059669" }}>
              {isDanger ? "⚠ Approaching FCRA limit" : "Awaiting Processing"}
            </span>
          </div>
        </div>

        {/* Simulate button — or Reset button after simulation */}
        {!isSimulating ? (
          <motion.button
            id="fcra-simulate-btn"
            onClick={handleSimulate}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isRunning}
            className="
              w-full py-4 rounded-xl font-bold text-white
              bg-gradient-to-r from-[#10B981] to-[#059669]
              shadow-lg shadow-emerald-100
              text-sm tracking-wide cursor-pointer
              disabled:opacity-60
            "
          >
            ⚡ Simulate ₹15,00,000 Foreign Inflow
          </motion.button>
        ) : (
          <motion.button
            id="fcra-reset-btn"
            onClick={handleReset}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="
              w-full py-4 rounded-xl font-bold
              border-2 border-slate-200 text-[#64748B] hover:border-slate-300
              text-sm tracking-wide flex items-center justify-center gap-2
              cursor-pointer
            "
          >
            <RefreshCw className="w-4 h-4" />
            Reset Simulation
          </motion.button>
        )}

        {/* Explainer note */}
        <p className="text-xs text-[#64748B] leading-relaxed">
          <strong className="text-[#0F172A]">FCRA Section 11(2):</strong> Foreign
          contributions must be reported within 14 days. Breach of the annual
          limit risks immediate 12A suspension.
        </p>
      </div>

      {/* ──────────────────────────────────────────
          RIGHT: Dashboard Widget
      ────────────────────────────────────────── */}
      {/*
        The container border flashes to amber/red when isDanger is true.
        We use Framer Motion's `animate` prop on the outer div to smoothly
        transition the borderColor CSS variable.
      */}
      <div className="flex flex-col gap-4">

        {/* Stats widget card */}
        <motion.div
          animate={{
            // Smoothly transition border color on danger state change
            borderColor: isDanger ? "#F59E0B" : "#E2E8F0",
            boxShadow: isDanger
              ? "0 0 0 3px rgba(245,158,11,0.15), 0 4px 24px rgba(245,158,11,0.1)"
              : "0 1px 3px rgba(0,0,0,0.05)",
          }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border p-5 space-y-4"
        >
          {/* Widget header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${isDanger ? "text-amber-500" : "text-[#10B981]"}`} />
              <p className="text-sm font-semibold text-[#0F172A]">Statutory Limit Tracker</p>
            </div>
            {/* Status badge */}
            <motion.span
              animate={{
                backgroundColor: isDanger ? "#FEF3C7" : "#ECFDF5",
                color: isDanger ? "#B45309" : "#059669",
              }}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            >
              {isDanger ? "⚠ AT RISK" : "✓ SAFE"}
            </motion.span>
          </div>

          {/* FCRA Annual Limit Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#64748B]">
              <span>FCRA Annual Foreign Contribution Limit</span>
              {/* Animated percentage text */}
              <motion.span
                animate={{ color: isDanger ? "#B45309" : "#059669" }}
                className="font-bold"
              >
                {/* We display the current fill percentage, Framer Motion handles
                    the bar itself — here we just show the number updating */}
                {fillPercent}%
              </motion.span>
            </div>

            {/* Progress bar track */}
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative">
              {/* Filled portion — width animates from 75% → 97% */}
              <motion.div
                className="h-full rounded-full"
                animate={{
                  width: `${fillPercent}%`,
                  backgroundColor: isDanger ? "#F59E0B" : "#10B981",
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              {/* Danger threshold marker line at 85% */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-400"
                style={{ left: "85%" }}
              >
                <span className="absolute -top-5 -translate-x-1/2 text-[9px] text-red-500 font-bold whitespace-nowrap">
                  Limit ▼
                </span>
              </div>
            </div>

            {/* Scale labels */}
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>₹0</span>
              <span className="text-red-400 font-semibold">85% — Statutory Limit</span>
              <span>₹1 Cr</span>
            </div>
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Received YTD", value: "₹72,00,000", ok: true },
              { label: "Post-Simulation", value: isDanger ? "₹87,00,000" : "—", ok: false },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className={`rounded-lg px-3 py-2 ${kpi.ok ? "bg-emerald-50" : isDanger ? "bg-amber-50" : "bg-slate-50"}`}
              >
                <p className="text-[10px] text-[#64748B]">{kpi.label}</p>
                <p className={`text-sm font-bold ${isDanger && !kpi.ok ? "text-amber-700" : "text-[#0F172A]"}`}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── WHATSAPP ALERT NOTIFICATION ── */}
        {/*
          AnimatePresence watches for showAlert changing.
          When it becomes true, the notification slides in from the bottom.
          When it becomes false (on reset), it slides back out.
        */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              key="whatsapp-alert"
              // Starts: below its final position + invisible
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              // Ends: fully visible at natural position
              animate={{ y: 0, opacity: 1, scale: 1 }}
              // Exit: slides back down
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="
                relative flex gap-3 p-4 rounded-xl
                bg-[#ECFEF5] border border-[#25D366]/40
                shadow-lg shadow-emerald-100/50
              "
            >
              {/* WhatsApp green icon circle */}
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-md">
                <MessageCircle className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-[#0F172A]">TrustSaathi Alerts</p>
                  <p className="text-[10px] text-[#64748B]">Just now</p>
                </div>
                {/* Alert message — bold text simulated with ** ** markdown style */}
                <p className="text-xs text-[#1A1A1A] leading-relaxed">
                  🚨 <strong>TrustSaathi Alert:</strong> Incoming foreign funds
                  approaching 12A/FCRA limit.{" "}
                  <strong>Action required within 14 days</strong> to preserve
                  tax-exempt status.
                </p>
              </div>
              {/* "Delivered" double-tick checkmark */}
              <div className="absolute bottom-3 right-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

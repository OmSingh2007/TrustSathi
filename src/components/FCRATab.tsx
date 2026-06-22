"use client";

/**
 * TAB 1 — FCRA COMPLIANCE RADAR
 * ─────────────────────────────────────────────────────────────────
 * Simulates a foreign donation inflow breaching the FCRA limit.
 *
 * States:
 *   idle       → progress bar at 75% (safe, green)
 *   simulating → bar animates to 97% (danger, amber border flashes)
 *              → WhatsApp alert notification slides in from below
 *
 * All animations driven by Framer Motion's animate prop + setTimeout
 * for sequencing the three phases.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Globe,
  MessageCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export default function FCRATab() {
  const [fillPercent, setFillPercent]   = useState(75);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDanger, setIsDanger]         = useState(false);
  const [showAlert, setShowAlert]       = useState(false);
  const [isRunning, setIsRunning]       = useState(false);

  /**
   * handleSimulate — 3-phase animation sequence:
   *  Phase 1 (0ms):    bar starts rising to 97%
   *  Phase 2 (700ms):  cross threshold → danger border turns amber
   *  Phase 3 (1300ms): WhatsApp alert springs in from below
   */
  const handleSimulate = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsSimulating(true);
    setFillPercent(97);
    setTimeout(() => setIsDanger(true), 700);
    setTimeout(() => { setShowAlert(true); setIsRunning(false); }, 1300);
  };

  const handleReset = () => {
    setFillPercent(75);
    setIsSimulating(false);
    setIsDanger(false);
    setShowAlert(false);
    setIsRunning(false);
  };

  return (
    <div className="h-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      {/* ── LEFT: Control Panel ── */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
            Simulation Controls
          </p>
          <h3 style={{ fontFamily: "var(--font-jakarta)" }}
            className="text-lg font-bold text-[#0F172A]">
            Incoming Foreign Donation
          </h3>
        </div>

        {/* Donor detail card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Foreign Donor</p>
              <p className="text-sm font-semibold text-[#0F172A]">Global Humanity Foundation, UK</p>
            </div>
          </div>
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
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: isDanger ? "#F59E0B" : "#10B981" }} />
            <span className="text-xs font-medium"
              style={{ color: isDanger ? "#B45309" : "#059669" }}>
              {isDanger ? "⚠ Approaching FCRA limit" : "Awaiting Processing"}
            </span>
          </div>
        </div>

        {/* Action button toggles between Simulate and Reset */}
        {!isSimulating ? (
          <motion.button id="fcra-simulate-btn" onClick={handleSimulate}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            disabled={isRunning}
            className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide cursor-pointer
              bg-gradient-to-r from-[#10B981] to-[#059669] shadow-lg shadow-emerald-100 disabled:opacity-60">
            ⚡ Simulate ₹15,00,000 Foreign Inflow
          </motion.button>
        ) : (
          <motion.button id="fcra-reset-btn" onClick={handleReset}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-xl font-bold border-2 border-slate-200 text-[#64748B]
              hover:border-slate-300 text-sm flex items-center justify-center gap-2 cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            Reset Simulation
          </motion.button>
        )}

        <p className="text-xs text-[#64748B] leading-relaxed">
          <strong className="text-[#0F172A]">FCRA Section 11(2):</strong> Foreign
          contributions must be reported within 14 days. Breach of the annual
          limit risks immediate 12A suspension.
        </p>
      </div>

      {/* ── RIGHT: Dashboard Widget ── */}
      <div className="flex flex-col gap-4">
        {/*
          motion.div's animate prop smoothly transitions borderColor and
          boxShadow when isDanger flips — no CSS class swapping needed.
        */}
        <motion.div
          animate={{
            borderColor: isDanger ? "#F59E0B" : "#E2E8F0",
            boxShadow: isDanger
              ? "0 0 0 3px rgba(245,158,11,0.15), 0 4px 24px rgba(245,158,11,0.1)"
              : "0 1px 3px rgba(0,0,0,0.05)",
          }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border p-5 space-y-4">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${isDanger ? "text-amber-500" : "text-[#10B981]"}`} />
              <p className="text-sm font-semibold text-[#0F172A]">Statutory Limit Tracker</p>
            </div>
            <motion.span
              animate={{ backgroundColor: isDanger ? "#FEF3C7" : "#ECFDF5", color: isDanger ? "#B45309" : "#059669" }}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full">
              {isDanger ? "⚠ AT RISK" : "✓ SAFE"}
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#64748B]">
              <span>FCRA Annual Foreign Contribution Limit</span>
              <motion.span animate={{ color: isDanger ? "#B45309" : "#059669" }} className="font-bold">
                {fillPercent}%
              </motion.span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative">
              {/*
                Width animates from 75% → 97% when fillPercent state changes.
                Framer Motion interpolates the width smoothly over 1.2 seconds.
              */}
              <motion.div className="h-full rounded-full"
                animate={{ width: `${fillPercent}%`, backgroundColor: isDanger ? "#F59E0B" : "#10B981" }}
                transition={{ duration: 1.2, ease: "easeOut" }} />
              {/* Red threshold marker fixed at 85% */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-red-400" style={{ left: "85%" }}>
                <span className="absolute -top-5 -translate-x-1/2 text-[9px] text-red-500 font-bold whitespace-nowrap">
                  Limit ▼
                </span>
              </div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>₹0</span>
              <span className="text-red-400 font-semibold">85% — Statutory Limit</span>
              <span>₹1 Cr</span>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Received YTD", value: "₹72,00,000", ok: true },
              { label: "Post-Simulation", value: isDanger ? "₹87,00,000" : "—", ok: false },
            ].map((kpi) => (
              <div key={kpi.label}
                className={`rounded-lg px-3 py-2 ${kpi.ok ? "bg-emerald-50" : isDanger ? "bg-amber-50" : "bg-slate-50"}`}>
                <p className="text-[10px] text-[#64748B]">{kpi.label}</p>
                <p className={`text-sm font-bold ${isDanger && !kpi.ok ? "text-amber-700" : "text-[#0F172A]"}`}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/*
          AnimatePresence lets the WhatsApp card play an exit animation
          when showAlert goes back to false (on Reset).
          type:"spring" gives the spring-in entrance feel.
        */}
        <AnimatePresence>
          {showAlert && (
            <motion.div key="whatsapp-alert"
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative flex gap-3 p-4 rounded-xl bg-[#ECFEF5] border border-[#25D366]/40 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-md">
                <MessageCircle className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-[#0F172A]">TrustSaathi Alerts</p>
                  <p className="text-[10px] text-[#64748B]">Just now</p>
                </div>
                <p className="text-xs text-[#1A1A1A] leading-relaxed">
                  🚨 <strong>TrustSaathi Alert:</strong> Incoming foreign funds approaching 12A/FCRA
                  limit. <strong>Action required within 14 days</strong> to preserve tax-exempt status.
                </p>
              </div>
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

"use client";

/**
 * DASHBOARD HOME PAGE — TrustSaathi
 * ─────────────────────────────────────────────────────────────────
 * Route: /dashboard
 *
 * A welcome hub showing quick stats and navigation cards
 * to the three main dashboard modules.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, FileText, ArrowRight, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

// ── QUICK STATS DATA ───────────────────────────────────────────────────────
const STATS = [
  {
    label: "Total Ledger Entries",
    value: "1,248",
    change: "+23 this month",
    trend: "up",
    icon: BookOpen,
    color: "#10B981",
    bg: "bg-[#10B981]/10",
  },
  {
    label: "Compliance Score",
    value: "94%",
    change: "2 alerts active",
    trend: "warn",
    icon: ShieldCheck,
    color: "#F59E0B",
    bg: "bg-amber-500/10",
  },
  {
    label: "Pending Filings",
    value: "3",
    change: "FCRA due in 12 days",
    trend: "alert",
    icon: FileText,
    color: "#3B82F6",
    bg: "bg-blue-500/10",
  },
];

// ── MODULE CARDS DATA ──────────────────────────────────────────────────────
const MODULES = [
  {
    title: "Digital Ledgers",
    description: "AI-powered Bahi-Khata digitization with live sync from physical records.",
    href: "/digital-ledgers",
    icon: BookOpen,
    accent: "#10B981",
    badge: "1,248 entries",
  },
  {
    title: "Compliance Radar",
    description: "Real-time FCRA, 80G and 115BBC monitoring with threshold alerts.",
    href: "/compliance-radar",
    icon: ShieldCheck,
    accent: "#F59E0B",
    badge: "2 active alerts",
  },
  {
    title: "Government Filings",
    description: "End-to-end FCRA Annual Return, ITR-7 and 80G renewal portal.",
    href: "/filings",
    icon: FileText,
    accent: "#3B82F6",
    badge: "3 pending",
  },
];

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default function DashboardHome() {
  return (
    <div className="space-y-8">

      {/* ── GREETING BANNER ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white flex items-center justify-between overflow-hidden relative"
      >
        {/* Decorative glow circle in the background */}
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />

        <div>
          <p className="text-white/50 text-sm font-medium">Welcome back 👋</p>
          <h2 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-jakarta)" }}>
            Om Singh
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Your NGO's compliance health is <span className="text-[#10B981] font-semibold">94% — Good Standing</span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#10B981]/20 border border-[#10B981]/30 rounded-full px-4 py-2">
          <CheckCircle className="w-4 h-4 text-[#10B981]" />
          <span className="text-[#10B981] text-sm font-semibold">All systems active</span>
        </div>
      </motion.div>

      {/* ── QUICK STATS ROW ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`${stat.bg} p-2.5 rounded-xl`}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-[#10B981]" />}
                {stat.trend === "warn" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                {stat.trend === "alert" && <AlertTriangle className="w-4 h-4 text-blue-500" />}
              </div>
              <p className="text-3xl font-bold text-[#0F172A] mt-3" style={{ fontFamily: "var(--font-jakarta)" }}>
                {stat.value}
              </p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">{stat.change}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── MODULE CARDS ─────────────────────────────────────────────── */}
      <div>
        <h3 className="text-[#0F172A] font-bold text-base mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
          Quick Access
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {MODULES.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              >
                <Link
                  href={mod.href}
                  className="group block bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${mod.accent}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: mod.accent }} />
                  </div>
                  <p className="text-[#0F172A] font-bold text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {mod.title}
                  </p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{mod.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ color: mod.accent, backgroundColor: `${mod.accent}15` }}
                    >
                      {mod.badge}
                    </span>
                    <ArrowRight
                      className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-200"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

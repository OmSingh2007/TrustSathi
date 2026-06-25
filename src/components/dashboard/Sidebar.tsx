"use client";

import { ShieldCheck, LayoutDashboard, FileText, AlertCircle, FileCheck, Cog } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
  { id: "ledgers", label: "Digital Ledgers", icon: FileText, active: false },
  { id: "compliance", label: "Compliance Radar", icon: AlertCircle, active: false },
  { id: "receipts", label: "80G Receipts", icon: FileCheck, active: false },
  { id: "filings", label: "Government Filings", icon: FileText, active: false },
  { id: "settings", label: "Settings", icon: Cog, active: false },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0F172A] min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          Trust<span className="text-[#10B981]">Saathi</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`
                w-full px-4 py-3 rounded-lg flex items-center gap-3
                transition-all duration-200 text-sm font-medium
                ${
                  item.active
                    ? "bg-[#10B981] text-white shadow-lg shadow-emerald-500/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 text-center">
          © 2024 TrustSaathi. All rights reserved.
        </p>
      </div>
    </aside>
  );
}

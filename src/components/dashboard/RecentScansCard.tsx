"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

const recentScans = [
  {
    id: 1,
    title: "Ledger Page 42",
    date: "Jan 15",
    status: "Processed",
    statusColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    title: "Ledger Page 43",
    date: "Jan 16",
    status: "Scanning...",
    statusColor: "bg-amber-100 text-amber-700",
    isScanning: true,
  },
];

export default function RecentScansCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/80">
        <h3 className="text-lg font-bold text-[#0F172A]">Recent AI Scans</h3>
        <p className="text-sm text-[#64748B] mt-1">
          Latest document uploads and processing status
        </p>
      </div>

      {/* Content */}
      <div className="divide-y divide-slate-200/80">
        {recentScans.map((scan) => (
          <div
            key={scan.id}
            className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {scan.isScanning ? (
                  <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-[#0F172A]">{scan.title}</p>
                <p className="text-xs text-[#94A3B8]">{scan.date}</p>
              </div>
            </div>
            <div className={`
              px-3 py-1.5 rounded-lg text-xs font-semibold
              ${scan.statusColor}
            `}>
              {scan.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

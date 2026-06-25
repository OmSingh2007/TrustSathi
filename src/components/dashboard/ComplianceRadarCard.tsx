"use client";

import { AlertTriangle } from "lucide-react";

export default function ComplianceRadarCard() {
  const fcraLimit = 85; // 85% of limit

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-[#0F172A]">Statutory Limits Radar</h3>
        </div>
        <p className="text-sm text-[#64748B] mt-1">
          Monitor compliance thresholds and statutory requirements
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* FCRA Compliance Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-[#0F172A]">
              Foreign Contributions (FCRA Limit)
            </label>
            <span className="text-sm font-bold text-amber-600">{fcraLimit}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${fcraLimit}%` }}
            />
          </div>

          {/* Warning Message */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-semibold text-amber-900">
              Action Required: Approaching 12A Threshold
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Review inflows to ensure compliance with statutory limits. Consider filing 12A exemption update if needed.
            </p>
          </div>
        </div>

        {/* Additional Compliance Status */}
        <div className="pt-4 border-t border-slate-200/80">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#475569]">80G Registration</span>
              <span className="text-xs font-bold text-emerald-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#475569]">Annual Return Filing</span>
              <span className="text-xs font-bold text-blue-600">Due in 45 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#475569]">Audit Status</span>
              <span className="text-xs font-bold text-slate-600">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

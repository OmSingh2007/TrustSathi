"use client";

/**
 * SETTINGS PAGE — TrustSaathi (Placeholder)
 * Route: /settings
 *
 * Placeholder settings page so the nav link doesn't 404.
 */

import { Settings, User, Bell, Shield, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const SETTINGS_SECTIONS = [
  { icon: User,      label: "Profile & Account",       desc: "Update your personal information and password." },
  { icon: Building2, label: "Organisation Details",    desc: "NGO name, PAN, registration numbers." },
  { icon: Bell,      label: "Notifications",           desc: "Email and in-app notification preferences." },
  { icon: Shield,    label: "Security & Permissions",  desc: "Two-factor authentication and role management." },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-4">
      {SETTINGS_SECTIONS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-shadow group"
          >
            <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="flex-1">
              <p className="text-[#0F172A] font-semibold text-sm">{s.label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{s.desc}</p>
            </div>
            <Settings className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:rotate-45 transition-all duration-300" />
          </motion.div>
        );
      })}
    </div>
  );
}

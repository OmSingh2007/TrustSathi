"use client";

import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200/80 shadow-sm">
      <div className="px-8 py-6 flex items-center justify-between">
        {/* Left: Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Welcome, Shree Siddhivinayak Trust
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage your compliance and digital records seamlessly.
          </p>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-[#0F172A]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>

          {/* User Profile Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-emerald-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
            <span className="text-white font-bold text-sm">SS</span>
          </div>
        </div>
      </div>
    </header>
  );
}

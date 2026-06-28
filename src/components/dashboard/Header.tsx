"use client";

/**
 * DASHBOARD HEADER - TrustSaathi
 *
 * A fixed top header bar containing:
 *  - LEFT:  Dynamic page title derived from the current route
 *  - RIGHT: Search icon | Notification bell (with unread dot) | Live Sync pill
 *
 * Design:
 *  - White background (#FFFFFF) with a subtle bottom border
 *  - Fixed at the top, aligned to the right of the 256px sidebar
 *  - z-30 (below sidebar's z-40 but above page content)
 */

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { useState } from "react";

// PAGE TITLE MAP
// Maps each URL path to the human-readable title shown in the header.
const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard":        { title: "Dashboard",          subtitle: "Your NGO's financial command center" },
  "/digital-ledgers":  { title: "Digital Ledgers",    subtitle: "AI-powered Bahi-Khata sync" },
  "/compliance-radar": { title: "Compliance Radar",   subtitle: "Real-time regulatory monitoring" },
  "/filings":          { title: "Government Filings", subtitle: "FCRA, 80G, ITR filing portal" },
  "/settings":         { title: "Settings",           subtitle: "Account & organisation preferences" },
};

// MAIN COMPONENT
export default function Header() {
  // usePathname() gives us the current URL (e.g. "/digital-ledgers" or "/digital-ledgers/")
  const rawPathname = usePathname();

  // Normalize: strip any trailing slash so "/digital-ledgers/" becomes "/digital-ledgers".
  // This ensures our lookup map always finds a match even if Next.js appends a trailing slash.
  // The replace() call uses a regex: /\/+$/ means "one or more slashes at the end of the string".
  // We replace that with an empty string, UNLESS the path is just "/" (the root — don't strip that).
  const pathname = rawPathname === "/" ? rawPathname : rawPathname.replace(/\/+$/, "");

  // useState tracks whether the notification dropdown is open or closed.
  // false = closed by default.
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Look up the title/subtitle for the current path.
  // The ?? (nullish coalescing) operator means: if left side is null/undefined, use right side.
  const pageInfo = PAGE_TITLES[pathname] ?? { title: "TrustSaathi", subtitle: "NGO Operating System" };

  return (
    /*
     * OUTER CONTAINER:
     *  fixed      - stays pinned to top of viewport even when scrolling
     *  top-0 right-0 - anchors to top-right corner of screen
     *  left-64    - starts 256px from left edge (= sidebar width), does NOT overlap sidebar
     *  h-16       - 64px tall, matches sidebar logo height for visual alignment
     *  z-30       - sits above main content, below sidebar (z-40)
     *  bg-white   - clean white background
     *  border-b   - 1px bottom border separating header from page content
     */
    <header className="fixed top-0 right-0 left-64 h-16 z-30 bg-white border-b border-slate-200 flex items-center justify-between px-6">

      {/* LEFT: DYNAMIC PAGE TITLE */}
      <div>
        {/*
         * h1 tag: dynamic title that changes per page via usePathname().
         * text-[#0F172A]: Navy Blue for strong contrast on white background.
         * font-bold + text-lg: prominent hierarchy.
         * fontFamily via inline style uses our Plus Jakarta Sans heading font CSS variable.
         */}
        <h1
          className="text-[#0F172A] font-bold text-lg leading-none"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {pageInfo.title}
        </h1>

        {/* Subtitle: smaller muted text describing the current section */}
        <p className="text-slate-400 text-xs mt-0.5">{pageInfo.subtitle}</p>
      </div>

      {/* RIGHT: ACTION ITEMS - search, bell, live sync */}
      <div className="flex items-center gap-2">

        {/* SEARCH BUTTON */}
        {/*
         * p-2: 8px padding creates a square clickable area around the icon.
         * rounded-lg: smooth corners.
         * hover:bg-slate-100: subtle gray background appears on hover for feedback.
         * transition-colors: smooth color change animation on hover.
         */}
        <button
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Search"
        >
          {/* Search (magnifying glass) icon, 18x18 pixels */}
          <Search className="w-[18px] h-[18px]" />
        </button>

        {/* NOTIFICATION BELL SECTION */}
        {/*
         * relative: sets this div as the positioning parent for the
         * absolute-positioned dropdown menu that appears below the bell.
         */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />

            {/*
             * RED UNREAD DOT:
             *  absolute     - positioned relative to the button (which has `relative`)
             *  top-1.5 right-1.5 - sits in the top-right corner of the bell icon
             *  w-2 h-2      - tiny 8px circle
             *  bg-red-500   - bright red signals unread notifications
             *  rounded-full - makes it a perfect circle shape
             *  ring-2 ring-white - white ring around dot so it visually pops off the button
             */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* NOTIFICATION DROPDOWN: only renders when notificationsOpen is true */}
          {notificationsOpen && (
            /*
             * absolute     - positions relative to the parent `relative` div
             * right-0      - right edge aligns with the bell button
             * top-full mt-2 - appears just below the button (100% height + 8px gap)
             * w-80         - 320px wide dropdown panel
             * shadow-xl    - strong shadow for floating panel appearance
             * z-50         - sits on top of everything while open
             * animation    - custom fadeIn keyframe defined in globals.css
             */
            <div
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
              style={{ animation: "fadeIn 0.15s ease-out" }}
            >
              {/* Dropdown header row */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#0F172A]">Notifications</p>
                <span className="text-xs text-white bg-red-500 rounded-full px-2 py-0.5 font-medium">3 new</span>
              </div>

              {/*
               * Notification items — map over an array of objects.
               * Each object has: icon (emoji), text (message), time (relative), dot (boolean).
               */}
              {[
                { icon: "🔔", text: "FCRA compliance deadline in 12 days", time: "2m ago", dot: true },
                { icon: "✅", text: "ITR-7 filed successfully for FY 2024-25", time: "1h ago", dot: true },
                { icon: "⚠️", text: "Section 80G cash donation limit flagged", time: "3h ago", dot: true },
              ].map((n, i) => (
                /*
                 * key={i}: React requires a unique key on list items.
                 * last:border-0: Tailwind modifier removes the border on the last item.
                 */
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                  </div>
                  {/* Green dot marks each item as unread */}
                  {n.dot && <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full flex-shrink-0 mt-1" />}
                </div>
              ))}

              {/* Footer: link to see all notifications */}
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs text-[#10B981] font-semibold hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LIVE SYNC STATUS PILL */}
        {/*
         * A status badge indicating data sync is active.
         *
         * rounded-full     - fully rounded pill shape
         * bg-[#10B981]/10  - 10% opacity emerald background (very subtle wash)
         * border-[#10B981]/20 - faint emerald border
         * ml-2             - small left margin to separate from notification bell
         */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 ml-2">
          {/*
           * SONAR PING ANIMATION - the "two-span" trick:
           *
           * Outer span: `relative flex` acts as a container sized to h-2 w-2.
           *
           * Inner span 1 (`animate-ping`):
           *   - `absolute` + `inline-flex h-full w-full` = same size as container
           *   - animate-ping is a Tailwind CSS animation that makes the element
           *     scale up from 1x to ~1.75x and fade to opacity 0, then repeat.
           *   - This creates the expanding ring "sonar" effect.
           *   - opacity-75: starts slightly transparent to look more like a fade.
           *
           * Inner span 2 (the solid dot):
           *   - `relative` ensures it renders on TOP of the absolute ping span.
           *   - Always solid and visible — the static center of the animation.
           */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>

          {/* Status label text */}
          <span className="text-[#10B981] text-xs font-semibold">Live Sync: Active</span>
        </div>
      </div>

      {/*
       * CLICK-OUTSIDE OVERLAY:
       * A transparent full-screen div that captures clicks anywhere outside
       * the notification dropdown. When clicked, sets notificationsOpen to false.
       *
       * Only renders when dropdown is open (notificationsOpen && ...).
       * z-40: sits above content but below the dropdown (z-50).
       * inset-0: covers the entire viewport (top:0, right:0, bottom:0, left:0).
       */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setNotificationsOpen(false)}
        />
      )}
    </header>
  );
}

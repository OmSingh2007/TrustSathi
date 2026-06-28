"use client";

/**
 * DASHBOARD SIDEBAR - TrustSaathi
 *
 * A fixed-width left navigation sidebar with:
 *  - TrustSaathi logo + branding at the top
 *  - 5 navigation links with Lucide icons and active-state highlighting
 *  - User profile block + logout button at the bottom
 *
 * Design tokens:
 *  #0F172A  -> Navy Blue (sidebar background)
 *  #1E293B  -> Navy Light (hover background)
 *  #10B981  -> Emerald Green (active border + accent)
 *  white    -> Text color on the dark background
 */

import Link from "next/link";
// usePathname() is a Next.js client-side hook that returns the current URL path.
// We use it to determine which nav link is "active" and highlight it.
import { usePathname } from "next/navigation";

// Lucide React icon imports - each is a single SVG icon component.
import {
  LayoutDashboard, // Dashboard / Home icon
  BookOpen,        // Digital Ledgers icon
  ShieldCheck,     // Compliance Radar icon
  FileText,        // Government Filings icon
  Settings,        // Settings icon
  LogOut,          // Logout / Sign out icon
  Shield,          // TrustSaathi brand shield icon
} from "lucide-react";

// ---- TYPES ---------------------------------------------------------------
// TypeScript interface describing each navigation item's shape.
interface NavItem {
  label: string;          // Text shown next to the icon
  href: string;           // URL path this link navigates to
  icon: React.ElementType; // A Lucide icon component (used as a value, not JSX)
}

// ---- NAV ITEMS DATA -------------------------------------------------------
// Array of all sidebar navigation links.
// Mapping over this array renders all nav links automatically.
const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",          href: "/dashboard",        icon: LayoutDashboard },
  { label: "Digital Ledgers",    href: "/digital-ledgers",  icon: BookOpen },
  { label: "Compliance Radar",   href: "/compliance-radar", icon: ShieldCheck },
  { label: "Government Filings", href: "/filings",          icon: FileText },
  { label: "Settings",           href: "/settings",         icon: Settings },
];

// ---- MAIN COMPONENT -------------------------------------------------------
export default function Sidebar() {
  // usePathname returns the current URL path string, e.g. "/digital-ledgers"
  const rawPathname = usePathname();

  // Normalize: strip trailing slashes so "/digital-ledgers/" === "/digital-ledgers".
  // Next.js can sometimes return paths WITH a trailing slash depending on configuration.
  // If we don't normalize, our isActive check (pathname === item.href) would fail,
  // because "/digital-ledgers/" !== "/digital-ledgers".
  // regex /\/+$/ = one or more '/' characters at the very end of the string.
  const pathname = rawPathname === "/" ? rawPathname : rawPathname.replace(/\/+$/, "");

  return (
    /*
     * SIDEBAR CONTAINER:
     *  fixed        - stays in place while the main content scrolls
     *  inset-y-0 left-0 - anchors to the full left height of the screen
     *  w-64         - 256px wide (16rem)
     *  flex flex-col - stacks children vertically (logo -> nav -> user block)
     *  z-40         - above page content but nav links are still clickable
     *  bg-[#0F172A] - Navy Blue background (our design system token)
     *  border-r     - subtle 1px right border separating sidebar from content
     */
    <aside className="fixed inset-y-0 left-0 w-64 flex flex-col z-40 bg-[#0F172A] border-r border-white/5">

      {/* LOGO SECTION */}
      {/*
       * h-16: 64px height, matches the top header height exactly.
       * This visual alignment makes logo and header feel like one bar.
       * border-b: subtle dividing line below the logo area.
       * flex-shrink-0: prevents this block from shrinking when content is tall.
       */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/5 flex-shrink-0">
        {/*
         * LOGO ICON BADGE:
         *  w-9 h-9       - 36px square
         *  bg-[#10B981]  - solid Emerald Green fill
         *  rounded-xl    - nicely rounded corners (not fully circular)
         *  shadow-lg shadow-emerald-500/30 - glowing emerald drop shadow for depth
         *  flex items-center justify-center - centers the Shield icon inside
         *  flex-shrink-0 - prevents badge from shrinking
         */}
        <div className="w-9 h-9 bg-[#10B981] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
          <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>

        {/* BRAND TEXT: product name on top, tagline below */}
        <div>
          <p className="text-white font-bold text-sm leading-none tracking-wide">TrustSaathi</p>
          <p className="text-white/40 text-[10px] mt-0.5 tracking-wider uppercase">NGO OS</p>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      {/*
       * flex-1: expands to fill all vertical space between the logo and user block.
       *         This pushes the user block to the very bottom of the sidebar.
       * overflow-y-auto: if many nav links overflow, this section becomes scrollable.
       * py-4: top and bottom padding inside the nav section.
       * px-3: left/right padding for the nav list.
       */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">

        {/* Section label - small uppercase heading above the links */}
        <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold px-3 mb-2">
          Main Menu
        </p>

        {/*
         * NAV LINK LIST:
         * We .map() over NAV_ITEMS to render each link.
         * For each item, we check if pathname matches item.href to set isActive.
         */}
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            // isActive is true when the current URL path exactly matches this link's href.
            const isActive = pathname === item.href;

            // Store the icon component in a variable with capital letter.
            // In React, components MUST start with a capital letter.
            // item.icon is React.ElementType — we can render it as <Icon />.
            const Icon = item.icon;

            return (
              <li key={item.href}>
                {/*
                 * Next.js <Link> component provides client-side navigation.
                 * Unlike <a href>, Link does NOT do a full page reload.
                 * It only renders what changed (the page content), keeping
                 * the sidebar/header persistent without any flicker.
                 *
                 * "group" class: Tailwind's parent-hover mechanism.
                 * Applying `group` to a parent lets child elements use
                 * `group-hover:` prefix to change styles when the PARENT is hovered.
                 * Example: `group-hover:text-white/70` on the icon changes icon
                 * color when the ENTIRE link is hovered, not just the icon itself.
                 *
                 * ACTIVE STATE styles (when isActive = true):
                 *  bg-[#10B981]/10  - 10% opacity emerald background wash
                 *  text-[#10B981]   - Emerald text color
                 *  border-l-2 border-[#10B981] - 2px left border in emerald (the highlight strip)
                 *  pl-[10px]        - compensate padding for the 2px border (keeps text aligned)
                 *
                 * INACTIVE STATE styles (when isActive = false):
                 *  text-white/50    - 50% opacity white (muted)
                 *  hover:bg-[#1E293B] - slightly lighter navy on hover
                 *  hover:text-white/90 - near-full white text on hover
                 *  border-l-2 border-transparent - invisible left border (keeps layout stable)
                 */}
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-sm font-medium transition-all duration-200
                    group relative
                    ${isActive
                      ? "bg-[#10B981]/10 text-[#10B981] border-l-2 border-[#10B981] pl-[10px]"
                      : "text-white/50 hover:bg-[#1E293B] hover:text-white/90 border-l-2 border-transparent"
                    }
                  `}
                >
                  {/*
                   * Dynamic Icon render:
                   * <Icon /> works because Icon = item.icon which is a React component.
                   * w-4 h-4: 16px icon size.
                   * flex-shrink-0: prevents icon from squishing on narrow screens.
                   * transition-colors: smooth color change on hover.
                   * group-hover:text-white/70: icon brightens when the whole link is hovered.
                   */}
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? "text-[#10B981]" : "text-white/40 group-hover:text-white/70"
                    }`}
                  />

                  {/* Link label text */}
                  {item.label}

                  {/* Active indicator dot: small emerald circle pushed to the far right */}
                  {isActive && (
                    /*
                     * ml-auto: pushes this element to the rightmost edge of the flex row.
                     * This creates the visual "active route indicator" dot on the right side.
                     */
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* USER PROFILE BLOCK */}
      {/*
       * flex-shrink-0: this block never shrinks; it stays at the bottom.
       * border-t: separating line above the profile area.
       * p-4: comfortable padding on all sides.
       * space-y-3: 12px vertical gap between user info row and logout button.
       */}
      <div className="flex-shrink-0 border-t border-white/5 p-4 space-y-3">

        {/* USER INFO ROW: avatar + name/role */}
        <div className="flex items-center gap-3">
          {/*
           * AVATAR CIRCLE:
           *  w-9 h-9       - 36px circle
           *  rounded-full  - perfect circle
           *  bg-gradient-to-br - diagonal gradient from top-left to bottom-right
           *  from-[#10B981] to-[#0D9488] - emerald to teal gradient (premium look)
           *  flex items-center justify-center - centers the initials text
           *  flex-shrink-0 - prevents it from squishing
           */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#10B981] to-[#0D9488] flex items-center justify-center flex-shrink-0">
            {/* User initials: "OS" for Om Singh */}
            <span className="text-white text-xs font-bold">OS</span>
          </div>

          {/* NAME + ROLE STACKED TEXT */}
          <div className="flex-1 min-w-0">
            {/*
             * truncate: adds "..." ellipsis if the name overflows.
             * This is important for a 256px sidebar where long names could break layout.
             */}
            <p className="text-white text-sm font-semibold truncate">Om Singh</p>
            <p className="text-white/40 text-xs truncate">Admin</p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        {/*
         * w-full: stretches to the full sidebar width.
         * group: enables group-hover on the LogOut icon inside.
         * hover:text-red-400: text turns red-ish on hover (danger color = logout).
         * hover:bg-red-500/10: very subtle red background wash on hover.
         */}
        <button
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg
            text-white/40 hover:text-red-400 hover:bg-red-500/10
            text-xs font-medium transition-all duration-200 group"
        >
          {/*
           * LogOut icon: changes to red when button is hovered.
           * group-hover:text-red-400: uses the parent's `group` class to trigger on hover.
           */}
          <LogOut className="w-3.5 h-3.5 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

/**
 * DASHBOARD LAYOUT - TrustSaathi
 * Route Group: (dashboard)
 *
 * This layout wraps all three dashboard pages:
 *   /digital-ledgers  -> Digital Ledgers
 *   /compliance-radar -> Compliance Radar
 *   /filings          -> Government Filings Portal
 *   /dashboard        -> Dashboard Home
 *   /settings         -> Settings
 *
 * It provides the persistent:
 *   - Left Sidebar (fixed, 256px wide)
 *   - Top Header   (fixed, 64px tall, starts at left-64)
 *   - Main content area (scrollable, ivory background, padded)
 *
 * WHY USE A ROUTE GROUP?
 * Next.js "route groups" are folders with parentheses in their name,
 * like `(dashboard)`. They GROUP routes together WITHOUT affecting
 * the URL. So `/digital-ledgers` stays `/digital-ledgers`, not
 * `/dashboard/digital-ledgers`. The group just lets us share this
 * layout among multiple pages cleanly.
 *
 * This file is a SERVER COMPONENT (no "use client" directive),
 * which is best for layout files. Sidebar & Header are Client
 * Components (they use hooks like usePathname, useState).
 */

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

/**
 * DashboardLayout
 * @param children - The page content for whichever route is active.
 *                   Next.js injects this automatically. For example, when
 *                   the user visits /digital-ledgers, Next.js renders the
 *                   DigitalLedgersPage as `children` inside this layout.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
     * ROOT WRAPPER:
     *  min-h-screen - always fills at least the full viewport height
     *  bg-[#FAFAFA] - soft Ivory background (our design system token)
     */
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* SIDEBAR - renders as `fixed inset-y-0 left-0 w-64` inside the component */}
      {/*
       * Sidebar is a Client Component (uses usePathname hook).
       * It sticks to the left side of the screen independently
       * of the normal document flow. Does NOT affect layout of siblings.
       */}
      <Sidebar />

      {/* HEADER - renders as `fixed top-0 right-0 left-64 h-16` inside the component */}
      {/*
       * Header is a Client Component (uses usePathname + useState hooks).
       * It sits above main content on the right side of the sidebar.
       */}
      <Header />

      {/* MAIN CONTENT AREA - the scrollable region where each page renders */}
      {/*
       * ml-64    - left margin of 256px (= sidebar width) so content does NOT
       *            hide behind the fixed sidebar. Since sidebar is `fixed`, it
       *            floats above the document - we manually push content right.
       *
       * pt-16    - top padding of 64px (= header height) so content does NOT
       *            render behind the fixed header bar.
       *
       * min-h-screen - page always fills the full viewport height.
       */}
      <main className="ml-64 pt-16 min-h-screen">
        {/*
         * INNER PADDING WRAPPER:
         *  p-6              - 24px of breathing room on all 4 sides
         *  max-w-screen-2xl - caps content width at ~1536px on very wide screens
         *  mx-auto          - centers the content if max-w kicks in
         *
         * {children} is replaced by Next.js with the active page's JSX.
         * For example, visiting /filings renders the FilingsPage component here.
         */}
        <div className="p-6 max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

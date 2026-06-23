"use client";

/**
 * NAVBAR COMPONENT
 * ─────────────────────────────────────────────────────────────────
 * - Sticky top navigation with a glassmorphism effect.
 * - Uses Framer Motion to slide down on load.
 * - Becomes more opaque when user scrolls down (dynamic blur).
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Menu, X } from "lucide-react";
import Link from "next/link";

// Navigation link data — easy to add/remove links here
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  // Track whether user has scrolled past 20px
  const [scrolled, setScrolled] = useState(false);
  // Track mobile menu open/close state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Listen to scroll events and update 'scrolled' state
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    // Cleanup: remove listener when component unmounts to avoid memory leaks
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /**
     * motion.nav — animates the navbar sliding in from the top on page load.
     * initial: starts 20px above its natural position, invisible
     * animate: slides to y=0 and becomes fully visible
     * transition: spring physics feel (stiffness controls bounce, damping controls settle speed)
     * 
     * The className changes dynamically:
     * - When scrolled: white/80 bg + heavier blur + border + shadow
     * - When not scrolled: white/50 bg + lighter blur (feels glassy)
     */
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`
        fixed top-0 left-0 right-0 z-50 px-6 py-4
        transition-all duration-300
        ${scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
          : "bg-white/50 backdrop-blur-md"
        }
      `}
    >
      {/* Max width container — keeps content centered on large screens */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* ShieldCheck icon from Lucide — represents protection and trust */}
            <div className="w-9 h-9 bg-[#10B981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            {/* Brand name — uses Plus Jakarta Sans via the font variable */}
            <span
              className="text-xl font-bold text-[#0F172A] tracking-tight"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Trust<span className="text-[#10B981]">Saathi</span>
            </span>
          </Link>
        {/* ── DESKTOP NAV LINKS ── (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors duration-200 relative group"
            >
              {link.label}
              {/* 
                Underline that grows from left on hover.
                - scaleX(0): starts invisible (width = 0)
                - group-hover: on parent hover, transitions to scaleX(1) (full width)
                - origin-left: the growth starts from the left side
              */}
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#10B981] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}
        </div>

        {/* ── CTA BUTTONS ── (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Login — ghost/outline button */}
          <Link
            href="/login"
            id="navbar-login-btn"
            className="
              px-5 py-2.5 rounded-xl text-sm font-semibold
              text-[#475569] hover:text-[#0F172A]
              border border-slate-200 hover:border-slate-300
              transition-all duration-200
            "
          >
            Login
          </Link>

          {/* Request Demo — solid emerald */}
          <motion.a
            href="#demo"
            id="navbar-cta-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="
              px-5 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-[#10B981] hover:bg-[#059669]
              shadow-lg shadow-emerald-200/70
              transition-colors duration-200
            "
          >
            Request Demo
          </motion.a>
        </div>

        {/* ── MOBILE HAMBURGER ICON ── */}
        <button
          id="mobile-menu-btn"
          className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-slate-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {/* Toggle between X (close) and Menu (open) icon */}
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {menuOpen && (
        <motion.div
          // Animate from invisible + slightly shifted up → visible at normal position
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden mt-4 pb-4 border-t border-slate-100"
        >
          <div className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}  // close menu on link click
                className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
            >
              Login
            </Link>
            <a
              href="#demo"
              className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#10B981] text-center"
            >
              Request Demo
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

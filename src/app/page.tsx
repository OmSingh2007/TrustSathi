import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeatureOnboarding from "@/components/FeatureOnboarding";
import InteractiveShowcase from "@/components/InteractiveShowcase";

/**
 * ROOT PAGE
 * ─────────────────────────────────────────────────────────────────
 * Assembles all Phase 1 sections in order:
 *  1. Navbar (sticky, always on top)
 *  2. Hero Section (above the fold)
 *  3. Stats / Ticking Time Bomb Section
 *  4. Feature 1 — Zero-Touch Onboarding (Voice & Vision Bahi-Khata)
 *  5. Interactive Capability Showcase (Simulator — FCRA + Fund Splitter)
 *
 * Each section is a separate component — easy to add/reorder.
 */
export default function Home() {
  return (
    <main>
      {/* Sticky navbar — fixed at top, layered above everything (z-50) */}
      <Navbar />

      {/* Above-the-fold hero with 3D tilt card */}
      <HeroSection />

      {/* Stats with animated counters — "Ticking Time Bomb" */}
      <StatsSection />

      {/* Feature 1 — AI scanner with sticky text + parallax visual */}
      <FeatureOnboarding />

      {/* Interactive pitch simulator — FCRA Radar + Gupt Daan Fund Splitter */}
      <InteractiveShowcase />
    </main>
  );
}

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeatureOnboarding from "@/components/FeatureOnboarding";
import InteractiveShowcase from "@/components/InteractiveShowcase";
import FeaturesGrid from "@/components/FeaturesGrid";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

/**
 * ROOT PAGE — TrustSaathi Landing Page
 * ─────────────────────────────────────────────────────────────────
 * Section order (top → bottom):
 *
 *  1. Navbar               — Sticky glassmorphism nav
 *  2. HeroSection          — Split hero with 3D tilt dashboard card
 *  3. StatsSection         — "Ticking Time Bomb" animated counters
 *  4. FeatureOnboarding    — Voice & Vision Bahi-Khata (sticky + parallax)
 *  5. InteractiveShowcase  — FCRA Radar + Gupt Daan Fund Splitter tabs
 *  ────────────────────────────────────────────────────────────────
 *  6. FeaturesGrid         — The Three Pillars (static feature cards)
 *  7. HowItWorks           — 3-step process timeline
 *  8. CTASection           — "Secure Your Trust's Legacy Today"
 *  9. Footer               — Dark navy corporate footer
 */
export default function Home() {
  return (
    <main>
      {/* ── PHASE 1: ABOVE THE FOLD ── */}
      <Navbar />
      <HeroSection />

      {/* ── PHASE 2: PROBLEM AWARENESS ── */}
      <StatsSection />

      {/* ── PHASE 3: PRODUCT DEMOS ── */}
      <FeatureOnboarding />
      <InteractiveShowcase />

      {/* ── PHASE 4: MARKETING CLOSE ── */}
      <FeaturesGrid />
      <HowItWorks />
      <CTASection />

      {/* ── FOOTER ── */}
      <Footer />
    </main>
  );
}

"use client";

/**
 * LOGIN PAGE — TrustSaathi
 * ─────────────────────────────────────────────────────────────────
 * Route: /login
 *
 * Three-state authentication flow (each state animates in/out):
 *
 *   "mobile"  → User enters their +91 mobile number → clicks "Send OTP"
 *   "otp"     → 6 individual digit boxes appear, auto-advance on input
 *   "email"   → Email + Password fallback when user clicks secondary CTA
 *
 * Design language:
 *  - Full-viewport ivory background with a subtle dot-grid pattern
 *  - Decorative radial gradient orbs for depth (no dark mode)
 *  - Centered glassmorphism card: white bg, border, large shadow
 *  - Framer Motion AnimatePresence for smooth state transitions
 *  - Emerald accents match the landing page exactly
 */

import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────
// The three screens the user can be on
type AuthStep = "mobile" | "otp" | "email";

// Typed as Variants so TypeScript validates all keys against Framer Motion's schema.
const panelVariants: Variants = {
  initial: { opacity: 0, x: 32 },
  animate: {
    opacity: 1,
    x: 0,
    // 'as const' narrows number[] to [n,n,n,n] tuple — required by Framer Motion's Easing type
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    x: -24,
    // Without 'as const', TypeScript infers "easeIn" as the broad type 'string'.
    // Framer Motion's Easing type is a union of specific literals: "easeIn" | "easeOut" | ...
    // 'as const' narrows it to the literal "easeIn" — exactly what Framer Motion expects.
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

// ─── OTP_LENGTH ───────────────────────────────────────────────────
const OTP_LENGTH = 6; // Number of OTP digit boxes to render

export default function LoginPage() {
  // Which screen is currently shown
  const [step, setStep] = useState<AuthStep>("mobile");

  // Mobile number state (digits only, max 10)
  const [mobile, setMobile] = useState("");

  // OTP digits — an array of single characters, e.g. ["1","2","","","",""]
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  // Email/password states
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false); // toggle password visibility

  // Loading state for the "Send OTP" button
  const [isSending, setIsSending] = useState(false);

  // Countdown for OTP resend (30 seconds)
  const [resendTimer, setResendTimer] = useState(0);

  // Array of refs — one per OTP input box so we can programmatically focus them
  // useRef(null) creates a ref; we store all 6 in an array
  const otpRefs = useRef<Array<HTMLInputElement | null>>(
    Array(OTP_LENGTH).fill(null)
  );

  /**
   * handleSendOTP — simulates sending the OTP.
   * In production: call your SMS API here (e.g. Twilio / MSG91).
   * Shows a 1.5s loading state, then transitions to the "otp" screen.
   * Also starts the 30-second resend countdown.
   */
  const handleSendOTP = () => {
    if (mobile.length < 10) return; // basic validation
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setStep("otp");
      startResendTimer();
      // Auto-focus the first OTP box after a brief delay
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    }, 1500);
  };

  /**
   * startResendTimer — counts down from 30 to 0.
   * Uses setInterval; clears itself when it hits 0.
   */
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * handleOtpChange — fires when user types into one OTP box.
   * - Accepts only digits (filters non-numeric input)
   * - Stores the digit in the otp array at the correct index
   * - Auto-advances focus to the next box
   */
  const handleOtpChange = (index: number, value: string) => {
    // Only allow a single digit (0-9)
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // If user typed a digit and there's a next box, move focus there
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  /**
   * handleOtpKeyDown — handles Backspace in OTP boxes.
   * If the current box is empty and user presses Backspace,
   * we move focus to the previous box (standard OTP UX behaviour).
   */
  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Check if all OTP digits are filled in
  const otpComplete = otp.every((d) => d !== "");

  return (
    /**
     * Full-viewport wrapper:
     * - min-h-screen: at least 100vh tall
     * - flex items-center justify-center: perfectly centers the card
     * - bg-[#FAFAFA]: matches landing page ivory background
     * - overflow-hidden: prevents decorative orbs from creating scrollbars
     */
    <div className="relative min-h-screen flex items-center justify-center bg-[#FAFAFA] overflow-hidden px-4 py-12">

      {/* ── BACKGROUND: DOT GRID PATTERN ── */}
      {/*
        A repeating radial-gradient creates the dot pattern.
        Each dot is 1.5px, spaced 28px apart — very subtle.
        opacity-60 keeps it from being distracting.
      */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── DECORATIVE ORBS ── */}
      {/* Emerald glow — top right */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
      {/* Slate blue glow — bottom left */}
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

      {/* ── LOGIN CARD ── */}
      {/*
        motion.div with initial opacity:0 / y:24 → y:0 / opacity:1
        Creates a satisfying "rise into view" entrance when the page loads.
        
        The card uses:
        - bg-white for the base
        - backdrop-blur-sm for glassmorphism depth
        - border border-slate-200/80 for the glass edge
        - shadow-2xl shadow-slate-300/40 for the floating feel
      */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="
          relative w-full max-w-md
          bg-white/90 backdrop-blur-sm
          rounded-3xl
          border border-slate-200/80
          shadow-2xl shadow-slate-300/40
          overflow-hidden
        "
      >
        {/* Subtle inner gradient overlay — gives the card a faint shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-emerald-50/30 pointer-events-none rounded-3xl" />

        {/* ── TOP SECURITY BANNER ── */}
        {/*
          A narrow emerald stripe at the very top of the card.
          Visually signals "this is a secure portal" before the user
          reads any text — like a bank's login page.
        */}
        <div className="relative bg-[#0F172A] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Secure Connection · SSL/TLS 1.3
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">AES-256</span>
        </div>

        {/* ── CARD BODY ── */}
        <div className="relative p-8 sm:p-10">

          {/* ── LOGO & HEADER ── */}
          <div className="flex flex-col items-center text-center mb-8 gap-3">
            {/* Logo mark */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-11 h-11 bg-[#10B981] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <ShieldCheck className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="text-2xl font-bold text-[#0F172A] tracking-tight"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Trust<span className="text-[#10B981]">Saathi</span>
              </span>
            </Link>

            {/* Heading + subtext */}
            <div className="mt-1">
              <h1
                style={{ fontFamily: "var(--font-jakarta)" }}
                className="text-xl font-extrabold text-[#0F172A]"
              >
                Welcome Back, Trustee
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Securely access your compliance dashboard.
              </p>
            </div>
          </div>

          {/* ── ANIMATED FORM PANELS ── */}
          {/*
            AnimatePresence mode="wait":
            When step changes, the current panel plays its "exit" animation
            BEFORE the new panel plays its "initial→animate" animation.
            This prevents two panels being visible simultaneously.
          */}
          <AnimatePresence mode="wait">

            {/* ═══════════════════════════════════
                PANEL 1: MOBILE NUMBER ENTRY
            ═══════════════════════════════════ */}
            {step === "mobile" && (
              <motion.div
                key="mobile-panel"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-4"
              >
                {/* Mobile number input with +91 prefix */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                    Mobile Number
                  </label>

                  {/*
                    Input group: the +91 prefix box + the number input sit
                    side by side inside a flex container that looks like one field.
                    focus-within:ring-2 = the whole group gets a ring when the
                    input inside it is focused.
                  */}
                  <div className="
                    flex items-center rounded-xl
                    border border-slate-200
                    focus-within:ring-2 focus-within:ring-[#10B981]/30
                    focus-within:border-[#10B981]
                    transition-all duration-200
                    bg-white overflow-hidden
                  ">
                    {/* Flag + country code prefix */}
                    <div className="flex items-center gap-2 px-3 py-3.5 border-r border-slate-200 bg-slate-50 shrink-0">
                      {/* Indian flag as text emoji */}
                      <span className="text-lg leading-none">🇮🇳</span>
                      <span className="text-sm font-semibold text-[#475569]">+91</span>
                    </div>

                    {/* Actual input — no border (border is on the container) */}
                    <input
                      id="mobile-input"
                      type="tel"              // Shows numeric keyboard on mobile devices
                      inputMode="numeric"    // Numeric keyboard on modern browsers
                      maxLength={10}
                      value={mobile}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        // Only allow digits; strip everything else
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="98765 43210"
                      className="
                        flex-1 px-4 py-3.5 text-sm text-[#0F172A]
                        placeholder:text-slate-400
                        bg-transparent border-none outline-none
                        tracking-widest font-mono
                      "
                    />

                    {/* Phone icon on the right edge */}
                    <div className="px-3">
                      <Phone className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#94A3B8]">
                    We&apos;ll send a 6-digit OTP to this number via SMS.
                  </p>
                </div>

                {/* Send OTP button */}
                <motion.button
                  id="send-otp-btn"
                  onClick={handleSendOTP}
                  disabled={mobile.length < 10 || isSending}
                  whileHover={mobile.length === 10 ? { scale: 1.02 } : {}}
                  whileTap={mobile.length === 10 ? { scale: 0.98 } : {}}
                  className="
                    w-full py-4 rounded-xl font-bold text-white text-sm
                    bg-[#10B981] hover:bg-[#059669]
                    shadow-lg shadow-emerald-100
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  "
                >
                  {isSending ? (
                    /* Loading spinner — CSS animation via animate-spin */
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send Secure OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {/* ── DIVIDER ── */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-[#94A3B8] font-medium">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Email/Password alternative */}
                <motion.button
                  id="switch-to-email-btn"
                  onClick={() => setStep("email")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    w-full py-3.5 rounded-xl font-semibold text-sm
                    text-[#475569] hover:text-[#0F172A]
                    border-2 border-slate-200 hover:border-slate-300
                    transition-all duration-200
                    flex items-center justify-center gap-2
                  "
                >
                  <Mail className="w-4 h-4" />
                  Login with Email & Password
                </motion.button>
              </motion.div>
            )}

            {/* ═══════════════════════════════════
                PANEL 2: OTP VERIFICATION
            ═══════════════════════════════════ */}
            {step === "otp" && (
              <motion.div
                key="otp-panel"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-5"
              >
                {/* Back link */}
                <button
                  onClick={() => { setStep("mobile"); setOtp(Array(OTP_LENGTH).fill("")); }}
                  className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors w-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change number
                </button>

                {/* Info text */}
                <div className="text-center">
                  <p className="text-sm text-[#64748B]">
                    Enter the 6-digit OTP sent to
                  </p>
                  <p className="text-sm font-bold text-[#0F172A] mt-0.5">
                    +91 {mobile.slice(0, 5)} {mobile.slice(5)}
                  </p>
                </div>

                {/* ── OTP DIGIT BOXES ── */}
                {/*
                  Six individual single-character input boxes.
                  Each input:
                    - Only accepts 1 character (maxLength=1)
                    - Auto-advances to the next box on digit entry
                    - Moves back to previous box on Backspace when empty
                    - ref is stored in the otpRefs array for programmatic focus
                */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {Array.from({ length: OTP_LENGTH }, (_, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      id={`otp-box-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="
                        w-11 h-14 sm:w-12 sm:h-14
                        text-center text-xl font-bold text-[#0F172A]
                        rounded-xl border-2 border-slate-200
                        focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20
                        focus:outline-none
                        transition-all duration-150
                        bg-white
                      "
                    />
                  ))}
                </div>

                {/* Verify button — only active when all 6 digits entered */}
                <motion.button
                  id="verify-otp-btn"
                  disabled={!otpComplete}
                  whileHover={otpComplete ? { scale: 1.02 } : {}}
                  whileTap={otpComplete ? { scale: 0.98 } : {}}
                  className="
                    w-full py-4 rounded-xl font-bold text-white text-sm
                    bg-[#10B981] hover:bg-[#059669]
                    shadow-lg shadow-emerald-100
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  "
                >
                  Verify & Access Dashboard
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                {/* Resend timer / Resend button */}
                <p className="text-center text-xs text-[#94A3B8]">
                  {resendTimer > 0 ? (
                    <>
                      Resend OTP in{" "}
                      <span className="font-bold text-[#0F172A]">{resendTimer}s</span>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setOtp(Array(OTP_LENGTH).fill(""));
                        startResendTimer();
                        otpRefs.current[0]?.focus();
                      }}
                      className="font-semibold text-[#10B981] hover:text-[#059669] transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </motion.div>
            )}

            {/* ═══════════════════════════════════
                PANEL 3: EMAIL + PASSWORD
            ═══════════════════════════════════ */}
            {step === "email" && (
              <motion.div
                key="email-panel"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-4"
              >
                {/* Back to mobile */}
                <button
                  onClick={() => setStep("mobile")}
                  className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors w-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Use mobile OTP instead
                </button>

                {/* Email field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="
                    flex items-center rounded-xl border border-slate-200
                    focus-within:ring-2 focus-within:ring-[#10B981]/30
                    focus-within:border-[#10B981]
                    transition-all duration-200 bg-white overflow-hidden
                  ">
                    <div className="px-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trustee@rammandir.org"
                      className="flex-1 px-2 py-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 bg-transparent border-none outline-none"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                      Password
                    </label>
                    <a href="#" className="text-xs text-[#10B981] hover:text-[#059669] font-medium transition-colors">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="
                    flex items-center rounded-xl border border-slate-200
                    focus-within:ring-2 focus-within:ring-[#10B981]/30
                    focus-within:border-[#10B981]
                    transition-all duration-200 bg-white overflow-hidden
                  ">
                    <div className="px-3">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    {/*
                      type toggles between "password" (hides chars) and "text" (shows them)
                      based on the showPass state — controlled by the eye icon button.
                    */}
                    <input
                      id="password-input"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="flex-1 px-2 py-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 bg-transparent border-none outline-none"
                    />
                    {/* Eye toggle button */}
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="px-3 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  id="email-login-btn"
                  disabled={!email || !password}
                  whileHover={email && password ? { scale: 1.02 } : {}}
                  whileTap={email && password ? { scale: 0.98 } : {}}
                  className="
                    w-full py-4 rounded-xl font-bold text-white text-sm
                    bg-[#10B981] hover:bg-[#059669]
                    shadow-lg shadow-emerald-100
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  "
                >
                  Sign In Securely
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── SECURITY FOOTER NOTE ── */}
          {/*
            Always visible at the bottom of the card regardless of which
            panel is active. Reinforces the "high-security portal" feel.
          */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Bank-grade <strong className="text-[#64748B]">256-bit encryption.</strong>{" "}
              Your trust&apos;s data is secure.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── PAGE FOOTER ── */}
      {/* Simple line below the card — links to landing page and legal pages */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
        <Link href="/" className="text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors">
          ← Back to Home
        </Link>
        <span className="text-[#CBD5E1] text-xs">·</span>
        <a href="#" className="text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors">
          Privacy Policy
        </a>
        <span className="text-[#CBD5E1] text-xs">·</span>
        <a href="#" className="text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors">
          Terms
        </a>
      </div>
    </div>
  );
}

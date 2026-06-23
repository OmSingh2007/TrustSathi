import type { Metadata } from "next";

/**
 * Metadata for the /login route.
 * Next.js App Router reads this and injects the correct <title> and
 * <meta description> tags automatically — no need to put them in the page JSX.
 */
export const metadata: Metadata = {
  title: "Login — TrustSaathi | Secure Trustee Portal",
  description:
    "Securely sign in to your TrustSaathi compliance dashboard. Mobile OTP or email login available.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // We intentionally do NOT include the main Navbar here —
  // the login page is a standalone, distraction-free screen.
  return <>{children}</>;
}

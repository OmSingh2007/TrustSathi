import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Load Inter (body text) with variable font support
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Load Plus Jakarta Sans (headings) — more geometric and premium
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// SEO metadata for the page
export const metadata: Metadata = {
  title: "TrustSaathi – AI Financial & Legal OS for Indian NGOs & Trusts",
  description:
    "Digitize Bahi-Khatas. Automate Compliance. Protect Your Impact. The AI Operating System built for India's 30 Lakh Trusts & NGOs.",
  keywords: ["NGO", "Trust", "Compliance", "AI", "Bahi-Khata", "India", "Financial OS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply both font variables to the HTML element
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      {/* 
        - bg-[#FAFAFA]: Soft ivory background (our design token)
        - text-[#0F172A]: Deep Navy for all text by default
        - font-sans: falls back to Inter via the CSS variable
        - antialiased: smoother font rendering
      */}
      <body className="bg-[#FAFAFA] text-[#0F172A] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

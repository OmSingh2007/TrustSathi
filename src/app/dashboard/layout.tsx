import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trustee Dashboard – TrustSaathi",
  description: "Manage your trust's compliance, filings, and digital ledgers.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

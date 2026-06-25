"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import UploadDropzone from "@/components/dashboard/UploadDropzone";
import RecentScansCard from "@/components/dashboard/RecentScansCard";
import ComplianceRadarCard from "@/components/dashboard/ComplianceRadarCard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Body */}
        <main className="flex-1 overflow-auto">
          {/* Upload Dropzone */}
          <UploadDropzone />

          {/* Analytics & Compliance Grid */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Card: Recent AI Scans */}
              <RecentScansCard />

              {/* Right Card: FCRA Compliance Radar */}
              <ComplianceRadarCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { Upload } from "lucide-react";

export default function UploadDropzone() {
  return (
    <div className="px-8 py-6">
      <div className="
        w-full py-12 px-8 rounded-2xl
        border-2 border-dashed border-[#10B981]
        bg-emerald-50/30 hover:bg-emerald-50/50
        transition-colors duration-200
        flex flex-col items-center justify-center gap-4
        cursor-pointer group
      ">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
          📷
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#0F172A]">
            Tap to Upload or Drop Bahi-Khata Photo
          </h2>
          <p className="text-sm text-[#64748B] mt-2">
            Upload images of your ledger pages for AI-powered scanning and analysis
          </p>
        </div>
        <button className="
          mt-4 px-6 py-2.5 rounded-lg
          bg-[#10B981] text-white font-semibold text-sm
          hover:bg-[#059669]
          shadow-lg shadow-emerald-200
          transition-all duration-200
        ">
          <Upload className="w-4 h-4 inline mr-2" />
          Browse Files
        </button>
      </div>
    </div>
  );
}

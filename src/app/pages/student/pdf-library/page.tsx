"use client";

import React, { useState } from "react";
import StudentHeader from "../components/StudentHeader";
import { FileText, Download, Eye, ChevronDown } from "lucide-react";
import { useStudent } from "../layout";

// ============================================================================
// API INTEGRATION AND INTERFACES (COMMENTED OUT UNTIL BACKEND IS READY)
// ============================================================================
// import CoreService from "@/app/hooks/core-service";
//
// interface PDFResource {
//   id: string;
//   title: string;
//   size: string;
//   level: string;
//   downloadUrl: string;
// }
// ============================================================================

export default function PdfLibrary() {
  const { unreadCount, showToast } = useStudent();
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("400 Level");

  // Fallback state matching design.
  // DELETE / COMMENT these variables out once API fetching is enabled.
  const [pdfResources, setPdfResources] = useState([
    {
      id: "1",
      title: "Final Year Project Guide",
      size: "5.2 MB",
      level: "Level 400 Resource",
    },
    {
      id: "2",
      title: "Research Methodology",
      size: "3.1 MB",
      level: "Level 400 Resource",
    },
    {
      id: "3",
      title: "Career Launchpad",
      size: "2.4 MB",
      level: "Level 400 Resource",
    },
  ]);

  // ============================================================================
  // COMMENTED API CALL EXAMPLE: UNCOMMENT THIS BLOCK TO INTEGRATE YOUR BACKEND
  // ============================================================================
  // const [apiPdfs, setApiPdfs] = useState<PDFResource[]>([]);
  //
  // const fetchPdfLibrary = async (level: string) => {
  //   setLoading(true);
  //   const service = new CoreService();
  //   try {
  //     // Convert "400 Level" format to level query parameter like "400"
  //     const lvlQuery = level.split(" ")[0];
  //     const response = await service.get(`content/v1/pdfs?level=${lvlQuery}`);
  //     if (response.success && response.data) {
  //       // setApiPdfs(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load PDFs from API:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // ============================================================================

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value;
    setSelectedLevel(level);
    showToast(`Filtered by ${level}`, "info");

    // UNCOMMENT when API is connected:
    // fetchPdfLibrary(level);
  };

  const handlePreview = (title: string) => {
    showToast(`Opening preview for "${title}"...`, "info");
  };

  const handleDownload = (title: string) => {
    showToast(`Downloading "${title}"...`, "success");
    
    // Simulate real browser download behavior
    try {
      const link = document.createElement("a");
      link.href = "#"; // Replace with real PDF URL when available
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      // link.click(); // Commented to prevent reloading in dev
      document.body.removeChild(link);
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10">
      {/* Header Panel */}
      <StudentHeader title="PDF Library" unreadCount={unreadCount} />

      {/* Main card housing the libraries */}
      <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden w-full flex flex-col select-none">
        
        {/* Card Header with Dropdown Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 gap-3 select-none">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#2dba4e]" />
            <h3 className="text-lg font-bold text-[#0d1b0f] font-sans">
              PDF Library
            </h3>
          </div>

          {/* Level Filter Selector */}
          <div className="relative flex items-center bg-white border border-[#d8eedd] px-3.5 py-2.5 rounded-2xl shadow-sm text-xs font-semibold text-[#0d1b0f] hover:border-[#2dba4e] transition-colors cursor-pointer select-none">
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="appearance-none bg-transparent pr-8 pl-1 cursor-pointer font-semibold outline-none text-[#0d1b0f] w-full"
            >
              <option value="400 Level">400 Level</option>
              <option value="300 Level">300 Level</option>
              <option value="200 Level">200 Level</option>
              <option value="100 Level">100 Level</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#3d5a45] absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Library Card Grid */}
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full">
            {pdfResources.map((pdf) => (
              <div
                key={pdf.id}
                className="bg-[#f5f9f6]/30 border border-[#d8eedd]/80 rounded-3xl p-5 flex flex-col justify-between hover:bg-[#e8f5ed]/20 hover:border-[#2dba4e]/30 hover:shadow-md transition-all h-[200px]"
              >
                {/* PDF Details Top Row */}
                <div className="flex flex-col">
                  <div className="flex items-start justify-between">
                    {/* PDF Icon container */}
                    <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0 select-none shadow-sm">
                      <FileText className="w-5 h-5 fill-red-50" />
                    </div>

                    {/* Size badge */}
                    <span className="text-[10px] font-extrabold text-[#3d5a45] bg-[#e8f5ed] border border-[#d8eedd] px-2.5 py-1 rounded-full uppercase">
                      {pdf.size}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#0d1b0f] font-sans mt-4 truncate leading-snug">
                    {pdf.title}
                  </h4>
                  <p className="text-[11px] font-bold text-[#3d5a45]/60 mt-1 uppercase">
                    {pdf.level}
                  </p>
                </div>

                {/* Card CTA Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  {/* Preview Button */}
                  <button
                    onClick={() => handlePreview(pdf.title)}
                    className="flex-1 py-3 border border-[#d8eedd] rounded-2xl text-xs font-extrabold text-[#3d5a45] bg-white hover:bg-slate-50 transition-colors shadow-sm select-none flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(pdf.title)}
                    className="flex-1 py-3 bg-[#0d2818] border border-emerald-950/20 text-[#3ef06e] hover:bg-[#091f12] text-xs font-extrabold rounded-2xl transition-all shadow-md select-none flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#3ef06e]" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

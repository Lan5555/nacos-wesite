"use client";

import React, { useState } from "react";
import { FileText, Download, Eye, ChevronDown, Library } from "lucide-react";
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

// Custom StudentHeader component matching NacosHub aesthetic
const StudentHeader: React.FC<{ title: string; unreadCount: number }> = ({ title, unreadCount }) => {
  const [currentDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-[#071a0d] tracking-tight">{title}</h1>
        <p className="text-sm text-[#6a9975] mt-1 flex items-center gap-2">
          <i className="fas fa-calendar-alt text-xs"></i>
          <span>{currentDate}</span>
          <span className="w-1 h-1 rounded-full bg-[#22b864]"></span>
          <span>Active session</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-white border border-[rgba(15,110,63,0.12)] flex items-center justify-center text-[#1e3d27] cursor-pointer hover:bg-[#e6faf0] transition-all shadow-sm">
            <i className="fas fa-bell text-sm"></i>
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#22b864] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 bg-white border border-[rgba(15,110,63,0.12)] rounded-xl px-4 py-2 shadow-sm">
          <i className="fas fa-search text-[#6a9975] text-sm"></i>
          <input 
            type="text" 
            placeholder="Search PDFs..." 
            className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
          />
        </div>
      </div>
    </div>
  );
};

const PdfLibrary: React.FC = () => {
  const { unreadCount = 1, showToast } = useStudent();
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("400 Level");

  // Complete PDF library by level - matching original NacosHub structure
  const pdfLibraryByLevel: Record<string, Array<{ id: string; title: string; size: string; level: string; description: string }>> = {
    "100 Level": [
      { id: "100-1", title: "Intro to Programming (NACOS 101)", size: "2.1 MB", level: "Level 100 Resource", description: "Fundamentals of programming with Python" },
      { id: "100-2", title: "General Mathematics I", size: "1.8 MB", level: "Level 100 Resource", description: "Algebra, trigonometry, and calculus basics" },
      { id: "100-3", title: "Study Skills Guide", size: "1.2 MB", level: "Level 100 Resource", description: "Effective learning strategies and time management" },
    ],
    "200 Level": [
      { id: "200-1", title: "Data Structures & Algorithms", size: "3.4 MB", level: "Level 200 Resource", description: "Arrays, trees, graphs, and sorting algorithms" },
      { id: "200-2", title: "OOP in Java", size: "2.9 MB", level: "Level 200 Resource", description: "Object-oriented programming principles" },
      { id: "200-3", title: "Technical Writing", size: "1.5 MB", level: "Level 200 Resource", description: "Documentation and report writing" },
    ],
    "300 Level": [
      { id: "300-1", title: "Software Engineering Principles", size: "4.0 MB", level: "Level 300 Resource", description: "SDLC, agile, and software design patterns" },
      { id: "300-2", title: "Database Systems", size: "2.7 MB", level: "Level 300 Resource", description: "SQL, normalization, and transaction management" },
      { id: "300-3", title: "Internship Prep Kit", size: "2.2 MB", level: "Level 300 Resource", description: "Resume, interview tips, and portfolio guide" },
    ],
    "400 Level": [
      { id: "400-1", title: "Final Year Project Guide", size: "5.2 MB", level: "Level 400 Resource", description: "Complete project documentation and thesis writing" },
      { id: "400-2", title: "Research Methodology", size: "3.1 MB", level: "Level 400 Resource", description: "Quantitative and qualitative research methods" },
      { id: "400-3", title: "Career Launchpad", size: "2.4 MB", level: "Level 400 Resource", description: "Job search, networking, and professional development" },
    ],
  };

  // Fallback state matching design.
  // DELETE / COMMENT these variables out once API fetching is enabled.
  const [pdfResources, setPdfResources] = useState(pdfLibraryByLevel["400 Level"]);

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
    
    // Update PDF resources based on selected level
    setPdfResources(pdfLibraryByLevel[level] || pdfLibraryByLevel["400 Level"]);
    
    showToast(`Filtered by ${level}`, "info");

    // UNCOMMENT when API is connected:
    // fetchPdfLibrary(level);
  };

  const handlePreview = (title: string) => {
    showToast(`Opening preview for "${title}"...`, "info");
  };

  const handleDownload = (title: string, size: string) => {
    showToast(`Downloading "${title}" (${size})...`, "success");
    
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

  // Get total PDF count across all levels
  const totalPdfs = Object.values(pdfLibraryByLevel).reduce((sum, arr) => sum + arr.length, 0);
  
  // Get current level PDF count
  const currentLevelCount = pdfResources.length;

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <StudentHeader title="PDF Library" unreadCount={unreadCount} />

      {/* Stats Row - Matching NacosHub dashboard style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6a9975]">Total PDFs</div>
              <div className="font-serif text-2xl text-[#071a0d] mt-1">{totalPdfs}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <Library className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6a9975]">Current Level</div>
              <div className="font-serif text-xl text-[#071a0d] mt-1">{selectedLevel}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center text-[#22b864]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6a9975]">Available</div>
              <div className="font-serif text-2xl text-[#071a0d] mt-1">{currentLevelCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <Download className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6a9975]">Total Size</div>
              <div className="font-serif text-lg text-[#071a0d] mt-1">~24.5 MB</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center text-[#c8a84b]">
              <i className="fas fa-database text-sm"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main card housing the libraries */}
      <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden w-full flex flex-col">
        
        {/* Card Header with Dropdown Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#071a0d] font-serif">
              PDF Library
            </h3>
          </div>

          {/* Level Filter Selector */}
          <div className="relative flex items-center bg-white border border-[#d8eedd] px-4 py-2.5 rounded-xl shadow-sm hover:border-[#88e8b0] transition-colors cursor-pointer">
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="appearance-none bg-transparent pr-8 cursor-pointer font-semibold outline-none text-[#071a0d] text-sm w-32 sm:w-auto"
            >
              <option value="100 Level">100 Level</option>
              <option value="200 Level">200 Level</option>
              <option value="300 Level">300 Level</option>
              <option value="400 Level">400 Level</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#6a9975] absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#e6faf0] border-t-[#22b864] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#6a9975] font-medium">Loading PDF resources...</p>
          </div>
        ) : (
          /* Library Card Grid */
          <div className="p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full">
              {pdfResources.map((pdf, idx) => (
                <div
                  key={pdf.id}
                  className="group bg-white border border-[#d8eedd] rounded-2xl p-5 flex flex-col justify-between hover:border-[#88e8b0] hover:shadow-md transition-all duration-300 relative overflow-hidden"
                  style={{ animationDelay: `${idx * 0.05}s`, animation: 'fadeUp 0.4s ease both' }}
                >
                  {/* Decorative background element */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#22b864]/5 rounded-full blur-xl group-hover:bg-[#22b864]/10 transition-colors"></div>

                  {/* PDF Details Top Row */}
                  <div className="flex flex-col relative z-10">
                    <div className="flex items-start justify-between">
                      {/* PDF Icon container - using red for PDF recognition */}
                      <div className="w-11 h-11 rounded-xl bg-linear-to-br from-red-50 to-red-100 border border-red-200 flex items-center justify-center text-red-500 shadow-sm group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>

                      {/* Size badge */}
                      <span className="text-[10px] font-bold text-[#3a6645] bg-[#f2fbf6] border border-[#d8eedd] px-2.5 py-1 rounded-full uppercase tracking-tight">
                        {pdf.size}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#071a0d] font-sans mt-4 leading-tight group-hover:text-[#0f6e3f] transition-colors">
                      {pdf.title}
                    </h4>
                    
                    <p className="text-xs text-[#6a9975] mt-1.5 line-clamp-1">
                      {pdf.description}
                    </p>
                    
                    <p className="text-[10px] font-mono font-semibold text-[#22b864] mt-2 uppercase tracking-wide">
                      {pdf.level}
                    </p>
                  </div>

                  {/* Card CTA Buttons */}
                  <div className="flex items-center gap-3 pt-4 mt-2 relative z-10">
                    {/* Preview Button */}
                    <button
                      onClick={() => handlePreview(pdf.title)}
                      className="flex-1 py-2.5 border border-[#d8eedd] rounded-xl text-xs font-bold text-[#3a6645] bg-white hover:bg-[#f2fbf6] hover:border-[#88e8b0] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(pdf.title, pdf.size)}
                      className="flex-1 py-2.5 bg-linear-to-r from-[#0a4a20] to-[#0f6e3f] text-[#e6faf0] hover:from-[#0f6e3f] hover:to-[#169150] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {pdfResources.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#e6faf0] flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#6a9975]" />
                </div>
                <h4 className="text-base font-bold text-[#071a0d]">No PDFs available</h4>
                <p className="text-sm text-[#6a9975] mt-1">No resources found for {selectedLevel}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer note - resource info */}
        <div className="border-t border-[#d8eedd] p-4 md:px-6 bg-[#f2fbf6]/30">
          <div className="flex items-center justify-between text-xs text-[#6a9975]">
            <div className="flex items-center gap-4">
              <span><i className="fas fa-file-pdf text-red-500 mr-1"></i> {currentLevelCount} PDF resources available</span>
              <span><i className="fas fa-download mr-1"></i> Free access for all students</span>
            </div>
            <span className="font-mono text-[10px] bg-white px-2 py-1 rounded-full border border-[#d8eedd]">
              📚 Updated weekly
            </span>
          </div>
        </div>
      </div>

      {/* Toast container */}
      <div id="toast-root" className="fixed bottom-6 right-6 z-50"></div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PdfLibrary;

 const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const toastRoot = document.getElementById('toast-root');
  if (!toastRoot) return;
  
  const toast = document.createElement('div');
  toast.className = 'animate-fadeUp bg-[#042b12] text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 mb-3';
  toast.style.animation = 'fadeUp 0.25s ease both';
  const icon = type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info';
  toast.innerHTML = `
    <div class="w-6 h-6 rounded-full bg-[#0f6e3f] flex items-center justify-center text-[10px]">
      <i class="fas fa-${icon}"></i>
    </div>
    <span>${message}</span>
  `;
  
  toastRoot.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
};
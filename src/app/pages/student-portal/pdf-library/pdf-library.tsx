"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  FileText,
  Download,
  Eye,
  ChevronDown,
  Library,
  Bell,
  LayoutGrid,
  List,
} from "lucide-react";
import { useStudent } from "../layout";
import CoreService from "@/app/hooks/core-service";

interface CourseResource {
  id: number;
  name: string;
  code: string;
  level: string;
  department: string;
  description: string;
  file: string;
  downloadUrl: string;
  created_at: string;
  updated_at: string;
}

const coreService = new CoreService();

const StudentHeader: React.FC<{
  title: string;
  unreadCount: number;
  onSearch: (query: string) => void;
}> = ({ title, unreadCount, onSearch }) => {
  const [currentDate] = useState(() => {
    const d = new Date();

    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-[#071a0d] tracking-tight">
          PDF Library
        </h1>

        <p className="text-sm text-[#6a9975] mt-1 flex items-center gap-2">
          <i className="fas fa-calendar-alt text-xs"></i>
          <span>{currentDate}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-white border border-[rgba(15,110,63,0.12)] flex items-center justify-center text-[#1e3d27]">
            <Bell className="w-4 h-4" />
          </div>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#22b864] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 bg-white border border-[rgba(15,110,63,0.12)] rounded-xl px-4 py-2 shadow-sm">
          <Search className="text-[#6a9975] w-4 h-4" />

          <input
            type="text"
            placeholder="Search PDFs..."
            onChange={(e) => onSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
          />
        </div>
      </div>
    </div>
  );
};

const PdfLibrary: React.FC = () => {
  const { unreadCount = 1, showToast, profile } = useStudent();

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [selectedLevel, setSelectedLevel] = useState(profile.level ? `${profile.level} Level` : "All Levels");

  const [selectedDepartment, setSelectedDepartment] =
    useState("All");

  const [searchQuery, setSearchQuery] = useState("");

  const [pdfResources, setPdfResources] = useState<
    CourseResource[]
  >([]);

  const fetchCourses = useCallback(async (level?: string, department?: string) => {
    setLoading(true);

    try {
      // Only display PDFs relative to the level of the user if "All Levels" is selected
      const effectiveLevel = (!level || level === "All" || level === "All Levels") ? profile.level : level;
      const levelParam = effectiveLevel ? `level=${effectiveLevel}` : "";
      const deptParam = department && department !== "All" && department !== "All Departments" ? `department=${department}` : "";
      const res = await coreService.get(`courses/find-all-courses?${levelParam}&${deptParam}`);
      if (res.success && Array.isArray(res.data)) {
        setPdfResources(res.data);
      } else {
        setPdfResources([]);
      }
    } catch (e) {
      console.log(e);
      showToast("Failed to fetch courses", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, profile.level]);

  useEffect(() => {
    if (profile.level) {
      setSelectedLevel(`${profile.level} Level`);
    }
    
    fetchCourses(profile.level, "All");
  }, [fetchCourses]);

  const handleLevelChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const level = e.target.value;

    setSelectedLevel(level);

    fetchCourses(
      level === "All Levels" ? "All" : level.split(" ")[0],
      selectedDepartment
    );
  };

  const handleDepartmentChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const department = e.target.value;

    setSelectedDepartment(department);

    fetchCourses(
      selectedLevel === "All Levels" ? "All" : selectedLevel.split(" ")[0],
      department
    );
  };

  // Implement search functionality using find-one-course logic or local filtering
  const [filteredResources, setFilteredResources] = useState<CourseResource[]>([]);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setFilteredResources(pdfResources);
        return;
      }

      // If search query looks like an ID, try fetching specific course
      if (/^\d+$/.test(searchQuery)) {
        try {
          const res = await coreService.get(`courses/find-one-course?id=${searchQuery}`);
          if (res.success && res.data) {
            setFilteredResources([res.data]);
            return;
          }
        } catch (e) { console.error(e); }
      }

      // Fallback to local filtering
      const filtered = pdfResources.filter(pdf => 
        pdf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResources(filtered);
    };

    performSearch();
  }, [searchQuery, pdfResources]);

  const handlePreview = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDownload = (
    url: string,
    filename: string
  ) => {
    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", filename);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full">
      <StudentHeader
        title="PDF Library"
        unreadCount={unreadCount}
        onSearch={setSearchQuery}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6a9975]">
                Total PDFs
              </div>

              <div className="font-serif text-2xl text-[#071a0d] mt-1">
                {pdfResources.length}
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <Library className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden w-full flex flex-col">
        <div className="flex flex-col md:flex-row gap-3 justify-between border-b border-[#d8eedd] p-5 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <FileText className="w-4 h-4" />
            </div>

            <h3 className="text-lg font-bold text-[#071a0d] font-serif">
              PDF Library
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-[#f2fbf6] p-1 rounded-xl border border-[#d8eedd] mr-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-white text-[#22b864] shadow-sm" : "text-[#6a9975]"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "list" ? "bg-white text-[#22b864] shadow-sm" : "text-[#6a9975]"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <div className="relative flex items-center bg-white border border-[#d8eedd] px-4 py-2.5 rounded-xl shadow-sm">
              <select
                value={selectedLevel}
                disabled
                className="appearance-none bg-transparent pr-8 cursor-not-allowed font-semibold outline-none text-[#6a9975] text-sm"
              >
                <option value={`${profile.level} Level`}>
                  {profile.level} Level
                </option>
              </select>

              <ChevronDown className="w-4 h-4 text-[#6a9975] absolute right-3 pointer-events-none" />
            </div>

            <div className="relative flex items-center bg-white border border-[#d8eedd] px-4 py-2.5 rounded-xl shadow-sm">
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="appearance-none bg-transparent pr-8 cursor-pointer font-semibold outline-none text-[#071a0d] text-sm"
              >
                <option value="All">
                  All Departments
                </option>

                <option value="Computer Science">
                  Computer Science
                </option>

                <option value="Cyber Security">
                  Cyber Security
                </option>

                <option value="Software Engineering">
                  Software Engineering
                </option>
              </select>

              <ChevronDown className="w-4 h-4 text-[#6a9975] absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#e6faf0] border-t-[#22b864] rounded-full animate-spin"></div>

            <p className="mt-4 text-[#6a9975] font-medium">
              Loading PDF resources...
            </p>
          </div>
        ) : (
          <div className="p-5 md:p-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full">
              {filteredResources.map((pdf, idx) => (
                <div
                  key={pdf.id}
                  className="group bg-white border border-[#d8eedd] rounded-2xl p-5 flex flex-col justify-between hover:border-[#88e8b0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  style={{
                    animationName: "fadeUp",
                    animationDuration: "0.4s",
                    animationTimingFunction: "ease",
                    animationFillMode: "both",
                    animationDelay: `${idx * 0.05}s`,
                  }}
                >
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#22b864]/5 rounded-full blur-xl group-hover:bg-[#22b864]/10 transition-colors"></div>

                  <div className="flex flex-col relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl bg-linear-to-br from-red-50 to-red-100 border border-red-200 flex items-center justify-center text-red-500 shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>

                      <span className="text-[10px] font-bold text-[#3a6645] bg-[#f2fbf6] border border-[#d8eedd] px-2.5 py-1 rounded-full uppercase tracking-tight">
                        {pdf.code}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#071a0d] mt-4 leading-tight group-hover:text-[#0f6e3f] transition-colors">
                      {pdf.name}
                    </h4>

                    <p className="text-xs text-[#6a9975] mt-1.5 line-clamp-2">
                      {pdf.description}
                    </p>

                    <p className="text-[10px] font-mono font-semibold text-[#22b864] mt-2 uppercase tracking-wide">
                      {pdf.level} Level
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 mt-2 relative z-10">
                    <button
                      onClick={() =>
                        handlePreview(pdf.downloadUrl)
                      }
                      className="flex-1 py-2.5 border border-[#d8eedd] rounded-xl text-xs font-bold text-[#3a6645] bg-white hover:bg-[#f2fbf6] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        handleDownload(
                          pdf.downloadUrl,
                          `${pdf.name}.pdf`
                        )
                      }
                      className="flex-1 py-2.5 bg-linear-to-r from-[#0a4a20] to-[#0f6e3f] text-[#e6faf0] text-xs font-bold rounded-xl hover:shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {filteredResources.map((pdf, idx) => (
                  <div
                    key={pdf.id}
                    className="group bg-white border border-[#d8eedd] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between hover:border-[#88e8b0] hover:shadow-md transition-all duration-300"
                    style={{
                      animationName: "fadeUp",
                      animationDuration: "0.4s",
                      animationTimingFunction: "ease",
                      animationFillMode: "both",
                      animationDelay: `${idx * 0.05}s`,
                    }}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#071a0d] group-hover:text-[#0f6e3f] transition-colors">
                            {pdf.name}
                          </h4>
                          <span className="text-[9px] font-bold text-[#22b864] bg-[#f2fbf6] px-2 py-0.5 rounded-full border border-[#d8eedd]">
                            {pdf.code}
                          </span>
                        </div>
                        <p className="text-xs text-[#6a9975] line-clamp-1 mt-0.5">
                          {pdf.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                      <span className="hidden md:block text-[10px] font-mono font-semibold text-[#6a9975] uppercase mr-4">
                        {pdf.level} Level
                      </span>
                      <button
                        onClick={() => handlePreview(pdf.downloadUrl)}
                        className="flex-1 sm:flex-none px-4 py-2 border border-[#d8eedd] rounded-xl text-xs font-bold text-[#3a6645] hover:bg-[#f2fbf6] transition-colors"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDownload(pdf.downloadUrl, `${pdf.name}.pdf`)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-linear-to-r from-[#0a4a20] to-[#0f6e3f] text-white text-xs font-bold rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredResources.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#e6faf0] flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#6a9975]" />
                </div>

                <h4 className="text-base font-bold text-[#071a0d]">
                  No results found
                </h4>

                <p className="text-sm text-[#6a9975] mt-1">
                  No resources available
                </p>
              </div>
            )}
          </div>
        )}
      </div>

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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PdfLibrary;
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  GraduationCap, 
  RotateCw, 
  Loader2,
  BarChart2, 
  Bell,
  Download, 
  FileText, 
  Filter,
  ChevronDown,
  Calendar,
  BookOpen,
  Eye,
  Award,
  Search
} from "lucide-react";
import { useStudent } from "../layout";
import CoreService from "@/app/hooks/core-service";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ResultPDF {
  id: number;
  course: string;
  code: string;
  level: number;
  department: string;
  file: string;
  createdAt: string;
  downloadUrl?: string;
  session: string;
  semester: string;
  credits?: number;
  score?: number;
  grade?: string;
}

const coreService = new CoreService();
// ============================================================================
// STUDENT HEADER COMPONENT
// ============================================================================

const StudentHeader: React.FC<{ 
  title: string; 
  unreadCount: number;
  onSearch: (query: string) => void;
}> = ({ title, unreadCount, onSearch }) => {
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
            <Bell className="w-4 h-4" />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#22b864] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 bg-white border border-[rgba(15,110,63,0.12)] rounded-xl px-4 py-2 shadow-sm">
          <Search className="w-4 h-4 text-[#6a9975]" />
          <input 
            type="text" 
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search results..." 
            className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN ACADEMIC RESULTS COMPONENT
// ============================================================================

const AcademicResults: React.FC = () => {
  const { unreadCount = 3, showToast, profile } = useStudent();
  const [refreshing, setRefreshing] = useState(false);
  const [results, setResults] = useState<ResultPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [selectedLevel, setSelectedLevel] = useState<number>(parseInt(profile.level) || 100);
  const [selectedSession, setSelectedSession] = useState<string>("2025/2026");
  const [selectedSemester, setSelectedSemester] = useState<string>("First Semester");
  const [selectedDepartment] = useState<string>(profile.department || "");
  
  // Available filter options
  const availableSessions = ["2025/2026", "2024/2025", "2023/2024", "2022/2023"];
  const availableSemesters = ["First Semester", "Second Semester"];
  const availableLevels = [100, 200, 300, 400];
  const availableDepartments = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Engineering"];

  // Filter results based on selected filters
  const filteredResults = useMemo(() => {
    return results.filter(result => {
      const matchesSearch = 
        result.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch &&
      result.level === selectedLevel &&
      result.session === selectedSession &&
      result.semester === selectedSemester &&
      result.department === selectedDepartment;
    });
  }, [results, selectedLevel, selectedSession, selectedSemester, selectedDepartment, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCourses = filteredResults.length;
    const totalCredits = totalCourses * 3;
    const gradePoints = filteredResults.reduce((sum, r) => {
      const gradeMap: Record<string, number> = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0 };
      return sum + (gradeMap[r.grade || 'F'] || 0) * 3;
    }, 0);
    const gpa = totalCredits > 0 ? gradePoints / totalCredits : 0;
    
    return {
      totalCourses,
      gpa: gpa.toFixed(2),
      totalCredits,
    };
  }, [filteredResults]);

  // Get grade classification
  const getClassification = (gpa: number) => {
    if (gpa >= 4.5) return { text: "First Class", color: "#22b864" };
    if (gpa >= 3.5) return { text: "Second Class Upper", color: "#4fd68a" };
    if (gpa >= 2.5) return { text: "Second Class Lower", color: "#c8a84b" };
    if (gpa >= 1.5) return { text: "Third Class", color: "#e67e22" };
    return { text: "Pass", color: "#e74c3c" };
  };

  const classification = getClassification(parseFloat(stats.gpa));

  // Fetch results from API
  const fetchResults = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await coreService.get(
        `results/find-all-results?level=${selectedLevel}&department=${selectedDepartment}`
      );
      if (res.success && Array.isArray(res.data)) {
        setResults(res.data);
      } else {
        setResults([]);
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch results", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedLevel, selectedDepartment, showToast]);

  // Handle PDF preview
  const handlePreview = async (result: ResultPDF) => {
    const url = result.downloadUrl || result.file;
    if (url && url !== "#") {
      window.open(url, '_blank');
    } else {
      showToast("Result file not available", "error");
    }
  };
  // Handle batch download
  const handleBatchDownload = () => {
    if (filteredResults.length === 0) {
      showToast("No results available to download", "error");
      return;
    }
    showToast(`Downloading ${filteredResults.length} results...`, "info");
    setTimeout(() => {
      showToast(`Successfully downloaded ${filteredResults.length} results!`, "success");
    }, 1500);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchResults();
      setRefreshing(false);
      showToast("Results refreshed successfully!", "success");
    }, 800);
  };

  // Initial load
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Update selected level when profile loads
  useEffect(() => {
    if (profile.level) setSelectedLevel(parseInt(profile.level));
  }, [profile.level]);

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <StudentHeader title="Academic Results" unreadCount={unreadCount} onSearch={setSearchQuery} />

      {/* Filter Section */}
      <div className="bg-white border border-[#d8eedd] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#22b864]" />
          <h3 className="text-sm font-bold text-[#071a0d]">Filter Results</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#6a9975] mb-1">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
              className="w-full p-2 border border-[#d8eedd] rounded-lg text-sm bg-white focus:outline-none focus:border-[#22b864]"
            >
              {availableLevels.map(level => (
                <option key={level} value={level}>{level} Level</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6a9975] mb-1">Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full p-2 border border-[#d8eedd] rounded-lg text-sm bg-white focus:outline-none focus:border-[#22b864]"
            >
              {availableSessions.map(session => (
                <option key={session} value={session}>{session}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6a9975] mb-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-2 border border-[#d8eedd] rounded-lg text-sm bg-white focus:outline-none focus:border-[#22b864]"
            >
              {availableSemesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6a9975] mb-1">Department</label>
            <select
              disabled
              value={profile.department}
              className="w-full p-2 border border-[#d8eedd] rounded-lg text-sm bg-[#f9f9f9] text-[#6a9975] cursor-not-allowed outline-none"
            >
              <option value={profile.department}>{profile.department}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#d8eedd] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold uppercase text-[#6a9975]">Total Courses</div>
          <div className="text-2xl font-bold text-[#071a0d] font-serif mt-1">{stats.totalCourses}</div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold uppercase text-[#6a9975]">Total Credits</div>
          <div className="text-2xl font-bold text-[#071a0d] font-serif mt-1">{stats.totalCredits}</div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold uppercase text-[#6a9975]">Semester GPA</div>
          <div className="text-2xl font-bold text-[#071a0d] font-serif mt-1">{stats.gpa}</div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold uppercase text-[#6a9975]">Classification</div>
          <div className="text-sm font-bold mt-1" style={{ color: classification.color }}>{classification.text}</div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#071a0d] font-serif">
              Result Downloads
            </h3>
            <span className="text-xs text-[#6a9975] ml-2">
              ({filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'})
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* <button
              onClick={handleBatchDownload}
              disabled={filteredResults.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0f6e3f] text-white rounded-xl text-xs font-semibold hover:bg-[#22b864] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              Download All
            </button> */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#d8eedd] bg-white hover:bg-[#f5f9f6] text-[#3a6645] rounded-xl text-xs font-semibold transition-all"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#e6faf0] border-t-[#22b864] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#6a9975]">Loading results...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#e6faf0] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#6a9975]" />
              </div>
              <p className="text-[#6a9975] font-medium">No results found</p>
              <p className="text-xs text-[#6a9975] mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#f2fbf6] border-b border-[#d8eedd]">
                <tr>
                  <th className="text-left p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Course Code</th>
                  <th className="text-left p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Course Title</th>
                  <th className="text-center p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Session</th>
                  <th className="text-center p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Semester</th>
                  <th className="text-center p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, idx) => (
                  <tr 
                    key={result.id} 
                    className="border-b border-[#d8eedd] hover:bg-[#f2fbf6] transition-colors"
                    style={{ 
                      animationName: 'fadeUp',
                      animationDuration: '0.3s',
                      animationTimingFunction: 'ease',
                      animationFillMode: 'both',
                      animationDelay: `${idx * 0.03}s` 
                    }}
                  >
                    <td className="p-4">
                      <span className="text-sm font-mono font-bold text-[#22b864]">{result.code}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-[#071a0d]">{result.course}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xs font-bold text-[#071a0d] bg-[#f2fbf6] px-2.5 py-1 rounded-full border border-[#d8eedd]">
                        {result.session}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xs font-semibold text-[#6a9975]">
                        {result.semester}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handlePreview(result)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#22b864] text-[#0f6e3f] rounded-lg text-xs font-semibold hover:bg-[#22b864] hover:text-white transition-all mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer with summary */}
        <div className="border-t border-[#d8eedd] p-4 md:px-6 bg-[#f2fbf6]/30">
          <div className="flex items-center justify-between text-xs text-[#6a9975]">
            <div className="flex items-center gap-4">
              <span><i className="fas fa-file-pdf text-red-500 mr-1"></i> {filteredResults.length} PDF results available</span>
              <span><i className="fas fa-eye mr-1"></i> Click preview to view your result</span>
            </div>
            <span className="font-mono text-[10px] bg-white px-2 py-1 rounded-full border border-[#d8eedd]">
              {selectedSession} • {selectedSemester} • Level {selectedLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary Card */}
      <div className="bg-linear-to-r from-[#0a4a20] to-[#0f6e3f] rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-[#4fd68a]" />
            <div>
              <p className="text-xs text-[#88e8b0]">Your Performance Summary</p>
              <p className="text-sm font-bold text-white">
                {stats.totalCourses} courses • {stats.totalCredits} credits • GPA: {stats.gpa}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#88e8b0]">Classification</p>
            <p className="text-lg font-bold text-white" style={{ color: classification.color }}>
              {classification.text}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

export default AcademicResults;
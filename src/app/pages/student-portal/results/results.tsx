"use client";

import React, { useState } from "react";
import { GraduationCap, RotateCw, BarChart2 } from "lucide-react";
import { useStudent } from "../layout";

// ============================================================================
// API INTEGRATION AND INTERFACES (COMMENTED OUT UNTIL BACKEND IS READY)
// ============================================================================
// import CoreService from "@/app/hooks/core-service";
//
// interface CourseResult {
//   id: string;
//   code: string;
//   title: string;
//   grade: string;
//   score: number;
//   gradeProgress: number; // percentage value to fill the decorative rating bar (e.g. 90% for A)
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
            placeholder="Search courses, results..." 
            className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
          />
        </div>
      </div>
    </div>
  );
};

const AcademicResults: React.FC = () => {
  const { unreadCount = 3, showToast } = useStudent();
  const [refreshing, setRefreshing] = useState(false);

  // Fallback results state matching design.
  // DELETE / COMMENT these variables out once API fetching is enabled.
  const [results, setResults] = useState([
    {
      id: "csc401",
      code: "CSC 401",
      title: "Advanced Software Engineering",
      grade: "A",
      score: 82,
      progress: 92, // decorative bar percentage
    },
    {
      id: "csc405",
      code: "CSC 405",
      title: "Machine Learning",
      grade: "B+",
      score: 78,
      progress: 82,
    },
    {
      id: "csc411",
      code: "CSC 411",
      title: "Cloud Computing",
      grade: "A-",
      score: 80,
      progress: 88,
    },
    {
      id: "ent402",
      code: "ENT 402",
      title: "Entrepreneurship",
      grade: "B",
      score: 74,
      progress: 75,
    },
  ]);

  // ============================================================================
  // COMMENTED API CALL EXAMPLE: UNCOMMENT THIS BLOCK TO INTEGRATE YOUR BACKEND
  // ============================================================================
  // const fetchResults = async () => {
  //   setRefreshing(true);
  //   const service = new CoreService();
  //   try {
  //     const response = await service.get("content/v1/student/results");
  //     if (response.success && response.data) {
  //       // setResults(response.data);
  //       showToast("Academic scores synced successfully!", "success");
  //     }
  //   } catch (error) {
  //     console.error("Failed to load results from API:", error);
  //     showToast("Could not contact results service.", "error");
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };
  // ============================================================================

  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API delay
    setTimeout(() => {
      setRefreshing(false);
      showToast("Scores refreshed successfully!", "success");
      
      // UNCOMMENT when API is connected:
      // fetchResults();
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <StudentHeader title="Academic Results" unreadCount={unreadCount} />

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start w-full">
        
        {/* Left Column: Academic Results Detailed Cards */}
        <div className="lg:col-span-2 bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden flex flex-col">
          {/* Card Header with Refresh Action */}
          <div className="flex items-center justify-between border-b border-[#d8eedd] p-5 md:px-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#071a0d] font-serif">
                Academic Results
              </h3>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-1.5 px-4 py-2 border border-[#d8eedd] bg-white hover:bg-[#f5f9f6] text-[#3a6645] hover:text-[#071a0d] transition-all rounded-xl text-xs font-bold shadow-sm cursor-pointer active:scale-95 ${
                refreshing ? "opacity-75 cursor-wait" : ""
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#22b864] ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Results rows list */}
          <div className="p-5 md:p-6 space-y-4">
            {results.map((result, idx) => (
              <div
                key={result.id}
                className="group flex items-center justify-between p-4 bg-[#f2fbf6]/50 border border-[#d8eedd] rounded-xl hover:bg-white hover:border-[#88e8b0] hover:shadow-md transition-all duration-300 gap-4"
                style={{ animationDelay: `${idx * 0.05}s`, animation: 'fadeUp 0.4s ease both' }}
              >
                {/* Course Metadata */}
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm md:text-base font-bold text-[#071a0d] font-sans truncate">
                    {result.title}
                  </h4>
                  <span className="text-[11px] font-mono font-semibold text-[#6a9975] mt-0.5 uppercase tracking-wide">
                    {result.code}
                  </span>
                </div>

                {/* Performance Visualizer Bar & Grade Letter */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  {/* Rating progress line with circular knob */}
                  <div className="w-20 sm:w-28 h-1.5 bg-[#e6faf0] border border-[#d8eedd]/40 rounded-full relative hidden sm:block">
                    <div
                      className="h-full bg-linear-to-r from-[#22b864] to-[#4fd68a] rounded-full absolute left-0 top-0 transition-all duration-700"
                      style={{ width: `${result.progress}%` }}
                    ></div>
                    {/* Circle Knob at the end of progress */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#22b864] border-2 border-white shadow-md group-hover:scale-125 transition-transform"
                      style={{ left: `${result.progress}%` }}
                    ></div>
                  </div>

                  {/* Letter Grade Circle Badge */}
                  <div className="w-10 h-10 rounded-full bg-white border border-[#d8eedd] flex items-center justify-center font-black text-sm text-[#22b864] shadow-sm group-hover:bg-[#22b864] group-hover:text-white group-hover:border-transparent transition-all duration-200">
                    {result.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Numerical Score Overview */}
        <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm p-5 md:p-6 flex flex-col">
          <div className="flex items-center gap-2.5 border-b border-[#d8eedd] pb-4 mb-5 md:mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#071a0d] font-serif">
              Score Overview
            </h3>
          </div>

          {/* List of horizontal progress bars depicting raw numerical grade score */}
          <div className="space-y-5">
            {results.map((result) => (
              <div key={result.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#3a6645] font-mono text-[11px] font-bold tracking-wide">{result.code}</span>
                  <span className="text-[#071a0d] font-black font-serif text-base">{result.score}</span>
                </div>
                {/* Score slider rail */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-[#e6faf0] border border-[#d8eedd]/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#0f6e3f] to-[#22b864] rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick stats summary - matching nacos dashboard style */}
          <div className="mt-6 pt-5 border-t border-[#d8eedd]">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6a9975]">Current GPA</div>
                <div className="font-serif text-2xl text-[#071a0d]">3.82</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6a9975]">Credits Earned</div>
                <div className="font-serif text-2xl text-[#071a0d]">24</div>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-[#e6faf0] rounded-full overflow-hidden">
              <div className="h-full w-[76%] bg-linear-to-r from-[#22b864] to-[#4fd68a] rounded-full"></div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-[#6a9975]">
              <span>Progress to graduation</span>
              <span>76%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Toast container - matching nacos style */}
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
      `}</style>
    </div>
  );
}

export default AcademicResults;

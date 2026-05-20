"use client";

import React, { useState } from "react";
import StudentHeader from "../components/StudentHeader";
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

export default function AcademicResults() {
  const { unreadCount, showToast } = useStudent();
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
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10">
      {/* Header Panel */}
      <StudentHeader title="Academic Results" unreadCount={unreadCount} />

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start w-full">
        
        {/* Left Column: Academic Results Detailed Cards */}
        <div className="lg:col-span-2 bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden flex flex-col select-none">
          {/* Card Header with Refresh Action */}
          <div className="flex items-center justify-between border-b border-[#d8eedd] p-5 md:px-6">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-[#2dba4e]" />
              <h3 className="text-lg font-bold text-[#0d1b0f] font-sans">
                Academic Results
              </h3>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-1.5 px-4 py-2 border border-[#d8eedd] bg-white hover:bg-slate-50 text-[#3d5a45] hover:text-[#0d1b0f] transition-all rounded-xl text-xs font-bold shadow-sm select-none cursor-pointer ${
                refreshing ? "opacity-75 cursor-wait" : ""
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#2dba4e] ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Results rows list */}
          <div className="p-5 md:p-6 space-y-5">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 bg-[#f5f9f6]/30 border border-[#d8eedd]/70 rounded-2xl hover:bg-[#e8f5ed]/20 transition-all gap-4"
              >
                {/* Course Metadata */}
                <div className="flex flex-col min-w-0 select-none">
                  <h4 className="text-sm md:text-base font-extrabold text-[#0d1b0f] font-sans truncate">
                    {result.title}
                  </h4>
                  <span className="text-[11px] font-extrabold text-[#3d5a45]/60 font-sans mt-0.5 uppercase">
                    {result.code}
                  </span>
                </div>

                {/* Performance Visualizer Bar & Grade Letter */}
                <div className="flex items-center gap-5 sm:gap-8 select-none shrink-0">
                  {/* Rating progress line with circular knob */}
                  <div className="w-20 sm:w-32 h-1.5 bg-[#e8f5ed] border border-[#d8eedd]/30 rounded-full relative hidden sm:block">
                    <div
                      className="h-full bg-[#2dba4e] rounded-full absolute left-0 top-0"
                      style={{ width: `${result.progress}%` }}
                    ></div>
                    {/* Circle Knob at the end of progress */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#2dba4e] border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                      style={{ left: `${result.progress}%` }}
                    ></div>
                  </div>

                  {/* Letter Grade Circle Badge */}
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ed] border border-[#d8eedd] flex items-center justify-center font-extrabold text-sm text-[#2dba4e] shadow-sm select-none">
                    {result.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Numerical Score Overview */}
        <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm p-5 md:p-6 flex flex-col select-none">
          <div className="flex items-center gap-2.5 border-b border-[#d8eedd] pb-4 mb-5 md:mb-6">
            <BarChart2 className="w-5 h-5 text-[#2dba4e]" />
            <h3 className="text-lg font-bold text-[#0d1b0f] font-sans">
              Score Overview
            </h3>
          </div>

          {/* List of horizontal progress bars depicting raw numerical grade score */}
          <div className="space-y-6 select-none my-1">
            {results.map((result) => (
              <div key={result.id} className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#3d5a45] font-extrabold">{result.code}</span>
                  <span className="text-[#0d1b0f] font-black font-sans">{result.score}</span>
                </div>
                {/* Score slider rail */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-[#e8f5ed] border border-[#d8eedd]/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2dba4e] rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

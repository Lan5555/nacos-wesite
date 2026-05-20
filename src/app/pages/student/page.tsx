"use client";

import React, { useEffect, useState } from "react";
import StudentHeader from "./components/StudentHeader";
import { Star, CheckCircle, Download, Zap, MapPin, Clock, MonitorPlay, TrendingUp } from "lucide-react";
import { useStudent } from "./layout";

// ============================================================================
// API INTEGRATION AND INTERFACES (COMMENTED OUT UNTIL BACKEND IS READY)
// ============================================================================
// import CoreService from "@/app/hooks/core-service";
//
// interface Lecture {
//   time: string;
//   title: string;
//   location: string;
// }
//
// interface AcademicProgress {
//   subject: string;
//   percentage: number;
// }
//
// interface DashboardData {
//   gpa: number;
//   gpaDelta: string;
//   downloadsCount: number;
//   lectures: Lecture[];
//   progress: AcademicProgress[];
// }
// ============================================================================

export default function StudentDashboard() {
  const { creditsEarned, activeCoursesCount, unreadCount } = useStudent();
  const [loading, setLoading] = useState(false);

  // Default hardcoded states matching design.
  // DELETE / COMMENT these variables out once API fetching is enabled.
  const [gpa] = useState(3.82);
  const [gpaDelta] = useState("+0.04 this semester");
  const [downloadsCount] = useState(18);

  const [lectures] = useState([
    { time: "10:30 AM", title: "Advanced English", location: "Room 204, Arts Block" },
    { time: "12:00 PM", title: "Speaking Spanish", location: "Language Lab, Block C" },
    { time: "2:00 PM", title: "Research Seminar", location: "Online – Zoom" },
  ]);

  const [academicProgress] = useState([
    { subject: "Research Project", percentage: 76 },
    { subject: "Advanced Database", percentage: 85 },
  ]);

  // ============================================================================
  // COMMENTED API CALL EXAMPLE: UNCOMMENT THIS BLOCK TO INTEGRATE YOUR BACKEND
  // ============================================================================
  // const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  //
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     setLoading(true);
  //     const service = new CoreService();
  //     try {
  //       // Example endpoint: GET content/v1/student-dashboard
  //       const response = await service.get("content/v1/student-dashboard");
  //       if (response.success && response.data) {
  //         // setDashboardData(response.data);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load dashboard from API:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchDashboardData();
  // }, []);
  // ============================================================================

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10">
      {/* Header Panel */}
      <StudentHeader title="Good morning, Chiamaka 👋" unreadCount={unreadCount} />

      {/* Metrics Row (4 premium cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 w-full">
        {/* Metric 1: GPA */}
        <div className="bg-white border border-[#d8eedd] rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex flex-col select-none">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3d5a45]/60 mb-2">
              Current GPA
            </span>
            <span className="text-3xl font-extrabold text-[#0d1b0f] font-sans leading-none">
              {gpa.toFixed(2)}
            </span>
            <span className="text-[11px] font-bold text-[#2dba4e] flex items-center gap-1 mt-2.5">
              ▲ <span className="font-sans font-medium">{gpaDelta}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#0d2818] flex items-center justify-center shrink-0 border border-emerald-950/20 text-white shadow-[0_4px_12px_rgba(13,40,24,0.15)] group-hover:scale-105 transition-transform">
            <Star className="w-5 h-5 fill-[#3ef06e] text-[#3ef06e]" />
          </div>
        </div>

        {/* Metric 2: Credits Earned */}
        <div className="bg-white border border-[#d8eedd] rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex flex-col select-none">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3d5a45]/60 mb-2">
              Credits Earned
            </span>
            <span className="text-3xl font-extrabold text-[#0d1b0f] font-sans leading-none">
              {creditsEarned}
            </span>
            <span className="text-[11px] font-semibold text-[#3d5a45]/70 flex items-center gap-1 mt-2.5">
              of 30 this year
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e8f5ed] border border-[#d8eedd] flex items-center justify-center shrink-0 text-[#2dba4e] group-hover:scale-105 transition-transform">
            <CheckCircle className="w-5 h-5 fill-emerald-100" />
          </div>
        </div>

        {/* Metric 3: PDF Downloads */}
        <div className="bg-white border border-[#d8eedd] rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex flex-col select-none">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3d5a45]/60 mb-2">
              PDF Downloads
            </span>
            <span className="text-3xl font-extrabold text-[#0d1b0f] font-sans leading-none">
              {downloadsCount}
            </span>
            <span className="text-[11px] font-semibold text-[#3d5a45]/70 flex items-center gap-1 mt-2.5">
              From PDF library
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e8f5ed] border border-[#d8eedd] flex items-center justify-center shrink-0 text-[#2dba4e] group-hover:scale-105 transition-transform">
            <Download className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Courses Active */}
        <div className="bg-white border border-[#d8eedd] rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex flex-col select-none">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3d5a45]/60 mb-2">
              Courses Active
            </span>
            <span className="text-3xl font-extrabold text-[#0d1b0f] font-sans leading-none">
              {activeCoursesCount}
            </span>
            <span className="text-[11px] font-semibold text-[#3d5a45]/70 flex items-center gap-1 mt-2.5">
              Harmattan 2026
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e8f5ed] border border-[#d8eedd] flex items-center justify-center shrink-0 text-[#2dba4e] group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-emerald-100" />
          </div>
        </div>
      </div>

      {/* Main Grid: Lectures & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start w-full">
        {/* Left Column: Today's Lectures */}
        <div className="lg:col-span-2 bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden h-full flex flex-col">
          <div className="flex items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 select-none">
            <div className="flex items-center gap-2.5">
              <MonitorPlay className="w-5 h-5 text-[#2dba4e]" />
              <h3 className="text-lg font-bold text-[#0d1b0f] font-sans">
                Today's Lectures
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#3d5a45]/60 font-sans">
              Wed, Sept 20
            </span>
          </div>

          <div className="p-5 md:p-6 space-y-4 flex-1">
            {lectures.map((lecture, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#f5f9f6]/40 border border-[#d8eedd]/80 rounded-2xl hover:bg-[#e8f5ed]/30 transition-all select-none gap-3"
              >
                <div className="flex items-start gap-4">
                  {/* Left Accent Bar */}
                  <div className="w-1 h-10 bg-[#2dba4e] rounded-full self-center shrink-0"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#2dba4e] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      {lecture.time}
                    </span>
                    <h4 className="text-sm md:text-base font-bold text-[#0d1b0f] font-sans mt-0.5">
                      {lecture.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#3d5a45]/70 bg-white border border-[#d8eedd] px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-sm">
                  <MapPin className="w-3 h-3 text-[#2dba4e] shrink-0" />
                  <span>{lecture.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Academic Progress */}
        <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm p-5 md:p-6 flex flex-col select-none">
          <div className="flex items-center gap-2.5 border-b border-[#d8eedd] pb-4 mb-5 md:mb-6">
            <TrendingUp className="w-5 h-5 text-[#2dba4e]" />
            <h3 className="text-lg font-bold text-[#0d1b0f] font-sans">
              Academic Progress
            </h3>
          </div>

          {/* Top circular dial container */}
          <div className="flex items-center gap-6 mb-8 mt-2 justify-center sm:justify-start">
            {/* SVG Ring Gauge */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e8f5ed"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Foreground Fill */}
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#2dba4e"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * gpa) / 4.0}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner details */}
              <div className="absolute flex flex-col items-center select-none">
                <span className="text-[17px] font-extrabold text-[#0d1b0f] leading-none">
                  {gpa.toFixed(2)}
                </span>
                <span className="text-[9px] font-bold text-[#3d5a45]/60 mt-1 uppercase">
                  / 4.0
                </span>
              </div>
            </div>

            {/* Standing Details */}
            <div className="flex flex-col">
              <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#3d5a45]/60 mb-0.5">
                Standing
              </span>
              <span className="text-base font-extrabold text-[#2dba4e] tracking-wide leading-tight">
                First Class
              </span>
              <div className="flex items-center gap-1.5 mt-2 bg-[#f5f9f6] border border-[#d8eedd] px-3 py-1 rounded-lg w-fit">
                <span className="text-[9px] font-bold text-[#3d5a45]/60 uppercase leading-none">Level</span>
                <span className="text-[11px] font-bold text-[#0d1b0f] leading-none">400</span>
              </div>
            </div>
          </div>

          {/* Bottom Project Progress Bars */}
          <div className="space-y-4">
            {academicProgress.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold select-none">
                  <span className="text-[#3d5a45] font-bold">{item.subject}</span>
                  <span className="text-[#0d1b0f] font-extrabold">{item.percentage}%</span>
                </div>
                {/* Bar Rail */}
                <div className="w-full h-2.5 bg-[#e8f5ed] rounded-full overflow-hidden border border-[#d8eedd]/30">
                  <div
                    className="h-full bg-[#2dba4e] rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, Download, Zap, MapPin, Clock, MonitorPlay, TrendingUp, GraduationCap, BookOpen, ShoppingBag, FileText, Bell } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useStudent } from "./layout";
import MyCourses from "./courses/courses";
import AcademicResults from "./results/results";
import MerchResources from "./purchases/purchases";
import PdfLibrary from "./pdf-library/pdf-library";
import NotificationsPage from "./notifications/notifications";
import Validator from "@/app/validators/auth-validator";
import { useToast } from "@/app/providers/toast-provider";

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
            placeholder="Search dashboard..." 
            className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardView: React.FC = () => {
  const { creditsEarned = 24, activeCoursesCount = 5, unreadCount = 3, profile = { name: "Chiamaka M." } } = useStudent();
  const [loading, setLoading] = useState(false);

  // Default hardcoded states matching design.
  // DELETE / COMMENT these variables out once API fetching is enabled.
  const [gpa] = useState(3.82);
  const [gpaDelta] = useState("+0.04 this semester");
  const [downloadsCount] = useState(18);

  const [lectures] = useState([
    { time: "10:30 AM", title: "Advanced Software Engineering", location: "Room 204, Engineering Block" },
    { time: "12:00 PM", title: "Machine Learning Lab", location: "CS Lab, Block C" },
    { time: "2:00 PM", title: "Research Seminar", location: "Online – Zoom" },
  ]);

  const [academicProgress] = useState([
    { subject: "Research Project", percentage: 70 },
    { subject: "Advanced Database", percentage: 85 },
    { subject: "Machine Learning", percentage: 78 },
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = profile.name?.split(' ')[0] || "Student";

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full"
    >
      {/* Header Panel */}
      <StudentHeader title={`${getGreeting()}, ${firstName} 👋`} unreadCount={unreadCount} />

      {/* Metrics Row (4 premium cards) - NacosHub style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 w-full">
        {/* Metric 1: GPA */}
        <motion.div variants={itemVariants} className="bg-white border border-[#d8eedd] rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a9975] mb-2">
              Current GPA
            </span>
            <span className="text-3xl font-bold text-[#071a0d] font-serif leading-none">
              {gpa.toFixed(2)}
            </span>
            <span className="text-[11px] font-semibold text-[#22b864] flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>{gpaDelta}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0a4a20] to-[#0f6e3f] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Star className="w-5 h-5 fill-[#88e8b0] text-[#88e8b0]" />
          </div>
        </motion.div>

        {/* Metric 2: Credits Earned */}
        <motion.div variants={itemVariants} className="bg-white border border-[#d8eedd] rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a9975] mb-2">
              Credits Earned
            </span>
            <span className="text-3xl font-bold text-[#071a0d] font-serif leading-none">
              {creditsEarned}
            </span>
            <span className="text-[11px] font-semibold text-[#6a9975] mt-2">
              of 30 this year
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e6faf0] border border-[#c0f4d5] flex items-center justify-center text-[#0f6e3f] group-hover:scale-105 transition-transform">
            <CheckCircle className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Metric 3: PDF Downloads */}
        <motion.div variants={itemVariants} className="bg-white border border-[#d8eedd] rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a9975] mb-2">
              PDF Downloads
            </span>
            <span className="text-3xl font-bold text-[#071a0d] font-serif leading-none">
              {downloadsCount}
            </span>
            <span className="text-[11px] font-semibold text-[#6a9975] mt-2">
              From PDF library
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e6faf0] border border-[#c0f4d5] flex items-center justify-center text-[#0f6e3f] group-hover:scale-105 transition-transform">
            <Download className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Metric 4: Courses Active */}
        <motion.div variants={itemVariants} className="bg-white border border-[#d8eedd] rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a9975] mb-2">
              Courses Active
            </span>
            <span className="text-3xl font-bold text-[#071a0d] font-serif leading-none">
              {activeCoursesCount}
            </span>
            <span className="text-[11px] font-semibold text-[#6a9975] mt-2">
              Harmattan 2026
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e6faf0] border border-[#c0f4d5] flex items-center justify-center text-[#0f6e3f] group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Lectures & Progress */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start w-full">
        {/* Left Column: Today's Lectures */}
        <div className="lg:col-span-2 bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden h-full flex flex-col">
          <div className="flex items-center justify-between border-b border-[#d8eedd] p-5 md:px-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
                <MonitorPlay className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#071a0d] font-serif">
                Today's Lectures
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#6a9975]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="p-5 md:p-6 space-y-4 flex-1">
            {lectures.map((lecture, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#f2fbf6]/50 border border-[#d8eedd] rounded-xl hover:bg-[#e6faf0] hover:border-[#88e8b0] transition-all gap-3"
                style={{ animationDelay: `${index * 0.1}s`, animation: 'fadeUp 0.4s ease both' }}
              >
                <div className="flex items-start gap-4">
                  {/* Left Accent Bar */}
                  <div className="w-1 h-10 bg-[#22b864] rounded-full self-center"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#22b864] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {lecture.time}
                    </span>
                    <h4 className="text-sm md:text-base font-bold text-[#071a0d] font-sans mt-0.5">
                      {lecture.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#3a6645] bg-white border border-[#d8eedd] px-3 py-1.5 rounded-full self-start sm:self-auto shadow-sm">
                  <MapPin className="w-3 h-3 text-[#22b864]" />
                  <span>{lecture.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Academic Progress */}
        <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm p-5 md:p-6 flex flex-col">
          <div className="flex items-center gap-2.5 border-b border-[#d8eedd] pb-4 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#071a0d] font-serif">
              Academic Progress
            </h3>
          </div>

          {/* GPA Ring Gauge */}
          <div className="flex items-center gap-6 mb-8 justify-center sm:justify-start">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e6faf0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#22b864"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * gpa) / 4.0}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-[#071a0d] font-serif leading-none">
                  {gpa.toFixed(2)}
                </span>
                <span className="text-[9px] font-bold text-[#6a9975] mt-0.5">
                  / 4.0
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#6a9975] mb-0.5">
                Standing
              </span>
              <span className="text-base font-extrabold text-[#22b864] tracking-wide">
                First Class
              </span>
              <div className="flex items-center gap-1.5 mt-2 bg-[#f2fbf6] border border-[#d8eedd] px-2.5 py-1 rounded-lg">
                <span className="text-[9px] font-bold text-[#6a9975] uppercase">Level</span>
                <span className="text-[11px] font-bold text-[#071a0d]">400</span>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            {academicProgress.map((item, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#3a6645] font-bold">{item.subject}</span>
                  <span className="text-[#071a0d] font-black">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-[#e6faf0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#22b864] to-[#4fd68a] rounded-full transition-all duration-700"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-6 pt-4 border-t border-[#d8eedd]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#6a9975]">Semester Progress</span>
              <span className="font-bold text-[#22b864]">76%</span>
            </div>
            <div className="mt-2 h-1.5 bg-[#e6faf0] rounded-full overflow-hidden">
              <div className="h-full w-[76%] bg-linear-to-r from-[#0f6e3f] to-[#22b864] rounded-full"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links Section - NacosHub style */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center mx-auto mb-2 text-[#0f6e3f] group-hover:scale-110 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#071a0d]">Browse Courses</span>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center mx-auto mb-2 text-[#0f6e3f] group-hover:scale-110 transition-transform">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#071a0d]">View Results</span>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center mx-auto mb-2 text-[#0f6e3f] group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#071a0d]">Merch Store</span>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center mx-auto mb-2 text-[#0f6e3f] group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#071a0d]">PDF Library</span>
        </div>
      </motion.div>

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
    </motion.div>
  );
};

const StudentDashboard: React.FC = () => {
  const { activeSection = "dashboard" } = useStudent();

  const renderView = () => {
    const sections = ["dashboard", "courses", "results", "purchases", "pdf-library", "notifications"];
    const screens = [
      <DashboardView />,
      <MyCourses />,
      <AcademicResults />,
      <MerchResources />,
      <PdfLibrary />,
      <NotificationsPage />,
    ]
    
    const activeIndex = sections.indexOf(activeSection);
    return activeIndex !== -1 ? screens[activeIndex] : <DashboardView />;
  };

  return (
    <>
      {renderView()}
      <Validator />
    </>
  );
};

export default StudentDashboard;
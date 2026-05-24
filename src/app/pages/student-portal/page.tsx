"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Star, CheckCircle, Download, Zap, MapPin, Clock, MonitorPlay, TrendingUp, GraduationCap, BookOpen, ShoppingBag, FileText, Bell, Loader2, Lightbulb, Sparkles } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useStudent } from "./layout";
import MyCourses from "./courses/courses";
import AcademicResults from "./results/results";
import MerchResources from "./purchases/purchases";
import PdfLibrary from "./pdf-library/pdf-library";
import NotificationsPage from "./notifications/notifications";
import Validator from "@/app/validators/auth-validator";
import { useToast } from "@/app/providers/toast-provider";
import GPAPredictionEngine from "./gpa-prediction/gpa-prediction";
import GameHub from "./game-hub/game-hub";
import CourseRepDashboard from "./course-reps/course-reps";
import { useRouter } from "next/navigation";
import CoreService from "@/app/hooks/core-service";

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
            <Bell className="w-4 h-4" />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#22b864] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#22b864] to-[#0f6e3f] flex items-center justify-center text-white shadow-lg shadow-[#22b864]/20 cursor-pointer hover:scale-105 transition-all">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#e6faf0] border border-[#c0f4d5] rounded-xl">
          <div className="w-2 h-2 rounded-full bg-[#22b864] animate-pulse"></div>
          <span className="text-xs font-bold text-[#0f6e3f] uppercase tracking-wider">
            System Online
          </span>
        </div>
      </div>
    </div>
  );
};

const coreService = new CoreService();

const DashboardView: React.FC = () => {
  const { profile, setActiveSection, unreadCount } = useStudent();
  const [loading, setLoading] = useState(false);

  const [gpa] = useState(0.00);
  const [gpaDelta] = useState("Pending results");
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);
  const [registeredCredits, setRegisteredCredits] = useState(0);
  const [recentPdfs, setRecentPdfs] = useState<any[]>([]);
  const [facts, setFacts] = useState<{ category: string; content: string }[]>([
    { category: "Loading", content: "Fetching interesting facts for you..." }
  ]);

  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const fetchFacts = async () => {
    try {
      const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
      const data = await response.json();
      
      setFacts([{
        category: "Useless Fact",
        content: data.text
      }]);
    } catch (error) {
      console.error("Failed to fetch facts:", error);
    }
  };

  useEffect(() => {
    fetchFacts();
    const factInterval = setInterval(fetchFacts, 15000); // Refresh fact from API every 15 seconds
    return () => clearInterval(factInterval);
  }, []);

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

  // Logic to fetch actual available PDF count for the student
  useEffect(() => {
    const fetchStats = async () => {
      if (!profile.level || !profile.department) return;
      
      try {
        const res = await coreService.get(`courses/find-all-courses?level=${profile.level}&department=${profile.department}`);
        if (res.success && Array.isArray(res.data)) {
          setActiveCoursesCount(res.data.length);
          
          // Calculate total credits for the level
          const totalCredits = res.data.reduce((sum: number, c: any) => sum + (parseInt(c.credits) || 3), 0);
          
          setRegisteredCredits(totalCredits);
          setRecentPdfs(res.data.filter((c: any) => c.downloadUrl).slice(0, 3));
        }
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      }
    };
    fetchStats();
  }, [profile.level, profile.department]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [facts.length]);

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

  const firstName = profile?.name?.split(' ')[0] || "Student";

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
              Current Level
            </span>
            <span className="text-3xl font-bold text-[#071a0d] font-serif leading-none">
              {profile.level || "---"}
            </span>
            <span className="text-[11px] font-semibold text-[#6a9975] mt-2">
              {profile.department || "Undergraduate"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0a4a20] to-[#0f6e3f] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-[#88e8b0]" />
          </div>
        </motion.div>

        {/* Metric 2: Credits Earned */}
        <motion.div variants={itemVariants} className="bg-white border border-[#d8eedd] rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a9975] mb-2">
              Registered Units
            </span>
            <span className="text-3xl font-bold text-[#071a0d] font-serif leading-none">
              {registeredCredits}
            </span>
            <span className="text-[11px] font-semibold text-[#6a9975] mt-2">
              Current Semester
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
              {recentPdfs.length || 0}
            </span>
            <span className="text-[11px] font-semibold text-[#6a9975] mt-2">
              Recent resources
            </span>
          </div>
          <div 
            onClick={() => setActiveSection('pdf-library')}
            className="w-12 h-12 rounded-xl bg-[#e6faf0] border border-[#c0f4d5] flex items-center justify-center text-[#0f6e3f] group-hover:scale-105 transition-transform cursor-pointer"
          >
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
        <div className="lg:col-span-2 bg-white/40 backdrop-blur-xl border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden h-full flex flex-col relative group min-h-80">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700"
            >
              <Sparkles className="w-64 h-64 text-[#0f6e3f]" />
            </motion.div>
          </div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Big Sparkle Decoration */}
            <motion.div
              animate={{ 
                scale: [0.8, 1.1, 0.8],
                opacity: [0.1, 0.2, 0.1],
                rotate: [0, 45, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            >
              <Sparkles className="w-64 h-64 text-[#22b864]/5" />
            </motion.div>

            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.05, 0.1, 0.05] 
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-[#22b864] rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                x: [-20, 20, -20],
                y: [-20, 20, -20],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#e6faf0] rounded-full blur-2xl opacity-40"
            />
            
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.05, 0.15, 0.05],
                rotate: [0, -45, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-56 h-56 bg-[#22b864] rounded-full blur-3xl opacity-20"
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4 opacity-[0.08]"
            >
              <Sparkles className="w-32 h-32 text-[#0f6e3f]" />
            </motion.div>

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-[#22b864] rounded-full shadow-[0_0_12px_rgba(34,184,100,0.8)]"
                animate={{
                  y: [0, -100],
                  x: Math.sin(i) * 50,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "linear"
                }}
                style={{
                  left: `${15 + i * 15}%`,
                  bottom: "-10px"
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 relative z-10 bg-white/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#22b864]/10 flex items-center justify-center text-[#0f6e3f]">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#071a0d] font-serif">
                Did You Know?
              </h3>
            </div>
            <div className="flex gap-1">
              {facts.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentFactIndex ? 'w-4 bg-[#22b864]' : 'w-1 bg-[#d8eedd]'}`} />
              ))}
            </div>
          </div>

          <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative z-10 overflow-y-auto max-h-60">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFactIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f6e3f] bg-[#22b864]/10 px-3 py-1 rounded-full w-fit flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  {facts[currentFactIndex].category}
                </span>
                <p className="text-xl md:text-2xl lg:text-3xl font-serif text-[#071a0d] leading-relaxed italic relative">
                  <span className="absolute -left-6 -top-2 text-4xl text-[#22b864]/20 font-serif">"</span>
                  {facts[currentFactIndex].content}
                </p>
              </motion.div>
            </AnimatePresence>
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

          {/* Recent PDF Resources List */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6a9975]">
                Recent Resources
              </span>
              <button 
                onClick={() => setActiveSection('pdf-library')}
                className="text-[10px] font-bold text-[#22b864] hover:underline"
              >
                View All
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {recentPdfs.length > 0 ? (
                recentPdfs.map((pdf, idx) => (
                  <div 
                    key={pdf.id}
                    onClick={() => window.open(pdf.downloadUrl, '_blank')}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#f2fbf6] border border-[#d8eedd] hover:border-[#22b864] transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#071a0d] truncate">{pdf.name}</h4>
                      <p className="text-[10px] text-[#6a9975] font-mono">{pdf.code}</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#22b864] opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-[#e6faf0] rounded-2xl">
                  <p className="text-xs text-[#6a9975]">No recent PDFs found</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-auto pt-4 border-t border-[#d8eedd]">
            <p className="text-[11px] text-[#6a9975] leading-relaxed">
              Want to see your future grades? Use our <span className="text-[#22b864] font-bold cursor-pointer hover:underline" onClick={() => setActiveSection('gpa-predictor')}>GPA Predictor</span> to calculate your potential results for this semester.
            </p>
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-6 pt-4 border-t border-[#d8eedd]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#6a9975]">Library Utilization</span>
              <span className="font-bold text-[#22b864]">Active</span>
            </div>
            <div className="mt-2 h-1 bg-[#e6faf0] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-linear-to-r from-[#0f6e3f] to-[#22b864] rounded-full"
              ></motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links Section - NacosHub style */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveSection('courses')}
          className="bg-white border border-[#d8eedd] rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center mx-auto mb-2 text-[#0f6e3f] group-hover:scale-110 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#071a0d]">Browse Courses</span>
        </div>
        <div 
          onClick={() => setActiveSection('results')}
          className="bg-white border border-[#d8eedd] rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center mx-auto mb-2 text-[#0f6e3f] group-hover:scale-110 transition-transform">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#071a0d]">View Results</span>
        </div>
        <div 
          onClick={() => setActiveSection('purchases')}
          className="bg-white border border-[#d8eedd] rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center mx-auto mb-2 text-[#0f6e3f] group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#071a0d]">Merch Store</span>
        </div>
        <div 
          onClick={() => setActiveSection('pdf-library')}
          className="bg-white border border-[#d8eedd] rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
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
  const router = useRouter();

  const renderView = () => {
    const sections = ["dashboard", "courses", "results", "purchases", "pdf-library", "notifications", "gpa-predictor", 'game-hub', 'course-reps'];
    const screens = [
      <DashboardView />,
      <MyCourses />,
      <AcademicResults />,
      <MerchResources />,
      <PdfLibrary />,
      <NotificationsPage />,
      <GPAPredictionEngine />,
      <GameHub />,
      <CourseRepDashboard />
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
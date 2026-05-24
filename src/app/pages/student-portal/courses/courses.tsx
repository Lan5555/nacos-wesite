"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, BookOpen, Check, Clock, GraduationCap, LayoutGrid, List } from "lucide-react";
import { useStudent } from "../layout";
import CoreService from "@/app/hooks/core-service";

const coreService = new CoreService();

// Custom StudentHeader component matching NacosHub aesthetic
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
          <i className="fas fa-search text-[#6a9975] text-sm"></i>
          <input 
            type="text" 
            placeholder="Search courses..." 
            onChange={(e) => onSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
          />
        </div>
      </div>
    </div>
  );
};

const MyCourses: React.FC = () => {
  const { unreadCount = 0, registeredCourses = [], registerCourse, profile, showToast } = useStudent();
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchCourses = useCallback(async () => {
    if (!profile.level || !profile.department) return;
    setLoading(true);
    try {
      // Fetch courses matching user's level and department
      const res = await coreService.get(
        `courses/find-all-courses?level=${profile.level}&department=${profile.department}`
      );
      if (res.success && Array.isArray(res.data)) {
        setCourses(res.data);
      } else {
        setCourses([]);
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch courses", "error");
    } finally {
      setLoading(false);
    }
  }, [profile.level, profile.department, showToast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate total credits from registered courses
  const totalRegisteredCredits = courses
    .filter(c => registeredCourses.includes(c.code))
    .reduce((sum, c) => sum + (parseInt(c.credits) || 3), 0);

  const handleRegister = (courseId: string, courseCode: string, credits: number) => {
    // If you are using the API, call `handleRegisterApi` instead of this mock setup.
    setLoadingCourseId(courseId);
    
    // Simulate API delay
    setTimeout(() => {
      registerCourse(courseCode, credits);
      setLoadingCourseId(null);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <StudentHeader 
        title="My Courses" 
        unreadCount={unreadCount} 
        onSearch={setSearchQuery}
      />

      {/* Stats Row - Matching NacosHub dashboard style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6a9975]">Total Courses</div>
              <div className="font-serif text-2xl text-[#071a0d] mt-1">{courses.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6a9975]">Total Credits</div>
              <div className="font-serif text-2xl text-[#071a0d] mt-1">{totalRegisteredCredits}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6a9975]">Semester</div>
              <div className="font-serif text-lg text-[#071a0d] mt-1">Harmattan 2026</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center text-[#c8a84b]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main card housing the available courses */}
      <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden w-full flex flex-col">
        
        {/* Card Header details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#071a0d] font-serif">
              Available Courses
            </h3>
          </div>
          <div className="flex items-center bg-[#f2fbf6] p-1 rounded-xl border border-[#d8eedd]">
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
        </div>

        {/* Courses grid list */}
        <div className="p-5 md:p-6 min-h-75">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#e6faf0] border-t-[#22b864] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#6a9975] font-medium">Loading your courses...</p>
            </div>
          ) : (
            <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full">
              {filteredCourses.map((course, idx) => {
              const isRegistered = registeredCourses.includes(course.code);
              const credits = parseInt(course.credits) || 3;
              const isLoading = loadingCourseId === course.id;

              return (
                <div
                  key={course.id}
                  className={`group bg-white border rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden ${
                    isRegistered
                      ? "border-[#88e8b0] bg-linear-to-br from-white to-[#e6faf0]/30"
                      : "border-[#d8eedd] hover:border-[#88e8b0]"
                  }`}
                  style={{ animationName: 'fadeUp', animationDuration: '0.4s', animationTimingFunction: 'ease', animationFillMode: 'both', animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Decorative background element */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#22b864]/5 rounded-full blur-xl group-hover:bg-[#22b864]/10 transition-colors"></div>

                  {/* Top segment: Title and Credit Badge */}
                  <div className="flex flex-col relative z-10">
                    <div className="flex items-start justify-between">
                      {/* Course Icon container */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-105 ${
                        isRegistered 
                          ? "bg-[#22b864] text-white" 
                          : "bg-linear-to-br from-[#e6faf0] to-[#c0f4d5] text-[#0f6e3f]"
                      }`}>
                        <BookOpen className="w-5 h-5" />
                      </div>

                      {/* Credit units badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight border shadow-sm ${
                        isRegistered
                          ? "bg-[#22b864]/10 text-[#0f6e3f] border-[#88e8b0]"
                          : "bg-[#f2fbf6] text-[#3a6645] border-[#d8eedd]"
                      }`}>
                        {credits} cr.
                      </span>
                    </div>

                    {/* Course codes and titles */}
                    <div className="mt-4">
                      <span className="text-[11px] font-mono font-bold text-[#22b864] tracking-wide uppercase">
                        {course.code}
                      </span>
                      <h4 className="text-base font-bold text-[#071a0d] font-sans mt-1 leading-tight group-hover:text-[#0f6e3f] transition-colors">
                        {course.name}
                      </h4>
                      <p className="text-xs text-[#6a9975] mt-1.5 line-clamp-1">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom segment: Credit hours metadata & CTA button */}
                  <div className="flex items-center justify-between border-t border-[#d8eedd] pt-3.5 mt-3.5 relative z-10">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6a9975]">
                      <Clock className="w-3.5 h-3.5 text-[#22b864]" />
                      <span>{credits} Credit Hours</span>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {filteredCourses.map((course, idx) => {
                const isRegistered = registeredCourses.includes(course.code);
                const credits = parseInt(course.credits) || 3;

                return (
                  <div
                    key={course.id}
                    className={`group bg-white border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between hover:shadow-md transition-all duration-300 ${
                      isRegistered ? "border-[#88e8b0] bg-[#f2fbf6]/30" : "border-[#d8eedd] hover:border-[#88e8b0]"
                    }`}
                    style={{ animationName: 'fadeUp', animationDuration: '0.4s', animationTimingFunction: 'ease', animationFillMode: 'both', animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isRegistered ? "bg-[#22b864] text-white" : "bg-[#e6faf0] text-[#0f6e3f]"
                      }`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#071a0d] group-hover:text-[#0f6e3f] transition-colors">
                            {course.name}
                          </h4>
                          <span className="text-[9px] font-bold text-[#22b864] bg-[#f2fbf6] px-2 py-0.5 rounded-full border border-[#d8eedd]">
                            {course.code}
                          </span>
                        </div>
                        <p className="text-xs text-[#6a9975] line-clamp-1 mt-0.5">{course.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6a9975]">
                        <Clock className="w-3.5 h-3.5 text-[#22b864]" />
                        <span>{credits} Credits</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty Search State */}
          {filteredCourses.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#f2fbf6] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#6a9975]" />
              </div>
              <h4 className="text-base font-bold text-[#071a0d]">No courses found</h4>
              <p className="text-sm text-[#6a9975] mt-1">We couldn't find any courses matching "{searchQuery}"</p>
            </div>
          )}
          </>
          )}
        </div>

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

export default MyCourses;

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
"use client";

import React, { useState } from "react";
import StudentHeader from "../components/StudentHeader";
import { BookOpen, Check, Bookmark, Clock } from "lucide-react";
import { useStudent } from "../layout";

// ============================================================================
// API INTEGRATION AND INTERFACES (COMMENTED OUT UNTIL BACKEND IS READY)
// ============================================================================
// import CoreService from "@/app/hooks/core-service";
//
// interface Course {
//   id: string;
//   code: string;
//   title: string;
//   credits: number;
//   semester: string;
//   registered: boolean;
// }
// ============================================================================

export default function MyCourses() {
  const { unreadCount, registeredCourses, registerCourse } = useStudent();
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);

  // Fallback courses state matching the screenshots.
  // DELETE / COMMENT these variables out once API fetching is enabled.
  const [courses] = useState([
    {
      id: "csc401",
      code: "CSC 401",
      title: "Advanced Software Engineering",
      credits: 3,
      semester: "1st Semester",
      creditHours: "3 Credit Hours",
    },
    {
      id: "csc405",
      code: "CSC 405",
      title: "Machine Learning Fundamentals",
      credits: 3,
      semester: "1st Semester",
      creditHours: "3 Credit Hours",
    },
    {
      id: "csc411",
      code: "CSC 411",
      title: "Cloud Computing",
      credits: 2,
      semester: "1st Semester",
      creditHours: "2 Credit Hours",
    },
    {
      id: "ent402",
      code: "ENT 402",
      title: "Entrepreneurship",
      credits: 2,
      semester: "1st Semester",
      creditHours: "2 Credit Hours",
    },
    {
      id: "csc498",
      code: "CSC 498",
      title: "Project Seminar",
      credits: 3,
      semester: "1st Semester",
      creditHours: "3 Credit Hours",
    },
  ]);

  // ============================================================================
  // COMMENTED API CALL EXAMPLE: UNCOMMENT THIS BLOCK TO INTEGRATE YOUR BACKEND
  // ============================================================================
  // const [apiCourses, setApiCourses] = useState<Course[]>([]);
  //
  // const fetchCourses = async () => {
  //   const service = new CoreService();
  //   try {
  //     const response = await service.get("content/v1/courses/available");
  //     if (response.success && response.data) {
  //       // setApiCourses(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load courses from API:", error);
  //   }
  // };
  //
  // const handleRegisterApi = async (courseId: string, courseCode: string, credits: number) => {
  //   setLoadingCourseId(courseId);
  //   const service = new CoreService();
  //   try {
  //     const response = await service.send("content/v1/courses/register", { courseId });
  //     if (response.success) {
  //       registerCourse(courseCode, credits); // Updates UI context globally
  //     }
  //   } catch (error) {
  //     console.error("Course registration failed:", error);
  //   } finally {
  //     setLoadingCourseId(null);
  //   }
  // };
  // ============================================================================

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
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10">
      {/* Header Panel */}
      <StudentHeader title="My Courses" unreadCount={unreadCount} />

      {/* Main card housing the available courses */}
      <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden w-full flex flex-col select-none">
        
        {/* Card Header details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 gap-3 select-none">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#2dba4e]" />
            <h3 className="text-lg font-bold text-[#0d1b0f] font-sans">
              Available Courses
            </h3>
          </div>
          
          <span className="text-xs font-semibold text-[#3d5a45]/60 font-sans uppercase tracking-wider select-none">
            Harmattan Semester 2026
          </span>
        </div>

        {/* Courses grid list */}
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full">
            {courses.map((course) => {
              const isRegistered = registeredCourses.includes(course.code);
              const isLoading = loadingCourseId === course.id;

              return (
                <div
                  key={course.id}
                  className={`bg-[#f5f9f6]/30 border rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-all h-[210px] ${
                    isRegistered
                      ? "border-[#2dba4e] bg-[#e8f5ed]/10"
                      : "border-[#d8eedd]/80 hover:bg-[#e8f5ed]/20 hover:border-[#2dba4e]/30"
                  }`}
                >
                  {/* Top segment: Title and Credit Badge */}
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between">
                      {/* Course Icon container */}
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                        isRegistered 
                          ? "bg-[#2dba4e]/10 border-[#2dba4e]/20 text-[#2dba4e]" 
                          : "bg-emerald-50 border-emerald-100 text-[#2dba4e]"
                      }`}>
                        <BookOpen className="w-5 h-5 fill-emerald-100/10" />
                      </div>

                      {/* Credit units badge */}
                      <span className="text-[10px] font-extrabold text-[#3d5a45] bg-[#e8f5ed] border border-[#d8eedd] px-2.5 py-1 rounded-full uppercase">
                        {course.credits} cr.
                      </span>
                    </div>

                    {/* Course codes and titles */}
                    <div className="mt-3.5 select-none">
                      <span className="text-[11px] font-extrabold text-[#2dba4e]/90 font-sans tracking-wide uppercase leading-none">
                        {course.code}
                      </span>
                      <h4 className="text-sm font-extrabold text-[#0d1b0f] font-sans mt-1 truncate leading-snug">
                        {course.title}
                      </h4>
                    </div>
                  </div>

                  {/* Bottom segment: Credit hours metadata & CTA button */}
                  <div className="flex items-center justify-between border-t border-[#d8eedd]/40 pt-3 mt-3 select-none">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#3d5a45]/60 uppercase">
                      <Clock className="w-3.5 h-3.5 text-[#2dba4e]" />
                      <span>{course.creditHours}</span>
                    </div>

                    {/* Register button */}
                    <button
                      onClick={() => handleRegister(course.id, course.code, course.credits)}
                      disabled={isRegistered || isLoading}
                      className={`px-4.5 py-2.5 text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                        isRegistered
                          ? "bg-[#e8f5ed] border border-[#d8eedd] text-[#2dba4e] shadow-none cursor-default"
                          : isLoading
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-wait shadow-none"
                          : "bg-[#0d2818] border border-emerald-950/20 text-[#3ef06e] hover:bg-[#091f12] active:scale-95"
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2dba4e]" />
                          <span>Registered</span>
                        </>
                      ) : isLoading ? (
                        <span>Processing...</span>
                      ) : (
                        <span>Register</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

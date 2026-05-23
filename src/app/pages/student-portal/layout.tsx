"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import StudentSidebar from "./components/StudentSidebar";
import { X, CheckCircle, Info, AlertTriangle, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Validator from "@/app/validators/auth-validator";
import CoreService from "@/app/hooks/core-service";

// Types for dynamic states
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "academic" | "course" | "purchase" | "alert";
  timestamp?: Date;
  priority?: string;
  author?: string;
}

export interface StudentProfile {
  id?: number;
  name: string;
  level: string;
  department: string;
  matricNo: string;
  email?: string;
  initials: string;
  isAdmin?: boolean;
}

interface StudentContextType {
  profile: StudentProfile;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  classNotifications: any[];
  setClassNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  refreshNotifications: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  registeredCourses: string[];
  registerCourse: (courseCode: string, credits: number) => boolean;
  creditsEarned: number;
  activeCoursesCount: number;
  toast: { message: string; type: "success" | "info" | "error" } | null;
  showToast: (message: string, type: "success" | "info" | "error") => void;
  hideToast: () => void;
  cartCount: number;
  addToCart: (itemName: string, price: number) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

// Create context
const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Custom hook to use student states in child pages
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentLayout");
  }
  return context;
};

const coreService = new CoreService();

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Student Info State
  const [profile, setProfile] = useState<StudentProfile>({
    name: "Student",
    level: "",
    department: "",
    matricNo: "",
    initials: "S",
  });

  useEffect(() => {
    const storedStudent = sessionStorage.getItem('student');
    if (storedStudent) {
      try {
        const studentData = JSON.parse(storedStudent);
        setProfile({
          id: studentData.id,
          name: studentData.name,
          level: studentData.level, // e.g. "100"
          department: studentData.department,
          matricNo: studentData.mat_no,
          email: studentData.email,
          initials: studentData.name ? studentData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : "S",
          isAdmin: studentData.isAdmin || false,
        });
      } catch (error) {
        console.error("Error loading session data:", error);
      }
    }
  }, []);

  // 2. Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [classNotifications, setClassNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAllNotifications = useCallback(async () => {
    if (!profile.matricNo) return;
    try {
      const personalRes = await coreService.get(`student-notifications/find-all?mat_no=${profile.matricNo}`);
      if (personalRes?.success && Array.isArray(personalRes.data)) {
        const mapped: NotificationItem[] = personalRes.data.map((n: any) => ({
          id: n.id.toString(),
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date(n.createdAt),
          read: n.isRead,
          type: n.title.toLowerCase().includes('registration') ? "academic" : n.title.toLowerCase().includes('payment') ? "purchase" : "alert",
          priority: n.priority || "normal"
        }));
        setNotifications(mapped);
      }

      if (profile.level && profile.department) {
        const classRes = await coreService.get(`class-notifications/find-all?level=${profile.level}&department=${profile.department}&take=20&skip=0`);
        if (classRes?.success && Array.isArray(classRes.data)) {
          const readClassIds = JSON.parse(localStorage.getItem(`read_class_notifs_${profile.id}`) || "[]");
          const mappedClass = classRes.data.map((n: any) => ({
            id: `class-${n.id}`,
            rawId: n.id,
            title: n.title,
            message: n.message,
            timestamp: new Date(n.createdAt),
            read: readClassIds.includes(n.id),
            type: "course",
            author: n.author || "Course Coordinator"
          }));
          setClassNotifications(mappedClass);
        }
      }
    } catch (error) { console.error("Portal notification sync error", error); }
  }, [profile.matricNo, profile.level, profile.department, profile.id]);

  useEffect(() => { if (profile.matricNo) fetchAllNotifications(); }, [profile.matricNo, fetchAllNotifications]);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length + classNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications, classNotifications]);

  const markNotificationRead = async (id: string) => {
    if (id.startsWith('class-')) {
      const rawId = parseInt(id.replace('class-', ''));
      const readClassIds = JSON.parse(localStorage.getItem(`read_class_notifs_${profile.id}`) || "[]");
      if (!readClassIds.includes(rawId)) {
        readClassIds.push(rawId);
        localStorage.setItem(`read_class_notifs_${profile.id}`, JSON.stringify(readClassIds));
        setClassNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } else {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      await coreService.patch(`student-notifications/update?id=${id}`, { isRead: true });
    }
  };

  const deleteNotification = async (id: string) => {
    if (id.startsWith('class-')) return;
    const res = await coreService.delete(`student-notifications/delete?mat_no=${profile.matricNo}&id=${id}`);
    if (res.success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      showToast("Notification removed", "info");
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // API call to batch update could be added here
    showToast("All notifications marked as read", "success");
  };

  // 3. Registered Courses State
  const [registeredCourses, setRegisteredCourses] = useState<string[]>([]);
  const [creditsEarned, setCreditsEarned] = useState(24); // Starting point from screenshot
  const [activeCoursesCount, setActiveCoursesCount] = useState(5); // Starting count

  const registerCourse = (courseCode: string, credits: number): boolean => {
    if (registeredCourses.includes(courseCode)) {
      showToast(`${courseCode} is already registered.`, "error");
      return false;
    }
    setRegisteredCourses((prev) => [...prev, courseCode]);
    setCreditsEarned((prev) => prev + credits);
    setActiveCoursesCount((prev) => prev + 1);

    // Add dynamic notification
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      title: "Course Registration",
      message: `You have successfully registered for ${courseCode} (${credits} credits).`,
      time: "Just now",
      read: false,
      type: "course",
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Registered for ${courseCode} successfully!`, "success");
    return true;
  };

  // 4. Cart & Purchase State
  const [cartCount, setCartCount] = useState(0);

  const addToCart = (itemName: string, price: number) => {
    setCartCount((prev) => prev + 1);
    
    // Add dynamic notification
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      title: "Cart Update",
      message: `Added ${itemName} to your cart. Price: $${price}.`,
      time: "Just now",
      read: false,
      type: "purchase",
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Added ${itemName} to cart!`, "success");
  };

  // 5. Sleek Toast Alert State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 6. Section Navigation State (SPA Mode)
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <StudentContext.Provider
      value={{
        profile,
        unreadCount,
        setUnreadCount,
        notifications,
        setNotifications,
        classNotifications,
        setClassNotifications,
        refreshNotifications: fetchAllNotifications,
        deleteNotification,
        markNotificationRead,
        markAllNotificationsRead,
        registeredCourses,
        registerCourse,
        creditsEarned,
        activeCoursesCount,
        toast,
        showToast,
        hideToast,
        cartCount,
        addToCart,
        activeSection,
        setActiveSection,
      }}
    >
      <div className="flex bg-[#fcfdfc] min-h-screen text-slate-800 font-sans antialiased overflow-hidden relative">
        {/* Enforce authentication for all student routes */}
        {/* <Validator /> */}

        {/* Background decorations matching Login Page */}
        <div className="fixed -top-20 -right-20 w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(60,196,60,0.08),transparent_70%)] pointer-events-none" />
        <div className="fixed -bottom-16 -left-16 w-75 h-75 rounded-full bg-[radial-gradient(circle,rgba(40,162,40,0.05),transparent_70%)] pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(30,122,30,0.02)_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />

        {/* Sidebar implementation for Mobile & Desktop */}
        <div className={`
          fixed inset-y-0 left-0 z-50 transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
          shrink-0
        `}>
          <StudentSidebar 
            unreadNotificationsCount={unreadCount} 
            profile={profile} 
            activeSection={activeSection}
            onSectionChange={(section) => {
              setActiveSection(section);
              setIsSidebarOpen(false);
            }}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Mobile Backdrop Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Right Scrollable Area */}
        <main className="flex-1 h-screen overflow-y-auto relative flex flex-col z-10">
          {/* Mobile Top Navigation Bar */}
          <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-emerald-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 rounded-lg hover:bg-emerald-50 text-emerald-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="font-serif font-bold text-lg text-emerald-950">NacosHub</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {profile.initials}
            </div>
          </div>

          <div className="px-6 py-6 md:px-10 md:py-8 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Global Toast Banner */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white border border-white/10 rounded-2xl shadow-xl select-none max-w-sm"
            >
              <div className="shrink-0">
                {toast.type === "success" && (
                  <CheckCircle className="w-5 h-5 text-[#2dba4e]" />
                )}
                {toast.type === "info" && (
                  <Info className="w-5 h-5 text-emerald-600" />
                )}
                {toast.type === "error" && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <p className="text-sm font-semibold text-white/90 font-sans flex-1">
                {toast.message}
              </p>
              <button
                onClick={hideToast}
                className="text-white/40 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&display=swap');
          
          .font-serif {
            font-family: 'Crimson Pro', serif;
          }

          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.25s ease-out forwards;
          }

          ::-webkit-scrollbar {
            width: 5px;
          }
          ::-webkit-scrollbar-thumb {
            background: #2dba4e40;
            border-radius: 10px;
          }
        `}</style>
      </div>
    </StudentContext.Provider>
  );
}

export default StudentLayout;

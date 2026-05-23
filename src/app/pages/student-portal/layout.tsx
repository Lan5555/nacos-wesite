"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import StudentSidebar from "./components/StudentSidebar";
import { X, CheckCircle, Info, AlertTriangle, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Validator from "@/app/validators/auth-validator";

// Types for dynamic states
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "academic" | "course" | "purchase" | "alert";
}

export interface StudentProfile {
  id?: number;
  name: string;
  level: string;
  department: string;
  matricNo: string;
  email?: string;
  initials: string;
}

interface StudentContextType {
  profile: StudentProfile;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  notifications: NotificationItem[];
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
        });
      } catch (error) {
        console.error("Error loading session data:", error);
      }
    }
  }, []);

  // 2. Notifications State (3 unread initially to match the badge in screenshots)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Results Posted",
      message: "Your grade for CSC 401: Advanced Software Engineering has been uploaded. You scored an A!",
      time: "10 minutes ago",
      read: false,
      type: "academic",
    },
    {
      id: "2",
      title: "Course Registration Open",
      message: "Harmattan Semester 2026 course registration is active. Register your available courses now.",
      time: "2 hours ago",
      read: false,
      type: "course",
    },
    {
      id: "3",
      title: "Merchandise Available",
      message: "Nacos Eco Notebooks and official hoodies are now in stock in the Purchases center.",
      time: "1 day ago",
      read: false,
      type: "purchase",
    },
    {
      id: "4",
      title: "Active Session Approved",
      message: "Your biometric attendance session has been authenticated successfully.",
      time: "2 days ago",
      read: true,
      type: "alert",
    },
  ]);

  const [unreadCount, setUnreadCount] = useState(3);

  // Recalculate unread count whenever notifications list updates
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    showToast("Notification marked as read", "info");
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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

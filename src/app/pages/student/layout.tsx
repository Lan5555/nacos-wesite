"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import StudentSidebar from "./components/StudentSidebar";
import { X, CheckCircle, Info, AlertTriangle } from "lucide-react";
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
  name: string;
  level: string;
  department: string;
  matricNo: string;
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

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Student Info State
  const [profile] = useState<StudentProfile>({
    name: "Chiamaka M.",
    level: "400 Level",
    department: "CS",
    matricNo: "NAC/CS/1234",
    initials: "CM",
  });

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
      }}
    >
      <div className="flex bg-[#f5f9f6] min-h-screen text-slate-800 font-sans antialiased overflow-hidden">
        {/* Enforce authentication for all student routes */}
        {/* <Validator /> */}

        {/* Left Fixed Sidebar */}
        <StudentSidebar unreadNotificationsCount={unreadCount} profile={profile} />

        {/* Right Scrollable Area */}
        <main className="flex-1 h-screen overflow-y-auto px-6 py-6 md:px-10 md:py-8 relative flex flex-col">
          {/* Subtle Page Background Accents */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2dba4e]/5 rounded-full filter blur-[100px] pointer-events-none select-none"></div>
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-[80px] pointer-events-none select-none"></div>

          {/* Child Pages Content */}
          <div className="relative z-10 flex-1 flex flex-col">
            {children}
          </div>
        </main>

        {/* Global Toast Banner */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-white/90 backdrop-blur-md border border-[#d8eedd] rounded-2xl shadow-xl transition-all duration-300 transform translate-y-0 animate-bounce-short select-none max-w-sm">
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
            <p className="text-sm font-semibold text-[#0d1b0f] font-sans flex-1">
              {toast.message}
            </p>
            <button
              onClick={hideToast}
              className="text-[#8aab92] hover:text-[#0d1b0f] p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </StudentContext.Provider>
  );
}

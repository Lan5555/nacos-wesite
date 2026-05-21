"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
  ShoppingBag,
  Bell,
  Leaf,
  Sparkles,
  X,
  Brain,
  Gamepad,
} from "lucide-react";
import StudentProfileCard, { StudentProfile } from "./StudentProfileCard";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  badge,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm cursor-pointer select-none ${
        active
          ? "bg-[#22b864]/15 text-white shadow-sm"
          : "text-white/55 hover:text-white hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3.5">
        {/* Icon container with active glow */}
        <div className={`relative ${active ? "before:absolute before:inset-0 before:bg-[#22b864]/20 before:rounded-lg before:blur-md" : ""}`}>
          <Icon
            className={`w-5 h-5 transition-all duration-300 group-hover:scale-105 relative z-10 ${
              active ? "text-[#4fd68a] drop-shadow-sm" : "text-white/55 group-hover:text-white"
            }`}
          />
        </div>
        <span className={`transition-colors duration-200 ${
          active ? "text-white font-semibold" : "text-white/70 group-hover:text-white"
        }`}>
          {label}
        </span>
      </div>

      {badge !== undefined && badge !== "" && badge !== 0 && (
        <span className="flex items-center justify-center min-w-5 h-5 px-1.5 bg-linear-to-r from-[#22b864] to-[#4fd68a] text-[#042b12] text-[10px] font-black rounded-full shadow-md select-none">
          {badge}
        </span>
      )}

      {/* Active indicator line */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-[#22b864] to-[#4fd68a] rounded-r-full shadow-[0_0_8px_rgba(34,184,100,0.6)]"></div>
      )}
    </button>
  );
};

interface StudentSidebarProps {
  unreadNotificationsCount?: number;
  profile?: StudentProfile;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onClose?: () => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  unreadNotificationsCount = 3,
  profile,
  activeSection = "dashboard",
  onSectionChange,
  onClose,
}) => {
  const mainNavItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Overview",
    },
    {
      id: "pdf-library",
      icon: FileText,
      label: "PDF Library",
    },
    {
      id: "courses",
      icon: BookOpen,
      label: "My Courses",
    },
  ];

  const activityNavItems = [
    {
  id: "gpa-predictor",
  icon: Brain,
  label: "GPA Predictor",
},
    {
      id: "results",
      icon: GraduationCap,
      label: "Results",
    },
    {
      id: "game-hub",
      icon: Gamepad,
      label: "Game Hub",
    },
    {
      id: "purchases",
      icon: ShoppingBag,
      label: "Purchases",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadNotificationsCount,
    },
  ];

  return (
    <aside className="w-72 min-h-screen bg-linear-to-br from-[#042b12] via-[#0a4a20] to-[#0f6e3f] flex flex-col justify-between p-5 shrink-0 border-r border-[#22b864]/15 relative z-40 shadow-2xl">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-linear-to-b from-[#22b864]/8 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#22b864]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -left-20 w-40 h-40 bg-[#4fd68a]/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col flex-1 relative z-10">
        {/* Brand Header - NacosHub Style */}
        <div className="flex items-center justify-between gap-3 mb-8 mt-1 px-1 select-none">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#22b864]/30 rounded-2xl blur-md animate-pulse"></div>
              <div className="relative flex items-center justify-center w-11 h-11 bg-linear-to-br from-[#22b864] to-[#4fd68a] text-[#042b12] rounded-xl shadow-lg border border-[#88e8b0]/30">
                <Leaf className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-extrabold text-2xl tracking-tight font-serif leading-none">
                NacosHub
              </h1>
              <span className="text-[#4fd68a] text-[9px] font-bold tracking-[0.25em] uppercase mt-1.5">
                STUDENT PORTAL
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-white/10 text-white/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6 flex-1">
          {/* Main Links */}
          <div className="space-y-2">
            <span className="text-[#88e8b0]/50 text-[10px] font-extrabold uppercase tracking-wider px-4 select-none">
              Main
            </span>
            <div className="space-y-1 pt-1">
              {mainNavItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeSection === item.id}
                  onClick={() => onSectionChange(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Activity Links */}
          <div className="space-y-2">
            <span className="text-[#88e8b0]/50 text-[10px] font-extrabold uppercase tracking-wider px-4 select-none">
              Activity
            </span>
            <div className="space-y-1 pt-1">
              {activityNavItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  active={activeSection === item.id}
                  onClick={() => onSectionChange(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Decorative Quick Tip */}
          <div className="mt-8 mx-2 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#4fd68a]" />
              <span className="text-[10px] text-white/60 font-medium">Quick Tip</span>
            </div>
            <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
              Your semester registration closes Sept 25
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Profile Details */}
      <div className="pt-5 border-t border-[#22b864]/20 mt-auto relative z-10">
        <StudentProfileCard profile={profile} />
      </div>
    </aside>
  );
};

export default StudentSidebar;
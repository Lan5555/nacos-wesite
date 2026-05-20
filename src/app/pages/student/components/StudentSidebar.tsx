"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
  ShoppingBag,
  Bell,
  Leaf,
} from "lucide-react";
import StudentProfileCard, { StudentProfile } from "./StudentProfileCard";

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon: Icon,
  label,
  badge,
  active,
}) => {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium text-sm select-none ${
        active
          ? "bg-[#1a4a28]/40 border border-[#2dba4e]/20 text-white font-semibold"
          : "hover:bg-emerald-950/15"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <Icon
          className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${
            active ? "text-[#3ef06e]" : "text-white/60 group-hover:text-white"
          }`}
        />
        <span className={active ? "text-white font-semibold" : "text-white/70 group-hover:text-white"}>
          {label}
        </span>
      </div>

      {badge !== undefined && badge !== "" && badge !== 0 && (
        <span className="flex items-center justify-center min-w-5 h-5 px-1.5 bg-[#2dba4e] text-white text-[11px] font-bold rounded-full select-none shadow-sm">
          {badge}
        </span>
      )}
    </Link>
  );
};

interface StudentSidebarProps {
  unreadNotificationsCount?: number;
  profile?: StudentProfile;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  unreadNotificationsCount = 3,
  profile,
}) => {
  const pathname = usePathname();

  const mainNavItems = [
    {
      href: "/pages/student",
      icon: LayoutDashboard,
      label: "Overview",
      exact: true,
    },
    {
      href: "/pages/student/pdf-library",
      icon: FileText,
      label: "PDF Library",
    },
    {
      href: "/pages/student/courses",
      icon: BookOpen,
      label: "My Courses",
    },
  ];

  const activityNavItems = [
    {
      href: "/pages/student/results",
      icon: GraduationCap,
      label: "Results",
    },
    {
      href: "/pages/student/purchases",
      icon: ShoppingBag,
      label: "Purchases",
    },
    {
      href: "/pages/student/notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadNotificationsCount,
    },
  ];

  const isRouteActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-[280px] min-h-screen bg-[#072412] flex flex-col justify-between p-6 select-none shrink-0 border-r border-[#1a4a28]/20 relative z-30 shadow-2xl">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#2dba4e]/5 to-transparent pointer-events-none rounded-t-3xl"></div>

      <div className="flex flex-col flex-1">
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 mb-10 mt-2 px-1 select-none">
          <div className="flex items-center justify-center w-11 h-11 bg-[#2dba4e]/95 text-white rounded-2xl shadow-[0_0_15px_rgba(45,186,78,0.3)] animate-pulse border border-[#3ef06e]/30">
            <Leaf className="w-5 h-5 fill-white/10" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-extrabold text-[21px] tracking-wide font-sans leading-none">
              NacosHub
            </h1>
            <span className="text-[#3ef06e] text-[9.5px] font-bold tracking-[0.2em] font-sans mt-1.5 uppercase leading-none">
              STUDENT PORTAL
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-7 flex-1">
          {/* Main Links */}
          <div className="space-y-2">
            <span className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest px-4 select-none">
              MAIN
            </span>
            <div className="space-y-1.5 pt-1.5">
              {mainNavItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isRouteActive(item)}
                />
              ))}
            </div>
          </div>

          {/* Activity Links */}
          <div className="space-y-2">
            <span className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest px-4 select-none">
              ACTIVITY
            </span>
            <div className="space-y-1.5 pt-1.5">
              {activityNavItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  active={isRouteActive(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Profile Details */}
      <div className="pt-6 border-t border-[#1a4a28]/25 mt-auto">
        <StudentProfileCard profile={profile} />
      </div>
    </aside>
  );
};

export default StudentSidebar;

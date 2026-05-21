"use client";

import React, { useEffect, useState } from "react";
import SearchInput from "./ui/SearchInput";
import NotificationBadge from "./ui/NotificationBadge";

interface StudentHeaderProps {
  title: string;
  showSearch?: boolean;
  unreadCount?: number;
  actions?: React.ReactNode;
}

const StudentHeader: React.FC<StudentHeaderProps> = ({
  title,
  showSearch = true,
  unreadCount = 3,
  actions,
}) => {
  const [currentDate, setCurrentDate] = useState("Monday, May 18, 2026");

  // Dynamically set date or fallback to default
  useEffect(() => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formatted = new Date().toLocaleDateString("en-US", options);
      setCurrentDate(formatted);
    } catch {
      // Fallback
    }
  }, []);

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full select-none pb-6 md:pb-8">
      {/* Title & Info Section */}
      <div className="flex flex-col">
        <h2 className="text-2xl md:text-[32px] font-bold text-slate-900 font-serif leading-tight">
          {title}
        </h2>
        
        {/* Dynamic Meta Info Row */}
        <div className="flex items-center gap-3 mt-1.5 md:mt-2 text-xs font-sans text-[#3d5a45] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#e8f5ed] border border-[#d8eedd] flex items-center justify-center text-gray-500">
              📅
            </span>
            <span>{currentDate}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2dba4e] animate-pulse"></span>
            <span className="text-[#2dba4e] font-semibold">Active session</span>
          </div>
        </div>
      </div>

      {/* Global Actions (Search, Notification Bell, Dropdowns) */}
      <div className="flex items-center gap-3.5 shrink-0 self-end md:self-auto">
        {showSearch && <SearchInput />}
        <NotificationBadge count={unreadCount} />
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

export default StudentHeader;

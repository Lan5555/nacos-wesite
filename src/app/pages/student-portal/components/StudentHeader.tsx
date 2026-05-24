"use client";

import React, { useEffect, useState } from "react";
import { Bell, Sparkles, Search } from "lucide-react";
import { useStudent } from "../layout";

interface StudentHeaderProps {
  title: string;
  showSearch?: boolean;
  unreadCount?: number;
  onSearch?: (query: string) => void;
  actions?: React.ReactNode;
}

const StudentHeader: React.FC<StudentHeaderProps> = ({
  title,
  showSearch = true,
  unreadCount: propUnread,
  onSearch,
  actions,
}) => {
  const { unreadCount: contextUnread, setActiveSection } = useStudent();
  const unreadCount = propUnread !== undefined ? propUnread : contextUnread;
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full select-none mb-6">
      {/* Title & Info Section */}
      <div className="flex flex-col">
        <h1 className="font-serif text-2xl md:text-3xl text-[#071a0d] tracking-tight font-bold">
          {title}
        </h1>
        
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

      <div className="flex items-center gap-3">
        <div className="relative" onClick={() => setActiveSection('notifications')}>
          <div className="w-10 h-10 rounded-xl bg-white border border-[rgba(15,110,63,0.12)] flex items-center justify-center text-[#1e3d27] cursor-pointer hover:bg-[#e6faf0] transition-all shadow-sm">
            <Bell className="w-4 h-4" />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#22b864] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        
        {onSearch && (
          <div className="flex items-center gap-3 bg-white border border-[rgba(15,110,63,0.12)] rounded-xl px-4 py-2 shadow-sm">
            <Search className="w-4 h-4 text-[#6a9975]" />
            <input 
              type="text" 
              placeholder="Search..." 
              onChange={(e) => onSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
            />
          </div>
        )}

        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#22b864] to-[#0f6e3f] flex items-center justify-center text-white shadow-lg shadow-[#22b864]/20 cursor-pointer hover:scale-105 transition-all">
          <Sparkles className="w-4 h-4" />
        </div>
        
        {actions && <div className="hidden sm:flex gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default StudentHeader;

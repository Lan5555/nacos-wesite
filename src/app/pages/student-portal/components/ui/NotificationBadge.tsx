"use client";

import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

interface NotificationBadgeProps {
  count?: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count = 0 }) => {
  return (
    <Link
      href="/pages/student/notifications"
      className="relative flex items-center justify-center w-12 h-12 bg-white border border-[#d8eedd] rounded-2xl hover:bg-[#e8f5ed]/50 transition-colors shadow-sm focus:outline-none group"
      aria-label="View notifications"
    >
      <Bell className="w-5 h-5 text-gray-700 group-hover:scale-105 transition-transform" />
      {count > 0 && (
        <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#2dba4e] border-2 border-white rounded-full flex items-center justify-center animate-pulse">
          {/* Small pulsing indicator matching design */}
        </span>
      )}
    </Link>
  );
};

export default NotificationBadge;

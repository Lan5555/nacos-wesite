"use client";

import React, { useState, useEffect, useCallback } from "react";
import StudentHeader from "../components/StudentHeader";
import { Bell, Check, Trash2, GraduationCap, BookOpen, ShoppingBag, Info } from "lucide-react";
import { useStudent, NotificationItem } from "../layout";
import CoreService from "@/app/hooks/core-service";

const coreService = new CoreService();

const NotificationsPage: React.FC = () => {
  const { profile, markNotificationRead, markAllNotificationsRead, showToast, setUnreadCount } = useStudent();
  const [clearing, setClearing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!profile.matricNo) return;
    setLoading(true);
    try {
      const response = await coreService.get(`student-notifications/find-all?mat_no=${profile.matricNo}`);
      if (response.success && Array.isArray(response.data)) {
        const mapped: NotificationItem[] = response.data.map((n: any) => ({
          id: n.id.toString(),
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleDateString() + ' ' + new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: n.isRead,
          type: n.title.toLowerCase().includes('registration') || n.title.toLowerCase().includes('result') ? "academic" : "alert"
        }));
        setNotifications(mapped);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      showToast("Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  }, [profile.matricNo, showToast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Sync local notifications unread count with layout context
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications, setUnreadCount]);

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "academic":
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case "course":
        return <BookOpen className="w-5 h-5 text-teal-500" />;
      case "purchase":
        return <ShoppingBag className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getBgColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "academic":
        return "bg-indigo-50 border-indigo-100/50";
      case "course":
        return "bg-teal-50 border-teal-100/50";
      case "purchase":
        return "bg-amber-50 border-amber-100/50";
      default:
        return "bg-emerald-50 border-emerald-100/50";
    }
  };

  const handleMarkAllRead = () => {
    setClearing(true);
    setTimeout(() => {
      markAllNotificationsRead();
      setClearing(false);
    }, 400);
  };

  const currentUnreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10">
      {/* Header Panel */}
      <StudentHeader title="Notifications" unreadCount={currentUnreadCount} />

      {/* Notifications list wrapper */}
      <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden w-full flex flex-col select-none">
        
        {/* Card Header details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 gap-3 select-none">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#2dba4e]" />
            <h3 className="text-lg font-bold text-[#0d1b0f] font-sans">
              Recent Activity
            </h3>
          </div>
          
          {/* Mark all as read action button */}
          {currentUnreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={clearing}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#d8eedd] bg-white hover:bg-slate-50 text-[#3d5a45] hover:text-[#0d1b0f] transition-all rounded-xl text-xs font-bold shadow-sm select-none cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-[#2dba4e]" />
              <span>{clearing ? "Processing..." : "Mark all as read"}</span>
            </button>
          )}
        </div>

        {/* Notifications list feed */}
        <div className="p-5 md:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-[#e8f5ed] border-t-[#2dba4e] rounded-full animate-spin"></div>
              <p className="text-xs text-[#3d5a45]/60 mt-4 font-medium">
                Fetching your updates...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center select-none">
              <div className="w-16 h-16 bg-[#e8f5ed] border border-[#d8eedd] rounded-2xl flex items-center justify-center text-[#2dba4e] mb-4">
                <Bell className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-extrabold text-[#0d1b0f] font-sans">
                All caught up!
              </h4>
              <p className="text-xs text-[#3d5a45]/60 mt-1 max-w-[280px]">
                You have no notifications or academic reminders at this moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.read && markNotificationRead(item.id)}
                  className={`flex items-start justify-between p-4.5 border rounded-2xl transition-all gap-4 select-none ${
                    item.read
                      ? "border-[#d8eedd]/40 bg-slate-50/20 opacity-80"
                      : "border-[#d8eedd] bg-[#f5f9f6]/30 hover:bg-[#e8f5ed]/10 cursor-pointer shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Activity Icon Box */}
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${getBgColor(item.type)}`}>
                      {getIcon(item.type)}
                    </div>

                    {/* Alert Text Details */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-extrabold text-[#0d1b0f] font-sans ${!item.read ? "font-black" : ""}`}>
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-[#2dba4e] shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-[#3d5a45]/80 mt-1 leading-relaxed font-medium">
                        {item.message}
                      </p>
                      <span className="text-[10px] font-semibold text-[#3d5a45]/50 mt-2 flex items-center gap-1 select-none">
                        ⏱️ {item.time}
                      </span>
                    </div>
                  </div>

                  {/* Mark as read Check Button */}
                  {!item.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(item.id);
                      }}
                      className="w-7 h-7 bg-white hover:bg-slate-50 border border-[#d8eedd] rounded-lg flex items-center justify-center text-[#8aab92] hover:text-[#2dba4e] transition-colors shadow-sm select-none cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default NotificationsPage;

"use client";

import React, { useState, useEffect, useCallback } from "react";
import StudentHeader from "../components/StudentHeader";
import { 
  Bell, Check, Trash2, GraduationCap, BookOpen, ShoppingBag, Info, 
  Filter, Calendar, Clock, ChevronRight, Mail, MailOpen, Star,
  Sparkles, AlertTriangle, Volume2, Zap, Archive, RefreshCw,
  ChevronDown, Settings, User, MessageSquare, Gift, Trophy
} from "lucide-react";
import { useStudent } from "../layout";
import CoreService from "@/app/hooks/core-service";

const coreService:CoreService = new CoreService();

const NotificationsPage: React.FC = () => {
  const { 
    profile, 
    notifications, 
    setNotifications,
    classNotifications, 
    setClassNotifications,
    markNotificationRead, 
    markAllNotificationsRead, 
    refreshNotifications,
    deleteNotification,
    showToast 
  } = useStudent();
  const [clearing, setClearing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "class">("personal");
  const [filterType, setFilterType] = useState<"all" | "unread" | "read">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const getIcon = (type: string, priority?: string) => {
    if (priority === "high") return <AlertTriangle className="w-5 h-5 text-red-500" />;
    switch (type) {
      case "academic":
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case "course":
        return <BookOpen className="w-5 h-5 text-teal-500" />;
      case "purchase":
        return <ShoppingBag className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getBgColor = (type: string, priority?: string) => {
    if (priority === "high") return "bg-red-50 border-red-100/50";
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

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleMarkAllRead = () => {
    setClearing(true);
    setTimeout(() => {
      markAllNotificationsRead();
      setClearing(false);
      showToast("All notifications marked as read", "success");
    }, 400);
  };

  const handleNotificationClick = (item: any) => {
    setSelectedNotification(item);
    if (!item.read) {
      if (activeTab === "personal") markNotificationRead(item.id);
      else handleMarkClassRead(item);
    }
  };

  const handleMarkClassRead = (notif: any) => {
    if (notif.read) return;
    
    const readClassIds = JSON.parse(localStorage.getItem(`read_class_notifs_${profile.id}`) || "[]");
    if (!readClassIds.includes(notif.rawId)) {
      readClassIds.push(notif.rawId);
      localStorage.setItem(`read_class_notifs_${profile.id}`, JSON.stringify(readClassIds));
      setClassNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const res = await coreService.delete(`student-notifications/delete?mat_no=${profile.matricNo}&id=${id}`);
      if (res.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        showToast("Notification deleted", "success");
      }
    } catch (error) {
      showToast("Failed to delete notification", "error");
    }
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      await refreshNotifications();
    }
  };

  const getFilteredNotifications = () => {
    let filtered = activeTab === "personal" ? notifications : classNotifications;
    
    if (filterType === "unread") {
      filtered = filtered.filter(n => !n.read);
    } else if (filterType === "read") {
      filtered = filtered.filter(n => n.read);
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(n => n.type === selectedCategory);
    }
    
    return filtered.sort((a, b) => (new Date(b.time).getTime() || 0) - (new Date(a.time).getTime() || 0));
  };

  const categories = [
    { id: "all", label: "All", icon: Bell },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "course", label: "Course", icon: BookOpen },
    { id: "purchase", label: "Purchase", icon: ShoppingBag },
  ];

  const personalUnread = notifications.filter(n => !n.read).length;
  const classUnread = classNotifications.filter(n => !n.read).length;
  const displayList = getFilteredNotifications();

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 bg-linear-to-br from-emerald-50/30 via-white to-teal-50/30 min-h-screen">
      {/* Header Panel with animation */}
      <div className="animate-in slide-in-from-top-5 duration-500">
        <StudentHeader title="Notifications" unreadCount={personalUnread + classUnread} />
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto w-full px-4 md:px-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-in fade-in duration-500 delay-100">
          <div className="bg-white rounded-xl border border-emerald-100 p-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-bold text-emerald-700">{activeTab === "personal" ? notifications.length : classNotifications.length}</p>
              </div>
              <Bell className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 p-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Unread</p>
                <p className="text-xl font-bold text-amber-600">{activeTab === "personal" ? personalUnread : classUnread}</p>
              </div>
              <MailOpen className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 p-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Read</p>
                <p className="text-xl font-bold text-gray-600">{activeTab === "personal" ? notifications.filter(n => n.read).length : 0}</p>
              </div>
              <Mail className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 p-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <p className="text-xl font-bold text-red-500">
                  {activeTab === "personal" ? notifications.filter(n => n.priority === "high").length : 0}
                </p>
              </div>
              <Star className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-500 delay-200">
          
          {/* Tab Bar with animations */}
          <div className="flex flex-row border-b border-emerald-100 bg-linear-to-r from-white to-emerald-50/30">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 py-3 md:py-4 text-xs md:text-sm font-bold transition-all relative group ${
                activeTab === "personal" ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5 md:gap-2">
                <Bell className={`w-4 h-4 transition-all ${activeTab === "personal" ? "scale-110" : ""}`} />
                Personal Updates
                {personalUnread > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                    {personalUnread}
                  </span>
                )}
              </span>
              {activeTab === "personal" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-t-full animate-in slide-in-from-left duration-300" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("class")}
              className={`flex-1 py-3 md:py-4 text-xs md:text-sm font-bold transition-all relative group ${
                activeTab === "class" ? "text-teal-600" : "text-gray-500 hover:text-teal-600"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5 md:gap-2">
                <BookOpen className={`w-4 h-4 transition-all ${activeTab === "class" ? "scale-110" : ""}`} />
                Class Announcements
                {classUnread > 0 && (
                  <span className="px-1.5 py-0.5 bg-teal-500 text-white text-[10px] rounded-full">
                    {classUnread}
                  </span>
                )}
              </span>
              {activeTab === "class" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-teal-500 to-emerald-500 rounded-t-full animate-in slide-in-from-right duration-300" />
              )}
            </button>
          </div>
          
          {/* Header with actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-emerald-100 p-5 md:px-6 gap-4 bg-linear-to-r from-white to-emerald-50/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-linear-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                {activeTab === "personal" ? (
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-teal-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-sans">
                  {activeTab === "personal" ? "Recent Activity" : `Class of ${profile.level}L - ${profile.department}`}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {activeTab === "personal" ? "Stay updated with your latest activities" : "Important course announcements"}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={refreshNotifications}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-3 py-2 border border-emerald-200 bg-white hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-all rounded-xl text-xs font-medium shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 border transition-all rounded-xl text-xs font-medium shadow-sm ${
                  showFilters ? "bg-emerald-100 border-emerald-300 text-emerald-700" : "bg-white border-emerald-200 text-gray-600 hover:bg-emerald-50"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
              
              {activeTab === "personal" && personalUnread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={clearing}
                  className="flex items-center gap-1.5 px-3 py-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all rounded-xl text-xs font-medium shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{clearing ? "..." : "Mark all read"}</span>
                </button>
              )}
              
              {activeTab === "personal" && notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-3 py-2 border border-red-200 bg-white hover:bg-red-50 text-red-500 transition-all rounded-xl text-xs font-medium shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">Clear all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          {showFilters && (
            <div className="border-b border-emerald-100 p-4 bg-emerald-50/30 animate-in slide-in-from-top duration-300">
              <div className="flex flex-wrap gap-4">
                {/* Read/Unread Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Status:</span>
                  <div className="flex gap-1 bg-white rounded-lg p-0.5 border border-emerald-100">
                    {[
                      { id: "all", label: "All" },
                      { id: "unread", label: "Unread" },
                      { id: "read", label: "Read" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setFilterType(opt.id as any)}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${
                          filterType === opt.id ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-emerald-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Category:</span>
                  <div className="flex gap-1 flex-wrap">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-all ${
                          selectedCategory === cat.id 
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <cat.icon className="w-3 h-3" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="p-5 md:p-6">
            {loading && !refreshing ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 font-medium">
                  Loading your notifications...
                </p>
              </div>
            ) : displayList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  {activeTab === "personal" ? (
                    <MailOpen className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <Bell className="w-8 h-8 text-teal-400" />
                  )}
                </div>
                <h4 className="text-base font-bold text-gray-800 font-sans">
                  All caught up! ✨
                </h4>
                <p className="text-xs text-gray-400 mt-1 max-w-60">
                  You have no {activeTab === "personal" ? "unread" : ""} notifications at this moment.
                </p>
                {filterType !== "all" && (
                  <button
                    onClick={() => setFilterType("all")}
                    className="mt-4 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Clear filters →
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {displayList.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`group relative flex items-start justify-between p-4 rounded-xl border transition-all duration-300 gap-4 cursor-pointer ${
                      item.read
                        ? "border-gray-100 bg-gray-50/30 opacity-75 hover:bg-gray-50"
                        : "border-emerald-100 bg-linear-to-r from-white to-emerald-50/20 hover:shadow-md hover:-translate-y-0.5"
                    } animate-in fade-in duration-300`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Priority Indicator Line */}
                    {item.priority === "high" && !item.read && (
                      <div className="absolute left-0 top-4 bottom-4 w-1 bg-linear-to-b from-red-500 to-orange-500 rounded-full animate-pulse" />
                    )}
                    
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon with pulse animation for unread */}
                      <div className="relative">
                        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all ${getBgColor(item.type, item.priority)} ${!item.read ? "scale-105" : ""}`}>
                          {getIcon(item.type, item.priority)}
                        </div>
                        {!item.read && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h4 className={`text-sm font-bold text-gray-900 ${!item.read ? "font-extrabold" : ""}`}>
                            {item.title}
                          </h4>
                          {item.priority === "high" && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-semibold">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Urgent
                            </span>
                          )}
                          {activeTab === "class" && (item as any).author && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-medium">
                              <User className="w-2.5 h-2.5" />
                              {(item as any).author}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {getTimeAgo(item.timestamp || new Date())}
                          </span>
                          {item.time && (
                            <span className="text-[10px] text-gray-300">
                              at {item.time}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      {activeTab === "personal" && !item.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(item.id);
                          }}
                          className="w-8 h-8 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {activeTab === "personal" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(item.id);
                          }}
                          className="w-8 h-8 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with stats */}
          {displayList.length > 0 && (
            <div className="border-t border-emerald-100 p-4 bg-emerald-50/20 flex justify-between items-center text-xs text-gray-500">
              <span>Showing {displayList.length} notification{displayList.length !== 1 ? "s" : ""}</span>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                View archive <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-emerald-50 flex justify-between items-center bg-linear-to-r from-white to-emerald-50/30">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getBgColor(selectedNotification.type, selectedNotification.priority)}`}>
                  {getIcon(selectedNotification.type, selectedNotification.priority)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{selectedNotification.title}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">{selectedNotification.type}</p>
                </div>
              </div>
              <button onClick={() => setSelectedNotification(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Trash2 className="w-5 h-5 text-gray-400 rotate-45" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedNotification.message}
              </p>
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(selectedNotification.timestamp).toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation-fill-mode: both;
        }
        .slide-in-from-top-5 {
          animation: slideInFromTop 0.5s ease-out;
        }
        .slide-in-from-left {
          animation: slideInFromLeft 0.3s ease-out;
        }
        .slide-in-from-right {
          animation: slideInFromRight 0.3s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .duration-300 {
          animation-duration: 300ms;
        }
        .duration-500 {
          animation-duration: 500ms;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
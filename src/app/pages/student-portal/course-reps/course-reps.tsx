import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Users, BookOpen, Calendar, CheckCircle, XCircle,
  Clock, TrendingUp, UserCheck, FileText, MessageSquare, Bell,
  Settings, ChevronRight, Award, PieChart, BarChart3, Activity,
  Download, Search, Filter, Plus, Eye, Edit2, Trash2, Send,
  Upload, AlertCircle, GraduationCap, MapPin, Phone, Mail,
  Star, TrendingDown, ClipboardList, Target, Sparkles,
  RefreshCw,
  Save
} from 'lucide-react';
import { useStudent } from '../layout';
import CoreService from '@/app/hooks/core-service';
import StudentHeader from '../components/StudentHeader';

// Types
interface Course {
  id: string;
  code: string;
  name: string;
  creditHours: number;
  department: string;
  level: number;
  semester: 'First' | 'Second';
  session: string;
  lecturer: string;
  schedule: {
    day: string;
    time: string;
    venue: string;
  };
}

interface Student {
  id: string;
  matricNo: string;
  name: string;
  email: string;
  phone: string;
  level: number;
  department: string;
  attendance: number;
  status: 'active' | 'inactive' | 'graduated';
  lastActive?: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  submissions: number;
  total: number;
  points: number;
}

interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  students: {
    studentId: string;
    present: boolean;
    timeIn?: string;
  }[];
}


interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getGradeColor = (grade: string) => {
  const colors: Record<string, string> = {
    'A': 'bg-green-100 text-green-700',
    'B': 'bg-blue-100 text-blue-700',
    'C': 'bg-yellow-100 text-yellow-700',
    'D': 'bg-orange-100 text-orange-700',
    'F': 'bg-red-100 text-red-700'
  };
  return colors[grade] || 'bg-gray-100 text-gray-700';
};

const service = new CoreService();

const CourseRepDashboard: React.FC = () => {
  const { profile, unreadCount } = useStudent();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'attendance'>('overview');
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [fetchAmount, setFetchAmount] = useState({
    take: 50,
    skip: 0
  });
  const studentLevelFilter = profile.level?.toString() || '100';
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({});
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Assignments State
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: '1', title: 'Data Structures Lab Report', dueDate: '2025-01-28', submissions: 35, total: 45, points: 50 },
    { id: '2', title: 'Mid-Semester Project', dueDate: '2025-02-10', submissions: 38, total: 45, points: 150 },
    { id: '3', title: 'Quiz 2', dueDate: '2025-01-18', submissions: 40, total: 45, points: 50 }
  ]);

  // Goals Management
  const [goals, setGoals] = useState<{label: string, done: boolean, category: string}[]>([]);
  const [newGoal, setNewGoal] = useState({ label: '', category: 'Admin' });

  // New Announcement State
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const fetchStudents = useCallback(async () => {
    if (!profile.department || !profile.level) return;
    setLoadingStudents(true);
    try {
      const res = await service.get(
        `users/find-all-users?level=${profile.level}&department=${profile.department}&take=${fetchAmount.take}&skip=${fetchAmount.skip}`
      );
      if (res.success) {
        const formatted = res.data.map((s: any) => ({
          id: s.id.toString(),
          matricNo: s.mat_no,
          name: s.name,
          email: s.email,
          phone: s.phone || '',
          level: parseInt(s.level),
          department: s.department,
          attendance: 85, // Mock default
          status: 'active',
          lastActive: s.updatedAt || new Date().toISOString()
        }));
        setStudents(prev => fetchAmount.skip === 0 ? formatted : [...prev, ...formatted]);
      }
    } catch (e) {
      showToast('Failed to fetch students', 'error');
    } finally {
      setLoadingStudents(false);
    }
  }, [profile.department, profile.level, fetchAmount]);

  const fetchCourses = useCallback(async () => {
    if (!profile.department || !profile.level) return;
    try {
      const res = await service.get(
        `courses/find-all-courses?level=${profile.level}&department=${profile.department}`
      );
      if (res.success) {
        setCourses(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch courses', e);
    }
  }, [profile.department, profile.level]);

  const fetchAnnouncements = useCallback(async () => {
    if (!profile.department || !profile.level) return;
    try {
      const res = await service.get(
        `class-notifications/find-all?level=${profile.level}&department=${profile.department}`
      );
      if (res.success) {
        const formatted = res.data.map((a: any) => ({
          id: a.id,
          title: a.title,
          content: a.message,
          createdAt: a.createdAt,
          priority: a.priority || 'medium'
        }));
        setAnnouncements(formatted);
      }
    } catch (e) {
      console.error('Failed to fetch announcements', e);
    }
  }, [profile.department, profile.level]);

  useEffect(() => {
    fetchCourses();
    if (activeTab === 'students' || activeTab === 'attendance') fetchStudents();
    if (activeTab === 'overview') fetchAnnouncements();
  }, [activeTab, fetchStudents, fetchAnnouncements]);

  useEffect(() => {
    const savedGoals = localStorage.getItem(`rep_goals_${profile.id}`);
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals([
        { label: 'Upload CSC101 Materials', done: true, category: 'Academic' },
        { label: 'Verify Attendance Records', done: false, category: 'Admin' }
      ]);
    }
  }, [profile.id]);

  const saveGoals = (updatedGoals: typeof goals) => {
    setGoals(updatedGoals);
    localStorage.setItem(`rep_goals_${profile.id}`, JSON.stringify(updatedGoals));
  };

  // Access check
  if (!profile.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white border border-emerald-100 rounded-3xl">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Restricted Access</h2>
        <p className="text-slate-500 mt-2 max-w-md">The Course Representative Dashboard is only available to authorized departmental representatives. Please contact the NACOS executive team if you should have access.</p>
      </div>
    );
  }

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    setIsBroadcasting(true);
    try {
      const res = await service.send('class-notifications/create', {
        level: Number(profile.level),
        department: profile.department,
        title: newAnnouncement.title,
        message: newAnnouncement.content
      });

      if (res.success) {
        showToast('Announcement broadcasted successfully', 'success');
        setIsAnnouncementModalOpen(false);
        setNewAnnouncement({ title: '', content: '', priority: 'medium' });
        fetchAnnouncements();
      } else {
        showToast(res.message || 'Failed to broadcast announcement', 'error');
      }
    } catch (e) {
      showToast('An error occurred while broadcasting', 'error');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement) return;
    setIsBroadcasting(true);
    try {
      const res = await service.patch(`class-notifications/update/${editingAnnouncement.id}`, {
        title: editingAnnouncement.title,
        message: editingAnnouncement.content
      });
      if (res.success) {
        showToast('Announcement updated', 'success');
        setEditingAnnouncement(null);
        fetchAnnouncements();
      } else {
        showToast(res.message || 'Update failed', 'error');
      }
    } catch (e) {
      showToast('Error updating announcement', 'error');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    setIsBroadcasting(true);
    try {
      const res = await service.delete(`class-notifications/delete/${id}`);
      if (res.success) {
        showToast('Announcement deleted', 'success');
        setIsDeleteModalOpen(false);
        fetchAnnouncements();
      } else {
        showToast(res.message || 'Delete failed', 'error');
      }
    } catch (e) {
      showToast('Error deleting announcement', 'error');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleMarkAll = () => {
    const newState: Record<string, boolean> = {};
    students.forEach(s => newState[s.id] = true);
    setAttendanceState(newState);
    showToast('All students marked as present', 'success');
  };

  const handleUnmarkAll = () => {
    setAttendanceState({});
    showToast('All attendance marks cleared', 'info' as any);
  };

  const handleExportStudentList = () => {
    const headers = ['Name', 'Matric No', 'Email', 'Phone', 'Level', 'Department'];
    const rows = filteredStudents.map(s => [
      s.name,
      s.matricNo,
      s.email,
      `'${s.phone}`, // Added single quote to prevent Excel from truncating leading zeros
      s.level,
      s.department
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_List_${profile.department}_L${profile.level}.csv`;
    a.click();
    showToast('Student list exported', 'success');
  };

  const handleExportAttendance = () => {
    const headers = ['Name', 'Matric No', 'Status', 'Time In'];
    const rows = students.map(s => [
      s.name,
      s.matricNo,
      attendanceState[s.id] ? 'Present' : 'Absent',
      attendanceState[s.id] ? (document.querySelector(`input[type="time"]`) as HTMLInputElement)?.value || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_${selectedCourse?.code}_${new Date().toLocaleDateString()}.csv`;
    a.click();
    showToast('Attendance report exported', 'success');
  };

  // Calculate overall statistics
  const totalStudents = students.length;
  
  // Calculate real-time attendance based on checkboxes
  const presentCount = Object.values(attendanceState).filter(Boolean).length;
  const liveAttendanceRate = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;
  
  // Calculate trend vs last week (mock logic based on current attendance)
  const lastWeekRate = 78.5;
  const attendanceTrend = liveAttendanceRate > 0 ? (liveAttendanceRate - lastWeekRate).toFixed(1) : "5.2";

  const avgAttendance = totalStudents > 0 ? students.reduce((sum, s) => sum + (s.attendance || 0), 0) / totalStudents : 0;
  const pendingTasks = goals.filter(g => !g.done).length;
  const completedTasks = goals.filter(g => g.done).length;
  
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-900 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <StudentHeader title="Rep Console" unreadCount={unreadCount} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6 p-4 bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900 leading-tight">Representative Access Active</p>
            <p className="text-xs text-emerald-600/80">Manage {profile.department} students and course data for Level {profile.level}.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Class Avg. Attendance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{liveAttendanceRate > 0 ? liveAttendanceRate.toFixed(1) : (avgAttendance || 0).toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Tasks Done</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{completedTasks}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Pending Tasks</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{pendingTasks}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{courses.length}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 font-medium rounded-t-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutDashboard size="16" className="inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-5 py-2.5 font-medium rounded-t-lg transition-all ${
              activeTab === 'students'
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size="16" className="inline mr-2" />
            Students
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-5 py-2.5 font-medium rounded-t-lg transition-all ${
              activeTab === 'attendance'
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserCheck size="16" className="inline mr-2" />
            Attendance
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-linear-to-br from-slate-900 to-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-serif mb-2">Welcome back, {profile.name.split(' ')[0]}</h2>
                    <p className="text-emerald-100/80 max-w-md">You are currently managing {totalStudents} students in {profile.department} Level {profile.level}.</p>
                    <div className="flex gap-4 mt-8">
                      <button onClick={() => setActiveTab('attendance')} className="px-6 py-3 bg-white text-emerald-900 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all">Take Attendance</button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Target className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">Weekly Goals</span>
                        <span className="text-[10px] text-slate-400 font-normal">Track your administrative tasks</span>
                      </div>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Add new goal..." 
                          className="flex-1 text-xs p-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                          value={newGoal.label}
                          onChange={(e) => setNewGoal({...newGoal, label: e.target.value})}
                        />
                        <button 
                          onClick={() => {
                            if(!newGoal.label) return;
                            saveGoals([...goals, { ...newGoal, done: false }]);
                            setNewGoal({ label: '', category: 'Admin' });
                          }}
                          className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {goals.map((goal, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                const newGoals = [...goals];
                                newGoals[i].done = !newGoals[i].done;
                                saveGoals(newGoals);
                              }}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${goal.done ? 'bg-emerald-600 border-emerald-600 scale-110' : 'border-slate-400 bg-white hover:border-emerald-400'}`}
                            >
                              {goal.done && <CheckCircle size={12} className="text-white" />}
                            </button>
                            <span className={`text-sm ${goal.done ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{goal.label}</span>
                          </div>
                          <button onClick={() => saveGoals(goals.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500"><Trash2 size={12}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">Courses Offered</span>
                        <span className="text-[10px] text-slate-400 font-normal">Current Semester</span>
                      </div>
                    </h3>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <div key={course.id} className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50 hover:bg-indigo-50 transition-colors">
                            <p className="text-xs font-bold text-indigo-900">{course.code}: {course.name}</p>
                            <p className="text-[10px] text-indigo-600 mt-0.5">{course.lecturer}</p>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                              <Clock size={10} /> {course.schedule.day} • {course.schedule.time}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-slate-400 text-xs italic">No courses found for this level</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Broadcast Center</span>
                      <span className="text-[10px] text-slate-400 font-normal">Announcements for students</span>
                    </div>
                  </h3>
                  <div className="space-y-4">
                    {announcements.map((ann, i) => (
                      <div key={i} onClick={() => setEditingAnnouncement(ann)} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${ann.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {ann.priority}
                          </span>
                          <span className="text-[10px] text-slate-400">{formatDate(ann.createdAt)}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mb-1">{ann.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{ann.content}</p>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Edit2 size={12} className="text-emerald-600" />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => setIsAnnouncementModalOpen(true)}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:border-emerald-400 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={14} /> New Announcement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-62.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or matric number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                  />
                </div>
                <div className="px-4 py-2.5 rounded-xl border border-emerald-100 text-sm font-bold text-emerald-700 bg-emerald-50/50">
                  Level: {studentLevelFilter}L
                </div>
                <button onClick={handleExportStudentList} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                  <Download size="14" /> Export Student List
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Matric No</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Active</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Connect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingStudents ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center">
                        <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Loading student records...</p>
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">No students found</td>
                    </tr>
                  ) : filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">{student.matricNo}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {student.phone || 'N/A'}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        {student.lastActive ? formatDate(student.lastActive) : 'Never'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <a href={`mailto:${student.email}`} className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors inline-block" title="Send Email">
                          <Mail size="16" />
                        </a>
                        <a href={`tel:${student.phone}`} className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors inline-block" title="Call Student">
                          <Phone size="16" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loadingStudents && filteredStudents.length >= fetchAmount.take && (
                <div className="p-6 flex justify-center border-t border-gray-50">
                  <button 
                    onClick={() => setFetchAmount(prev => ({ ...prev, take: prev.take + 50 }))}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
                  >
                    <RefreshCw size={14} /> Load More Students
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Today's Attendance</h3>
                <div className="flex gap-2">
                  <button onClick={handleMarkAll} className="flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                    <CheckCircle size="14" /> Mark All
                  </button>
                  <button onClick={handleUnmarkAll} className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                    <XCircle size="14" /> Unmark All
                  </button>
                  <button onClick={handleExportAttendance} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                    <Download size="14" /> Export CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Time In</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Previous Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.matricNo}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={attendanceState[student.id] || false}
                              onChange={(e) => setAttendanceState(prev => ({...prev, [student.id]: e.target.checked}))}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" 
                            />
                            <span className="text-sm text-gray-600">Present</span>
                          </label>
                        </td>
                        <td className="px-4 py-3">
                          <input type="time" defaultValue="09:00" className="px-2 py-1 border border-gray-200 rounded text-sm" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-2">
                              <div className="bg-green-500 rounded-full h-2" style={{ width: `${student.attendance}%` }} />
                            </div>
                            <span className="text-sm text-gray-600">{student.attendance}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                  Save Attendance
                </button>
              </div>
            </div>

            {/* Attendance Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                    <UserCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{liveAttendanceRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-500 mt-1">Today's Attendance Rate</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className={`text-3xl font-bold ${Number(attendanceTrend) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {Number(attendanceTrend) >= 0 ? '+' : ''}
                    {attendanceTrend}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">vs Previous Week</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-3">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{students.filter(s => s.attendance < 75).length}</p>
                  <p className="text-sm text-gray-500 mt-1">Low Attendance Students</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* New Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-serif text-slate-900">New Broadcast</h3>
              <button onClick={() => setIsAnnouncementModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="e.g. Class Reschedule"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Priority</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value as any})}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority (Urgent)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Message Content</label>
                <textarea 
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  placeholder="Type your message to the class..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                />
              </div>
              <button 
                disabled={isBroadcasting}
                onClick={handleCreateAnnouncement}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                {isBroadcasting ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                {isBroadcasting ? 'Broadcasting...' : 'Broadcast to Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Delete Announcement Modal */}
      {editingAnnouncement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-serif text-slate-900">Manage Announcement</h3>
              <button onClick={() => setEditingAnnouncement(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({...editingAnnouncement, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Message Content</label>
                <textarea 
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  value={editingAnnouncement.content}
                  onChange={(e) => setEditingAnnouncement({...editingAnnouncement, content: e.target.value})}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  disabled={isBroadcasting}
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Delete
                </button>
                <button 
                  disabled={isBroadcasting}
                  onClick={handleUpdateAnnouncement}
                  className="flex-2 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  {isBroadcasting ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && editingAnnouncement && (
        <div className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Delete Announcement?</h4>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone. This will remove the broadcast for all students.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 text-slate-600 font-semibold">Cancel</button>
              <button 
                onClick={() => handleDeleteAnnouncement(editingAnnouncement.id)}
                disabled={isBroadcasting}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                {isBroadcasting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in-from-right-5 {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default CourseRepDashboard;
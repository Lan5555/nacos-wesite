'use client'
import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCog,
  UserCheck,
  Coins,
  CalendarCheck,
  Bell,
  Settings,
  BarChart3,
  Crown,
  Trash2,
  Plus,
  Send,
  FileText,
  DollarSign,
  CalendarPlus,
  CheckCircle2,
  AlertCircle,
  X,
  Menu,
  RefreshCw,
  Shield,
  GraduationCap,
  Wallet,
  Hourglass,
  UserPlus,
  UserMinus,
  Receipt,
  Calendar,
  Check,
  Megaphone,
  TrendingUp,
  Gift,
  Building2,
  BadgeCheck,
  Clock,
  Search,
  Download,
  ChartBar,
  Cog
} from 'lucide-react';
import Validator from '@/app/validators/auth-validator';
import { Exco, ExcosManagement } from './manage-excos/manage-excos';
import { HiAcademicCap } from 'react-icons/hi';
import { label } from 'framer-motion/client';
import { useRouter } from 'next/navigation';
import CourseManagement from './manage-courses/manage-courses';
import ResultsManagement from './manage-results/manage-results';
import AdminSettings from './settings/settings';

// --- Types ---
type Student = {
  id: string;
  matric: string;
  name: string;
  level: number;
  dept: string;
  isRep: boolean;
};

type Rep = {
  id: number;
  name: string;
  dept: string;
  level: number;
  contact: string;
  status: 'Active' | 'Inactive';
};

type Staff = {
  id: string;
  name: string;
  role: string;
  dept: string;
  status: 'Active' | 'Inactive';
};

type FinanceTransaction = {
  id: string;
  desc: string;
  amount: string;
  date: string;
  paidBy: string;
};

type AdminEvent = {
  id: string;
  title: string;
  date: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
};

type ActivityLogEntry = {
  id: string;
  text: string;
  time: string;
};

// --- Initial Data ---
const initialStudents: Student[] = [
  { id: '1', matric: "NAC/CS/2101", name: "Ada Eze", level: 400, dept: "Computer Science", isRep: false },
  { id: '2', matric: "NAC/CS/2102", name: "Chidi Obi", level: 300, dept: "Computer Science", isRep: true },
  { id: '3', matric: "NAC/EE/2105", name: "Bola Yusuf", level: 400, dept: "Electrical Eng", isRep: false },
  { id: '4', matric: "NAC/CS/2108", name: "Ifeanyi Nwosu", level: 400, dept: "Computer Science", isRep: true },
];

const initialReps: Rep[] = [
  { id: 1, name: "Chidi Obi", dept: "Computer Science", level: 300, contact: "chidi@nacos.edu", status: "Active" },
  { id: 2, name: "Ifeanyi Nwosu", dept: "Computer Science", level: 400, contact: "ifeanyi@nacos.edu", status: "Active" },
  { id: 3, name: "Fatima Bello", dept: "Mass Comm", level: 300, contact: "fatima@nacos.edu", status: "Active" },
];

const initialStaff: Staff[] = [
  { id: "STF101", name: "Dr. Okonkwo", role: "Dean of Students", dept: "Admin", status: "Active" },
  { id: "STF102", name: "Prof. Adeyemi", role: "Course Advisor", dept: "Computer Science", status: "Active" },
  { id: "STF103", name: "Mrs. Eze", role: "Financial Secretary", dept: "Finance", status: "Active" },
];

const initialTransactions: FinanceTransaction[] = [
  { id: "T001", desc: "Annual Dues – 400 Level", amount: "₦15,000", date: "Sept 1, 2026", paidBy: "Ada Eze" },
  { id: "T002", desc: "NACOS Merch", amount: "₦8,500", date: "Sept 5, 2026", paidBy: "Chidi Obi" },
];

const initialEvents: AdminEvent[] = [
  { id: "E1", title: "Tech Summit 2026", date: "Oct 15, 2026", status: "Pending Approval" },
  { id: "E2", title: "Green Coding Hackathon", date: "Oct 28, 2026", status: "Approved" },
];

const initialActivityLog: ActivityLogEntry[] = [
  { id: '1', text: "Rep Chidi Obi requested event budget review", time: "Sept 19, 10:32 AM" },
  { id: '2', text: "Staff Dr. Okonkwo approved new merch design", time: "Sept 19, 9:14 AM" },
  { id: '3', text: "Dues payment of ₦15,000 from 400L student", time: "Sept 18, 4:05 PM" },
  { id: '4', text: "Meeting with reps scheduled for Friday", time: "Sept 17, 2:00 PM" },
];

// --- Helper Functions ---
const formatDate = () => {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

// --- Components ---

// Toast Notification
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2600);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2 text-sm font-medium border border-white/10">
        <div className="w-5 h-5 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700/50">
          <Check size={12} />
        </div>
        {message}
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, icon, children }: { isOpen: boolean; onClose: () => void; title: string; icon?: React.ReactNode; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-fade-up overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414]">
          <div className="flex items-center gap-3">
            {icon && <div className="text-white/80">{icon}</div>}
            <h3 className="font-serif text-xl text-white">{title}</h3>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, sub, iconBg, delay }: any) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-fade-up`} style={{ animationDelay: `${delay}s` }}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
      {icon}
    </div>
    <div>
      <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="font-serif text-2xl text-slate-900 leading-tight">{value}</div>
      <div className="text-xs text-slate-400 font-semibold mt-1">{sub}</div>
    </div>
  </div>
);


const AdminPage: React.FC = () => {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();
  const [studentSearch, setStudentSearch] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState('all');
  const [studentDeptFilter, setStudentDeptFilter] = useState('all');
  const [financeSearch, setFinanceSearch] = useState('');
  const [financeTypeFilter, setFinanceTypeFilter] = useState('all');
  
  // Data States
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [reps, setReps] = useState<Rep[]>(initialReps);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(initialTransactions);
  const [events, setEvents] = useState<AdminEvent[]>(initialEvents);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(initialActivityLog);
  const [adminData, setAdminData] = useState<Partial<Exco>>({});

  // Modal States
  const [modals, setModals] = useState({
    addStudent: false,
    appointRep: false,
    addStaff: false,
    recordPayment: false,
    createEvent: false,
  });

  // Form States
  const [newStudent, setNewStudent] = useState({ matric: '', name: '', level: '400', dept: '' });
  const [newStaff, setNewStaff] = useState({ id: '', name: '', role: '', dept: '' });
  const [newPayment, setNewPayment] = useState({ desc: '', amount: '', paidBy: '' });
  const [newEvent, setNewEvent] = useState({ title: '', body:'', date: '' });

  // Utility Functions
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const addLog = (text: string) => {
    const newLog: ActivityLogEntry = {
      id: Date.now().toString(),
      text,
      time: 'Just now',
    };
    setActivityLog(prev => [newLog, ...prev.slice(0, 6)]);
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    // Reset forms
    setNewStudent({ matric: '', name: '', level: '400', dept: '' });
    setNewStaff({ id: '', name: '', role: '', dept: '' });
    setNewPayment({ desc: '', amount: '', paidBy: '' });
    setNewEvent({ title: '', body:'', date: '' });
  };

  // Handlers
  const handleAddStudent = () => {
    if (newStudent.matric && newStudent.name && newStudent.dept) {
      const student: Student = {
        id: Date.now().toString(),
        matric: newStudent.matric,
        name: newStudent.name,
        level: parseInt(newStudent.level),
        dept: newStudent.dept,
        isRep: false,
      };
      setStudents(prev => [...prev, student]);
      addLog(`➕ Added new student: ${newStudent.name}`);
      showToast(`${newStudent.name} added`);
      closeModal('addStudent');
    } else {
      showToast('Fill all required fields');
    }
  };

  const handleMakeRep = (student: Student) => {
    if (!student.isRep) {
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, isRep: true } : s));
      const newRep: Rep = {
        id: Date.now(),
        name: student.name,
        dept: student.dept,
        level: student.level,
        contact: `${student.name.replace(/\s/g, '').toLowerCase()}@nacos.edu`,
        status: 'Active',
      };
      setReps(prev => [...prev, newRep]);
      addLog(`👑 Appointed ${student.name} as Departmental Rep`);
      showToast(`${student.name} is now a Rep`);
    }
  };

  const handleDismissRep = (repName: string) => {
    setReps(prev => prev.filter(r => r.name !== repName));
    setStudents(prev => prev.map(s => s.name === repName ? { ...s, isRep: false } : s));
    addLog(`🚫 Dismissed rep ${repName}`);
    showToast(`${repName} removed from reps`);
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student && student.isRep) {
      setReps(prev => prev.filter(r => r.name !== student.name));
    }
    setStudents(prev => prev.filter(s => s.id !== studentId));
    addLog(`🗑️ Removed student ${student?.matric}`);
    showToast('Student removed');
  };

  const handleAddStaff = () => {
    if (newStaff.id && newStaff.name) {
      const staffMember: Staff = {
        id: newStaff.id,
        name: newStaff.name,
        role: newStaff.role || 'Staff',
        dept: newStaff.dept || 'General',
        status: 'Active',
      };
      setStaff(prev => [...prev, staffMember]);
      addLog(`🧑‍🏫 New staff added: ${newStaff.name}`);
      showToast('Staff member added');
      closeModal('addStaff');
    } else {
      showToast('Fill required fields');
    }
  };

  const handleRecordPayment = () => {
    if (newPayment.desc && newPayment.amount) {
      const transaction: FinanceTransaction = {
        id: `T${Date.now()}`,
        desc: newPayment.desc,
        amount: newPayment.amount,
        date: new Date().toLocaleDateString('en-GB'),
        paidBy: newPayment.paidBy || 'Anonymous',
      };
      setTransactions(prev => [transaction, ...prev]);
      addLog(`💰 Payment recorded: ${newPayment.amount} from ${transaction.paidBy}`);
      showToast('Payment recorded');
      closeModal('recordPayment');
    } else {
      showToast('Fill required fields');
    }
  };

  const handleCreateEvent = () => {
    if (newEvent.title) {
      const event: AdminEvent = {
        id: `E${Date.now()}`,
        title: newEvent.title,
        date: newEvent.date || 'TBC',
        status: 'Pending Approval',
      };
      setEvents(prev => [...prev, event]);
      addLog(`📅 New event created: ${newEvent.title}`);
      showToast('Event created');
      closeModal('createEvent');
    } else {
      showToast('Enter event title');
    }
  };

  const handleApproveEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'Approved' } : e));
    const event = events.find(e => e.id === eventId);
    addLog(`✅ Event "${event?.title}" approved`);
    showToast('Event approved');
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
    addLog(`❌ Event "${event?.title}" removed`);
    showToast('Event removed');
  };

  const handleAppointRepFromModal = (selectedStudentId: string) => {
    const student = students.find(s => s.id === selectedStudentId);
    if (student && !student.isRep) {
      handleMakeRep(student);
      closeModal('appointRep');
    }
  };

  const handleDownloadFinanceReport = () => {
    const headers = ['Transaction ID', 'Description', 'Amount', 'Date', 'Paid By'];
    const rows = transactions.map(tx => [
      tx.id,
      tx.desc,
      tx.amount.replace('₦', ''),
      tx.date,
      tx.paidBy
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `NACOS_Finance_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Financial report downloaded');
  };

  //==========================================//
  const loadAdminData = () => {
    const admin = sessionStorage.getItem('admin');
    if(admin){
        setAdminData(JSON.parse(admin));
    }
  }

  useEffect(() => {
    loadAdminData();
  },[]);

  //==========================================//

  // Render Functions
  const renderStudentsTable = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Search by name or matric..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <select value={studentLevelFilter} onChange={(e) => setStudentLevelFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <option value="all">All Levels</option>
          <option value="100">100L</option><option value="200">200L</option><option value="300">300L</option><option value="400">400L</option>
        </select>
        <select value={studentDeptFilter} onChange={(e) => setStudentDeptFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <option value="all">All Departments</option>
          {Array.from(new Set(students.map(s => s.dept))).map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Matric No</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Level</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {students.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.matric.toLowerCase().includes(studentSearch.toLowerCase());
            const matchesLevel = studentLevelFilter === 'all' || s.level.toString() === studentLevelFilter;
            const matchesDept = studentDeptFilter === 'all' || s.dept === studentDeptFilter;
            return matchesSearch && matchesLevel && matchesDept;
          }).map((student, idx) => (
            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-emerald-600">{student.matric}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">{student.level}L</span></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{student.dept}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {student.isRep ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900 text-emerald-100 text-[10px] font-bold uppercase tracking-tight">
                    <Crown size={10} /> Rep
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-tight">Regular</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  {!student.isRep && (
                    <button onClick={() => handleMakeRep(student)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-50 transition-all">
                      <Crown size={12} /> Make Rep
                    </button>
                  )}
                  <button onClick={() => handleDeleteStudent(student.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all flex justify-center items-center gap-1">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );

  const renderRepsTable = () => (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Level</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {reps.map((rep, idx) => (
            <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">{rep.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{rep.dept}</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">{rep.level}L</span></td>
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-emerald-600">{rep.contact}</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-tight border border-emerald-100">{rep.status}</span></td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleDismissRep(rep.name)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all">
                  <UserMinus size={12} /> Dismiss
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderStaffTable = () => (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Staff ID</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {staff.map((member, idx) => (
            <tr key={member.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-emerald-600">{member.id}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">{member.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{member.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{member.dept}</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-tight border border-emerald-100">{member.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFinanceLogs = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Search by description or payer..." value={financeSearch} onChange={(e) => setFinanceSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <select value={financeTypeFilter} onChange={(e) => setFinanceTypeFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <option value="all">All Transactions</option>
          <option value="Dues">Annual Dues</option>
          <option value="Merch">Merchandise</option>
          <option value="Event">Events</option>
        </select>
      </div>

    <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Paid By</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {transactions.filter(tx => {
            const matchesSearch = tx.desc.toLowerCase().includes(financeSearch.toLowerCase()) || tx.paidBy.toLowerCase().includes(financeSearch.toLowerCase());
            const matchesType = financeTypeFilter === 'all' || tx.desc.toLowerCase().includes(financeTypeFilter.toLowerCase());
            return matchesSearch && matchesType;
          }).map((tx, idx) => (
            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-emerald-600">{tx.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{tx.desc}</td>
              <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-emerald-600">{tx.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tx.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{tx.paidBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-3">
      {events.length === 0 ? (
        <div className="text-center py-10 text-emerald-500">No events yet</div>
      ) : (
        events.map(event => (
          <div key={event.id} className="flex justify-between items-center p-4 border-b border-emerald-100 last:border-0">
            <div>
              <div className="font-semibold text-emerald-900">{event.title}</div>
              <div className="text-sm text-emerald-500 flex items-center gap-1 mt-1">
                <Calendar size={12} /> {event.date}
              </div>
              <div className="mt-2">
                {event.status === 'Approved' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-xs font-semibold">
                    <Check size={10} /> Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                    <Hourglass size={10} /> Pending Approval
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {event.status !== 'Approved' && (
                <button onClick={() => handleApproveEvent(event.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-xs font-semibold hover:opacity-90 transition shadow-sm">
                  <CheckCircle2 size={12} /> Approve
                </button>
              )}
              <button onClick={() => handleDeleteEvent(event.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-4">
      {activityLog.map(log => (
        <div key={log.id} className="flex gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2"></div>
          <div>
            <div className="text-emerald-800 text-sm">{log.text}</div>
            <div className="text-xs text-emerald-400 mt-1">{log.time}</div>
          </div>
        </div>
      ))}
    </div>
  );

  // Navigation
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'students', label: 'Students', icon: <Users size={18} /> },
    { id: 'reps', label: 'Dept. Reps', icon: <UserCog size={18} /> },
    { id: 'courses', label: 'Courses', icon: <HiAcademicCap size={18} /> },
    { id: 'excos', label: 'Excos', icon: <Users size={18} />},
    { id: 'results', label: 'Results', icon: <ChartBar size={18} />},
    { id: 'staff', label: 'Staff Directory', icon: <UserCheck size={18} /> },
    { id: 'finance', label: 'Finance & Dues', icon: <Coins size={18} /> },
    { id: 'events', label: 'Events', icon: <CalendarCheck size={18} />, badge: true },
    { id: 'settings', label: 'Settings', icon: <Cog size={18} /> }
  ];

  const pageTitles: Record<string, [string, string]> = {
    overview: ['Admin Control Centre', 'Manage reps, approve requests & oversee operations'],
    students: ['Student Directory', 'View and manage all registered students'],
    reps: ['Departmental Representatives', 'Manage appointed reps across departments'],
    staff: ['Staff Directory', 'Faculty and administrative staff records'],
    finance: ['Finance & Dues', 'Transaction logs and dues collection progress'],
    events: ['Events Oversight', 'Create, approve, and manage NACOS events'],
    results: ['Results', 'Upload results for the respective session'],
    excos: ['Excos', 'Manage Available Excos'],
    courses: ['Courses', 'Manage courses'],
    settings: ['Settings', 'Admin Settings']
  };

  // Stats
  const totalCollected = 2480000;
  const totalTarget = 3200000;
  const progress = (totalCollected / totalTarget) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50/40 to-white relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-125 h-125 rounded-full bg-emerald-500/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-emerald-500/5 blur-3xl"></div>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setSidebarOpen(prev => !prev)} className="fixed top-4 left-4 z-50 lg:hidden bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white p-2 rounded-lg shadow-lg border border-[#0e2d3d]/50">
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col shadow-2xl overflow-y-auto`}>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-800/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#0e2d3d]/30 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="p-6 border-b border-emerald-800/50 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] border border-white/20 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <img src='/nacos.jpg' className='w-full h-full bg-cover bg-center rounded-full object-cover'></img>
            </div>
            <div>
              <div className="font-serif text-white text-xl">NacosHub</div>
              <div className="text-[10px] tracking-wider text-slate-400 uppercase">Admin Portal</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 mt-3 bg-white/5 rounded-full px-3 py-1 border border-white/10">
            <Shield size={10} className="text-slate-400" />
            <span className="text-[10px] font-semibold text-slate-300 uppercase">{(adminData.adminLevel ?? 0) > 0 ? `Super Admin · Level ${adminData.adminLevel}` : "Admin · Level 1"}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group ${activeSection === item.id ? 'bg-white/10 text-white border border-white/10 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeSection === item.id ? 'bg-white text-black' : 'bg-white/5'}`}>
                {item.icon}
              </div>
              {item.label}
              {item.badge && (
                <div className="ml-auto w-2 h-2 rounded-full bg-amber-500"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] border border-white/20 flex items-center justify-center text-white font-bold shadow-md">
               {adminData.profileImage ? (
                <img src={adminData.profileImage} alt={adminData.name} className="w-full h-full object-cover rounded-full" />
              ) : adminData.name?.substring(0, 1)?.toUpperCase()}
            </div>
            <div>
              <div className="text-white text-sm font-semibold">{adminData.name}</div>
              <div className="text-[10px] text-slate-400">{adminData.position}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-2xl text-slate-900">{pageTitles[activeSection]?.[0] || 'Admin Portal'}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{pageTitles[activeSection]?.[1] || 'Manage your dashboard'}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-slate-200 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-700">Live · {formatDate()}</span>
            </div>
            <button className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-sm">
              <Bell size={16} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-sm">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={<GraduationCap size={20} />} label="Total Students" value="486" sub="▲ 12 this semester" iconBg="bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white" delay={0.05} />
              <StatCard icon={<UserCog size={20} />} label="Dept. Reps" value="8" sub="Across 6 depts" iconBg="bg-slate-100 text-slate-900" delay={0.1} />
              <StatCard icon={<Hourglass size={20} />} label="Pending Approvals" value="3" sub="Awaiting action" iconBg="bg-amber-100 text-amber-600" delay={0.15} />
              <StatCard icon={<Wallet size={20} />} label="Dues Collected" value="₦2.48M" sub="75% of target" iconBg="bg-blue-100 text-blue-600" delay={0.2} />
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.25s' }}>
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                      <BarChart3 size={14} />
                    </div>
                    <h3 className="font-serif text-slate-900">Recent Activity</h3>
                  </div>
                  <button onClick={() => showToast('Activity log refreshed')} className="flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition">
                    <RefreshCw size={10} /> Refresh
                  </button>
                </div>
                <div className="p-5">
                  {renderActivity()}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                      <TrendingUp size={14} />
                    </div>
                    <h3 className="font-serif text-slate-900">Quick Actions</h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => showToast('📢 Broadcast sent to all reps & staff via email')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition group">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 flex items-center justify-center">
                        <Megaphone size={16} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Broadcast to Reps</span>
                    </button>
                    <button onClick={() => showToast('📊 Financial report generated — PDF ready')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition group">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Financial Report</span>
                    </button>
                    <button onClick={() => showToast('Dues management: target set to ₦3.2M')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition group">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 flex items-center justify-center">
                        <DollarSign size={16} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Manage Dues</span>
                    </button>
                    <button onClick={() => setActiveSection('events')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition group">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 flex items-center justify-center">
                        <CalendarPlus size={16} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Create Event</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Students Section */}
        {activeSection === 'students' && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden animate-fade-up">
            <div className="flex justify-between items-center p-5 border-b border-emerald-100 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Users size={14} />
                </div>
                <h3 className="font-serif text-emerald-900">Student Directory</h3>
              </div>
              <button onClick={() => setModals(prev => ({ ...prev, addStudent: true }))} className="flex items-center gap-1 px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">
                <Plus size={14} /> Add Student
              </button>
            </div>
            <div className="p-5">
              {renderStudentsTable()}
            </div>
          </div>
        )}

        {/* Reps Section */}
        {activeSection === 'reps' && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden animate-fade-up">
            <div className="flex justify-between items-center p-5 border-b border-emerald-100 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <UserCog size={14} />
                </div>
                <h3 className="font-serif text-emerald-900">Departmental Representatives</h3>
              </div>
              <button onClick={() => setModals(prev => ({ ...prev, appointRep: true }))} className="flex items-center gap-1 px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">
                <UserPlus size={14} /> Appoint Rep
              </button>
            </div>
            <div className="p-5">
              {renderRepsTable()}
            </div>
          </div>
        )}

        {/* Staff Section */}
        {activeSection === 'staff' && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden animate-fade-up">
            <div className="flex justify-between items-center p-5 border-b border-emerald-100 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <BadgeCheck size={14} />
                </div>
                <h3 className="font-serif text-emerald-900">Faculty & Staff Directory</h3>
              </div>
              <button onClick={() => setModals(prev => ({ ...prev, addStaff: true }))} className="flex items-center gap-1 px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">
                <Plus size={14} /> Add Staff
              </button>
            </div>
            <div className="p-5">
              {renderStaffTable()}
            </div>
          </div>
        )}

        {/* Finance Section */}
        {activeSection === 'finance' && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden animate-fade-up">
            <div className="flex justify-between items-center p-5 border-b border-emerald-100 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Coins size={14} />
                </div>
                <h3 className="font-serif text-emerald-900">Dues & Transaction Logs</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={handleDownloadFinanceReport} className="flex items-center gap-1 px-4 py-2 rounded-full border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition shadow-sm">
                  <Download size={14} /> Export CSV
                </button>
                <button onClick={() => setModals(prev => ({ ...prev, recordPayment: true }))} className="flex items-center gap-1 px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">
                  <Receipt size={14} /> Record Payment
                </button>
              </div>
            </div>
            <div className="p-5">
              {renderFinanceLogs()}
              <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-emerald-800">Annual Dues Target Progress</span>
                  <span className="font-mono text-emerald-600 font-bold">{Math.round(progress)}% — ₦2.48M of ₦3.2M</span>
                </div>
                <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-emerald-500">
                  <span>₦2,480,000 collected</span>
                  <span>₦720,000 remaining</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Section */}
        {activeSection === 'events' && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden animate-fade-up">
            <div className="flex justify-between items-center p-5 border-b border-emerald-100 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Calendar size={14} />
                </div>
                <h3 className="font-serif text-emerald-900">NACOS Events & Approvals</h3>
              </div>
              <button onClick={() => setModals(prev => ({ ...prev, createEvent: true }))} className="flex items-center gap-1 px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">
                <Plus size={14} /> Create Event
              </button>
            </div>
            <div className="p-5">
              {renderEvents()}
            </div>
          </div>
        )}
        {/* Excos Section */}
        {activeSection === 'excos' && (<ExcosManagement activeExco={adminData}/>)}
        {/* Courses Section */}
        {activeSection === 'courses' && (<CourseManagement/>)}
        {/* Results Section */}
        {activeSection === 'results' && (<ResultsManagement/>)}
        {activeSection === 'settings' && (<AdminSettings/>)}
      </main>

      {/* Modals */}
      <Modal isOpen={modals.addStudent} onClose={() => closeModal('addStudent')} title="Add New Student" icon={<UserPlus size={18} />}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Matric Number</label>
            <input type="text" value={newStudent.matric} onChange={e => setNewStudent(prev => ({ ...prev, matric: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition" placeholder="NAC/CS/XXXX" />
          </div>
          <div>
            <label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Full Name</label>
            <input type="text" value={newStudent.name} onChange={e => setNewStudent(prev => ({ ...prev, name: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition" placeholder="e.g. Ada Eze" />
          </div>
          <div>
            <label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Level</label>
            <select value={newStudent.level} onChange={e => setNewStudent(prev => ({ ...prev, level: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option>100</option><option>200</option><option>300</option><option>400</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Department</label>
            <input type="text" value={newStudent.dept} onChange={e => setNewStudent(prev => ({ ...prev, dept: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition" placeholder="e.g. Computer Science" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => closeModal('addStudent')} className="px-4 py-2 rounded-full border border-emerald-200 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition">Cancel</button>
            <button onClick={handleAddStudent} className="px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">Add Student</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.appointRep} onClose={() => closeModal('appointRep')} title="Appoint Departmental Rep" icon={<Crown size={18} />}>
        <div>
          <label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Select Student</label>
          <select id="repSelect" className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="">Select a student</option>
            {students.filter(s => !s.isRep).map(s => (
              <option key={s.id} value={s.id}>{s.name} – {s.dept}</option>
            ))}
          </select>
          <div className="flex justify-end gap-3 pt-6">
            <button onClick={() => closeModal('appointRep')} className="px-4 py-2 rounded-full border border-emerald-200 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition">Cancel</button>
            <button onClick={() => {
              const select = document.getElementById('repSelect') as HTMLSelectElement;
              if (select.value) handleAppointRepFromModal(select.value);
              else showToast('Please select a student');
            }} className="px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">Appoint</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.addStaff} onClose={() => closeModal('addStaff')} title="Add Staff Member" icon={<UserPlus size={18} />}>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Staff ID</label><input type="text" value={newStaff.id} onChange={e => setNewStaff(prev => ({ ...prev, id: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="STF104" /></div>
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Full Name</label><input type="text" value={newStaff.name} onChange={e => setNewStaff(prev => ({ ...prev, name: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. Dr. Amaka" /></div>
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Role</label><input type="text" value={newStaff.role} onChange={e => setNewStaff(prev => ({ ...prev, role: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. Course Advisor" /></div>
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Department</label><input type="text" value={newStaff.dept} onChange={e => setNewStaff(prev => ({ ...prev, dept: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. Computer Science" /></div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => closeModal('addStaff')} className="px-4 py-2 rounded-full border border-emerald-200 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition">Cancel</button><button onClick={handleAddStaff} className="px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">Add Staff</button></div>
        </div>
      </Modal>

      <Modal isOpen={modals.recordPayment} onClose={() => closeModal('recordPayment')} title="Record Payment" icon={<Receipt size={18} />}>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Description</label><input type="text" value={newPayment.desc} onChange={e => setNewPayment(prev => ({ ...prev, desc: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. Annual Dues – 300 Level" /></div>
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Amount</label><input type="text" value={newPayment.amount} onChange={e => setNewPayment(prev => ({ ...prev, amount: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="₦15,000" /></div>
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Paid By</label><input type="text" value={newPayment.paidBy} onChange={e => setNewPayment(prev => ({ ...prev, paidBy: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Student name" /></div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => closeModal('recordPayment')} className="px-4 py-2 rounded-full border border-emerald-200 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition">Cancel</button><button onClick={handleRecordPayment} className="px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">Record</button></div>
        </div>
      </Modal>

      <Modal isOpen={modals.createEvent} onClose={() => closeModal('createEvent')} title="Create Event" icon={<CalendarPlus size={18} />}>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Event Title</label><input type="text" value={newEvent.title} onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. Tech Summit 2027" /></div>
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Event Body</label><textarea value={newEvent.body} onChange={e => setNewEvent(prev => ({ ...prev, body: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. Some new Event Message" /></div>
          <div><label className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Date</label><input type="date" value={newEvent.date} onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))} className="w-full mt-1 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-400" /></div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => closeModal('createEvent')} className="px-4 py-2 rounded-full border border-emerald-200 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition">Cancel</button><button onClick={handleCreateEvent} className="px-4 py-2 rounded-full bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white text-sm font-semibold hover:opacity-90 transition shadow-sm">Create</button></div>
        </div>
      </Modal>

      {/* Toast */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Global Styles via style tag */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #0e2d3d;
          border-radius: 10px;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.3s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out forwards;
        }
      `}</style>
      <Validator/>
    </div>
  );
};

export default AdminPage;
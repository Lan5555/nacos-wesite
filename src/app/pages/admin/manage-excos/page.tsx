'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CoreService from '@/app/hooks/core-service';


interface Exco {
  id: string;
  name: string;
  level: number;
  isStaff: boolean;
  password: string;
  email: string;
  department: string;
  position?: string;
  phone?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface FormErrors {
  [key: string]: string;
}

const service:CoreService = new CoreService();

export const ExcosManagement = () => {
  const [excos, setExcos] = useState<Exco[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExco, setSelectedExco] = useState<Exco | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'staff'>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'position' | 'date'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingExco, setEditingExco] = useState<Exco | null>(null);
  const [selectedExcos, setSelectedExcos] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    level: 100,
    isStaff: false,
    password: '',
    confirmPassword: '',
    email: '',
    department: 'Computer Science',
    position: '',
    phone: ''
  });
  
  const [profileImage, setProfileImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const departments = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Cyber Security',
    'Data Science',
    'Information Systems'
  ];

  const positions = [
    'President',
    'Vice President',
    'Secretary General',
    'Welfare Secretary',
    'Treasurer',
    'Financial Secretary',
    'Public Relations Officer',
    'Director of Academics',
    'Director of Socials',
    'Director of Sports',
    'Director of Welfare',
    'Auditor General',
    'Technical Director'
  ];

  
  const fetchExcos = async () => {
    try {
      setPageLoading(true);
      const result = await service.get("admin/find-all");
      if (result.success) {
        setExcos(result.data ?? []);
      }
    } catch (error) {
      console.error("fetchExcos error:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchExcos();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^[\d\s+\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (excos.some(e => e.id !== editingExco?.id && e.email.toLowerCase() === formData.email.toLowerCase())) {
      errors.email = 'This email is already in use';
    }

    if (!editingExco && !formData.password) {
      errors.password = 'Password is required for new members';
    } else if (formData.password && !validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters with letters and numbers';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.position) {
      errors.position = 'Position is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, profileImage: 'Image must be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, profileImage: 'Please upload an image file' }));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setFormErrors(prev => ({ ...prev, profileImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  
  const handleAddExco = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const createResult = await service.send("admin/create-admin", {
        name: formData.name.trim(),
        level: formData.isStaff ? 0 : formData.level,
        isStaff: formData.isStaff,
        password: formData.password,
        email: formData.email.trim().toLowerCase(),
        department: formData.department,
        position: formData.position,
        phone: formData.phone.trim(),
      });

      if (!createResult.success) {
        console.error("Create failed:", createResult.message, createResult);
        return;
      }

      const newId = createResult.data?.id ?? createResult.data?._id;
      if (!newId) {
        console.error("Create succeeded but returned no id:", createResult);
        return;
      }

      if (imageFile && newId) {
        const uploadResult = await service.upload(`admin/update/${newId}`, {
          file: imageFile,
        }, "PATCH");
        console.log("add image upload result:", uploadResult);
        if (!uploadResult.success) {
          setFormErrors(prev => ({ ...prev, profileImage: `Image upload failed: ${uploadResult.message || 'Unknown error'}` }));
          console.error("Image upload failed:", uploadResult);
          setLoading(false);
          return;
        }
      }

      await fetchExcos();
      setSuccessMessage('Exco member added successfully!');
      resetForm();
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error("handleAddExco error:", error);
    } finally {
      setLoading(false);
    }
  }, [formData, imageFile]);

  const handleEditExco = useCallback((exco: Exco) => {
    setEditingExco(exco);
    setFormData({
      name: exco.name,
      level: exco.level,
      isStaff: exco.isStaff,
      password: '',
      confirmPassword: '',
      email: exco.email,
      department: exco.department,
      position: exco.position || '',
      phone: exco.phone || ''
    });
    setProfileImage(exco.profileImage || '');
    setImageFile(null);
    setFormErrors({});
    setShowAddModal(true);
  }, []);

  
  const handleUpdateExco = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      await service.patch(`admin/update/${editingExco?.id}`, {
        name: formData.name.trim(),
        level: formData.isStaff ? 0 : formData.level,
        isStaff: formData.isStaff,
        email: formData.email.trim().toLowerCase(),
        department: formData.department,
        position: formData.position,
        phone: formData.phone.trim(),
        ...(formData.password && { password: formData.password }),
      });

      if (imageFile && editingExco?.id) {
        const uploadResult = await service.upload(`admin/update/${editingExco.id}`, {
          file: imageFile,
        }, "PATCH");
        console.log("update image upload result:", uploadResult);
        if (!uploadResult.success) {
          setFormErrors(prev => ({ ...prev, profileImage: `Image upload failed: ${uploadResult.message || 'Unknown error'}` }));
          console.error("Image upload failed:", uploadResult);
          setLoading(false);
          return;
        }
      }

      await fetchExcos();
      setSuccessMessage('Exco member updated successfully!');
      resetForm();
      setShowAddModal(false);
      setEditingExco(null);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error("handleUpdateExco error:", error);
    } finally {
      setLoading(false);
    }
  }, [formData, imageFile, editingExco]);

  
  const handleDeleteExco = useCallback(async () => {
    if (!selectedExco) return;
    try {
      await service.delete(`admin/delete/${selectedExco.id}`);
      await fetchExcos();
      setSuccessMessage(`${selectedExco.name} has been removed from the team.`);
      setShowDeleteModal(false);
      setSelectedExco(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("handleDeleteExco error:", error);
    }
  }, [selectedExco]);


  const handleBulkDelete = useCallback(async () => {
    try {
      await Promise.all(
        selectedExcos.map(id => service.delete(`admin/delete/${id}`))
      );
      await fetchExcos();
      setSuccessMessage(`${selectedExcos.length} members have been removed.`);
      setSelectedExcos([]);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("handleBulkDelete error:", error);
    }
  }, [selectedExcos]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      level: 100,
      isStaff: false,
      password: '',
      confirmPassword: '',
      email: '',
      department: 'Computer Science',
      position: '',
      phone: ''
    });
    setProfileImage('');
    setImageFile(null);
    setFormErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const toggleSelectExco = useCallback((id: string) => {
    setSelectedExcos(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const filteredAndSortedExcos = useMemo(() => {
    let result = [...excos];

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(exco => 
        exco.name.toLowerCase().includes(lowerSearch) ||
        exco.email.toLowerCase().includes(lowerSearch) ||
        (exco.position && exco.position.toLowerCase().includes(lowerSearch)) ||
        exco.department.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterRole === 'student') {
      result = result.filter(exco => !exco.isStaff);
    } else if (filterRole === 'staff') {
      result = result.filter(exco => exco.isStaff);
    }

    if (filterDepartment !== 'all') {
      result = result.filter(exco => exco.department === filterDepartment);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'position':
          return (a.position || '').localeCompare(b.position || '');
        case 'date':
        default:
          return (new Date(b.updatedAt || b.createdAt)).getTime() - (new Date(a.updatedAt || a.createdAt)).getTime();
      }
    });

    return result;
  }, [excos, searchTerm, filterRole, filterDepartment, sortBy]);

  const toggleSelectAll = useCallback(() => {
    if (selectedExcos.length === filteredAndSortedExcos.length) {
      setSelectedExcos([]);
    } else {
      setSelectedExcos(filteredAndSortedExcos.map(e => e.id));
    }
  }, [selectedExcos, filteredAndSortedExcos]);

  const stats = useMemo(() => ({
    total: excos.length,
    staff: excos.filter(e => e.isStaff).length,
    students: excos.filter(e => !e.isStaff).length,
    departments: new Set(excos.map(e => e.department)).size
  }), [excos]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50 to-slate-50">
      {/* Enhanced Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="font-bold text-slate-800 text-lg">ExcosHub</span>
              </Link>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                <Link href="/admin/dashboard" className="px-4 py-2 text-slate-600 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all text-sm font-medium">
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Right side nav items */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800">Admin User</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header with breadcrumb */}
        <div className="bg-white/50 backdrop-blur-sm border-b border-emerald-100/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <Link href="/admin/dashboard" className="text-slate-500 hover:text-emerald-600 transition-colors">
                Dashboard
              </Link>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-emerald-600 font-semibold">Excos Management</span>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                  Executive Committee
                </h1>
                <p className="text-sm text-slate-500 mt-1">Manage your executive team members</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setEditingExco(null);
                  setShowAddModal(true);
                }}
                className="group relative px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-105"
              >
                <span className="absolute inset-0 bg-linear-to-r from-emerald-700 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Member
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Members', value: stats.total, icon: '👥', color: 'emerald', change: '+12%' },
              { label: 'Student Leaders', value: stats.students, icon: '👨‍🎓', color: 'blue', change: '+5%' },
              { label: 'Staff Advisors', value: stats.staff, icon: '👩‍🏫', color: 'orange', change: '0%' },
              { label: 'Departments', value: stats.departments, icon: '🏛️', color: 'purple', change: '+2' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl border border-slate-200 p-6 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-linear-to-br from-${stat.color}-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <span className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-2">{stat.change} from last month</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Actions Bar */}
          {selectedExcos.length > 0 && (
            <div className="bg-white rounded-xl border border-emerald-200 shadow-lg p-4 mb-6 animate-slide-in-right">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{selectedExcos.length} selected</span>
                  <button
                    onClick={() => setSelectedExcos([])}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all text-sm"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Panel - Enhanced */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members by name, email, position, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 pl-12 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder-slate-400 text-slate-900"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold text-slate-600">Role:</span>
                  {(['all', 'student', 'staff'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setFilterRole(role)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                        filterRole === role 
                          ? 'bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {role === 'all' ? 'All' : role === 'student' ? 'Students' : 'Staff'}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold text-slate-600">Dept:</span>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 items-center ml-auto">
                  <span className="text-sm font-semibold text-slate-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'position' | 'date')}
                    className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  >
                    <option value="date">Recently Updated</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="position">Position</option>
                  </select>
                </div>

                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Success Toast */}
          {successMessage && (
            <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
              <div className="bg-white border border-emerald-200 rounded-xl shadow-lg p-4 flex items-center gap-3 min-w-[320px]">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-700 font-medium text-sm">{successMessage}</p>
              </div>
            </div>
          )}

          
           {/* Members Grid/List */}
          {pageLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm font-medium">Loading members...</p>
            </div>
          ) : filteredAndSortedExcos.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedExcos.map((exco, idx) => (
                  <div
                    key={exco.id}
                    className={`group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 animate-fade-in ${
                      selectedExcos.includes(exco.id) ? 'ring-2 ring-emerald-500' : ''
                    }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onMouseEnter={() => setHoveredCard(exco.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-4 left-4 z-10">
                      <input
                        type="checkbox"
                        checked={selectedExcos.includes(exco.id)}
                        onChange={() => toggleSelectExco(exco.id)}
                        className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Header Gradient */}
                    <div className="relative h-28 bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-600">
                      <div className="absolute inset-0 bg-black/10"></div>
                      
                      {exco.isStaff && (
                        <div className="absolute top-4 right-4 backdrop-blur-sm bg-amber-500/90 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                          Staff
                        </div>
                      )}
                    </div>

                    <div className="relative px-6 pb-6">
                      {/* Profile Image */}
                      <div className="flex justify-center -mt-14 mb-4">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl border-4 border-white">
                          {exco.profileImage ? (
                            <img
                              src={exco.profileImage}
                              alt={exco.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                              {exco.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{exco.name}</h3>
                        {exco.position && (
                          <p className="text-sm font-semibold text-emerald-600">
                            {exco.position}
                          </p>
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-3 mb-5">
                        <p className="text-xs text-slate-500 truncate text-center">{exco.email}</p>
                        
                        <div className="flex flex-wrap gap-2 justify-center">
                          <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                            {exco.department}
                          </span>
                          {!exco.isStaff && (
                            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                              Level {exco.level}
                            </span>
                          )}
                        </div>

                        {exco.phone && (
                          <p className="text-xs text-slate-600 text-center">📱 {exco.phone}</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className={`flex gap-2 transition-all duration-300 ${hoveredCard === exco.id ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                          onClick={() => handleEditExco(exco)}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-100 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExco(exco);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 font-semibold hover:bg-red-100 transition-all duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left w-12">
                          <input
                            type="checkbox"
                            checked={selectedExcos.length === filteredAndSortedExcos.length && filteredAndSortedExcos.length > 0}
                            onChange={toggleSelectAll}
                            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Member</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Position</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Department</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredAndSortedExcos.map((exco) => (
                        <tr key={exco.id} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedExcos.includes(exco.id)}
                              onChange={() => toggleSelectExco(exco.id)}
                              className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                                {exco.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{exco.name}</p>
                                <p className="text-xs text-slate-500">{exco.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-700">{exco.position || '—'}</span>
                            {exco.isStaff && (
                              <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Staff</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-700">{exco.department}</span>
                            {!exco.isStaff && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">L{exco.level}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {exco.phone && <p className="text-sm text-slate-600">{exco.phone}</p>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditExco(exco)}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-all"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedExco(exco);
                                  setShowDeleteModal(true);
                                }}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 transition-all"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <div className="text-7xl mb-6 opacity-50">👥</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No members found</h3>
              <p className="text-slate-600 mb-8">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first member'}
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setEditingExco(null);
                  setShowAddModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-200/50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add First Member
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl animate-modal-in">
            <div className="sticky top-0 bg-linear-to-r from-emerald-600 to-emerald-500 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingExco ? `Edit ${editingExco.name}` : 'Add New Member'}
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  {editingExco ? 'Update member information' : 'Create a new team member'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                  setEditingExco(null);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={editingExco ? handleUpdateExco : handleAddExco} className="p-6 space-y-5 max-h-[calc(90vh-180px)] overflow-y-auto">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="w-28 h-28 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 p-1 border-4 border-white shadow-lg">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
                        ?
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 shadow-lg transition-all text-sm"
                  >
                    📷
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {formErrors.profileImage && <p className="text-xs text-red-600 mt-1">{formErrors.profileImage}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${formErrors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Password {!editingExco && '*'}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${formErrors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                    placeholder={editingExco ? 'Leave blank to keep current' : 'Min 6 characters'}
                  />
                  {formErrors.password && <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${formErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                    placeholder="Confirm password"
                  />
                  {formErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{formErrors.confirmPassword}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg border ${formErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                  placeholder="+234 812 345 6789"
                />
                {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  >
                    {departments.map(dept => <option key={dept}>{dept}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Position *</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${formErrors.position ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                  >
                    <option value="">Select position</option>
                    {positions.map(pos => <option key={pos}>{pos}</option>)}
                  </select>
                  {formErrors.position && <p className="text-xs text-red-600 mt-1">{formErrors.position}</p>}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isStaff}
                    onChange={(e) => setFormData({ ...formData, isStaff: e.target.checked, level: e.target.checked ? 0 : formData.level })}
                    className="w-5 h-5 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-slate-900">This is a staff member / faculty advisor</span>
                </label>
              </div>

              {!formData.isStaff && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Academic Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  >
                    {[100, 200, 300, 400].map(level => <option key={level} value={level}>{level} Level</option>)}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="submit" disabled={loading} className="flex-1 px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? 'Processing...' : (editingExco ? 'Update Member' : 'Add Member')}
                </button>
                <button type="button" onClick={() => { setShowAddModal(false); resetForm(); setEditingExco(null); }} className="px-6 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold hover:bg-slate-100 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedExco && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-modal-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Member?</h3>
              <p className="text-slate-600 mb-2">
                Remove <strong className="text-slate-900">{selectedExco.name}</strong> from the team?
              </p>
              <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
              
              <div className="flex gap-3">
                <button onClick={handleDeleteExco} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all">
                  Remove
                </button>
                <button onClick={() => { setShowDeleteModal(false); setSelectedExco(null); }} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold hover:bg-slate-100 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; opacity: 0; }
        .animate-modal-in { animation: modal-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}

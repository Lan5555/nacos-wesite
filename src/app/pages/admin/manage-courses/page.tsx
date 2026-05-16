'use client'
import React, { useState } from 'react';
import {
  Plus, FileText, Upload, X, Search, Edit2, Trash2,
  BookOpen, FolderOpen, Download, CheckCircle, AlertCircle
} from 'lucide-react';

// Types based on schema
interface Course {
  id: string;
  name: string;
  department: string;
  level: string;
  code: string;
  description: string;
  document?: {
    name: string;
    url: string;
    size: number;
    type: string;
  };
  createdAt: string;
}

// Mock initial data
const initialCourses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Software Engineering 2',
    department: 'Software Engineering II',
    level: '100',
    code: 'SEN 102',
    description: 'Official pdf for Software Engineering 2',
    document: {
      name: 'SEN102_Syllabus.pdf',
      url: '#',
      size: 2450000,
      type: 'application/pdf'
    },
    createdAt: '2024-09-01'
  },
  {
    id: '2',
    name: 'Data Structures and Algorithms',
    department: 'Computer Science',
    level: '200',
    code: 'CSC 201',
    description: 'Advanced data structures and algorithm analysis',
    document: {
      name: 'CSC201_Notes.pdf',
      url: '#',
      size: 3800000,
      type: 'application/pdf'
    },
    createdAt: '2024-09-01'
  }
];

const levels = ['100', '200', '300', '400', '500'];
const departments = [
  'Computer Science',
  'Software Engineering I',
  'Software Engineering II',
  'Information Technology',
  'Cyber Security',
  'Data Science'
];

function App() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    level: '',
    code: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        department: course.department,
        level: course.level,
        code: course.code,
        description: course.description,
      });
      setSelectedFile(null);
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        department: '',
        level: '',
        code: '',
        description: '',
      });
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData({
      name: '',
      department: '',
      level: '',
      code: '',
      description: '',
    });
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        setSelectedFile(file);
      } else {
        showToast('Please upload a valid document (PDF, DOC, DOCX)', 'error');
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.department || !formData.level || !formData.code) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (editingCourse) {
      // Update existing course
      setCourses(courses.map(course =>
        course.id === editingCourse.id
          ? {
              ...course,
              ...formData,
              document: selectedFile
                ? {
                    name: selectedFile.name,
                    url: URL.createObjectURL(selectedFile),
                    size: selectedFile.size,
                    type: selectedFile.type
                  }
                : course.document
            }
          : course
      ));
      showToast('Course updated successfully', 'success');
    } else {
      // Create new course
      const newCourse: Course = {
        id: Date.now().toString(),
        ...formData,
        document: selectedFile
          ? {
              name: selectedFile.name,
              url: URL.createObjectURL(selectedFile),
              size: selectedFile.size,
              type: selectedFile.type
            }
          : undefined,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCourses([newCourse, ...courses]);
      showToast('Course created successfully', 'success');
    }
    handleCloseModal();
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
      showToast('Course deleted successfully', 'success');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || course.department === selectedDepartment;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    return matchesSearch && matchesDepartment && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Toast Notification */}
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
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-linear-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-900 to-emerald-600 bg-clip-text text-transparent">
                  Course Management
                </h1>
                <p className="text-sm text-emerald-600/70 mt-0.5">Manage academic courses and resources</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={18} />
              Add Course
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-50">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search by name, code or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="w-48">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              >
                <option value="">All</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}L</option>
                ))}
              </select>
            </div>
            {(selectedDepartment || selectedLevel || searchTerm) && (
              <button
                onClick={() => { setSelectedDepartment(''); setSelectedLevel(''); setSearchTerm(''); }}
                className="px-4 py-2.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-2xl border border-emerald-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="relative p-5 pb-3 border-b border-emerald-50 bg-linear-to-r from-emerald-50/30 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md">
                        {course.code}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-md">
                        {course.level}L
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-emerald-900 leading-tight mb-1">
                      {course.name}
                    </h3>
                    <p className="text-sm text-emerald-600/70">{course.department}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(course)}
                      className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Document Section */}
                {course.document ? (
                  <div className="bg-emerald-50/40 rounded-xl p-3 flex items-center gap-3 border border-emerald-100">
                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-800 truncate">{course.document.name}</p>
                      <p className="text-xs text-emerald-500">{formatFileSize(course.document.size)}</p>
                    </div>
                    <button
                      onClick={() => window.open(course.document?.url, '_blank')}
                      className="p-2 text-emerald-500 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <Download size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
                    <FolderOpen size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">No document uploaded</span>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between">
                  <span className="text-xs text-emerald-400">
                    Added {course.createdAt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No courses found</h3>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  {editingCourse ? <Edit2 size="18" className="text-emerald-600" /> : <Plus size="18" className="text-emerald-600" />}
                </div>
                <h2 className="text-xl font-bold text-emerald-900">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size="20" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Introduction to Software Engineering 2"
                  className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Course Code */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                    Course Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SEN 102"
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                {/* Level */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="">Select Level</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}L</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Course description, objectives, or additional information..."
                  className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                  Course Document
                </label>
                <div className="border-2 border-dashed border-emerald-200 rounded-xl p-5 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-emerald-50/20"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size="20" className="text-emerald-500" />
                      <span className="text-sm text-emerald-700">{selectedFile.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                        className="p-1 hover:bg-emerald-100 rounded"
                      >
                        <X size="14" className="text-emerald-500" />
                      </button>
                    </div>
                  ) : editingCourse?.document ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size="20" className="text-emerald-500" />
                      <span className="text-sm text-emerald-700">{editingCourse.document.name}</span>
                      <span className="text-xs text-emerald-400">(keep existing)</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Upload size="18" className="text-emerald-400" />
                      <span className="text-sm text-gray-500">Click or drag to upload document</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">Supported: PDF, DOC, DOCX, PPT, PPTX (Max 10MB)</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-emerald-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-md"
              >
                {editingCourse ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-in {
          animation: animateIn 0.2s ease-out;
        }
        .slide-in-from-right-5 {
          animation: slideInRight 0.3s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .zoom-in-95 {
          animation: zoomIn 0.2s ease-out;
        }
        @keyframes animateIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import {
  Upload, FileText, X, Search, Download, CheckCircle, AlertCircle,
  GraduationCap, BookOpen, Users, Calendar, BarChart3, Filter,
  ChevronDown, Eye, Trash2, RefreshCw, Plus, School
} from 'lucide-react';

// Schema based on your requirement
interface ResultUpload {
  id: string;
  course: string;
  code: string;
  level: number;
  department: string;
  session: string;
  semester: 'First' | 'Second';
  document: {
    name: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: string;
  };
  uploadedBy: string;
  status: 'Published' | 'Draft';
  remarks?: string;
}

// Mock initial data
const initialResults: ResultUpload[] = [
  {
    id: '1',
    course: 'Elementary Mathematics 1',
    code: 'MTH 101',
    level: 100,
    department: 'Computer Science',
    session: '2024/2025',
    semester: 'First',
    document: {
      name: 'MTH101_Elementary_Mathematics_Result.pdf',
      url: '#',
      size: 1240000,
      type: 'application/pdf',
      uploadedAt: '2025-01-15T10:30:00'
    },
    uploadedBy: 'Dr. Adeyemi O.',
    status: 'Published'
  },
  {
    id: '2',
    course: 'Introduction to Programming',
    code: 'CSC 102',
    level: 100,
    department: 'Computer Science',
    session: '2024/2025',
    semester: 'First',
    document: {
      name: 'CSC102_Programming_Results.pdf',
      url: '#',
      size: 980000,
      type: 'application/pdf',
      uploadedAt: '2025-01-18T14:15:00'
    },
    uploadedBy: 'Prof. Okonkwo C.',
    status: 'Published'
  },
  {
    id: '3',
    course: 'Discrete Mathematics',
    code: 'MTH 201',
    level: 200,
    department: 'Mathematics',
    session: '2024/2025',
    semester: 'First',
    document: {
      name: 'MTH201_Discrete_Math_Results.xlsx',
      url: '#',
      size: 2100000,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      uploadedAt: '2025-01-20T09:45:00'
    },
    uploadedBy: 'Dr. Eze N.',
    status: 'Draft'
  },
  {
    id: '4',
    course: 'Elementary Mathematics 1',
    code: 'MTH 101',
    level: 100,
    department: 'Software Engineering',
    session: '2024/2025',
    semester: 'First',
    document: {
      name: 'MTH101_SE_Results.pdf',
      url: '#',
      size: 1180000,
      type: 'application/pdf',
      uploadedAt: '2025-01-22T11:20:00'
    },
    uploadedBy: 'Dr. Adeyemi O.',
    status: 'Published'
  }
];

const departments = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Cyber Security',
  'Data Science',
  'Mathematics',
  'Physics',
  'Chemistry'
];

const levels = [100, 200, 300, 400, 500];
const semesters = ['First', 'Second'];
const sessions = ['2023/2024', '2024/2025', '2025/2026'];

// Helper function to get department color
const getDepartmentColor = (dept: string) => {
  const colors: Record<string, string> = {
    'Computer Science': 'bg-blue-100 text-blue-700',
    'Software Engineering': 'bg-purple-100 text-purple-700',
    'Information Technology': 'bg-teal-100 text-teal-700',
    'Cyber Security': 'bg-red-100 text-red-700',
    'Data Science': 'bg-amber-100 text-amber-700',
    'Mathematics': 'bg-indigo-100 text-indigo-700',
    'Physics': 'bg-cyan-100 text-cyan-700',
    'Chemistry': 'bg-lime-100 text-lime-700'
  };
  return colors[dept] || 'bg-gray-100 text-gray-700';
};

const ResultsManagement = () => {
  const [results, setResults] = useState<ResultUpload[]>(initialResults);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ResultUpload | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | ''>('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<ResultUpload | null>(null);
  
  // Form state matching your schema
  const [formData, setFormData] = useState({
    course: '',
    code: '',
    level: 100,
    department: '',
    session: '2024/2025',
    semester: 'First' as 'First' | 'Second'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleOpenModal = (result?: ResultUpload) => {
    if (result) {
      setSelectedResult(result);
      setFormData({
        course: result.course,
        code: result.code,
        level: result.level,
        department: result.department,
        session: result.session,
        semester: result.semester
      });
      setSelectedFile(null);
    } else {
      setSelectedResult(null);
      setFormData({
        course: '',
        code: '',
        level: 100,
        department: '',
        session: '2024/2025',
        semester: 'First'
      });
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
    setFormData({
      course: '',
      code: '',
      level: 100,
      department: '',
      session: '2024/2025',
      semester: 'First'
    });
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        showToast('Please upload a valid file (PDF, Excel, or Word format)', 'error');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.course || !formData.code || !formData.department) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (!selectedFile && !selectedResult) {
      showToast('Please upload a result document', 'error');
      return;
    }

    setIsLoading(true);

    // Simulate upload delay
    setTimeout(() => {
      if (selectedResult) {
        // Update existing result
        setResults(results.map(result =>
          result.id === selectedResult.id
            ? {
                ...result,
                course: formData.course,
                code: formData.code,
                level: formData.level,
                department: formData.department,
                session: formData.session,
                semester: formData.semester,
                document: selectedFile
                  ? {
                      name: selectedFile.name,
                      url: URL.createObjectURL(selectedFile),
                      size: selectedFile.size,
                      type: selectedFile.type,
                      uploadedAt: new Date().toISOString()
                    }
                  : result.document,
              }
            : result
        ));
        showToast('Result updated successfully', 'success');
      } else {
        // Create new result
        const newResult: ResultUpload = {
          id: Date.now().toString(),
          ...formData,
          document: {
            name: selectedFile!.name,
            url: URL.createObjectURL(selectedFile!),
            size: selectedFile!.size,
            type: selectedFile!.type,
            uploadedAt: new Date().toISOString()
          },
          uploadedBy: 'Admin User',
          status: 'Draft'
        };
        setResults([newResult, ...results]);
        showToast('Result uploaded successfully', 'success');
      }
      setIsLoading(false);
      handleCloseModal();
    }, 1500);
  };

  const handleUpdateStatus = (id: string, status: 'Published' | 'Draft') => {
    setResults(results.map(result =>
      result.id === id ? { ...result, status } : result
    ));
    showToast(`Result ${status.toLowerCase()}`, 'success');
  };

  const handleDeleteResult = (id: string) => {
    if (window.confirm('Are you sure you want to delete this result record?')) {
      setResults(results.filter(result => result.id !== id));
      showToast('Result deleted successfully', 'success');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('sheet')) return '📊';
    if (type.includes('word')) return '📝';
    return '📁';
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || result.department === selectedDepartment;
    const matchesLevel = !selectedLevel || result.level === selectedLevel;
    const matchesStatus = !selectedStatus || result.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesLevel && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-lg ${
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-900 to-emerald-600 bg-clip-text text-transparent">
                  Result Management
                </h1>
                <p className="text-sm text-emerald-600/70 mt-0.5">Upload and manage student examination results</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg w-full md:w-auto"
            >
              <Plus size={18} />
              Upload Result
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Total Results</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{results.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Published</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{results.filter(r => r.status === 'Published').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Drafts</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{results.filter(r => r.status === 'Draft').length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Departments</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{
                  new Set(results.map(r => r.department)).size
                }</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <School className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-50">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search by course or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
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
            <div className="w-full md:w-32">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : '' )}
                className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}L</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-36">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              >
                <option value="">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            {(selectedDepartment || selectedLevel || selectedStatus || searchTerm) && (
              <button
                onClick={() => { setSelectedDepartment(''); setSelectedLevel(''); setSelectedStatus(''); setSearchTerm(''); }}
                className="px-4 py-2.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium w-full md:w-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-50/50 border-b border-emerald-100">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Course Info</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Department</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Level</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Session</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Document</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-emerald-900">{result.course}</p>
                        <p className="text-xs text-emerald-500 font-mono mt-0.5">{result.code}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getDepartmentColor(result.department)}`}>
                        {result.department}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                        {result.level}L
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Calendar size="12" className="text-emerald-400" />
                        <span className="text-sm text-gray-600">{result.session} • {result.semester}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFileIcon(result.document.type)}</span>
                        <div>
                          <p className="text-sm text-gray-700 truncate max-w-45">{result.document.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(result.document.size)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {result.status === 'Published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                          <CheckCircle size="12" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                          <AlertCircle size="12" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.open(result.document.url, '_blank')}
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size="16" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(result)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Eye size="16" />
                        </button>
                        {result.status === 'Draft' && (
                          <button
                            onClick={() => handleUpdateStatus(result.id, 'Published')}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <CheckCircle size="16" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteResult(result.id)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size="16" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredResults.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500">No results found</h3>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Upload size="18" className="text-[#0e2d3d]" />
                </div>
                <h2 className="text-xl font-bold text-emerald-900">
                  {selectedResult ? 'Edit Result' : 'Upload New Result'}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size="20" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Course Name - matches schema */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g., Elementary Mathematics 1"
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
                    placeholder="e.g., MTH 101"
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
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}L</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department - matches schema */}
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

              <div className="grid grid-cols-2 gap-4">
                {/* Session */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                    Academic Session
                  </label>
                  <select
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {sessions.map(session => (
                      <option key={session} value={session}>{session}</option>
                    ))}
                  </select>
                </div>
                {/* Semester */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value as 'First' | 'Second' })}
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>{sem} Semester</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                  Result Document <span className="text-red-500">*</span>
                </label>
                <div 
                  className="border-2 border-dashed border-emerald-200 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-emerald-50/20"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf,.xls,.xlsx,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size="24" className="text-emerald-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-emerald-800">{selectedFile.name}</p>
                        <p className="text-xs text-emerald-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                        className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <X size="14" className="text-emerald-500" />
                      </button>
                    </div>
                  ) : selectedResult?.document ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size="24" className="text-emerald-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-emerald-800">{selectedResult.document.name}</p>
                        <p className="text-xs text-emerald-500">Current file (upload new to replace)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size="32" className="text-emerald-400" />
                      <span className="text-sm text-gray-500">Click or drag to upload result document</span>
                      <span className="text-xs text-gray-400">PDF, Excel, or Word files (Max 10MB)</span>
                    </div>
                  )}
                </div>
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
                disabled={isLoading}
                className="px-6 py-2.5 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size="16" className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size="16" />
                    {selectedResult ? 'Save Changes' : 'Upload Result'}
                  </>
                )}
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

export default ResultsManagement;
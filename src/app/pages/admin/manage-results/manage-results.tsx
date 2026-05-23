'use client'
import React, { useState, useEffect } from 'react';
import {
  Upload, FileText, X, Search, Download, CheckCircle, AlertCircle,
  GraduationCap, RefreshCw, Plus, School, Loader2, Trash2, Eye
} from 'lucide-react';
import CoreService from "@/app/hooks/core-service";

interface ResultUpload {
  id: string;
  course: string;
  code: string;
  level: number;
  department: string;
  session: string;
  semester: string;
  file: string;
  createdAt: string;
}

const departments = [
  'Computer Science', 'Software Engineering', 'Information Technology',
  'Cyber Security', 'Data Science', 'Mathematics', 'Physics', 'Chemistry'
];
const levels = [100, 200, 300, 400, 500];
const semesters = ['First Semester', 'Second Semester'];
const sessions = ['2023/2024', '2024/2025', '2025/2026'];

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

const service = new CoreService();

const ResultsManagement = () => {
  const [results, setResults] = useState<ResultUpload[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ResultUpload | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | ''>('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    course: '',
    code: '',
    level: 100,
    department: '',
    session: '2025/2026',
    semester: 'First Semester',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  
  const fetchResults = async () => {
    try {
      setPageLoading(true);
      const result = await service.get("results/find-all-results");
      if (result.success) {
        setResults(result.data ?? []);
      }
    } catch {
      showToast("Failed to load results", "error");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleOpenModal = (result?: ResultUpload) => {
    if (result) {
      setSelectedResult(result);
      setFormData({
        course: result.course,
        code: result.code,
        level: result.level,
        department: result.department,
        session: result.session,
        semester: result.semester,
      });
      setSelectedFile(null);
    } else {
      setSelectedResult(null);
      setFormData({ course: '', code: '', level: 100, department: '', session: '2025/2026', semester: 'First Semester' });
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
    setFormData({ course: '', code: '', level: 100, department: '', session: '2025/2026', semester: 'First Semester' });
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

    try {
      if (selectedResult) {
        
        await service.patch(`results/update-result/${selectedResult.id}`, {
          course: formData.course,
          code: formData.code,
          level: formData.level,
          department: formData.department,
          session: formData.session,
          semester: formData.semester,
        });

    
        if (selectedFile) {
          await service.upload(
            `results/update-result/${selectedResult.id}`,
            { file: selectedFile },
            "PATCH"
          );
        }

        showToast('Result updated successfully', 'success');
      } else {
        
        const createResult = await service.send("results/save-result", {
          course: formData.course,
          code: formData.code,
          level: formData.level,
          department: formData.department,
          session: formData.session,
          semester: formData.semester,
        });

        if (!createResult.success) {
          showToast(createResult.message || 'Failed to upload result', 'error');
          return;
        }

        const newId = createResult.data?.id;

        // ✅ Step 2 — Upload file
        if (selectedFile && newId) {
          await service.upload(
            `results/update-result/${newId}`,
            { file: selectedFile },
            "PATCH"
          );
        }

        showToast('Result uploaded successfully', 'success');
      }

      await fetchResults();
      handleCloseModal();

    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResult = async (id: string) => {
  if (window.confirm('Are you sure you want to delete this result record?')) {
    try {
      console.log("Deleting:", id);
      const result = await service.delete(`results/delete-result/${id}`);
      console.log("Delete result:", result); 
      if (result.success) {
        await fetchResults();
        showToast('Result deleted successfully', 'success');
      } else {
        showToast(result.message || 'Delete failed', 'error');
      }
    } catch (e) {
      console.error("Delete error:", e);
      showToast('Failed to delete result', 'error');
    }
  }
};

  const filteredResults = results.filter(result => {
    const matchesSearch = result.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || result.department === selectedDepartment;
    const matchesLevel = !selectedLevel || result.level === selectedLevel;
    return matchesSearch && matchesDepartment && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
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
                <p className="text-sm text-emerald-600 font-medium">Departments</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{new Set(results.map(r => r.department)).size}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <School className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Sessions</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{new Set(results.map(r => r.session)).size}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
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
                  className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
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
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
            <div className="w-full md:w-32">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              >
                <option value="">All Levels</option>
                {levels.map(level => <option key={level} value={level}>{level}L</option>)}
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

        {/* Page Loader */}
        {pageLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={40} className="text-emerald-600 animate-spin" />
            <p className="text-emerald-600/70 text-sm font-medium">Loading results...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-50/50 border-b border-emerald-100">
                    <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Course Info</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Department</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Level</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Session</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">File</th>
                    <th className="px-5 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {filteredResults.map((result) => (
                    <tr key={result.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-emerald-900">{result.course}</p>
                        <p className="text-xs text-emerald-500 font-mono mt-0.5">{result.code}</p>
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
                        <span className="text-sm text-gray-600">{result.session} • {result.semester}</span>
                      </td>
                      <td className="px-5 py-4">
                        {result.file ? (
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-emerald-500" />
                            <span className="text-sm text-emerald-700">PDF File</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No file</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {result.file && (
                            <button
                              onClick={() => window.open(result.file, '_blank')}
                              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenModal(result)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteResult(result.id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Upload size={18} className="text-[#0e2d3d]" />
                </div>
                <h2 className="text-xl font-bold text-emerald-900">
                  {selectedResult ? 'Edit Result' : 'Upload New Result'}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g., Elementary Mathematics 1"
                  className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {levels.map(level => <option key={level} value={level}>{level}L</option>)}
                  </select>
                </div>
              </div>

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
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">Academic Session</label>
                  <select
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {sessions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

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
                      <FileText size={24} className="text-emerald-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-emerald-800">{selectedFile.name}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="p-1.5 hover:bg-emerald-100 rounded-lg">
                        <X size={14} className="text-emerald-500" />
                      </button>
                    </div>
                  ) : selectedResult?.file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size={24} className="text-emerald-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-emerald-800">Existing file uploaded</p>
                        <p className="text-xs text-emerald-500">Upload new to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={32} className="text-emerald-400" />
                      <span className="text-sm text-gray-500">Click or drag to upload result document</span>
                      <span className="text-xs text-gray-400">PDF, Excel, or Word files (Max 10MB)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-emerald-100 px-6 py-4 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-5 py-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-medium">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-medium shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                ) : (
                  <><Upload size={16} /> {selectedResult ? 'Save Changes' : 'Upload Result'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes animateIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

export default ResultsManagement;
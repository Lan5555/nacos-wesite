import React, { useState, useEffect } from 'react';
import {
  Settings, Users, Shield, UserCog, Plus, Trash2, Edit2, Save, X,
  Moon, Sun, Bell, Lock, Globe, Database, RefreshCw, AlertCircle,
  CheckCircle, Search, Filter, Download, Upload, Crown, UserCheck,
  Activity, Clock, Mail, Phone, Calendar, ChevronRight, ChevronDown
} from 'lucide-react';
import CoreService from '@/app/hooks/core-service';
import { useToast } from '@/app/providers/toast-provider';
import { Exco } from '../manage-excos/manage-excos';

// Types
interface AdminUser {
  id: string;
  name: string;
  email: string;
  adminLevel: number;
  isStaff: boolean;
  profileImage?: string;
  department?: string;
  position?: string;
  level?: number;
  phone?: string;
  createdAt: string;
  permissions: string[];
}

interface SystemSettings {
  siteName: string;
  siteLogo: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  sessionTimeout: number;
  defaultLanguage: string;
  maintenanceMode: boolean;
  dateFormat: string;
}

interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  timestamp: string;
  details: string;
}

const initialSettings: SystemSettings = {
  siteName: 'NACOS Admin Portal',
  siteLogo: '',
  theme: 'system',
  emailNotifications: true,
  sessionTimeout: 60,
  defaultLanguage: 'en',
  maintenanceMode: false,
  dateFormat: 'DD/MM/YYYY'
};

const initialActivityLogs: ActivityLog[] = [
  { id: '1', adminId: '1', adminName: 'Dr. Okonkwo', action: 'Promoted user to Super Admin', timestamp: '2024-01-15T08:30:00', details: 'Promoted Prof. Adeyemi from Admin to Super Admin' },
  { id: '2', adminId: '2', adminName: 'Prof. Adeyemi', action: 'Updated system settings', timestamp: '2024-01-14T16:20:00', details: 'Changed email notification settings' },
  { id: '3', adminId: '1', adminName: 'Dr. Okonkwo', action: 'Added new admin', timestamp: '2024-01-14T10:15:00', details: 'Added Mrs. Eze as Admin' },
  { id: '4', adminId: '3', adminName: 'Mrs. Eze', action: 'Generated financial report', timestamp: '2024-01-13T14:00:00', details: 'Generated Q4 2024 financial report' }
];

// Permission options
const allPermissions = [
  'manage_students', 'manage_events', 'manage_finance', 'manage_excos', 'manage_courses', 'manage_settings', 'manage_department'
];

const permissionLabels: Record<string, string> = {
  manage_students: 'Manage Students',
  manage_events: 'Manage Events',
  manage_finance: 'Manage Finance',
  manage_excos: 'Manage Admins',
  manage_settings: 'Manage Settings',
  manage_courses: 'Manage Courses',
  manage_department: 'Manage Department'
};
const service:CoreService = new CoreService();

const AdminSettings:React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'super_admin'>('all');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState<'admins' | 'settings' | 'activity'>('admins');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    adminLevel: 1,
    isStaff: false,
    department: '',
    position: '',
    level: 100,
    phone: '',
    permissions: [] as string[],
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  //=======================//
    const fetchAdmins = async() => {
      setLoading(true);
      try{
        const res = await service.get('admin/find-all');
        if(res.success){
          setAdmins(res.data);
        }else{
          setAdmins([]);
          showToast(res.message || 'Failed to fetch admins','error')
        }
      }catch(e:any){
        showToast(e,'error');
      } finally {
        setLoading(false);
      }
    }
  //=====================//

  const handleOpenModal = (admin?: AdminUser) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        name: admin.name,
        email: admin.email,
        adminLevel: admin.adminLevel,
        isStaff: admin.isStaff,
        department: admin.department || '',
        position: admin.position || '',
        level: admin.level || 100,
        phone: admin.phone || '',
        permissions: admin.permissions || []
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        name: '',
        email: '',
        adminLevel: 1,
        isStaff: false,
        department: '',
        position: '',
        level: 100,
        phone: '',
        permissions: []
      });
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchAdmins();
  },[])

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  const handleSaveAdmin = async () => {
    if (!formData.name || !formData.email) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setProcessing(true);
    if (editingAdmin) {
      try {
        const res = await service.patch(`admin/update/${editingAdmin.id}`, {
          ...formData,
          permissions: formData.adminLevel >= 2 ? ['all'] : formData.permissions.filter(p => p !== 'all')
        });
        if (res.success) {
          await fetchAdmins();
          addActivityLog(editingAdmin.name, `Updated admin profile`, `Updated ${formData.name}'s information`);
          showToast('Admin updated successfully', 'success');
        } else {
          showToast(res.message || 'Update failed', 'error');
        }
      } catch (e: any) {
        showToast(e.message || 'An error occurred', 'error');
      }
    } else {
      try {
        const res = await service.send('admin/create-admin', {
          ...formData,
          permissions: formData.adminLevel >= 2 ? ['all'] : formData.permissions.filter(p => p !== 'all')
        });
        if (res.success) {
          await fetchAdmins();
          addActivityLog('System', `Added new Admin`, `Added ${formData.name} with Level ${formData.adminLevel}`);
          showToast('Admin added successfully', 'success');
        } else {
          showToast(res.message || 'Creation failed', 'error');
        }
      } catch (e: any) {
        showToast(e.message || 'An error occurred', 'error');
      }
    }
    setProcessing(false);
    handleCloseModal();
  };

  const handleDeleteAdmin = async(admin: AdminUser) => {
    if (admin.adminLevel >= 3 && admins.filter(a => a.adminLevel >= 3).length === 1) {
      showToast('Cannot delete the only Super Admin', 'error');
      return;    }
    if (admin.adminLevel >= 2) {
      showToast('Cannot delete a Super Admin', 'error');
      return;

    }
    if (window.confirm(`Are you sure you want to remove ${admin.name}?`)) {
      try{
        const res = await service.delete(`admin/delete/${admin.id}`);
        if(!res.success){
          showToast(res.message || 'Deletion failed', 'error');
        }
        setAdmins(admins.filter(a => a.id !== admin.id));
        addActivityLog('System', `Removed admin`, `Removed ${admin.name} (Level ${admin.adminLevel})`);
      }catch(e){
        showToast('An error occurred', 'error');
      }
      showToast('Admin removed successfully', 'success');
    }
  };

  const handlePromoteToSuperAdmin = async(admin: AdminUser) => {
    if (admin.adminLevel >= 2) {
      showToast(`${admin.name} is already a Super Admin`, 'error');
      return;
    }
    setAdmins(admins.map(a =>
      a.id === admin.id
        ? { ...a, adminLevel: 2, permissions: ['all'] }
        : a
    ));
  };

  const addActivityLog = async (adminName: string, action: string, details: string) => {
    try {
      const res = await service.send('activity-logs/create', {
        adminId: editingAdmin?.id || 'system',
        adminName,
        action,
        details
      });

      if (res.success) {
        const newLog: ActivityLog = {
          id: res.data?.id || Date.now().toString(),
          adminId: editingAdmin?.id || 'system',
          adminName,
          action,
          timestamp: new Date().toISOString(),
          details
        };
        setActivityLogs([newLog, ...activityLogs.slice(0, 49)]);
      }
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const handleUpdateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
    addActivityLog('Current User', `Updated settings`, `Changed ${key} to ${value}`);
    showToast('Settings updated', 'success');
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || (roleFilter === 'super_admin' ? admin.adminLevel >= 2 : admin.adminLevel === 1);
    return matchesSearch && matchesRole;
  });

  const togglePermission = (permission: string) => {
    if (formData.permissions.includes(permission)) {
      setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== permission) });
    } else {
      setFormData({ ...formData, permissions: [...formData.permissions, permission] });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
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
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-900 to-emerald-600 bg-clip-text text-transparent">
                  Settings & Administration
                </h1>
                <p className="text-sm text-emerald-600/70 mt-0.5">Manage admins, roles, and system preferences</p>
              </div>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {admins.filter(a => a.adminLevel >= 2).length} Super Admins
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {admins.length} Total Admins
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-emerald-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-5 py-2.5 font-medium rounded-t-lg transition-all ${
              activeTab === 'admins'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-emerald-600'
            }`}
          >
            <UserCog className="w-4 h-4 inline mr-2" />
            Admin Management
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 font-medium rounded-t-lg transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-emerald-600'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            System Settings
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-5 py-2.5 font-medium rounded-t-lg transition-all ${
              activeTab === 'activity'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-emerald-600'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Activity Logs
          </button>
        </div>

        {/* Admin Management Tab */}
        {activeTab === 'admins' && (
          <div className="animate-in fade-in duration-300">
            {/* Filters and Actions */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-5 mb-6 shadow-sm">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 flex-1 flex-wrap">
                  <div className="relative flex-1 min-w-62.5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="w-full md:w-auto px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins</option>
                    <option value="super_admin">Super Admins</option>
                  </select>
                </div>
                <button
                  onClick={() => handleOpenModal()}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-medium transition-all shadow-md"
                >
                  <Plus size="18" />
                  Add Admin
                </button>
              </div>
            </div>

            {/* Admins Table */}
            <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm relative min-h-100">
              {(loading || processing) && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                    <p className="text-sm font-medium text-emerald-800">Processing...</p>
                  </div>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50/50 border-b border-emerald-100">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Admin</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Role</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Department</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wide">Permissions</th>
                      <th className="px-5 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center overflow-hidden shrink-0">
                              {admin.profileImage ? (
                                <img 
                                  src={admin.profileImage} 
                                  alt={admin.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-emerald-700 font-bold text-sm">
                                  {admin.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                            <p className="font-semibold text-emerald-900">{admin.name}</p>
                            <p className="text-xs text-gray-500">{admin.email}</p>
                            {admin.phone && <p className="text-xs text-gray-400 mt-0.5">{admin.phone}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {admin.adminLevel >= 2 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                              <Crown size="12" /> Level {admin.adminLevel}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                              <UserCheck size="12" /> Level 1
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{admin.department || '—'}</td>
                        <td className="px-5 py-4">
                          {admin.adminLevel >= 2 ? (
                            <span className="text-xs text-amber-600">Full Access</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {admin.permissions.slice(0, 2).map(p => (
                                <span key={p} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{permissionLabels[p]}</span>
                              ))}
                              {admin.permissions.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">+{admin.permissions.length - 2}</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(admin)}
                              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size="16" />
                            </button>
                            {admin.adminLevel < 2 && (
                              <button
                                onClick={() => handlePromoteToSuperAdmin(admin)}
                                className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Promote to Super Admin"
                              >
                                <Crown size="16" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAdmin(admin)}
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
              {!loading && filteredAdmins.length === 0 && (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No admins found</h3>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new admin</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/30">
                  <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
                    <Globe size="18" /> General Settings
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleUpdateSetting('siteName', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleUpdateSetting('theme', e.target.value as any)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleUpdateSetting('dateFormat', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                    <select
                      value={settings.defaultLanguage}
                      onChange={(e) => handleUpdateSetting('defaultLanguage', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security & Notifications */}
              <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/30">
                  <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
                    <Lock size="18" /> Security & Notifications
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleUpdateSetting('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <button
                      onClick={() => handleUpdateSetting('emailNotifications', !settings.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-emerald-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                    <button
                      onClick={() => handleUpdateSetting('maintenanceMode', !settings.maintenanceMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? 'bg-amber-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                      <RefreshCw size="14" /> Clear All Cache
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm lg:col-span-2">
                <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/30">
                  <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
                    <Database size="18" /> Data Management
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-4">
                    <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-medium transition-colors">
                      <Download size="16" /> Export All Data
                    </button>
                    <button className="flex items-center justify-center gap-2 px-5 py-2.5 border border-emerald-200 text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition-colors">
                      <Upload size="16" /> Import Backup
                    </button>
                    <button className="flex items-center justify-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors">
                      <Trash2 size="16" /> Clear Activity Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Logs Tab */}
        {activeTab === 'activity' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/30 flex justify-between items-center">
                <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
                  <Activity size="18" /> Recent Activity Logs
                </h3>
                <button className="text-sm text-emerald-600 hover:text-emerald-700">View All</button>
              </div>
              <div className="divide-y divide-emerald-50">
                {activityLogs.map((log) => (
                  <div key={log.id} className="px-6 py-4 hover:bg-emerald-50/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                        {log.adminName === 'System' ? <Shield size="14" className="text-emerald-600" /> : <UserCog size="14" className="text-emerald-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <p className="font-medium text-gray-800">{log.action}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{log.details}</p>
                            <p className="text-xs text-gray-400 mt-1">by {log.adminName}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size="12" />
                            {formatDate(log.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <UserCog size="18" className="text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-emerald-900">
                  {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size="20" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Level</label>
                  <select
                    value={formData.adminLevel}
                    onChange={(e) => {
                      const newLevel = parseInt(e.target.value);
                      const newPermissions = newLevel >= 2 ? ['all'] : formData.permissions.filter(p => p !== 'all');
                      setFormData({ ...formData, adminLevel: newLevel, permissions: newPermissions });
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value={1}>Level 1 (Admin)</option>
                    <option value={2}>Level 2 (Super Admin)</option>
                    <option value={3}>Level 3 (Root)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isStaff}
                        onChange={() => setFormData({ ...formData, isStaff: true })}
                      /> <span className="text-sm">Staff</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.isStaff}
                        onChange={() => setFormData({ ...formData, isStaff: false })}
                      /> <span className="text-sm">Admin</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {formData.adminLevel < 2 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Permissions</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allPermissions.map(perm => (
                      <label key={perm} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{permissionLabels[perm]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.adminLevel >= 2 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Crown size="16" />
                    <span className="text-sm font-medium">Super Admin Access</span>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">Super Admins have full access to all features and settings.</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdmin}
                className="px-6 py-2.5 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-medium transition-colors shadow-md flex items-center gap-2"
              >
                <Save size="16" />
                {editingAdmin ? 'Save Changes' : 'Add Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-in {
          animation: fadeIn 0.2s ease-out;
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

export default AdminSettings;
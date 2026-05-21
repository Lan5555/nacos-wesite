"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Gamepad2, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Play,
  Clock,
  Users,
  Star,
  TrendingUp,
  Search,
  Filter,
  Award,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Power,
  PowerOff,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  User,
  Link as LinkIcon,
  Image,
  Info,
  Bell
} from "lucide-react";
import CoreService from "@/app/hooks/core-service";
import { Exco } from "../manage-excos/manage-excos";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnail: string;
  plays: number;
  rating: number;
  is_active: boolean;
  created_at: string;
  multiplayer: boolean;
  estimated_time: string;
  created_by?: string;
}

interface GameStats {
  totalGames: number;
  activeGames: number;
  totalPlays: number;
  averageRating: number;
  mostPlayedGame: Game | null;
  topRatedGame: Game | null;
  gamesByCategory: Record<string, number>;
}

// ============================================================================
// ADMIN HEADER COMPONENT
// ============================================================================

const AdminHeader: React.FC<{ title: string; unreadCount: number }> = ({ title, unreadCount }) => {
  const [currentDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">ADMIN PANEL</div>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-[#071a0d] tracking-tight">{title}</h1>
        <p className="text-sm text-[#6a9975] mt-1 flex items-center gap-2">
          <i className="fas fa-calendar-alt text-xs"></i>
          <span>{currentDate}</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
          <span>Manage games, track analytics, and moderate content</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-white border border-[rgba(15,110,63,0.12)] flex items-center justify-center text-[#1e3d27] cursor-pointer hover:bg-[#e6faf0] transition-all shadow-sm">
            <Bell className="w-4 h-4" />
         
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 bg-white border border-[rgba(15,110,63,0.12)] rounded-xl px-4 py-2 shadow-sm">
          <Search className="w-4 h-4 text-[#6a9975]" />
          <input 
            type="text" 
            placeholder="Search games..." 
            className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// GAME FORM MODAL (ADD/EDIT)
// ============================================================================

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (game: Partial<Game>) => Promise<void>;
  editingGame?: Game | null;
  isLoading?: boolean;
}

const GameFormModal: React.FC<GameFormModalProps> = ({ isOpen, onClose, onSave, editingGame, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    category: "Action",
    thumbnail: "",
    multiplayer: false,
    estimated_time: "15-30 min",
  });

  const categories = ["Action", "Puzzle", "Strategy", "Arcade", "Multiplayer", "Educational", "Casual", "Racing", "Sports"];

  useEffect(() => {
    if (editingGame) {
      setFormData({
        title: editingGame.title,
        description: editingGame.description || "",
        url: editingGame.url,
        category: editingGame.category,
        thumbnail: editingGame.thumbnail || "",
        multiplayer: editingGame.multiplayer,
        estimated_time: editingGame.estimated_time,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        url: "",
        category: "Action",
        thumbnail: "",
        multiplayer: false,
        estimated_time: "15-30 min",
      });
    }
  }, [editingGame, isOpen]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.url) return;
    await onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#071a0d]">
            {editingGame ? "Edit Game" : "Add New Game"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-[#e6faf0] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Game Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Among Us, Chess, Sudoku"
              className="w-full p-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the game..."
              rows={3}
              className="w-full p-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Game URL *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com/game"
              className="w-full p-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Thumbnail URL (optional)</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full p-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.multiplayer}
                onChange={(e) => setFormData(prev => ({ ...prev, multiplayer: e.target.checked }))}
                className="w-4 h-4 accent-emerald-600"
              />
              <span className="text-sm text-[#071a0d]">Multiplayer</span>
            </label>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#071a0d] mb-1">Est. Play Time</label>
              <select
                value={formData.estimated_time}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_time: e.target.value }))}
                className="w-full p-2 border border-emerald-100 rounded-lg text-sm"
              >
                <option>5-10 min</option>
                <option>10-15 min</option>
                <option>15-30 min</option>
                <option>30-60 min</option>
                <option>60+ min</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.url || isLoading}
            className="w-full py-3 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : (editingGame ? "Save Changes" : "Add Game")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CONFIRMATION MODAL
// ============================================================================

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-[#071a0d]">{title}</h3>
        </div>
        <p className="text-[#6a9975] mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border border-[#d8eedd] rounded-lg text-sm font-semibold">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const formatPlays = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <div className="bg-white border border-[#d8eedd] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase text-[#6a9975] tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-500`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-[#071a0d] font-serif">{typeof value === 'number' && title === "Total Plays" ? formatPlays(value) : value}</div>
      {trend && <div className="text-[10px] text-[#6a9975] mt-1">{trend}</div>}
    </div>
  );
};

// ============================================================================
// GAME TABLE ROW COMPONENT
// ============================================================================

interface GameTableRowProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const GameTableRow: React.FC<GameTableRowProps> = ({ game, onEdit, onDelete, onToggleStatus }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Action: "bg-red-100 text-red-600",
      Puzzle: "bg-purple-100 text-purple-600",
      Strategy: "bg-blue-100 text-blue-600",
      Arcade: "bg-yellow-100 text-yellow-600",
      Multiplayer: "bg-green-100 text-green-600",
      Educational: "bg-teal-100 text-teal-600",
      Casual: "bg-pink-100 text-pink-600",
      Racing: "bg-orange-100 text-orange-600",
      Sports: "bg-indigo-100 text-indigo-600",
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  return (
    <tr className="border-b border-[#d8eedd] hover:bg-[#f2fbf6] transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#0a4a20] to-[#0f6e3f] flex items-center justify-center">
            {game.thumbnail ? (
              <img src={game.thumbnail} alt={game.title} className="w-full h-full rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Game'; }} />
            ) : (
              <Gamepad2 className="w-5 h-5 text-[#4fd68a]" />
            )}
          </div>
          <div>
            <div className="font-semibold text-[#071a0d]">{game.title}</div>
            <div className="text-xs text-[#6a9975] truncate max-w-50">{game.url}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${getCategoryColor(game.category)}`}>
          {game.category}
        </span>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <Star className="w-3.5 h-3.5 text-[#c8a84b]" />
          <span className="text-sm font-semibold text-[#071a0d]">{(Number(game.rating) || 0).toFixed(1)}</span>
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-[#6a9975]" />
          <span className="text-sm font-semibold text-[#071a0d]">{formatPlays(game.plays)}</span>
        </div>
      </td>
      <td className="p-4 text-center">
        <button
          onClick={() => onToggleStatus(game.id, game.is_active)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
            game.is_active 
              ? "bg-green-100 text-green-600 hover:bg-green-200" 
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {game.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {game.is_active ? "Active" : "Disabled"}
        </button>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(game)}
            className="p-1.5 text-[#6a9975] hover:text-[#22b864] hover:bg-[#e6faf0] rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-emerald-600" />
          </button>
          <button
            onClick={() => onDelete(game.id)}
            className="p-1.5 text-[#6a9975] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const service:CoreService = new CoreService();


const AdminGameManagement: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [unreadCount] = useState(2);
  
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deleteConfirmGame, setDeleteConfirmGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [admin, setAdmin] = useState<Partial<Exco>>({});

  const fetchAdmin = () => {
    const admin = sessionStorage.getItem('admin');
    if(admin){
        setAdmin(JSON.parse(admin));
    }
  }
  // Load games
  const fetchGames = async () => {
    setLoading(true);
    try{
        const res = await service.get('games/find-all-games');
        if(res.success){
            setGames(res.data);
            setLoading(false);
        }else{
            showToast(res.message,'error');
        }
    }catch(e:any){
        showToast(e.message,'error');
    }finally{
        setLoading(false);
    }
  };

  // Add game
  const handleAddGame = async (gameData: Partial<Game>) => {
    setIsSubmitting(true);
    const newGame: Partial<Game> = {
        title: gameData.title || "",
        description: gameData.description || "",
        url: gameData.url || "",
        category: gameData.category || "Action",
        thumbnail: gameData.thumbnail || "",
        plays: 0,
        rating: 0,
        is_active: true,
        multiplayer: gameData.multiplayer || false,
        estimated_time: gameData.estimated_time || "15-30 min",
        created_by: admin.name,
      };
    
      try{
        const res = await service.send('games/create-game', newGame);
        if(res.success){
            setGames(prev => [res.data, ...prev]);
            showToast(`${newGame.title} added successfully!`, "success");
            setIsSubmitting(false);
        }else{
            showToast(res.message,'error');
        }
      }catch(e:any){
        showToast(e.message,'error');
      }finally{
        setIsSubmitting(false);
      }
  };

  // Update game
  const handleUpdateGame = async (id: string, updates: Partial<Game>) => {
    setIsSubmitting(true);
    try{
        const res = await service.patch(`games/update-game/${id}`,updates);
        if(res.success){
            setGames(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
            showToast("Game updated successfully!", "success");
            setEditingGame(null);
            setIsSubmitting(false);
        }else{
            showToast(res.message,'error');
            setIsSubmitting(false);
        }
    }catch(e:any){
        showToast(e,'error');
    }finally{
        setIsSubmitting(false);
    }
  };

  // Delete game
  const handleDeleteGame = async () => {
    if (!deleteConfirmGame) return;
    setLoading(true);
    try{
        const res = await service.delete(`games/delete-game/${deleteConfirmGame.id}`);
        if(res.success){
            setGames(prev => prev.filter(g => g.id !== deleteConfirmGame.id));
            showToast(`${deleteConfirmGame.title} deleted successfully!`, "success");
            setDeleteConfirmGame(null);
            setLoading(false);
        }else{
            showToast(res.message,'error')
        }
    }catch(e:any){
        showToast(e.message,'error');
    }finally{
        setIsSubmitting(false);
    }
  };

  // Toggle game status
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await service.patch(`games/update-game/${id}`, { is_active: !currentStatus });
      if (res.success) {
        setGames(prev => prev.map(g => 
          g.id === id ? { ...g, is_active: !currentStatus } : g
        ));
        showToast(`Game ${!currentStatus ? "enabled" : "disabled"} successfully!`, "success");
      } else {
        showToast(res.message, 'error');
      }
    } catch (e: any) {
      showToast(e.message || "Failed to update status", 'error');
    }
  };

  // Calculate statistics
  const stats = useMemo((): GameStats => {
    const activeGames = games.filter(g => g.is_active);
    const totalPlays = games.reduce((sum, g) => sum + g.plays, 0);
    const avgRating = games.reduce((sum, g) => sum + g.rating, 0) / (games.length || 1);
    
    const gamesByCategory: Record<string, number> = {};
    games.forEach(g => {
      gamesByCategory[g.category] = (gamesByCategory[g.category] || 0) + 1;
    });
    
    const mostPlayedGame = games.reduce((max, g) => g.plays > max.plays ? g : max, games[0] || null);
    const topRatedGame = games.reduce((max, g) => g.rating > max.rating ? g : max, games[0] || null);
    
    return {
      totalGames: games.length,
      activeGames: activeGames.length,
      totalPlays,
      averageRating: avgRating,
      mostPlayedGame,
      topRatedGame,
      gamesByCategory,
    };
  }, [games]);

  // Filter games
  const filteredGames = useMemo(() => {
    let filtered = games.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || game.category === selectedCategory)
    );
    
    if (statusFilter === "active") {
      filtered = filtered.filter(g => g.is_active);
    } else if (statusFilter === "disabled") {
      filtered = filtered.filter(g => !g.is_active);
    }
    
    return filtered;
  }, [games, searchQuery, selectedCategory, statusFilter]);

  const categories = ["All", ...new Set(games.map(g => g.category))];

  useEffect(() => {
    fetchGames();
    fetchAdmin();
  }, []);

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <AdminHeader title="Game Management" unreadCount={unreadCount} />

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Games"
          value={stats.totalGames}
          icon={<Gamepad2 className="w-4 h-4" />}
          color="green"
        />
        <StatsCard
          title="Active Games"
          value={stats.activeGames}
          icon={<CheckCircle className="w-4 h-4" />}
          color="green"
        />
        <StatsCard
          title="Total Plays"
          value={stats.totalPlays}
          icon={<TrendingUp className="w-4 h-4" />}
          color="blue"
        />
        <StatsCard
          title="Avg Rating"
          value={stats.averageRating.toFixed(1)}
          icon={<Star className="w-4 h-4" />}
          color="yellow"
        />
        <StatsCard
          title="Most Played"
          value={stats.mostPlayedGame?.title || "—"}
          icon={<Award className="w-4 h-4" />}
          color="purple"
        />
        <StatsCard
          title="Categories"
          value={Object.keys(stats.gamesByCategory).length}
          icon={<Filter className="w-4 h-4" />}
          color="orange"
        />
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-[#d8eedd] rounded-2xl p-5">
        <h3 className="text-sm font-bold text-[#071a0d] mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          Games by Category
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.gamesByCategory).map(([category, count]) => (
            <div key={category} className="flex items-center gap-2 px-3 py-1.5 bg-[#f2fbf6] rounded-full">
              <span className="text-xs font-semibold text-[#071a0d]">{category}</span>
              <span className="text-xs font-bold text-[#22b864] bg-white px-2 py-0.5 rounded-full">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6a9975]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="pl-9 pr-4 py-2 border border-emerald-100 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-emerald-100 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-emerald-100 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
          <button
            onClick={fetchGames}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-2 border border-emerald-100 rounded-xl text-sm hover:bg-emerald-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <button
          onClick={() => {
            setEditingGame(null);
            setIsFormModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Game
        </button>
      </div>

      {/* Games Table */}
      <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-emerald-50 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-emerald-600 font-medium">Loading games...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-[#e6faf0] rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-10 h-10 text-[#6a9975]" />
            </div>
            <h3 className="text-lg font-bold text-[#071a0d] mb-2">No games found</h3>
            <p className="text-[#6a9975] mb-4">Try adjusting your filters or add a new game</p>
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="px-4 py-2 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl"
            >
              Add Your First Game
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50/50 border-b border-emerald-100">
                <tr>
                  <th className="text-left p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Game</th>
                  <th className="text-left p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Category</th>
                  <th className="text-center p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Rating</th>
                  <th className="text-center p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Plays</th>
                  <th className="text-center p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Status</th>
                  <th className="text-center p-4 text-xs font-bold text-[#6a9975] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => (
                  <GameTableRow
                    key={game.id}
                    game={game}
                    onEdit={(g) => {
                      setEditingGame(g);
                      setIsFormModalOpen(true);
                    }}
                    onDelete={(id) => {
                      const gameToDelete = games.find(g => g.id === id);
                      if (gameToDelete) setDeleteConfirmGame(gameToDelete);
                    }}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] rounded-2xl p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Info className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-white">Admin Note</span>
        </div>
        <p className="text-xs text-slate-300">
          All games added here will be visible to students in the Game Hub. You can enable/disable games anytime to moderate content.
        </p>
      </div>

      {/* Modals */}
      <GameFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGame(null);
        }}
        onSave={async (data) => {
          if (editingGame) {
            await handleUpdateGame(editingGame.id, data);
          } else {
            await handleAddGame(data);
          }
        }}
        editingGame={editingGame}
        isLoading={isSubmitting}
      />
      
      <ConfirmModal
        isOpen={!!deleteConfirmGame}
        onClose={() => setDeleteConfirmGame(null)}
        onConfirm={handleDeleteGame}
        title="Delete Game"
        message={`Are you sure you want to delete "${deleteConfirmGame?.title}"? This action cannot be undone.`}
        confirmText="Delete Game"
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`rounded-full px-5 py-3 shadow-lg flex items-center gap-2 text-sm font-medium border border-white/10 text-white ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414]'
          }`}>
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              {toast.type === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            </div>
            {toast.message}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminGameManagement;
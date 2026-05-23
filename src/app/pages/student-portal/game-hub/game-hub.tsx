"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Gamepad2, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  ExternalLink,
  Play,
  Clock,
  Users,
  Star,
  TrendingUp,
  Search,
  Filter,
  ChevronDown,
  Globe,
  Award,
  Sparkles,
  Rocket,
  RefreshCw,
  AlertCircle,
  Bell
} from "lucide-react";
import { useStudent } from "../layout";
import CoreService from "@/app/hooks/core-service";

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

// ============================================================================
// STUDENT HEADER COMPONENT
// ============================================================================

const StudentHeader: React.FC<{ title: string; unreadCount: number }> = ({ title, unreadCount }) => {
  const [currentDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-[#071a0d] tracking-tight">{title}</h1>
        <p className="text-sm text-[#6a9975] mt-1 flex items-center gap-2">
          <i className="fas fa-calendar-alt text-xs"></i>
          <span>{currentDate}</span>
          <span className="w-1 h-1 rounded-full bg-[#22b864]"></span>
          <span>Take a break, you've earned it!</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-white border border-[rgba(15,110,63,0.12)] flex items-center justify-center text-[#1e3d27] cursor-pointer hover:bg-[#e6faf0] transition-all shadow-sm">
            <Bell className="w-4 h-4" />
          </div>
        
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#22b864] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
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
// ADD/EDIT GAME MODAL
// ============================================================================

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (game: Omit<Game, 'id' | 'plays' | 'rating' | 'created_at'>) => Promise<void>;
  editingGame?: Game | null;
  onEdit?: (id: string, game: Partial<Game>) => Promise<void>;
  isLoading?: boolean;
}

const AddGameModal: React.FC<AddGameModalProps> = ({ isOpen, onClose, onAdd, editingGame, onEdit, isLoading }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Action");
  const [thumbnail, setThumbnail] = useState("");
  const [multiplayer, setMultiplayer] = useState(false);
  const [estimated_time, setestimated_time] = useState("15-30 min");

  const categories = ["Action", "Puzzle", "Strategy", "Arcade", "Multiplayer", "Educational", "Casual", "Racing", "Sports"];

  useEffect(() => {
    if (editingGame) {
      setTitle(editingGame.title);
      setDescription(editingGame.description || "");
      setUrl(editingGame.url);
      setCategory(editingGame.category);
      setThumbnail(editingGame.thumbnail || "");
      setMultiplayer(editingGame.multiplayer);
      setestimated_time(editingGame.estimated_time);
    } else {
      resetForm();
    }
  }, [editingGame, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setCategory("Action");
    setThumbnail("");
    setMultiplayer(false);
    setestimated_time("15-30 min");
  };

  const handleSubmit = async () => {
    if (!title || !url) return;
    
    if (editingGame && onEdit) {
      await onEdit(editingGame.id, {
        title,
        description,
        url,
        category,
        thumbnail,
        multiplayer,
        estimated_time,
      is_active: true,
      });
    } else {
      await onAdd({
        title,
        description,
        url,
        category,
        thumbnail,
        multiplayer,
        estimated_time,
      is_active: true,
      });
    }
    onClose();
    resetForm();
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Among Us, Chess, Sudoku"
              className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the game..."
              rows={3}
              className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Game URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/game"
              className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#071a0d] mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
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
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full p-3 border border-[#d8eedd] rounded-xl focus:outline-none focus:border-[#22b864]"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={multiplayer}
                onChange={(e) => setMultiplayer(e.target.checked)}
                className="w-4 h-4 accent-[#22b864]"
              />
              <span className="text-sm text-[#071a0d]">Multiplayer</span>
            </label>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#071a0d] mb-1">Est. Play Time</label>
              <select
                value={estimated_time}
                onChange={(e) => setestimated_time(e.target.value)}
                className="w-full p-2 border border-[#d8eedd] rounded-lg text-sm"
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
            disabled={!title || !url || isLoading}
            className="w-full py-3 bg-[#0f6e3f] text-white rounded-xl font-semibold hover:bg-[#22b864] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : (editingGame ? "Save Changes" : "Add Game")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// GAME CARD COMPONENT
// ============================================================================

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  showControls?: boolean;
}

const formatPlays = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const GameCard: React.FC<GameCardProps> = ({ game, onPlay, onEdit, onDelete, showControls = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Action: "bg-red-100 text-red-600 border-red-200",
      Puzzle: "bg-purple-100 text-purple-600 border-purple-200",
      Strategy: "bg-blue-100 text-blue-600 border-blue-200",
      Arcade: "bg-yellow-100 text-yellow-600 border-yellow-200",
      Multiplayer: "bg-green-100 text-green-600 border-green-200",
      Educational: "bg-teal-100 text-teal-600 border-teal-200",
      Casual: "bg-pink-100 text-pink-600 border-pink-200",
      Racing: "bg-orange-100 text-orange-600 border-orange-200",
      Sports: "bg-indigo-100 text-indigo-600 border-indigo-200",
    };
    return colors[category] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <div 
      className="group bg-white border border-[#d8eedd] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail / Game Preview Area */}
      <div className="relative h-40 bg-linear-to-br from-[#0a4a20] to-[#0f6e3f] flex items-center justify-center overflow-hidden">
        {game.thumbnail ? (
          <img 
            src={game.thumbnail} 
            alt={game.title} 
            className="w-full h-full object-cover" 
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Game+Preview'; }}
          />
        ) : (
          <div className="text-center">
            <Gamepad2 className="w-16 h-16 text-[#4fd68a] opacity-50 mx-auto mb-2" />
            <span className="text-white/40 text-xs">No preview</span>
          </div>
        )}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <button
              onClick={() => onPlay(game)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#22b864] text-white rounded-full font-bold text-sm hover:bg-[#4fd68a] transition-all transform scale-100 hover:scale-105"
            >
              <Play className="w-4 h-4" />
              Play Now
            </button>
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-[#071a0d] text-base truncate">{game.title}</h3>
            <p className="text-xs text-[#6a9975] mt-0.5 line-clamp-2">{game.description || "No description"}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ml-2 shrink-0 ${getCategoryColor(game.category)}`}>
            {game.category}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#6a9975] mt-3">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{game.multiplayer ? "Multiplayer" : "Single Player"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{game.estimated_time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#c8a84b]" />
            <span>{(Number(game.rating) || 0).toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#d8eedd]">
          <div className="flex items-center gap-1 text-[10px] text-[#6a9975]">
            <TrendingUp className="w-3 h-3" />
            <span>
              {formatPlays(game.plays)} plays
            </span>
          </div>
          {showControls && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(game)}
                className="p-1.5 text-[#6a9975] hover:text-[#22b864] hover:bg-[#e6faf0] rounded-lg transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(game.id)}
                className="p-1.5 text-[#6a9975] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// GAME PLAY MODAL (IFRAME)
// ============================================================================

const service: CoreService = new CoreService();



const GameHub: React.FC = () => {
  const { unreadCount = 2, showToast } = useStudent();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"plays" | "rating" | "newest">("plays");
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Handle Play Action
  const handlePlay = (game: Game) => {
    showToast(`Launching ${game.title}...`, "info");
    handlePlayCount(game.id);
    // Open game in a new tab instead of framing
    window.open(game.url, '_blank', 'noopener,noreferrer');
  };

  // Fetch games from API
  const fetchGames = async () => {
    setLoading(true);
    try{
      const res = await service.get('games/find-all-games');
      if(res.success){
        setGames(res.data);
        setLoading(false);
      }else{
        showToast("Error fetching games", "error");
        setLoading(false);
      }
    }catch(e){
      showToast("Error fetching games", "error");
    }finally{
      setLoading(false);
    }
  };

  // Add new game
  const handleAddGame = async (newGame: Omit<Game, 'id' | 'plays' | 'rating' | 'created_at'>) => {
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      const game: Game = {
        ...newGame,
        id: Date.now().toString(),
        plays: 0,
        rating: 0,
        created_at: new Date().toISOString(),
      };
      setGames(prev => [game, ...prev]);
      showToast(`${game.title} added successfully!`, "success");
      setIsSubmitting(false);
    }, 600);
  };

  // Edit game
  const handleEditGame = async (id: string, updates: Partial<Game>) => {
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setGames(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
      showToast("Game updated successfully!", "success");
      setEditingGame(null);
      setIsSubmitting(false);
    }, 600);
  };

  // Delete game
  const handleDeleteGame = async (id: string) => {
    const gameToDelete = games.find(g => g.id === id);
    if (!confirm(`Are you sure you want to delete "${gameToDelete?.title}"?`)) return;

    // Simulate API delay
    setLoading(true);
    setTimeout(() => {
      setGames(prev => prev.filter(g => g.id !== id));
      showToast("Game removed successfully!", "success");
      setLoading(false);
    }, 500);
  };

  // Increment play count when game is played
  const handlePlayCount = async (id: string) => {
    try {
      const res = await service.patch(`games/update-plays/${id}`, {});
      if (res.success) {
        setGames(prev => prev.map(g => 
          g.id === id ? { ...g, plays: g.plays + 1 } : g
        ));
      }
    } catch (e) {
      console.error("Failed to update play count", e);
    }
  };

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = games.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || game.category === selectedCategory)
    );

    filtered.sort((a, b) => {
      if (sortBy === "plays") return b.plays - a.plays;
      if (sortBy === "rating") return b.rating - a.rating;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return filtered;
  }, [games, searchQuery, selectedCategory, sortBy]);

  // Load games on mount
  useEffect(() => {
    fetchGames();
  }, []);

  const categories = ["All", ...new Set(games.map(g => g.category))];
  const totalPlays = games.reduce((sum, g) => sum + g.plays, 0);
  const mostPlayed = games.reduce((max, g) => g.plays > max.plays ? g : max, games[0]);

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <StudentHeader title="Game Hub" unreadCount={unreadCount} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#d8eedd] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase text-[#6a9975]">Total Games</div>
              <div className="text-2xl font-bold text-[#071a0d] font-serif mt-1">{games.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-[#22b864]" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase text-[#6a9975]">Total Plays</div>
              <div className="text-2xl font-bold text-[#071a0d] font-serif mt-1">{formatPlays(totalPlays)}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#22b864]" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase text-[#6a9975]">Most Played</div>
              <div className="text-sm font-bold text-[#071a0d] mt-1 truncate">{mostPlayed?.title || "—"}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center">
              <Award className="w-4 h-4 text-[#c8a84b]" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#d8eedd] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase text-[#6a9975]">Avg Rating</div>
              <div className="text-2xl font-bold text-[#071a0d] font-serif mt-1">
                {(games.length > 0 ? games.reduce((sum, g) => sum + (Number(g.rating) || 0), 0) / games.length : 0).toFixed(1)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6faf0] flex items-center justify-center">
              <Star className="w-4 h-4 text-[#c8a84b]" />
            </div>
          </div>
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
              className="pl-9 pr-4 py-2 border border-[#d8eedd] rounded-xl text-sm w-64 focus:outline-none focus:border-[#22b864]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-[#d8eedd] rounded-xl text-sm bg-white focus:outline-none focus:border-[#22b864]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-[#d8eedd] rounded-xl text-sm bg-white focus:outline-none focus:border-[#22b864]"
          >
            <option value="plays">Most Played</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
          <button
            onClick={fetchGames}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-2 border border-[#d8eedd] rounded-xl text-sm hover:bg-[#f2fbf6] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="bg-white border border-[#d8eedd] rounded-3xl p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#e6faf0] border-t-[#22b864] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6a9975]">Loading games...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="bg-white border border-[#d8eedd] rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-[#e6faf0] rounded-full flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-10 h-10 text-[#6a9975]" />
          </div>
          <h3 className="text-lg font-bold text-[#071a0d] mb-2">No games found</h3>
          <p className="text-[#6a9975] mb-4">Try adjusting your search or add a new game</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#0f6e3f] text-white rounded-xl"
          >
            Add Your First Game
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game, idx) => (
            <div 
              key={game.id} 
              style={{ 
                animationName: 'fadeUp',
                animationDuration: '400ms',
                animationTimingFunction: 'ease-out',
                animationDelay: `${idx * 0.05}s` 
              }}
            >
              <GameCard
                game={game}
                onPlay={handlePlay}
                onEdit={(g) => setEditingGame(g)}
                onDelete={handleDeleteGame}
                showControls={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Motivational Footer */}
      <div className="bg-linear-to-r from-[#0a4a20] to-[#0f6e3f] rounded-2xl p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#4fd68a]" />
          <span className="text-sm font-bold text-white">Take a well-deserved break!</span>
        </div>
        <p className="text-xs text-[#88e8b0]">
          Short gaming breaks can boost productivity and reduce stress. Just remember to balance play with study! 🎮
        </p>
      </div>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddGame}
        editingGame={editingGame}
        onEdit={handleEditGame}
        isLoading={isSubmitting}
      />

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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

export default GameHub;
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ShoppingBag, ShoppingCart, Book, Shirt, Database, Layout, Bell, Search, Package, User, Phone, Trash2, CreditCard, ArrowRight, X, LayoutGrid, List } from "lucide-react";
import { useStudent } from "../layout";
import CoreService from "@/app/hooks/core-service";

// ============================================================================
// API INTEGRATION AND INTERFACES (COMMENTED OUT UNTIL BACKEND IS READY)
// ============================================================================
interface MerchItem {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sellerName: string;
  sellerPhone: string;
  image?: string;
  createdAt: string;
}

interface CartItem extends MerchItem {
  quantity: number;
}

// ============================================================================

// Custom StudentHeader component matching NacosHub aesthetic
const StudentHeader: React.FC<{ title: string; unreadCount: number; onSearch: (q: string) => void }> = React.memo(({ title, unreadCount, onSearch }) => {
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
          <span>Active session</span>
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
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search merch, resources..." 
            className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
          />
        </div>
      </div>
    </div>
  );
});

const coreService = new CoreService();

const MerchResources: React.FC = () => {
  const { unreadCount = 2, showToast, addToCart, cartCount } = useStudent();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchMerchList = useCallback(async (isInitial = true) => {
    if (isInitial) setLoading(true);
    try {
      const response = await coreService.get("marketplace/find-all-products");
      if (response.success && Array.isArray(response.data)) {
        setMerchItems(response.data);
      }
    } catch (error) {
      console.error("Failed to load merchandise list:", error);
      showToast("Failed to load products", "error");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [showToast, merchItems.length]);

  useEffect(() => {
    if (merchItems.length === 0) fetchMerchList();
  }, [fetchMerchList, merchItems.length]);

  const handleAddToCart = (item: MerchItem) => {
    setLoadingItemId(item.id.toString());
    setTimeout(() => {
      // Only allow one product at a time in the cart
      setCart([{ ...item, quantity: 1 }]);
      setLoadingItemId(null);
      setShowCart(true);
    }, 400);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      return prev.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handlePurchase = async () => {
    const studentData = sessionStorage.getItem('student');
    if (!studentData) return showToast("Please login to continue", "error");
    const student = JSON.parse(studentData);

    setIsCheckingOut(true);
    try {
      const res = await coreService.send(`marketplace/pay/${cart[0].id}`, {
        email: student.email,
        amount: cartTotal.toString()
      });
      if (res.success) {
        window.location.href = res.data.link;
      }
    } catch (error) {
      showToast("Payment initialization failed", "error");
    } finally {
      setIsCheckingOut(false);
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const localCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getIconForProduct = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('shirt') || lower.includes('hoodie') || lower.includes('wear')) return Shirt;
    if (lower.includes('book') || lower.includes('note')) return Book;
    if (lower.includes('template') || lower.includes('design')) return Layout;
    if (lower.includes('data') || lower.includes('vault')) return Database;
    return Package;
  }

  const filteredItems = merchItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <StudentHeader title="Merch & Resources" unreadCount={unreadCount} onSearch={setSearchQuery} />

      {/* Main card container */}
      <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden w-full flex flex-col">
        
        {/* Card Header details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#071a0d] font-serif">
              Merch & Resources
            </h3>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#f2fbf6] p-1 rounded-xl border border-[#d8eedd]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-white text-[#22b864] shadow-sm" : "text-[#6a9975]"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "list" ? "bg-white text-[#22b864] shadow-sm" : "text-[#6a9975]"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 bg-[#f2fbf6] rounded-xl border border-[#d8eedd] text-[#0f6e3f] hover:bg-[#e6faf0] transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {localCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#22b864] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {localCartCount}
                </span>
              )}
            </button>
          <div className="flex items-center gap-2 bg-[#f2fbf6] px-3 py-1.5 rounded-full border border-[#d8eedd]">
            <span className="w-2 h-2 rounded-full bg-[#22b864] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#3a6645] uppercase tracking-wider">Official Store Catalog</span>
          </div>
          </div>
        </div>

        {/* Merch grid items */}
        <div className="p-5 md:p-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#e6faf0] border-t-[#22b864] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#6a9975] font-medium">Loading marketplace...</p>
            </div>
          ) : (
          viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 w-full">
            {filteredItems.map((item, idx) => {
              const ItemIcon = getIconForProduct(item.name);
              const isLoading = loadingItemId === item.id.toString();

              return (
                <div
                  key={item.id}
                  className="group bg-white border border-[#d8eedd] rounded-2xl p-4 flex flex-col justify-between hover:border-[#88e8b0] hover:shadow-md transition-all duration-300 relative overflow-hidden h-full"
                  style={{ animationDelay: `${idx * 0.02}s`, animation: 'fadeUp 0.4s ease both' }}
                >
                  {/* Decorative background element */}
                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#22b864]/5 rounded-full blur-xl group-hover:bg-[#22b864]/10 transition-colors"></div>

                  {/* Top Item details */}
                  <div>
                    <div className="flex flex-col gap-4">
                      {item.image ? (
                        <div className="w-full h-48 rounded-xl overflow-hidden border border-[#d8eedd] shadow-sm group-hover:shadow-md transition-all duration-300">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                      <div className="w-full h-48 rounded-xl bg-linear-to-br from-[#e6faf0] to-[#c0f4d5] border border-[#d8eedd] flex items-center justify-center text-[#0f6e3f] shadow-sm">
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between mt-4">
                      <h4 className="text-sm font-bold text-[#071a0d] font-sans leading-tight group-hover:text-[#0f6e3f] transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tight border shadow-sm bg-[#e6faf0] text-[#0f6e3f] border-[#c0f4d5] whitespace-nowrap ml-2`}>
                        {item.stock} left
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-[#6a9975] mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-xs font-bold text-[#22b864]">₦</span>
                      <span className="text-xl font-black text-[#071a0d] font-serif tracking-tight">
                        {item.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#f2fbf6] flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] text-[#6a9975]">
                        <User className="w-3 h-3" />
                        <span className="font-medium">{item.sellerName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isLoading}
                    className={`mt-4 w-full py-2.5 bg-linear-to-r from-[#0a4a20] to-[#0f6e3f] text-[#e6faf0] hover:from-[#0f6e3f] hover:to-[#169150] text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                      isLoading ? "opacity-75 cursor-wait active:scale-100" : "hover:shadow-md"
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-[#88e8b0] border-t-[#22b864] rounded-full animate-spin" />
                    ) : (
                      <ShoppingCart className="w-3.5 h-3.5" />
                    )}
                    <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
                  </button>
                </div>
              );
            })}
          </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {filteredItems.map((item, idx) => {
                const ItemIcon = getIconForProduct(item.name);
                const isLoading = loadingItemId === item.id.toString();

                return (
                  <div
                    key={item.id}
                    className="group bg-white border border-[#d8eedd] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between hover:border-[#88e8b0] hover:shadow-md transition-all duration-300"
                    style={{ animationDelay: `${idx * 0.02}s`, animation: 'fadeUp 0.4s ease both' }}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {item.image ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#d8eedd] shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#e6faf0] flex items-center justify-center text-[#0f6e3f] shrink-0">
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      )}
                      <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-[#071a0d] group-hover:text-[#0f6e3f] transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#6a9975] line-clamp-1">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-[#22b864]">₦{item.price.toLocaleString()}</span>
                          <span className="text-[10px] text-[#6a9975]">• {item.stock} in stock</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
                      <div className="hidden md:flex items-center gap-2 text-[10px] text-[#6a9975] mr-4">
                        <User className="w-3 h-3" />
                        <span>{item.sellerName}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={isLoading}
                        className={`flex-1 sm:flex-none px-6 py-2.5 bg-linear-to-r from-[#0a4a20] to-[#0f6e3f] text-white text-xs font-bold rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2 ${
                          isLoading ? "opacity-75 cursor-wait" : ""
                        }`}
                      >
                        {isLoading ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <ShoppingCart className="w-3.5 h-3.5" />
                        )}
                        <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
          )}
        </div>

        {/* Footer note - matching nacos style */}
        <div className="border-t border-[#d8eedd] p-4 md:px-6 bg-[#f2fbf6]/30">
          <div className="flex items-center justify-between text-xs text-[#6a9975]">
            <div className="flex items-center gap-4">
              <span><i className="fas fa-truck mr-1"></i> Campus-wide delivery available</span>
              <span><i className="fas fa-credit-card mr-1"></i> Secure checkout</span>
            </div>
            <span className="font-mono text-[10px]">🛒 {localCartCount} items in cart · ₦{cartTotal.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Shopping Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="p-6 border-b border-[#d8eedd] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-[#0f6e3f]" />
                <h3 className="text-xl font-bold text-[#071a0d] font-serif">Your Cart</h3>
              </div>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-[#f2fbf6] rounded-full transition-colors">
                <X className="w-5 h-5 text-[#6a9975]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-[#f2fbf6] rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-[#6a9975]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#071a0d]">Your cart is empty</h4>
                  <p className="text-sm text-[#6a9975] mt-2">Looks like you haven't added any items yet.</p>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="mt-6 px-6 py-2.5 bg-[#0f6e3f] text-white rounded-xl text-sm font-bold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-16 h-16 rounded-xl bg-[#f2fbf6] border border-[#d8eedd] flex items-center justify-center shrink-0">
                        {React.createElement(getIconForProduct(item.name), { className: "w-6 h-6 text-[#0f6e3f]" })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#071a0d] truncate">{item.name}</h4>
                        <p className="text-xs text-[#6a9975] mt-0.5">₦{item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-[#d8eedd] rounded-lg bg-white">
                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-[#6a9975] hover:text-[#0f6e3f]">-</button>
                            <span className="px-2 text-xs font-bold text-[#071a0d]">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-[#6a9975] hover:text-[#0f6e3f]">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-bold text-red-500 hover:underline">Remove</button>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#071a0d]">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-[#d8eedd] bg-[#f2fbf6]/30">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-[#6a9975]">
                    <span>Subtotal</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6a9975]">
                    <span>Processing Fee</span>
                    <span>₦0</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#071a0d] pt-2 border-t border-[#d8eedd]">
                    <span>Total</span>
                    <span className="text-[#22b864]">₦{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={handlePurchase}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-linear-to-r from-[#0a4a20] to-[#0f6e3f] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CreditCard className="w-5 h-5" />
                  )}
                  <span>{isCheckingOut ? "Processing..." : "Complete Purchase"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div id="toast-root" className="fixed bottom-6 right-6 z-50"></div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default MerchResources;

const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const toastRoot = document.getElementById('toast-root');
  if (!toastRoot) return;
  
  const toast = document.createElement('div');
  toast.className = 'animate-fadeUp bg-[#042b12] text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 mb-3';
  toast.style.animation = 'fadeUp 0.25s ease both';
  const icon = type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info';
  toast.innerHTML = `
    <div class="w-6 h-6 rounded-full bg-[#0f6e3f] flex items-center justify-center text-[10px]">
      <i class="fas fa-${icon}"></i>
    </div>
    <span>${message}</span>
  `;
  
  toastRoot.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
};

"use client";

import React, { useState } from "react";
import { ShoppingBag, ShoppingCart, Book, Shirt, Database, Layout, Bell, Search } from "lucide-react";
import { useStudent } from "../layout";

// ============================================================================
// API INTEGRATION AND INTERFACES (COMMENTED OUT UNTIL BACKEND IS READY)
// ============================================================================
// import CoreService from "@/app/hooks/core-service";
//
// interface MerchItem {
//   id: string;
//   title: string;
//   price: number;
//   category: string;
//   iconType: "stationery" | "apparel" | "resource" | "template";
// }
// ============================================================================

// Custom StudentHeader component matching NacosHub aesthetic
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
            placeholder="Search merch, resources..." 
            className="bg-transparent border-none outline-none text-sm font-sans text-[#071a0d] placeholder:text-[#6a9975] w-36 sm:w-48"
          />
        </div>
      </div>
    </div>
  );
};

const MerchResources: React.FC = () => {
  const { unreadCount = 2, addToCart } = useStudent();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  // Fallback merch items state matching design.
  // DELETE / COMMENT these variables out once API fetching is enabled.
  const [merchItems] = useState([
    {
      id: "notebook",
      title: "Nacos Eco Notebook",
      price: 11.99,
      category: "Stationery",
      icon: Book,
      description: "Recycled paper, 120 pages",
    },
    {
      id: "hoodie",
      title: "Green & White Hoodie",
      price: 34.99,
      category: "Apparel",
      icon: Shirt,
      description: "Cotton blend, unisex fit",
    },
    {
      id: "past_questions",
      title: "Past Question Vault",
      price: 19.99,
      category: "All Levels",
      icon: Database,
      description: "2015-2025, all courses",
    },
    {
      id: "project_template",
      title: "Final Year Project Template",
      price: 9.99,
      category: "Template",
      icon: Layout,
      description: "LaTeX + Word formats",
    },
  ]);

  // ============================================================================
  // COMMENTED API CALL EXAMPLE: UNCOMMENT THIS BLOCK TO INTEGRATE YOUR BACKEND
  // ============================================================================
  // const [apiMerch, setApiMerch] = useState<MerchItem[]>([]);
  //
  // const fetchMerchList = async () => {
  //   const service = new CoreService();
  //   try {
  //     const response = await service.get("content/v1/merch/items");
  //     if (response.success && response.data) {
  //       // setApiMerch(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load merchandise list from API:", error);
  //   }
  // };
  //
  // const handleCheckoutApi = async (itemId: string, itemName: string, price: number) => {
  //   setLoadingItemId(itemId);
  //   const service = new CoreService();
  //   try {
  //     const response = await service.send("content/v1/merch/purchase", { itemId, qty: 1 });
  //     if (response.success) {
  //       addToCart(itemName, price); // Updates context cart count
  //     }
  //   } catch (error) {
  //     console.error("Merch purchase transaction failed:", error);
  //   } finally {
  //     setLoadingItemId(null);
  //   }
  // };
  // ============================================================================

  const handleAddToCart = (itemId: string, title: string, price: number) => {
    // If using API, swap this block with `handleCheckoutApi`.
    setLoadingItemId(itemId);
    
    // Simulate transaction delay
    setTimeout(() => {
      addToCart(title, price);
      setLoadingItemId(null);
    }, 450);
  };

  // Helper to get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Stationery: "bg-[#e6faf0] text-[#0f6e3f] border-[#c0f4d5]",
      Apparel: "bg-[#fef3e8] text-[#c8a84b] border-[#fde6d4]",
      "All Levels": "bg-[#e8eef5] text-[#3a6645] border-[#d8e2ed]",
      Template: "bg-[#f0e8fe] text-[#7c3aed] border-[#e2d5fc]",
    };
    return colors[category] || "bg-[#f2fbf6] text-[#3a6645] border-[#d8eedd]";
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <StudentHeader title="Merch & Resources" unreadCount={unreadCount} />

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
          
          <div className="flex items-center gap-2 bg-[#f2fbf6] px-3 py-1.5 rounded-full border border-[#d8eedd]">
            <span className="w-2 h-2 rounded-full bg-[#22b864] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#3a6645] uppercase tracking-wider">Official Store Catalog</span>
          </div>
        </div>

        {/* Merch grid items */}
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 w-full">
            {merchItems.map((item, idx) => {
              const ItemIcon = item.icon;
              const isLoading = loadingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="group bg-white border border-[#d8eedd] rounded-2xl p-5 flex flex-col justify-between hover:border-[#88e8b0] hover:shadow-md transition-all duration-300 relative overflow-hidden"
                  style={{ animationDelay: `${idx * 0.05}s`, animation: 'fadeUp 0.4s ease both' }}
                >
                  {/* Decorative background element */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#22b864]/5 rounded-full blur-xl group-hover:bg-[#22b864]/10 transition-colors"></div>

                  {/* Top Item details */}
                  <div>
                    <div className="flex items-start justify-between">
                      {/* Item Icon container */}
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#e6faf0] to-[#c0f4d5] border border-[#88e8b0] flex items-center justify-center text-[#0f6e3f] shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <ItemIcon className="w-5 h-5" />
                      </div>

                      {/* Category tag badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight border shadow-sm ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#071a0d] font-sans mt-4 leading-tight group-hover:text-[#0f6e3f] transition-colors">
                      {item.title}
                    </h4>
                    
                    <p className="text-xs text-[#6a9975] mt-1 line-clamp-1">
                      {item.description}
                    </p>
                    
                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-xs font-bold text-[#22b864]">$</span>
                      <span className="text-2xl font-black text-[#071a0d] font-serif tracking-tight">
                        {item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleAddToCart(item.id, item.title, item.price)}
                    disabled={isLoading}
                    className={`mt-5 w-full py-3 bg-linear-to-r from-[#0a4a20] to-[#0f6e3f] text-[#e6faf0] hover:from-[#0f6e3f] hover:to-[#169150] text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
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
        </div>

        {/* Footer note - matching nacos style */}
        <div className="border-t border-[#d8eedd] p-4 md:px-6 bg-[#f2fbf6]/30">
          <div className="flex items-center justify-between text-xs text-[#6a9975]">
            <div className="flex items-center gap-4">
              <span><i className="fas fa-truck mr-1"></i> Free shipping on orders $50+</span>
              <span><i className="fas fa-credit-card mr-1"></i> Secure checkout</span>
            </div>
            <span className="font-mono text-[10px]">🛒 2 items in cart · $46.98</span>
          </div>
        </div>

      </div>

      {/* Toast container */}
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

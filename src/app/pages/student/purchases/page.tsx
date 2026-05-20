"use client";

import React, { useState } from "react";
import StudentHeader from "../components/StudentHeader";
import { ShoppingBag, ShoppingCart, Book, Shirt, Database, Layout } from "lucide-react";
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

export default function MerchResources() {
  const { unreadCount, addToCart } = useStudent();
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
    },
    {
      id: "hoodie",
      title: "Green & White Hoodie",
      price: 34.99,
      category: "Apparel",
      icon: Shirt,
    },
    {
      id: "past_questions",
      title: "Past Question Vault",
      price: 19.99,
      category: "All Levels",
      icon: Database,
    },
    {
      id: "project_template",
      title: "Final Year Project Template",
      price: 9.99,
      category: "Template",
      icon: Layout,
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

  return (
    <div className="flex flex-col gap-6 md:gap-8 flex-1 pb-10">
      {/* Header Panel */}
      <StudentHeader title="Merch & Resources" unreadCount={unreadCount} />

      {/* Main card container */}
      <div className="bg-white border border-[#d8eedd] rounded-3xl shadow-sm overflow-hidden w-full flex flex-col select-none">
        
        {/* Card Header details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8eedd] p-5 md:px-6 gap-3 select-none">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#2dba4e]" />
            <h3 className="text-lg font-bold text-[#0d1b0f] font-sans">
              Merch & Resources
            </h3>
          </div>
          
          <span className="text-xs font-semibold text-[#3d5a45]/60 font-sans uppercase tracking-wider">
            Official Store Catalog
          </span>
        </div>

        {/* Merch grid items */}
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full">
            {merchItems.map((item) => {
              const ItemIcon = item.icon;
              const isLoading = loadingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-[#f5f9f6]/30 border border-[#d8eedd]/80 rounded-3xl p-5 flex flex-col justify-between hover:bg-[#e8f5ed]/20 hover:border-[#2dba4e]/30 hover:shadow-md transition-all h-[220px]"
                >
                  {/* Top Item details */}
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between">
                      {/* Item Icon container */}
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#2dba4e] shrink-0 shadow-sm">
                        <ItemIcon className="w-5 h-5" />
                      </div>

                      {/* Category tag badge */}
                      <span className="text-[9px] font-extrabold text-[#3d5a45] bg-[#e8f5ed] border border-[#d8eedd] px-2.5 py-1 rounded-full uppercase">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#0d1b0f] font-sans mt-4 truncate leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-base font-extrabold text-[#2dba4e] font-sans mt-1.5 leading-none">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleAddToCart(item.id, item.title, item.price)}
                    disabled={isLoading}
                    className={`w-full py-3 bg-[#0d2818] border border-emerald-950/20 text-[#3ef06e] hover:bg-[#091f12] text-xs font-extrabold rounded-2xl transition-all shadow-md select-none flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                      isLoading ? "opacity-75 cursor-wait select-none shadow-none active:scale-100" : ""
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-[#3ef06e]" />
                    <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

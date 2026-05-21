"use client";

import React from "react";

interface LoadingSkeletonProps {
  type?: "card" | "list" | "metrics" | "chart";
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = "card",
  count = 1,
}) => {
  const items = Array.from({ length: count });

  if (type === "metrics") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#d8eedd] rounded-3xl p-6 flex items-center justify-between animate-pulse shadow-sm h-27.5"
          >
            <div className="space-y-3 flex-1">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-5 bg-[#f5f9f6]/40 border border-[#d8eedd] rounded-2xl animate-pulse"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="bg-white border border-[#d8eedd] rounded-3xl p-6 animate-pulse w-full h-80 flex flex-col justify-between">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="flex items-end justify-around h-full gap-4">
          <div className="w-8 bg-gray-200 rounded-t h-[40%]"></div>
          <div className="w-8 bg-gray-200 rounded-t h-[80%]"></div>
          <div className="w-8 bg-gray-200 rounded-t h-[60%]"></div>
          <div className="w-8 bg-gray-200 rounded-t h-[90%]"></div>
        </div>
      </div>
    );
  }

  // Default "card" skeleton
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white border border-[#d8eedd] rounded-3xl p-6 space-y-4 animate-pulse shadow-sm h-45 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-2xl"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
            <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search courses, PDFs...",
}) => {
  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white text-gray-800 placeholder-gray-400 border border-[#d8eedd] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2dba4e]/30 focus:border-[#2dba4e] transition-all shadow-sm font-sans"
      />
    </div>
  );
};

export default SearchInput;

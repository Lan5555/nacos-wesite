"use client";

import React from "react";
import { LogOut } from "lucide-react";

export interface StudentProfile {
  name: string;
  level: string;
  department: string;
  matricNo: string;
  initials: string;
}

interface StudentProfileCardProps {
  profile?: StudentProfile;
}

const defaultProfile: StudentProfile = {
  name: "Chiamaka M.",
  level: "400 Level",
  department: "CS",
  matricNo: "NAC/CS/1234",
  initials: "CM",
};

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  profile = defaultProfile,
}) => {
  return (
    <div className="flex items-center gap-3.5 p-3.5 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl w-full select-none relative group/card">
      {/* Dynamic Circle Avatar Badge */}
      <div className="flex items-center justify-center w-11 h-11 bg-[#2dba4e]/90 text-white font-semibold rounded-full shadow-sm text-sm border border-emerald-800/40 select-none shrink-0">
        {profile.initials}
      </div>

      {/* Profile Details */}
      <div className="flex flex-col min-w-0 flex-1">
        <h4 className="text-white font-medium text-sm font-sans truncate tracking-wide">
          {profile.name}
        </h4>
        <p className="text-[#3ef06e] text-[11px] font-sans truncate tracking-wider mt-0.5">
          {profile.level} · {profile.department} · {profile.matricNo}
        </p>
      </div>

      {/* Sign Out Button */}
      <div className="relative group ml-auto">
        <button className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all duration-300">
          <LogOut className="w-4.5 h-4.5" />
        </button>
        {/* Tooltip */}
        <div className="absolute right-0 bottom-[calc(100%+8px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap bg-emerald-950/80 backdrop-blur-md border border-white/10 text-white/90 text-[11px] font-medium py-1.5 px-3 rounded-lg shadow-xl z-50">
          Sign Out
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;

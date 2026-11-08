import React from 'react';
import { Calendar, User } from 'lucide-react';

interface TopHeaderProps {
  onAvatarClick?: () => void;
  lastEditedTime?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ 
  onAvatarClick,
  lastEditedTime = 'Mon, Nov 10, 2025 • 10:24 AM'
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-2 px-1">
      {/* Welcome Title with Blue Vertical Accent */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-10 bg-[#1D6FEB] rounded-full" />
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Welcome, Admin!
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your supply orders in one place.
          </p>
        </div>
      </div>

      {/* Date & Time + Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Restored Session Tag */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Last Edited Session</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span>{lastEditedTime}</span>
        </div>

        <button
          onClick={onAvatarClick}
          className="w-10 h-10 rounded-full bg-[#1D6FEB] text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition shadow-md shadow-blue-500/20"
          title="Admin Profile"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

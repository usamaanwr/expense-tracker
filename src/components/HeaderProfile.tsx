'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Sparkles, UserCheck } from 'lucide-react';
import { supabase } from '@/lib/supbase';
export function HeaderProfile() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Current live formatted date
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    setCurrentDate(today.toLocaleDateString('en-US', options));

    // Supabase User Fetch
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    fetchUser();
  }, []);

  // Email se username nikalna (e.g. malik@gmail.com -> Malik)
  const username = userEmail 
    ? userEmail.split('@')[0].toUpperCase() 
    : 'USER';

  return (
    <header className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-xl transition-all">
      
      {/* Left Side: Profile & Greeting */}
      <div className="flex items-center gap-3.5">
        <div className="relative">
          {/* Avatar Icon / Initial */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-black font-bold text-base shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30">
            {username.charAt(0)}
          </div>
          {/* Online Indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse" />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Welcome back, <span className="text-emerald-400 capitalize">{username.toLowerCase()}</span>
            </h1>
            <Sparkles size={15} className="text-amber-400 hidden sm:inline-block" />
          </div>
          <p className="text-xs text-zinc-400 flex items-center gap-1.5">
            <UserCheck size={13} className="text-emerald-400" />
            <span>Account Active & Synced</span>
          </p>
        </div>
      </div>

      {/* Right Side: Date Badge & Notification Action */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-zinc-800/80 pt-3 sm:pt-0">
        
        {/* Date Display Card */}
        <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 shadow-inner">
          <Calendar size={14} className="text-emerald-400" />
          <span>{currentDate || 'Loading...'}</span>
        </div>

        {/* Quick Action Notification Button */}
        <button
          type="button"
          className="relative p-2.5 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 rounded-xl text-zinc-300 hover:text-white transition cursor-pointer"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full" />
        </button>

      </div>
    </header>
  );
}
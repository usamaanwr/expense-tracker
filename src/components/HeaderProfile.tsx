'use client';

import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
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
    ? userEmail.split('@')[0] 
    : 'User';

  const initial = username.charAt(0).toUpperCase();

  return (
    <header className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 sm:px-6 sm:py-4 flex items-center justify-between gap-4 backdrop-blur-xl shadow-2xl transition-all">
      
      {/* Left Side: Clean Profile Avatar & Greeting */}
      <div className="flex items-center gap-3.5">
        <div className="relative shrink-0">
          {/* High-Contrast Gradient Avatar */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-zinc-950 font-extrabold text-base shadow-lg shadow-emerald-500/10 border border-emerald-400/30">
            {initial}
          </div>
          {/* Subtle Sync Indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
        </div>

        <div className="space-y-0.5">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Welcome back, <span className="text-emerald-400 capitalize">{username}</span>
          </h1>
          <p className="text-[11px] text-zinc-400 font-mono truncate max-w-[180px] sm:max-w-none">
            {userEmail || 'Synced Account'}
          </p>
        </div>
      </div>

      {/* Right Side: Clean Date Badge Only */}
      <div className="flex items-center gap-2 bg-zinc-950/60 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 shadow-inner">
        <Calendar size={14} className="text-emerald-400 shrink-0" />
        <span className="font-mono text-[11px] sm:text-xs">{currentDate || 'Loading...'}</span>
      </div>

    </header>
  );
}
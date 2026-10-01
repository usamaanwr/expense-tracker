'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, History, PieChart, LogOut, Wallet, AlertTriangle, X } from 'lucide-react';
import { NavigationProps, TabType } from '@/types';
import { supabase } from '@/lib/supbase';

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  return (
    <>
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-zinc-900/60 backdrop-blur-2xl border-r border-zinc-800/80 p-6 h-screen sticky top-0 shrink-0 z-40">
        <div className="space-y-8">
          {/* App Brand Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/5">
              <Wallet size={22} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight leading-tight">
                ExpenseTrack
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
                Smart Budget
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-emerald-400 rounded-r-full shadow-glow" />
                  )}
                  <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-zinc-500'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* 2. Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/90 backdrop-blur-2xl border-t border-zinc-800/80 px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* 3. CLASSICAL LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative overflow-hidden">
            {/* Modal Glow Accent */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header & Icon */}
            <div className="flex items-start justify-between">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl">
                <AlertTriangle size={22} />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-zinc-500 hover:text-white transition p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Text Context */}
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white tracking-wide">
                Confirm Sign Out
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Are you sure you want to log out of your ExpenseTrack account? Your synced budget session will be ended.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoggingOut ? (
                  <span className="animate-pulse">Logging out...</span>
                ) : (
                  <>
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
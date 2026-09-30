'use client';

import { useRouter } from 'next/navigation';
import { LayoutDashboard, History, PieChart, LogOut, Wallet } from 'lucide-react';
import { NavigationProps } from '@/types';
import { supabase } from '@/lib/supbase';
export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const router = useRouter();

  // Clean Logout Handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  return (
    <>
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-zinc-900/80 border-r border-zinc-800 p-6 h-screen sticky top-0 shrink-0">
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
              <Wallet size={22} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">ExpenseTrack</h1>
              <p className="text-[10px] text-zinc-500">Smart Budget Manager</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* 2. Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition ${
                isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Mobile Logout Button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium text-rose-400 hover:text-rose-300 transition cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}
'use client';

import { Calendar, AlertCircle } from 'lucide-react';

interface DailyLimitProps {
  monthlyBudget: number;
  totalSpent: number;
}

export default function DailyLimit({ monthlyBudget, totalSpent }: DailyLimitProps) {
  const now = new Date();
  const currentDay = now.getDate();
  const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(totalDaysInMonth - currentDay + 1, 1);

  const remainingBudget = monthlyBudget - totalSpent;
  const safeDailyBudget = remainingBudget > 0 ? Math.floor(remainingBudget / remainingDays) : 0;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <Calendar size={18} />
        </div>
        <div>
          <p className="text-xs text-zinc-400 font-medium">Safe Daily Spending Limit</p>
          <h4 className="text-lg font-bold text-white">
            Rs {safeDailyBudget.toLocaleString()} <span className="text-xs font-normal text-zinc-500">/ day</span>
          </h4>
        </div>
      </div>

      <div className="text-right">
        <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-700/60">
          {remainingDays} Days Left
        </span>
      </div>
    </div>
  );
}
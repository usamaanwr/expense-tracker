'use client';

import { Calendar, AlertTriangle } from 'lucide-react';

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
  const isOverBudget = remainingBudget <= 0;

  return (
    <div className="h-full bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4 transition-all">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <Calendar size={18} />
        </div>

        <span
          className={`text-[11px] font-semibold font-mono px-3 py-1 rounded-xl border ${
            isOverBudget
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : "bg-zinc-950/80 text-zinc-300 border-zinc-800"
          }`}
        >
          {remainingDays} Days Remaining
        </span>
      </div>

      {/* Limit Value Display */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Safe Daily Spending Limit
        </p>
        
        <div className="flex items-baseline gap-1.5">
          <h4
            className={`text-2xl font-extrabold tracking-tight font-mono ${
              isOverBudget ? "text-rose-400" : "text-white"
            }`}
          >
            Rs {safeDailyBudget.toLocaleString()}
          </h4>
          <span className="text-xs font-medium text-zinc-500">/ day</span>
        </div>
      </div>

      {/* Micro Status / Warning Indicator */}
      <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-2">
        {isOverBudget ? (
          <>
            <AlertTriangle size={13} className="text-rose-400 shrink-0" />
            <p className="text-[11px] text-rose-400/90 font-medium truncate">
              Budget exhausted. No safe daily margin.
            </p>
          </>
        ) : (
          <p className="text-[11px] text-zinc-500 font-medium truncate">
            Based on current remaining monthly balance.
          </p>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { BudgetSummaryProps } from "@/types";
import {
  AlertTriangle,
  Edit3,
  Check,
  TrendingDown,
  Wallet,
  DollarSign,
} from "lucide-react";

export default function BudgetSummary({
  monthlyBudget,
  setMonthlyBudget,
  totalSpent,
}: BudgetSummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());

  // Calculations
  const remainingBalance = monthlyBudget - totalSpent;
  const spentPercentage =
    monthlyBudget > 0
      ? Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100)
      : 0;
  const isOverBudget = totalSpent > monthlyBudget && monthlyBudget > 0;

  const handleSaveBudget = () => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val >= 0) {
      setMonthlyBudget(val);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveBudget();
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Over-Budget Alert Banner */}
      {isOverBudget && (
        <div className="bg-rose-950/80 border border-rose-800/80 text-rose-200 px-5 py-3 rounded-2xl flex items-center justify-between shadow-xl animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-rose-400 shrink-0" size={20} />
            <div>
              <p className="text-xs font-bold text-rose-100">
                Over-Budget Alert!
              </p>
              <p className="text-[11px] text-rose-300">
                Exceeded limit by Rs {Math.abs(remainingBalance).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="h-full bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden space-y-6">
        
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Wallet size={16} className="text-emerald-400" />
            </div>
            <span>Monthly Budget Overview</span>
          </div>

          {/* Edit / Save Action Button */}
          {isEditing ? (
            <button
              onClick={handleSaveBudget}
              className="flex items-center gap-1.5 bg-emerald-500 text-zinc-950 text-xs px-3.5 py-1.5 rounded-xl font-bold hover:bg-emerald-400 transition shadow-lg cursor-pointer"
            >
              <Check size={14} />
              <span>Save</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setTempBudget(monthlyBudget.toString());
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white text-xs bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer"
            >
              <Edit3 size={13} className="text-emerald-400" />
              <span>Edit Limit</span>
            </button>
          )}
        </div>

        {/* Amount Display / Input */}
        <div className="space-y-1">
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-[11px] text-zinc-400 font-medium">
                Set Budget Limit (Press Enter):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-zinc-400 font-mono">Rs</span>
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-zinc-950/80 border border-emerald-500/50 text-xl font-bold text-white rounded-xl px-3.5 py-2 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition font-mono"
                  placeholder="Enter limit..."
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wide">
                Assigned Monthly Budget
              </p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-mono">
                Rs {monthlyBudget.toLocaleString()}
              </h1>
            </div>
          )}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-zinc-400 font-mono">
              Spent: Rs {totalSpent.toLocaleString()}
            </span>
            <span
              className={`font-mono ${
                isOverBudget ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {spentPercentage}% Spent
            </span>
          </div>

          <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? "bg-gradient-to-r from-rose-500 to-red-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400"
              }`}
              style={{ width: `${spentPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Sub Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800/60">
          <div className="bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-0.5 font-medium">
              <TrendingDown size={13} className="text-rose-400" />
              <span>Total Spent</span>
            </div>
            <p className="text-sm font-bold text-zinc-100 font-mono">
              Rs {totalSpent.toLocaleString()}
            </p>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-0.5 font-medium">
              <DollarSign size={13} className="text-emerald-400" />
              <span>Remaining</span>
            </div>
            <p
              className={`text-sm font-bold font-mono ${
                remainingBalance < 0 ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              Rs {remainingBalance.toLocaleString()}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
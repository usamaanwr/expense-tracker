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

  // Handle Save on 'Enter' key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveBudget();
    }
  };

  return (
    <div className="w-full space-y-4 my-4">
      {/* Over-Budget Alert Banner */}
      {isOverBudget && (
        <div className="bg-rose-950/80 border border-rose-800/80 text-rose-200 px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-xl animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-rose-400 shrink-0" size={22} />
            <div>
              <p className="text-sm font-bold text-rose-100">
                Over-Budget Alert!
              </p>
              <p className="text-xs text-rose-300">
                You have exceeded your monthly budget by Rs{" "}
                {Math.abs(remainingBalance).toLocaleString()}!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5 text-zinc-400 text-sm font-medium">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Wallet size={18} className="text-emerald-400" />
            </div>
            <span>Monthly Budget Overview</span>
          </div>

          {/* Edit / Save Action Button */}
          {isEditing ? (
            <button
              onClick={handleSaveBudget}
              className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs md:text-sm px-4 py-1.5 rounded-xl font-semibold hover:bg-emerald-500/30 transition shadow-lg cursor-pointer"
            >
              <Check size={16} />
              <span>Save Budget</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setTempBudget(monthlyBudget.toString());
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white text-xs md:text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-1.5 rounded-xl font-medium transition shadow cursor-pointer"
            >
              <Edit3 size={14} className="text-emerald-400" />
              <span>Edit Limit</span>
            </button>
          )}
        </div>

        {/* Amount Display / Input */}
        {/* Amount Display / Input */}
        <div className="mb-8">
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-medium">
                Set New Monthly Budget (Press Enter to save):
              </label>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-zinc-400">Rs</span>
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-zinc-800/90 border border-zinc-700 text-xl md:text-2xl font-bold text-white rounded-2xl px-4 py-2.5 w-full md:max-w-md focus:outline-none focus:border-emerald-500 transition placeholder:font-normal placeholder:text-sm placeholder:text-zinc-500 cursor-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter budget limit..."
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-zinc-400 mb-1 font-medium">
                Assigned Monthly Budget
              </p>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Rs {monthlyBudget.toLocaleString()}
              </h1>
            </div>
          )}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-xs md:text-sm font-semibold">
            <span className="text-zinc-400">
              Spent: Rs {totalSpent.toLocaleString()}
            </span>
            <span
              className={isOverBudget ? "text-rose-400" : "text-emerald-400"}
            >
              {spentPercentage}% Spent
            </span>
          </div>

          <div className="h-3.5 w-full bg-zinc-800/80 rounded-full overflow-hidden p-0.5 border border-zinc-700/50 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? "bg-gradient-to-r from-rose-500 to-red-600"
                  : "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400"
              }`}
              style={{ width: `${spentPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Sub Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-zinc-800/80">
          <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <TrendingDown size={14} className="text-rose-400" />
                <span>Total Spent</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-zinc-100">
                Rs {totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <DollarSign size={14} className="text-emerald-400" />
                <span>Remaining Balance</span>
              </div>
              <p
                className={`text-lg md:text-xl font-bold ${
                  remainingBalance < 0 ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                Rs {remainingBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

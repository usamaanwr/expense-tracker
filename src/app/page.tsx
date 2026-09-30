"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supbase";
import { useRouter } from "next/navigation";
import {
  getUserDataFromSupabase,
  saveBudgetToSupabase,
  addExpenseToSupabase,
  deleteExpenseFromSupabase,
} from "@/lib/supabaseService";
import Navigation from "@/components/Navigation";
import { ExportShare } from "@/components/ExportShare";
import BudgetSummary from "@/components/BudgetSummary";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import { HeaderProfile } from "@/components/HeaderProfile";
import { Expense } from "@/types";
import ExpenseFilter from "@/components/ExpenseFilter";
import DailyLimit from "@/components/DailyLimit";
import { Analytics } from "@/components/Analytics";
export default function Home() {
  const [monthlyBudget, setMonthlyBudget] = useState<number>(50000);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "history" | "analytics"
  >("dashboard");
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  // Filtered Expenses List
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, selectedCategory]);

  const router = useRouter()
  useEffect(() => {
  const initData = async () => {
    // 1. Current Session check karein
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 2. Agar session / user nahi hai, toh Login page par redirect kar dein
    if (!session?.user) {
      router.push("/login"); // (Ya jo bhi aapka login page route ho)
      return;
    }

    // 3. Agar user logged in hai, toh unka data load karein
    const uId = session.user.id;
    setUserId(uId);

    const { monthlyBudget: fetchedBudget, expenses: fetchedExpenses } =
      await getUserDataFromSupabase(uId);

    setMonthlyBudget(fetchedBudget);
    setExpenses(fetchedExpenses);
    setLoading(false);
  };

  initData();
}, [router]);
  const handleSetMonthlyBudget = async (newBudget: number) => {
    setMonthlyBudget(newBudget);
    if (userId) {
      await saveBudgetToSupabase(userId, newBudget);
    }
  };

  const handleAddExpense = async (newExpenseData: Omit<Expense, "id">) => {
    if (!userId) return;
    const addedExpense = await addExpenseToSupabase(userId, newExpenseData);
    if (addedExpense) {
      setExpenses((prev) => [addedExpense, ...prev]);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const res = await deleteExpenseFromSupabase(id);
    if (!res?.error) {
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 text-sm animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex selection:bg-emerald-500 selection:text-black">
      {/* Responsive Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 lg:pb-10">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <HeaderProfile />

          {/* 1. DASHBOARD VIEW (Clean - Sirf jab activeTab === 'dashboard' ho) */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Controls & Forms) */}
              <div className="lg:col-span-5 space-y-6">
                <BudgetSummary
                  monthlyBudget={monthlyBudget}
                  setMonthlyBudget={handleSetMonthlyBudget}
                  totalSpent={totalSpent}
                />

                <DailyLimit
                  monthlyBudget={monthlyBudget}
                  totalSpent={totalSpent}
                />

                <ExpenseForm onAddExpense={handleAddExpense} />
              </div>

              {/* Right Column (Recent Transactions - Clean, filter yahan se hata diya hai) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold text-zinc-300">
                    Recent Transactions
                  </h3>
                  <span className="text-[11px] text-zinc-500">
                    Latest entries
                  </span>
                </div>
                <ExpenseList
                  expenses={expenses.slice(0, 5)}
                  onDeleteExpense={handleDeleteExpense}
                />
              </div>
            </div>
          )}

          {/* 2. HISTORY VIEW (Full Width - Sirf jab activeTab === 'history' ho) */}
          {/* 2. HISTORY TAB */}
{activeTab === 'history' && (
  <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto w-full">
    
    {/* Title Header with Inline Export Buttons & Count */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">Date-wise Transaction History</h2>
        <p className="text-xs text-zinc-400">View, filter and export your past expenses</p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-medium">
          Total: {filteredExpenses.length} Items
        </span>
        
        {/* Compact ExportShare Buttons */}
        <ExportShare
          expenses={filteredExpenses}
          monthlyBudget={monthlyBudget}
          totalSpent={totalSpent}
        />
      </div>
    </div>

    {/* Search & Category Filter */}
    <ExpenseFilter
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
    />

    {/* Date-wise Grouped Expense List */}
    <ExpenseList
      expenses={filteredExpenses}
      onDeleteExpense={handleDeleteExpense}
    />
  </div>
)}
          {/* 3. ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="max-w-4xl mx-auto">
              <Analytics
                expenses={expenses}
                monthlyBudget={monthlyBudget}
                totalSpent={totalSpent}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

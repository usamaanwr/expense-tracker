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

  const router = useRouter();

  useEffect(() => {
    const initData = async () => {
      // 1. Current Session check karein
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 2. Agar session / user nahi hai, toh Login page par redirect kar dein
      if (!session?.user) {
        router.push("/login");
        return;
      }

      // Token waali gandi URL ko clean karein
      if (window.location.hash || window.location.search.includes("code=")) {
        window.history.replaceState(null, "", window.location.pathname);
      }

      // 3. Data load karein
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

  const handleUpdateExpense = async (updatedExpense: Expense) => {
  setExpenses((prev) =>
    prev.map((item) => (item.id === updatedExpense.id ? updatedExpense : item))
  );
  // Supabase state update
  await supabase
    .from('expenses')
    .update({
      title: updatedExpense.title,
      amount: updatedExpense.amount,
      category: updatedExpense.category,
    })
    .eq('id', updatedExpense.id);
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

      {/* Main Content Area - Aligned to max-w-4xl for single column consistency */}
      <main className="flex-1 pb-20 lg:pb-10">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <HeaderProfile />

          {/* 1. DASHBOARD VIEW (Full-width Single Column Flow) */}
         

{/* 1. DASHBOARD VIEW (Clean, Single Column Stacked Flow) */}
{activeTab === "dashboard" && (
  <div className="space-y-6 animate-fadeIn w-full">
    
    {/* 1. Budget Summary (Full Width) */}
    <BudgetSummary
      monthlyBudget={monthlyBudget}
      setMonthlyBudget={handleSetMonthlyBudget}
      totalSpent={totalSpent}
    />

    {/* 2. Safe Daily Limit (Full Width - Directly below Budget Summary) */}
    <DailyLimit
      monthlyBudget={monthlyBudget}
      totalSpent={totalSpent}
    />

    {/* 3. Add Expense Form (Full Width) */}
    <ExpenseForm onAddExpense={handleAddExpense} />

    {/* 4. Recent Transactions List (Full Width) */}
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-zinc-300 tracking-wide">
          Recent Transactions
        </h3>
        <span className="text-[11px] text-zinc-500 font-mono">
          Showing latest entries
        </span>
      </div>

      <ExpenseList
        expenses={expenses.slice(0, 5)}
        onDeleteExpense={handleDeleteExpense}
        onUpdateExpense={handleUpdateExpense}
      />
    </div>

  </div>
)}

          {/* 2. HISTORY TAB */}
          {activeTab === "history" && (
            <div className="space-y-6 animate-fadeIn w-full">
              {/* Title Header with Inline Export Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Date-wise Transaction History
                  </h2>
                  <p className="text-xs text-zinc-400">
                    View, filter and export your past expenses
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-semibold font-mono">
                    Total: {filteredExpenses.length} Items
                  </span>

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
            <div className="w-full animate-fadeIn">
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
'use client';

import { Expense } from '@/types';
import { Trash2, Calendar } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 text-center text-zinc-500 text-xs">
        No expenses found.
      </div>
    );
  }

  // Expenses ko Date ke hisab se Group (Categorize) karne ka logic
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date || 'Other';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  // Dates ko latest (Naye din pehle) sort karna
  const sortedDates = Object.keys(groupedExpenses).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => {
        const dayExpenses = groupedExpenses[date];
        const dayTotal = dayExpenses.reduce((sum, item) => sum + item.amount, 0);

        return (
          <div key={date} className="space-y-2">
            {/* Date Header Card */}
            <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800/80 px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Calendar size={14} />
                <span>{date}</span>
              </div>
              <span className="text-[11px] font-medium text-zinc-400">
                Day Total: <strong className="text-white">Rs {dayTotal.toLocaleString()}</strong>
              </span>
            </div>

            {/* List of items for this specific date */}
            <div className="space-y-2 pl-1">
              {dayExpenses.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 rounded-2xl p-3.5 flex items-center justify-between transition group"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-200">{item.title}</p>
                    <span className="inline-block bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-xs font-bold text-emerald-400">
                      Rs {item.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => onDeleteExpense(item.id)}
                      className="text-zinc-600 hover:text-rose-400 transition p-1 cursor-pointer"
                      title="Delete Expense"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Expense } from '@/types';
import { Trash2, Calendar, Tag, Edit3, Check, X, AlertCircle } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onUpdateExpense?: (updatedExpense: Expense) => void;
}

const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Transportation',
  'Healthcare',
  'Other',
];

export default function ExpenseList({
  expenses,
  onDeleteExpense,
  onUpdateExpense,
}: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 text-center text-zinc-400 text-sm font-mono">
        No transactions recorded yet.
      </div>
    );
  }

  const handleStartEdit = (item: Expense) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditAmount(item.amount.toString());
    setEditCategory(item.category);
    setConfirmDeleteId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id: string, originalDate: string) => {
    const parsedAmount = parseFloat(editAmount);
    if (!editTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (onUpdateExpense) {
      onUpdateExpense({
        id,
        title: editTitle.trim(),
        amount: parsedAmount,
        category: editCategory,
        date: originalDate,
      });
    }
    setEditingId(null);
  };

  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date || 'Other';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  const sortedDates = Object.keys(groupedExpenses).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-5">
      {sortedDates.map((date) => {
        const dayExpenses = groupedExpenses[date];
        const dayTotal = dayExpenses.reduce((sum, item) => sum + item.amount, 0);

        return (
          <div key={date} className="space-y-2.5">
            {/* Date Header Badge */}
            <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800/80 px-4 py-2.5 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 font-mono">
                <Calendar size={15} className="shrink-0" />
                <span>{date}</span>
              </div>
              <span className="text-xs font-semibold text-zinc-300">
                Day Total: <strong className="text-white font-mono text-sm">Rs {dayTotal.toLocaleString()}</strong>
              </span>
            </div>

            {/* List Items */}
            <div className="space-y-2">
              {dayExpenses.map((item) => {
                const isEditing = editingId === item.id;
                const isConfirmingDelete = confirmDeleteId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/70 hover:border-zinc-700/80 rounded-2xl p-4 transition-all shadow-sm"
                  >
                    {isEditing ? (
                      /* INLINE EDIT MODE (BIGGER FONTS & INPUTS) */
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-zinc-950 border border-emerald-500/60 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none font-medium"
                            placeholder="Title"
                          />
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="bg-zinc-950 border border-emerald-500/60 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none font-mono font-medium"
                            placeholder="Amount"
                          />
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="bg-zinc-950 border border-emerald-500/60 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none cursor-pointer"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat} className="bg-zinc-900 text-white">
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleSaveEdit(item.id, item.date)}
                            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs px-4 py-2 rounded-xl font-bold transition cursor-pointer"
                          >
                            <Check size={16} />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* VIEW MODE WITH LARGER TEXT */
                      <div className="flex items-center justify-between">
                        <div className="space-y-1.5">
                          <p className="text-sm font-bold text-white capitalize tracking-wide">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <Tag size={12} className="text-zinc-400" />
                            <span className="inline-block bg-zinc-800/90 text-zinc-300 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-zinc-700/60">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-sm font-extrabold text-emerald-400 font-mono">
                            Rs {item.amount.toLocaleString()}
                          </p>

                          <div className="flex items-center gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 p-2 rounded-lg transition cursor-pointer"
                              title="Edit Expense"
                            >
                              <Edit3 size={16} />
                            </button>

                            {/* Safe Delete */}
                            {isConfirmingDelete ? (
                              <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 p-1 rounded-xl">
                                <span className="text-xs font-bold text-rose-400 px-1 flex items-center gap-1">
                                  <AlertCircle size={12} /> Confirm?
                                </span>
                                <button
                                  onClick={() => onDeleteExpense(item.id)}
                                  className="bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-zinc-400 hover:text-white text-xs px-1.5 cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(item.id)}
                                className="text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition cursor-pointer"
                                title="Delete Expense"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
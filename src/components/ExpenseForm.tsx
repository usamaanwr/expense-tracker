'use client';

import { useState } from 'react';
import { ExpenseFormProps } from '@/types';
import { PlusCircle, Tag, DollarSign, FileText, Send } from 'lucide-react';

const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Transportation',
  'Healthcare',
  'Other',
];

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddExpense({
      title: title.trim(),
      amount: parsedAmount,
      category,
      date: new Date().toISOString().split('T')[0],
    });

    // Reset Form
    setTitle('');
    setAmount('');
    setCategory(CATEGORIES[0]);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-5 md:p-6 shadow-2xl space-y-5 transition-all">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <PlusCircle size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Add New Expense</h2>
            <p className="text-[11px] text-zinc-500">Record a new transaction to sync budget</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
              <FileText size={13} className="text-emerald-400" />
              <span>Title</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery, House Rent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all font-medium"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
              <DollarSign size={13} className="text-emerald-400" />
              <span>Amount (Rs)</span>
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Tag size={13} className="text-emerald-400" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="w-full md:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-bold text-xs rounded-xl transition duration-200 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send size={14} />
            <span>Add Transaction</span>
          </button>
        </div>
      </form>
    </div>
  );
}
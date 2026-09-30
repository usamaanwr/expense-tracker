'use client';

import { useState } from 'react';
import { ExpenseFormProps } from '@/types';
import { PlusCircle, Tag, DollarSign, FileText } from 'lucide-react';

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
    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl my-4">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
          <PlusCircle size={20} />
        </div>
        <h2 className="text-lg font-bold text-white">Add New Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <FileText size={14} />
              <span>Title</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery, Electricity Bill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <DollarSign size={14} />
              <span>Amount (Rs)</span>
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Tag size={14} />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
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
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm rounded-xl transition duration-200 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
        >
          <PlusCircle size={16} />
          <span>Add Transaction</span>
        </button>
      </form>
    </div>
  );
}
'use client';

import { Search, Filter } from 'lucide-react';

interface ExpenseFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CATEGORIES = [
  'All',
  'Food & Dining',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Transportation',
  'Healthcare',
  'Other',
];

export default function ExpenseFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: ExpenseFilterProps) {
  return (
    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-4 md:p-6 shadow-xl my-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transaction..."
            className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative shrink-0 sm:w-48">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer appearance-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-zinc-900 text-white">
                {cat} Category
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
import React, { useMemo } from 'react';
import { 
  PieChart, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Tag 
} from 'lucide-react';
import { AnalyticsProps } from '@/types';
const CATEGORY_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Food: { bg: 'bg-orange-500/10', text: 'text-orange-400', bar: 'bg-orange-500' },
  Transport: { bg: 'bg-blue-500/10', text: 'text-blue-400', bar: 'bg-blue-500' },
  Bills: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', bar: 'bg-yellow-500' },
  Entertainment: { bg: 'bg-purple-500/10', text: 'text-purple-400', bar: 'bg-purple-500' },
  Shopping: { bg: 'bg-pink-500/10', text: 'text-pink-400', bar: 'bg-pink-500' },
  Health: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  Other: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', bar: 'bg-zinc-500' },
};

export const Analytics: React.FC<AnalyticsProps> = ({
  expenses,
  monthlyBudget,
  totalSpent,
}) => {
  // Category Breakdown Logic
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    expenses.forEach((item) => {
      stats[item.category] = (stats[item.category] || 0) + Number(item.amount);
    });

    return Object.entries(stats)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalSpent]);

  // Metrics Calculations
  const highestExpense = useMemo(() => {
    if (expenses.length === 0) return null;
    return [...expenses].sort((a, b) => b.amount - a.amount)[0];
  }, [expenses]);

  const avgExpense = useMemo(() => {
    if (expenses.length === 0) return 0;
    return Math.round(totalSpent / expenses.length);
  }, [expenses, totalSpent]);

  const topCategory = categoryStats[0]?.category || 'N/A';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            Spending Analytics
          </h2>
          <p className="text-xs text-zinc-400">Detailed insights and breakdown of your expenses</p>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
          Active Month
        </span>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Highest Transaction</p>
            <p className="text-lg font-bold text-white">
              {highestExpense ? `Rs ${highestExpense.amount.toLocaleString()}` : 'Rs 0'}
            </p>
            {highestExpense && (
              <p className="text-[10px] text-zinc-500 truncate max-w-[150px]">
                {highestExpense.title} ({highestExpense.category})
              </p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Average Per Expense</p>
            <p className="text-lg font-bold text-white">Rs {avgExpense.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500">Based on {expenses.length} entries</p>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Top Category</p>
            <p className="text-lg font-bold text-white">{topCategory}</p>
            <p className="text-[10px] text-zinc-500">
              {categoryStats[0] ? `${categoryStats[0].percentage}% of total spend` : 'No data'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Analytics: Category Progress Breakdown */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-5">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          Category Spending Distribution
        </h3>

        {categoryStats.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-sm">
            No expenses found to calculate category distribution.
          </div>
        ) : (
          <div className="space-y-4">
            {categoryStats.map(({ category, amount, percentage }) => {
              const theme = CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];

              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-200 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${theme.bar}`} />
                      {category}
                    </span>
                    <div className="space-x-2">
                      <span className="text-zinc-400">Rs {amount.toLocaleString()}</span>
                      <span className={`font-semibold ${theme.text}`}>({percentage}%)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-800/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${theme.bar} transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
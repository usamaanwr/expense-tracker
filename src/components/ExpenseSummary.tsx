import { Receipt } from 'lucide-react';

interface ExpenseSummaryProps {
  role: 'personal' | 'shopkeeper';
  totalSpent: number;
}

export default function ExpenseSummary({ role, totalSpent }: ExpenseSummaryProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl shadow-xl shadow-blue-100 flex justify-between items-center">
      <div>
        <p className="text-xs font-medium text-blue-100 uppercase tracking-wider">
          Total {role === 'shopkeeper' ? 'Business Expense' : 'Personal Spend'}
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">Rs. {totalSpent.toLocaleString()}</h2>
      </div>
      <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
        <Receipt size={28} />
      </div>
    </div>
  );
}
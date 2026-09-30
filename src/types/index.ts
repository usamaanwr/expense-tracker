export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export interface AnalyticsProps {
  expenses: Expense[];
  monthlyBudget: number;
  totalSpent: number;
}

export interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export interface HeaderProfileProps {
  userEmail?: string;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  isOverBudget?: boolean;
}

export interface BudgetSummaryProps {
  monthlyBudget: number;
  setMonthlyBudget: (amount: number) => void;
  totalSpent: number;
  categoryData: { name: string; value: number }[];
}

export interface ExpenseFormProps {
  title: string;
  setTitle: (val: string) => void;
  amount: string;
  setAmount: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  handleAddExpense: (e: React.FormEvent) => void;
}

export interface ExpenseFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export interface ExpenseListProps {
  expenses: Expense[];
onDeleteExpense: (id: string) => void;
}

export interface ExportActionsProps {
  exportPDF: () => void;
  shareWhatsApp: () => void;
}

export interface AuthProps {
  onSuccess?: () => void;
}
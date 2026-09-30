export type TabType = "dashboard" | "history" | "analytics";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface AnalyticsProps {
  expenses: Expense[];
  monthlyBudget: number;
  totalSpent: number;
}

// Fixed: TabType set kiya string ke bajaye
export interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export interface HeaderProfileProps {
  userEmail?: string;
  selectedMonth?: string;
  setSelectedMonth?: (month: string) => void;
  isOverBudget?: boolean;
}

// Fixed: categoryData ko optional (?) banaya
export interface BudgetSummaryProps {
  monthlyBudget: number;
  setMonthlyBudget: (amount: number) => void;
  totalSpent: number;
  categoryData?: { name: string; value: number }[];
}

export interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export interface ExpenseFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (val: string) => void;
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
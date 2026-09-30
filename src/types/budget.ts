// src/types/budget.ts

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  discount?: number;
  category: 'Food' | 'Rent' | 'Bills' | 'Shopping' | 'Other';
  date: string;
}

export interface BudgetData {
  income: number;
  expenses: ExpenseItem[];
}
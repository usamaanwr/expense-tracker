import { Expense } from '@/types';
import { supabase } from './supbase';
// Fetch Budget & Expenses
export const getUserDataFromSupabase = async (userId: string) => {
  const { data: budgetData } = await supabase
    .from('budgets')
    .select('monthly_budget')
    .eq('user_id', userId)
    .single();

  const { data: expenseData } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const formattedExpenses: Expense[] = expenseData
    ? expenseData.map((item) => ({
        id: item.id,
        title: item.title,
        amount: Number(item.amount),
        category: item.category,
        date: item.date,
      }))
    : [];

  return {
    monthlyBudget: budgetData ? Number(budgetData.monthly_budget) : 50000,
    expenses: formattedExpenses,
  };
};

// Save Budget
export const saveBudgetToSupabase = async (userId: string, newBudget: number) => {
  return await supabase.from('budgets').upsert({
    user_id: userId,
    monthly_budget: newBudget,
    updated_at: new Date().toISOString(),
  });
};

// Add Expense
export const addExpenseToSupabase = async (userId: string, expenseData: Omit<Expense, 'id'>) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        user_id: userId,
        title: expenseData.title,
        amount: expenseData.amount,
        category: expenseData.category,
        date: expenseData.date,
      },
    ])
    .select()
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    amount: Number(data.amount),
    category: data.category,
    date: data.date,
  } as Expense;
};

// Delete Expense
export const deleteExpenseFromSupabase = async (id: string) => {
  return await supabase.from('expenses').delete().eq('id', id);
};
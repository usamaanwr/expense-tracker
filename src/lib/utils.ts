// src/lib/utils.ts

// 1. Numbers ko Pakistani Rupee / Currency format mein convert karne ke liye
export function formatCurrency(amount: number): string {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(num).replace('PKR', 'Rs.');
}

// 2. Current month ke baaqi din calculate karne ke liye
export function getRemainingDaysInMonth(): number {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const remaining = lastDay.getDate() - today.getDate() + 1;
  return remaining > 0 ? remaining : 1;
}
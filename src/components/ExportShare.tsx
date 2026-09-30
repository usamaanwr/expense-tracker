'use client';

import React from 'react';
import { Download, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense } from '@/types';

interface ExportShareProps {
  expenses: Expense[];
  monthlyBudget: number;
  totalSpent: number;
}

export function ExportShare({ expenses, monthlyBudget, totalSpent }: ExportShareProps) {
  
  // Download PDF Report
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('ExpenseTrack - Monthly Financial Summary', 14, 20);

    doc.setFontSize(11);
    doc.text(`Total Monthly Budget: Rs ${monthlyBudget.toLocaleString()}`, 14, 30);
    doc.text(`Total Amount Spent: Rs ${totalSpent.toLocaleString()}`, 14, 37);
    doc.text(`Remaining Balance: Rs ${(monthlyBudget - totalSpent).toLocaleString()}`, 14, 44);

    const tableData = expenses.map((e, index) => [
      index + 1,
      e.title,
      e.category,
      `Rs ${e.amount.toLocaleString()}`,
      e.date || 'N/A',
    ]);

    autoTable(doc, {
      startY: 52,
      head: [['#', 'Title', 'Category', 'Amount', 'Date']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save(`Expense_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // WhatsApp Share Report
  const handleShareWhatsApp = () => {
    let message = `📊 *ExpenseTrack Monthly Report*\n\n`;
    message += `💰 *Budget:* Rs ${monthlyBudget.toLocaleString()}\n`;
    message += `📉 *Total Spent:* Rs ${totalSpent.toLocaleString()}\n`;
    message += `💵 *Remaining:* Rs ${(monthlyBudget - totalSpent).toLocaleString()}\n\n`;
    message += `*Recent Transactions (${expenses.length}):*\n`;

    expenses.slice(0, 5).forEach((e) => {
      message += `• ${e.title} - Rs ${e.amount.toLocaleString()} (${e.category})\n`;
    });

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownloadPDF}
        className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white transition shadow cursor-pointer"
        title="Download PDF Report"
      >
        <Download size={14} className="text-emerald-400" />
        <span className="hidden sm:inline">PDF</span>
      </button>

      <button
        onClick={handleShareWhatsApp}
        className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow cursor-pointer"
        title="Share via WhatsApp"
      >
        <Share2 size={14} />
        <span className="hidden sm:inline">WhatsApp</span>
      </button>
    </div>
  );
}
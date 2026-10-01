"use client";

import { Download, Share2 } from "lucide-react";
import { Expense } from "@/types";

interface ExportShareProps {
  expenses: Expense[];
  monthlyBudget: number;
  totalSpent: number;
}

export function ExportShare({ expenses, monthlyBudget, totalSpent }: ExportShareProps) {
  // 1. Functional PDF Generator / Print View
  const handlePDFDownload = () => {
    if (!expenses.length) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const remaining = monthlyBudget - totalSpent;

    const itemsHtml = expenses
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #27272a;">
          <td style="padding: 10px; color: #e4e4e7;">${item.date || "N/A"}</td>
          <td style="padding: 10px; color: #ffffff; font-weight: 600;">${item.title}</td>
          <td style="padding: 10px; color: #a1a1aa;">${item.category}</td>
          <td style="padding: 10px; color: #10b981; font-weight: 700; text-align: right;">Rs ${item.amount.toLocaleString()}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Expense Tracker Statement</title>
          <style>
            body { font-family: monospace, sans-serif; background: #09090b; color: #fff; padding: 30px; }
            h2 { color: #10b981; margin-bottom: 5px; }
            .summary { background: #18181b; padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #27272a; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { text-align: left; padding: 10px; background: #27272a; color: #a1a1aa; }
          </style>
        </head>
        <body>
          <h2>ExpenseTrack Statement</h2>
          <p style="color: #a1a1aa; font-size: 11px; margin-top: 0;">Generated Report</p>
          
          <div class="summary">
            <p style="margin: 3px 0;"><strong>Monthly Budget:</strong> Rs ${monthlyBudget.toLocaleString()}</p>
            <p style="margin: 3px 0;"><strong>Total Spent:</strong> Rs ${totalSpent.toLocaleString()}</p>
            <p style="margin: 3px 0; color: ${remaining < 0 ? "#f43f5e" : "#10b981"}">
              <strong>Remaining Balance:</strong> Rs ${remaining.toLocaleString()}
            </p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 2. Formatted WhatsApp Message Share
  const handleWhatsAppShare = () => {
    const remaining = monthlyBudget - totalSpent;
    const text = 
`📊 *ExpenseTrack Summary Report*
━━━━━━━━━━━━━━━━━━━━
💰 *Monthly Budget:* Rs ${monthlyBudget.toLocaleString()}
💸 *Total Spent:* Rs ${totalSpent.toLocaleString()}
⚖️ *Remaining:* Rs ${remaining.toLocaleString()}
📦 *Total Entries:* ${expenses.length}
━━━━━━━━━━━━━━━━━━━━
*Synced via ExpenseTrack App*`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handlePDFDownload}
        className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 rounded-xl text-xs font-bold text-zinc-300 hover:text-white transition shadow-sm cursor-pointer active:scale-95"
        title="Export Statement"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400" />
        <span>Export PDF</span>
      </button>

      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400 transition shadow-sm cursor-pointer active:scale-95"
        title="Share Breakdown via WhatsApp"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>
    </div>
  );
}
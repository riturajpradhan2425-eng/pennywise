// PennyWise Full Financial Statement & Documentation PDF Generator
// Generates a comprehensive, clean, professional PDF report of expenses, budgets, savings goals, and financial metrics.

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePennyWisePDF({
  currency = "₹",
  userName = "PennyWise Student",
  userEmail = "",
  totalIncome = 0,
  totalExpenses = 0,
  remainingBalance = 0,
  runway = { days: 0, dailyBurn: 0, status: "safe", message: "" },
  expenses = [],
  budgets = [],
  savingsGoals = [],
  recurringBills = [],
  unusualExpenses = [],
  coachAdvice = "Maintain a steady daily burn rate, review food deliveries, and contribute small portions to savings goals regularly.",
  saveToFile = true,
  fileName = `PennyWise_Financial_Report_${new Date().toISOString().split("T")[0]}.pdf`,
} = {}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const primaryColor = [16, 185, 129]; // Emerald/Mint #10b981
  const darkNavy = [15, 23, 42]; // Slate 900
  const slateText = [71, 85, 105]; // Slate 600
  const lightBg = [248, 250, 252]; // Slate 50

  // 1. Header Banner
  doc.setFillColor(...darkNavy);
  doc.rect(0, 0, pageWidth, 42, "F");

  // Accent mint stripe
  doc.setFillColor(...primaryColor);
  doc.rect(0, 42, pageWidth, 2.5, "F");

  // Brand Name & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("PennyWise", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text("AI-Powered Smart Expense & Financial Tracker for Students", 14, 28);
  doc.text(`Official Financial Statement & Summary Report`, 14, 34);

  // Date and Metadata on Top Right
  const todayStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${todayStr}`, pageWidth - 14, 18, { align: "right" });
  if (userName) {
    doc.text(`Account: ${userName}`, pageWidth - 14, 24, { align: "right" });
  }
  if (userEmail) {
    doc.text(userEmail, pageWidth - 14, 30, { align: "right" });
  }

  let yPos = 52;

  // 2. Summary KPI Cards (Income, Expense, Net Balance, Runway)
  const cardWidth = (pageWidth - 28 - 9) / 4; // 4 cards with 3mm gap
  const cardHeight = 22;

  const kpis = [
    { label: "Total Inflow / Allowance", val: `${currency}${Number(totalIncome).toLocaleString()}`, color: [16, 185, 129] },
    { label: "Total Outflow / Spent", val: `${currency}${Number(totalExpenses).toLocaleString()}`, color: [239, 68, 68] },
    { label: "Net Available Balance", val: `${currency}${Number(remainingBalance).toLocaleString()}`, color: remainingBalance >= 0 ? [59, 130, 246] : [239, 68, 68] },
    { label: "Runway Remaining", val: `${runway.days || 0} Days`, color: [245, 158, 11] },
  ];

  kpis.forEach((kpi, idx) => {
    const xPos = 14 + idx * (cardWidth + 3);
    doc.setFillColor(...lightBg);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 2, 2, "FD");

    // KPI top indicator line
    doc.setFillColor(...kpi.color);
    doc.rect(xPos, yPos, cardWidth, 1.2, "F");

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...slateText);
    doc.text(kpi.label, xPos + 3, yPos + 7);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkNavy);
    doc.text(kpi.val, xPos + 3, yPos + 16);
  });

  yPos += cardHeight + 8;

  // 3. AI Financial Coach Insight Box
  doc.setFillColor(240, 253, 250); // Mint tint (teal-50)
  doc.setDrawColor(153, 246, 228); // Teal-200
  doc.roundedRect(14, yPos, pageWidth - 28, 20, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 118, 110); // Teal-700
  doc.text("AI Financial Coach Summary & Spending Health:", 18, yPos + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const adviceLines = doc.splitTextToSize(
    coachAdvice ||
      `With ${currency}${remainingBalance.toLocaleString()} remaining and a daily burn rate of ${currency}${runway.dailyBurn || 0}/day, your runway is projected at ${runway.days} days. Keep your top categories monitored!`,
    pageWidth - 36
  );
  doc.text(adviceLines, 18, yPos + 11);

  yPos += 26;

  // 4. Budgets and Goals Overview (Two Columns / Table)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...darkNavy);
  doc.text("Active Category Budgets", 14, yPos);

  const budgetBody = budgets.map((b) => {
    const spent = expenses
      .filter((e) => (e.type === "expense" || !e.type) && e.category?.toLowerCase() === b.category?.toLowerCase())
      .reduce((sum, curr) => sum + Number(curr.amount || 0), 0);
    const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
    const remaining = Math.max(0, b.amount - spent);
    let status = "Normal";
    if (pct >= 100) status = "OVER LIMIT (100%+)";
    else if (pct >= 90) status = "Warning (90%+)";
    else if (pct >= 70) status = "Caution (70%+)";

    return [
      b.category,
      b.period || "Monthly",
      `${currency}${Number(b.amount).toLocaleString()}`,
      `${currency}${spent.toLocaleString()} (${pct}%)`,
      `${currency}${remaining.toLocaleString()}`,
      status,
    ];
  });

  autoTable(doc, {
    startY: yPos + 2,
    head: [["Category", "Period", "Limit", "Spent (% used)", "Remaining", "Alert Status"]],
    body: budgetBody.length > 0 ? budgetBody : [["No budgets defined", "-", "-", "-", "-", "-"]],
    theme: "striped",
    headStyles: {
      fillColor: darkNavy,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: darkNavy,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 8;

  // 5. Savings Goals
  if (savingsGoals && savingsGoals.length > 0) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...darkNavy);
    doc.text("Savings Goals & Milestones", 14, yPos);

    const goalsBody = savingsGoals.map((g) => {
      const pct = g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0;
      return [
        g.name,
        `${currency}${Number(g.currentAmount || 0).toLocaleString()}`,
        `${currency}${Number(g.targetAmount || 0).toLocaleString()}`,
        `${pct}%`,
        g.deadline || "Ongoing",
        pct >= 100 ? "Goal Reached" : `${currency}${(g.targetAmount - g.currentAmount).toLocaleString()} left`,
      ];
    });

    autoTable(doc, {
      startY: yPos + 2,
      head: [["Goal Name", "Current Saved", "Target Amount", "Progress", "Deadline", "Status"]],
      body: goalsBody,
      theme: "striped",
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
      },
      margin: { left: 14, right: 14 },
    });

    yPos = doc.lastAutoTable.finalY + 8;
  }

  // 6. Recent Transaction Ledger Table
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...darkNavy);
  doc.text("Detailed Transaction Ledger", 14, yPos);

  const expenseBody = expenses.slice(0, 40).map((e) => [
    e.date || "N/A",
    e.title || "Untitled",
    e.category || "General",
    (e.type || "expense").toUpperCase(),
    `${(e.type === "income" ? "+" : "-")}${currency}${Number(e.amount).toLocaleString()}`,
    e.notes || "-",
  ]);

  autoTable(doc, {
    startY: yPos + 2,
    head: [["Date", "Title / Merchant", "Category", "Type", "Amount", "Notes"]],
    body: expenseBody.length > 0 ? expenseBody : [["No transactions recorded", "-", "-", "-", "-", "-"]],
    theme: "striped",
    headStyles: {
      fillColor: darkNavy,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: darkNavy,
    },
    columnStyles: {
      4: { fontStyle: "bold" },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Footer on each page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      `PennyWise Financial Intelligence • Confidential Student Ledger • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  if (saveToFile) {
    doc.save(fileName);
  }

  return doc;
}

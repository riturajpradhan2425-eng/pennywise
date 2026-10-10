import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, handleFirestoreError } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import { generatePennyWisePDF } from "../utils/pdfGenerator";

const ExpenseContext = createContext(null);

export const DEFAULT_EXPENSES = [
  { id: "e-1", title: "Campus Hostel Rent", amount: 9500, category: "Housing", date: "2026-10-02", type: "expense", notes: "Monthly hostel & room maintenance" },
  { id: "e-2", title: "Campus Dining Hall & Meal Plan", amount: 5200, category: "Food & Dining", date: "2026-10-04", type: "expense", notes: "Mess card monthly recharge" },
  { id: "e-3", title: "Semester Reference Books & Xerox", amount: 1650, category: "Academics", date: "2026-10-06", type: "expense", notes: "Data structures & Algorithms lab manuals" },
  { id: "e-4", title: "Metro Smart Card Recharge", amount: 1200, category: "Transport", date: "2026-10-07", type: "expense", notes: "Transit to campus & coaching" },
  { id: "e-5", title: "Weekend Pizza & Cafe Hangout", amount: 2100, category: "Lifestyle", date: "2026-10-08", type: "expense", notes: "Study group dinner" },
  { id: "e-6", title: "Spotify Student Subscription", amount: 119, category: "Lifestyle", date: "2026-10-09", type: "expense", notes: "Monthly campus plan" },
  { id: "i-1", title: "Campus Lab Assistant Stipend", amount: 18000, category: "Income", date: "2026-10-01", type: "income", notes: "CS Department Teaching Assistant" },
  { id: "i-2", title: "Peer Tutoring (Math)", amount: 6500, category: "Income", date: "2026-10-05", type: "income", notes: "Calculus tutoring" },
  { id: "i-3", title: "Family Campus Pocket Money", amount: 8000, category: "Income", date: "2026-10-01", type: "income", notes: "Monthly support" },
];

export const DEFAULT_BUDGETS = [
  { id: "b-1", name: "Total Monthly Budget", category: "Overall", limit: 22000, period: "monthly" },
  { id: "b-2", name: "Food & Dining", category: "Food & Dining", limit: 7000, period: "monthly" },
  { id: "b-3", name: "Lifestyle & Social", category: "Lifestyle", limit: 3500, period: "monthly" },
  { id: "b-4", name: "Academics & Tech", category: "Academics", limit: 2500, period: "monthly" },
];

export const DEFAULT_GOALS = [
  { id: "g-1", name: "New Coding Laptop (MacBook M3)", targetAmount: 85000, currentAmount: 42500, deadline: "2026-12-15", category: "Tech" },
  { id: "g-2", name: "Semester Break Trip to Goa", targetAmount: 18000, currentAmount: 11200, deadline: "2026-11-20", category: "Travel" },
  { id: "g-3", name: "Emergency Security Deposit Buffer", targetAmount: 15000, currentAmount: 9500, deadline: "2026-12-31", category: "Safety" },
];

export const DEFAULT_RECURRING = [
  { id: "r-1", name: "Hostel Wi-Fi Fiber", amount: 699, category: "Utilities", dueDay: 12, period: "Monthly", status: "due" },
  { id: "r-2", name: "Spotify Student", amount: 119, category: "Lifestyle", dueDay: 15, period: "Monthly", status: "paid" },
  { id: "r-3", name: "GitHub Copilot Student", amount: 0, category: "Academics", dueDay: 1, period: "Monthly", status: "paid" },
  { id: "r-4", name: "Campus Gym Pass", amount: 1200, category: "Healthcare", dueDay: 25, period: "Monthly", status: "due" },
  { id: "r-5", name: "Hostel Laundry Pass", amount: 850, category: "Housing", dueDay: 28, period: "Monthly", status: "due" },
];

export const DEFAULT_GROUP_EXPENSES = [
  {
    id: "grp-1",
    title: "Apartment Wi-Fi & Electricity",
    amount: 1800,
    paidBy: "You",
    date: "2026-10-05",
    category: "Utilities",
    members: [
      { name: "You", share: 600, settled: true },
      { name: "Rohan (Roommate)", share: 600, settled: false },
      { name: "Sameer (Roommate)", share: 600, settled: true },
    ],
    status: "partially_settled",
  },
  {
    id: "grp-2",
    title: "Hostel Weekend Grocery Run",
    amount: 2400,
    paidBy: "Rohan",
    date: "2026-10-07",
    category: "Food & Dining",
    members: [
      { name: "Rohan", share: 800, settled: true },
      { name: "You", share: 800, settled: false },
      { name: "Sameer", share: 800, settled: true },
    ],
    status: "partially_settled",
  },
  {
    id: "grp-3",
    title: "Hackathon Team Dinner & Energy Drinks",
    amount: 1250,
    paidBy: "You",
    date: "2026-10-09",
    category: "Food & Dining",
    members: [
      { name: "You", share: 420, settled: true },
      { name: "Ananya", share: 415, settled: false },
      { name: "Dev", share: 415, settled: false },
    ],
    status: "pending",
  },
];

export function ExpenseProvider({ children }) {
  const { user } = useAuth();

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("pennywise_currency") || "₹";
  });

  const [monthlyAllowance, setMonthlyAllowance] = useState(() => {
    const val = localStorage.getItem("pennywise_allowance");
    return val ? Number(val) : 32500;
  });

  const [expenses, setExpenses] = useState(() => {
    const cached = localStorage.getItem("pennywise_expenses");
    return cached ? JSON.parse(cached) : DEFAULT_EXPENSES;
  });

  const [budgets, setBudgets] = useState(() => {
    const cached = localStorage.getItem("pennywise_budgets");
    return cached ? JSON.parse(cached) : DEFAULT_BUDGETS;
  });

  const [savingsGoals, setSavingsGoals] = useState(() => {
    const cached = localStorage.getItem("pennywise_goals");
    return cached ? JSON.parse(cached) : DEFAULT_GOALS;
  });

  const [recurringBills, setRecurringBills] = useState(() => {
    const cached = localStorage.getItem("pennywise_recurring");
    return cached ? JSON.parse(cached) : DEFAULT_RECURRING;
  });

  const [groupExpenses, setGroupExpenses] = useState(() => {
    const cached = localStorage.getItem("pennywise_group");
    return cached ? JSON.parse(cached) : DEFAULT_GROUP_EXPENSES;
  });

  const [coachChatHistory, setCoachChatHistory] = useState([
    {
      id: "coach-intro",
      sender: "coach",
      text: "Hey Alex! I'm your PennyWise AI Financial Coach. Looking over your October cash flow, you've saved ₹12,731 so far! Your largest variable expense is Food & Dining. Ask me anything or tap one of the quick suggestions below.",
      timestamp: "Just now",
    },
  ]);

  // Persist locally
  useEffect(() => {
    localStorage.setItem("pennywise_currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("pennywise_allowance", String(monthlyAllowance));
  }, [monthlyAllowance]);

  useEffect(() => {
    localStorage.setItem("pennywise_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("pennywise_budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("pennywise_goals", JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem("pennywise_recurring", JSON.stringify(recurringBills));
  }, [recurringBills]);

  useEffect(() => {
    localStorage.setItem("pennywise_group", JSON.stringify(groupExpenses));
  }, [groupExpenses]);

  // Firestore Sync when authenticated
  useEffect(() => {
    if (!user) return;

    const userExpCol = collection(db, "users", user.uid, "expenses");
    const unsubscribeExp = onSnapshot(
      userExpCol,
      (snap) => {
        if (!snap.empty) {
          const list = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setExpenses(list);
        }
      },
      (err) => handleFirestoreError(err, "list", `users/${user.uid}/expenses`)
    );

    const userBudCol = collection(db, "users", user.uid, "budgets");
    const unsubscribeBud = onSnapshot(
      userBudCol,
      (snap) => {
        if (!snap.empty) {
          const list = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setBudgets(list);
        }
      },
      (err) => handleFirestoreError(err, "list", `users/${user.uid}/budgets`)
    );

    const userGoalCol = collection(db, "users", user.uid, "goals");
    const unsubscribeGoal = onSnapshot(
      userGoalCol,
      (snap) => {
        if (!snap.empty) {
          const list = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setSavingsGoals(list);
        }
      },
      (err) => handleFirestoreError(err, "list", `users/${user.uid}/goals`)
    );

    const userRecCol = collection(db, "users", user.uid, "recurring");
    const unsubscribeRec = onSnapshot(
      userRecCol,
      (snap) => {
        if (!snap.empty) {
          const list = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setRecurringBills(list);
        }
      },
      (err) => handleFirestoreError(err, "list", `users/${user.uid}/recurring`)
    );

    const userGrpCol = collection(db, "users", user.uid, "group_expenses");
    const unsubscribeGrp = onSnapshot(
      userGrpCol,
      (snap) => {
        if (!snap.empty) {
          const list = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setGroupExpenses(list);
        }
      },
      (err) => handleFirestoreError(err, "list", `users/${user.uid}/group_expenses`)
    );

    return () => {
      unsubscribeExp();
      unsubscribeBud();
      unsubscribeGoal();
      unsubscribeRec();
      unsubscribeGrp();
    };
  }, [user]);

  // Financial Computations
  const totalIncome = useMemo(() => {
    return expenses
      .filter((e) => e.type === "income")
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [expenses]);

  const totalExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.type === "expense" || !e.type)
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [expenses]);

  const remainingBalance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  // Pocket Money Runway Estimation
  const runway = useMemo(() => {
    const expenseItems = expenses.filter((e) => e.type === "expense" || !e.type);
    if (expenseItems.length === 0 || remainingBalance <= 0) {
      return { days: 0, dailyBurn: 0, status: "critical", message: "No active runway. Top up your pocket money." };
    }

    const dates = expenseItems.map((e) => new Date(e.date || Date.now()).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const daySpan = Math.max(Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1, 10);

    const dailyBurn = Math.round(totalExpenses / daySpan);
    const estimatedDays = dailyBurn > 0 ? Math.floor(remainingBalance / dailyBurn) : 999;

    let status = "safe";
    let message = "Your pocket money is healthy! Keep maintaining this daily burn rate.";
    if (estimatedDays < 7) {
      status = "critical";
      message = "Critical runway! You may run out of cash before the month ends.";
    } else if (estimatedDays < 18) {
      status = "warning";
      message = "Runway is getting tight. Consider cutting back on dining out.";
    }

    return {
      days: estimatedDays,
      dailyBurn,
      status,
      message,
    };
  }, [expenses, totalExpenses, remainingBalance]);

  // Unusual Expense Detection (expenses >= 2x category average & amount > 1500)
  const unusualExpenses = useMemo(() => {
    const catTotals = {};
    const catCounts = {};
    const items = expenses.filter((e) => e.type === "expense" || !e.type);

    items.forEach((item) => {
      const c = item.category || "Other";
      catTotals[c] = (catTotals[c] || 0) + Number(item.amount);
      catCounts[c] = (catCounts[c] || 0) + 1;
    });

    return items.filter((item) => {
      const c = item.category || "Other";
      const avg = catTotals[c] / (catCounts[c] || 1);
      return item.amount >= avg * 2 && item.amount > 1500;
    });
  }, [expenses]);

  // Formatted currency helper
  const formatAmt = useCallback(
    (n) => {
      return `${currency}${Number(n || 0).toLocaleString("en-IN")}`;
    },
    [currency]
  );

  // CRUD Actions - Expenses
  const addExpense = useCallback(
    async (item) => {
      const newId = `exp-${Date.now()}`;
      const record = { ...item, id: newId, createdAt: new Date().toISOString() };

      setExpenses((prev) => [record, ...prev]);

      if (user) {
        try {
          const ref = doc(db, "users", user.uid, "expenses", newId);
          await setDoc(ref, record);
        } catch (err) {
          handleFirestoreError(err, "create", `users/${user.uid}/expenses/${newId}`);
        }
      }
      return record;
    },
    [user]
  );

  const editExpense = useCallback(
    async (id, updatedFields) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
      );
      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid, "expenses", id), updatedFields, { merge: true });
        } catch (err) {
          handleFirestoreError(err, "update", `users/${user.uid}/expenses/${id}`);
        }
      }
    },
    [user]
  );

  const deleteExpense = useCallback(
    async (id) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      if (user) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "expenses", id));
        } catch (err) {
          handleFirestoreError(err, "delete", `users/${user.uid}/expenses/${id}`);
        }
      }
    },
    [user]
  );

  // CRUD Actions - Budgets
  const addBudget = useCallback(
    async (budget) => {
      const newId = `bud-${Date.now()}`;
      const record = { ...budget, id: newId };
      setBudgets((prev) => [...prev, record]);
      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid, "budgets", newId), record);
        } catch (err) {
          handleFirestoreError(err, "create", `users/${user.uid}/budgets/${newId}`);
        }
      }
    },
    [user]
  );

  const updateBudget = useCallback(
    async (id, updated) => {
      setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid, "budgets", id), updated, { merge: true });
        } catch (err) {
          handleFirestoreError(err, "update", `users/${user.uid}/budgets/${id}`);
        }
      }
    },
    [user]
  );

  const deleteBudget = useCallback(
    async (id) => {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      if (user) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "budgets", id));
        } catch (err) {
          handleFirestoreError(err, "delete", `users/${user.uid}/budgets/${id}`);
        }
      }
    },
    [user]
  );

  // CRUD Actions - Savings Goals
  const addSavingsGoal = useCallback(
    async (goal) => {
      const newId = `goal-${Date.now()}`;
      const record = { ...goal, id: newId, currentAmount: Number(goal.currentAmount || 0) };
      setSavingsGoals((prev) => [...prev, record]);
      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid, "goals", newId), record);
        } catch (err) {
          handleFirestoreError(err, "create", `users/${user.uid}/goals/${newId}`);
        }
      }
    },
    [user]
  );

  const contributeToGoal = useCallback(
    async (id, amount) => {
      setSavingsGoals((prev) =>
        prev.map((g) => {
          if (g.id === id) {
            const nextAmt = Math.min(Number(g.currentAmount || 0) + Number(amount), g.targetAmount);
            return { ...g, currentAmount: nextAmt };
          }
          return g;
        })
      );

      // Record as savings transfer expense
      addExpense({
        title: `Goal Contribution: ${savingsGoals.find((g) => g.id === id)?.name || "Savings"}`,
        amount: Number(amount),
        category: "Savings",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
        notes: "Transferred to savings goal fund",
      });

      if (user) {
        try {
          const currentGoal = savingsGoals.find((g) => g.id === id);
          if (currentGoal) {
            const nextAmt = Number(currentGoal.currentAmount || 0) + Number(amount);
            await setDoc(doc(db, "users", user.uid, "goals", id), { currentAmount: nextAmt }, { merge: true });
          }
        } catch (err) {
          handleFirestoreError(err, "update", `users/${user.uid}/goals/${id}`);
        }
      }
    },
    [user, savingsGoals, addExpense]
  );

  const deleteSavingsGoal = useCallback(
    async (id) => {
      setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
      if (user) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "goals", id));
        } catch (err) {
          handleFirestoreError(err, "delete", `users/${user.uid}/goals/${id}`);
        }
      }
    },
    [user]
  );

  // CRUD Actions - Recurring Bills
  const addRecurringBill = useCallback(
    async (bill) => {
      const newId = `rec-${Date.now()}`;
      const record = { ...bill, id: newId, status: bill.status || "due" };
      setRecurringBills((prev) => [...prev, record]);
      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid, "recurring", newId), record);
        } catch (err) {
          handleFirestoreError(err, "create", `users/${user.uid}/recurring/${newId}`);
        }
      }
    },
    [user]
  );

  const toggleRecurringPaid = useCallback(
    async (id) => {
      setRecurringBills((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const nextStatus = r.status === "paid" ? "due" : "paid";
            return { ...r, status: nextStatus };
          }
          return r;
        })
      );
      if (user) {
        try {
          const bill = recurringBills.find((b) => b.id === id);
          const nextStatus = bill?.status === "paid" ? "due" : "paid";
          await setDoc(doc(db, "users", user.uid, "recurring", id), { status: nextStatus }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, "update", `users/${user.uid}/recurring/${id}`);
        }
      }
    },
    [user, recurringBills]
  );

  const deleteRecurringBill = useCallback(
    async (id) => {
      setRecurringBills((prev) => prev.filter((r) => r.id !== id));
      if (user) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "recurring", id));
        } catch (err) {
          handleFirestoreError(err, "delete", `users/${user.uid}/recurring/${id}`);
        }
      }
    },
    [user]
  );

  // CRUD Actions - Group Expenses
  const addGroupExpense = useCallback(
    async (item) => {
      const newId = `grp-${Date.now()}`;
      const record = { ...item, id: newId, date: item.date || new Date().toISOString().split("T")[0] };
      setGroupExpenses((prev) => [record, ...prev]);

      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid, "group_expenses", newId), record);
        } catch (err) {
          handleFirestoreError(err, "create", `users/${user.uid}/group_expenses/${newId}`);
        }
      }
      return record;
    },
    [user]
  );

  const settleGroupMember = useCallback(
    async (expenseId, memberName) => {
      setGroupExpenses((prev) =>
        prev.map((item) => {
          if (item.id === expenseId) {
            const updatedMembers = item.members.map((m) =>
              m.name === memberName ? { ...m, settled: !m.settled } : m
            );
            const allSettled = updatedMembers.every((m) => m.settled);
            return {
              ...item,
              members: updatedMembers,
              status: allSettled ? "settled" : "partially_settled",
            };
          }
          return item;
        })
      );

      if (user) {
        try {
          const current = groupExpenses.find((g) => g.id === expenseId);
          if (current) {
            const updatedMembers = current.members.map((m) =>
              m.name === memberName ? { ...m, settled: !m.settled } : m
            );
            const allSettled = updatedMembers.every((m) => m.settled);
            await setDoc(
              doc(db, "users", user.uid, "group_expenses", expenseId),
              { members: updatedMembers, status: allSettled ? "settled" : "partially_settled" },
              { merge: true }
            );
          }
        } catch (err) {
          handleFirestoreError(err, "update", `users/${user.uid}/group_expenses/${expenseId}`);
        }
      }
    },
    [user, groupExpenses]
  );

  const deleteGroupExpense = useCallback(
    async (id) => {
      setGroupExpenses((prev) => prev.filter((g) => g.id !== id));
      if (user) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "group_expenses", id));
        } catch (err) {
          handleFirestoreError(err, "delete", `users/${user.uid}/group_expenses/${id}`);
        }
      }
    },
    [user]
  );

  // Reset to default sample data
  const resetAllData = useCallback(() => {
    setExpenses(DEFAULT_EXPENSES);
    setBudgets(DEFAULT_BUDGETS);
    setSavingsGoals(DEFAULT_GOALS);
    setRecurringBills(DEFAULT_RECURRING);
    setGroupExpenses(DEFAULT_GROUP_EXPENSES);
    localStorage.removeItem("pennywise_expenses");
    localStorage.removeItem("pennywise_budgets");
    localStorage.removeItem("pennywise_goals");
    localStorage.removeItem("pennywise_recurring");
    localStorage.removeItem("pennywise_group");
  }, []);

  // AI Integration Handlers
  const askAICoach = async (question) => {
    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuestion: question,
          expenses,
          budgets,
          savingsGoals,
          balance: remainingBalance,
          currency,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      const reply = data.reply || "I analyzed your expenses! Your spending pace looks steady.";

      setCoachChatHistory((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, sender: "user", text: question, timestamp: "Just now" },
        { id: `coach-${Date.now()}`, sender: "coach", text: reply, timestamp: "Just now" },
      ]);
      return reply;
    } catch (err) {
      console.error("Coach client error:", err);
      const fallbackReply = `Here's a quick analysis of your ${currency}${totalExpenses.toLocaleString()} spending: Your largest category is Housing & Food. With ${currency}${remainingBalance.toLocaleString()} remaining and a ${runway.days}-day runway, try capping non-essential weekend dining to stretch your pocket money!`;
      setCoachChatHistory((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, sender: "user", text: question, timestamp: "Just now" },
        { id: `coach-${Date.now()}`, sender: "coach", text: fallbackReply, timestamp: "Just now" },
      ]);
      return fallbackReply;
    }
  };

  const scanReceipt = async (imageBase64, mimeType = "image/jpeg") => {
    try {
      const res = await fetch("/api/ai/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType }),
      });
      if (!res.ok) {
        throw new Error(`Scanner error ${res.status}`);
      }
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.error("Scan receipt error:", err);
      throw err;
    }
  };

  // Export CSV Report
  const exportCSV = () => {
    const headers = ["Title,Category,Amount,Type,Date,Notes\n"];
    const rows = expenses.map(
      (e) => `"${e.title}","${e.category}",${e.amount},"${e.type || "expense"}","${e.date}","${e.notes || ""}"\n`
    );
    const blob = new Blob([headers.join("") + rows.join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `pennywise_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Professional PDF Financial Statement
  const exportPDF = useCallback(() => {
    try {
      generatePennyWisePDF({
        currency,
        userName: user?.displayName || user?.email?.split("@")[0] || "Student",
        userEmail: user?.email || "",
        totalIncome,
        totalExpenses,
        remainingBalance,
        runway,
        expenses,
        budgets,
        savingsGoals,
        recurringBills,
        unusualExpenses,
        fileName: `PennyWise_Statement_${new Date().toISOString().split("T")[0]}.pdf`,
      });
    } catch (err) {
      console.error("PDF generation error, fallback to window.print():", err);
      window.print();
    }
  }, [currency, user, totalIncome, totalExpenses, remainingBalance, runway, expenses, budgets, savingsGoals, recurringBills, unusualExpenses]);

  // Printable Report Trigger
  const printReport = useCallback(() => {
    exportPDF();
  }, [exportPDF]);

  return (
    <ExpenseContext.Provider
      value={{
        currency,
        setCurrency,
        formatAmt,
        monthlyAllowance,
        setMonthlyAllowance,
        expenses,
        budgets,
        savingsGoals,
        recurringBills,
        groupExpenses,
        coachChatHistory,
        totalIncome,
        totalExpenses,
        remainingBalance,
        runway,
        unusualExpenses,
        addExpense,
        editExpense,
        deleteExpense,
        addBudget,
        updateBudget,
        deleteBudget,
        addSavingsGoal,
        contributeToGoal,
        deleteSavingsGoal,
        addRecurringBill,
        toggleRecurringPaid,
        deleteRecurringBill,
        addGroupExpense,
        settleGroupMember,
        deleteGroupExpense,
        resetAllData,
        askAICoach,
        scanReceipt,
        exportCSV,
        exportPDF,
        printReport,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}

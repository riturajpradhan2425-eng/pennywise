import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  RotateCcw,
  Wallet,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { Reveal, Tag } from "./anim";
import { inr } from "../lib/format";

// Realistic student monthly data sets across the academic semester
const MONTH_DATA = {
  "2026-10": {
    monthName: "October 2026",
    status: "Current Month",
    daysRemaining: 21,
    incomes: [
      { id: "inc-1", name: "Campus Research Stipend", category: "Campus Job", amount: 18000 },
      { id: "inc-2", name: "Peer Tutoring & Lab Assistant", category: "Freelance", amount: 6500 },
      { id: "inc-3", name: "Family Campus Allowance", category: "Allowance", amount: 8000 },
    ],
    expenses: [
      { id: "exp-1", name: "Hostel / Room Rent", category: "Housing", amount: 9500, color: "#60A5FA" },
      { id: "exp-2", name: "Campus Mess & Groceries", category: "Food & Dining", amount: 5200, color: "#34D399" },
      { id: "exp-3", name: "Semester Books & Printing", category: "Academics", amount: 1650, color: "#A78BFA" },
      { id: "exp-4", name: "Metro & Campus Shuttle", category: "Transport", amount: 1200, color: "#FBBF24" },
      { id: "exp-5", name: "Weekend Social & Coffee", category: "Lifestyle", amount: 2100, color: "#F472B6" },
    ],
  },
  "2026-09": {
    monthName: "September 2026",
    status: "Previous Month",
    daysRemaining: 0,
    incomes: [
      { id: "inc-1", name: "Campus Research Stipend", category: "Campus Job", amount: 18000 },
      { id: "inc-2", name: "Peer Tutoring & Lab Assistant", category: "Freelance", amount: 5000 },
      { id: "inc-3", name: "Family Campus Allowance", category: "Allowance", amount: 8000 },
    ],
    expenses: [
      { id: "exp-1", name: "Hostel / Room Rent", category: "Housing", amount: 9500, color: "#60A5FA" },
      { id: "exp-2", name: "Campus Mess & Groceries", category: "Food & Dining", amount: 5900, color: "#34D399" },
      { id: "exp-3", name: "Lab Manuals & Software Sub", category: "Academics", amount: 2800, color: "#A78BFA" },
      { id: "exp-4", name: "Metro Pass", category: "Transport", amount: 1200, color: "#FBBF24" },
      { id: "exp-5", name: "Club Fees & Outings", category: "Lifestyle", amount: 3100, color: "#F472B6" },
    ],
  },
  "2026-11": {
    monthName: "November 2026",
    status: "Projected Month",
    daysRemaining: 30,
    incomes: [
      { id: "inc-1", name: "Campus Research Stipend", category: "Campus Job", amount: 18000 },
      { id: "inc-2", name: "Peer Tutoring & Lab Assistant", category: "Freelance", amount: 7000 },
      { id: "inc-3", name: "Family Campus Allowance", category: "Allowance", amount: 8000 },
    ],
    expenses: [
      { id: "exp-1", name: "Hostel / Room Rent", category: "Housing", amount: 9500, color: "#60A5FA" },
      { id: "exp-2", name: "Campus Mess & Groceries", category: "Food & Dining", amount: 4800, color: "#34D399" },
      { id: "exp-3", name: "Exam Prep & Library Fees", category: "Academics", amount: 1100, color: "#A78BFA" },
      { id: "exp-4", name: "Transit", category: "Transport", amount: 1200, color: "#FBBF24" },
      { id: "exp-5", name: "Diwali & Midterm Outings", category: "Lifestyle", amount: 2600, color: "#F472B6" },
    ],
  },
};

const MONTH_KEYS = ["2026-09", "2026-10", "2026-11"];

export default function MonthlyBudgetOverview() {
  const [selectedMonth, setSelectedMonth] = useState("2026-10");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'income' | 'expenses'
  const [customTransactions, setCustomTransactions] = useState({
    "2026-10": { extraIncome: 0, extraExpense: 0, history: [] },
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState("expense"); // 'income' | 'expense'
  const [addName, setAddName] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addCategory, setAddCategory] = useState("Food & Dining");

  const monthConfig = MONTH_DATA[selectedMonth] || MONTH_DATA["2026-10"];
  const custom = customTransactions[selectedMonth] || { extraIncome: 0, extraExpense: 0, history: [] };

  // Calculate totals
  const baseIncome = useMemo(
    () => monthConfig.incomes.reduce((acc, i) => acc + i.amount, 0),
    [monthConfig]
  );
  const totalIncome = baseIncome + custom.extraIncome;

  const baseExpense = useMemo(
    () => monthConfig.expenses.reduce((acc, e) => acc + e.amount, 0),
    [monthConfig]
  );
  const totalExpenses = baseExpense + custom.extraExpense;

  const remainingBalance = totalIncome - totalExpenses;
  const spentRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const clampedRatio = Math.min(Math.max(spentRatio, 0), 100);

  // Daily budget remaining
  const daysLeft = monthConfig.daysRemaining || 1;
  const dailyAllowance = remainingBalance > 0 && daysLeft > 0 ? Math.round(remainingBalance / daysLeft) : 0;

  // Circular progress math (SVG dimensions)
  const size = 260;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedRatio / 100) * circumference;

  // Health color state
  const isOverBudget = spentRatio > 100;
  const isHighSpend = spentRatio >= 85 && !isOverBudget;
  const ringColor = isOverBudget ? "#FF5B5B" : isHighSpend ? "#F59E0B" : "#00E599";

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const val = parseFloat(addAmount);
    if (!val || val <= 0 || !addName.trim()) return;

    setCustomTransactions((prev) => {
      const current = prev[selectedMonth] || { extraIncome: 0, extraExpense: 0, history: [] };
      const newEntry = {
        id: `tx-${Date.now()}`,
        name: addName.trim(),
        category: addCategory,
        amount: val,
        type: addType,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      return {
        ...prev,
        [selectedMonth]: {
          ...current,
          extraIncome: addType === "income" ? current.extraIncome + val : current.extraIncome,
          extraExpense: addType === "expense" ? current.extraExpense + val : current.extraExpense,
          history: [newEntry, ...current.history],
        },
      };
    });

    setAddName("");
    setAddAmount("");
    setShowAddModal(false);
  };

  const handleResetMonth = () => {
    setCustomTransactions((prev) => ({
      ...prev,
      [selectedMonth]: { extraIncome: 0, extraExpense: 0, history: [] },
    }));
  };

  return (
    <section id="budget-overview" className="relative overflow-hidden py-24 md:py-32">
      {/* Background glow and subtle mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_35%,rgba(0,229,153,0.07),transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/4 top-1/2 -z-10 h-96 w-96 rounded-full bg-mint/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Tag>Monthly Cash Flow</Tag>
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Total Income vs. Expenses{" "}
            <em className="font-display font-light italic text-mint">at a glance.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-mist md:text-lg">
            Real-time monthly burn rate and discretionary savings gauge. Track every campus rupee before the weekend arrives.
          </p>
        </Reveal>

        {/* Month Selector Bar & Quick Actions */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Segmented Month Tabs */}
          <div className="flex items-center rounded-2xl border border-line bg-surface-1/80 p-1.5 backdrop-blur">
            {MONTH_KEYS.map((mKey) => {
              const m = MONTH_DATA[mKey];
              const isSelected = selectedMonth === mKey;
              return (
                <button
                  key={mKey}
                  type="button"
                  onClick={() => setSelectedMonth(mKey)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-mint text-ink shadow-[0_0_20px_rgba(0,229,153,0.35)]"
                      : "text-mist hover:text-white"
                  }`}
                >
                  <Calendar size={13} className={isSelected ? "text-ink" : "text-mist"} />
                  <span>{m.monthName}</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {custom.history.length > 0 && (
              <button
                type="button"
                onClick={handleResetMonth}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-1/60 px-3.5 py-2 text-xs font-medium text-mist transition-colors hover:border-mint/40 hover:text-white"
              >
                <RotateCcw size={13} />
                <span>Reset Simulation</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setAddType("income");
                setAddCategory("Campus Job");
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-1/80 px-3.5 py-2 text-xs font-medium text-white transition-all hover:border-mint/50 hover:bg-surface-2"
            >
              <Plus size={13} className="text-mint" />
              <span>Add Income</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAddType("expense");
                setAddCategory("Food & Dining");
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-mint px-4 py-2 font-heading text-xs font-semibold text-ink shadow-[0_0_20px_rgba(0,229,153,0.3)] transition-all hover:shadow-[0_0_32px_rgba(0,229,153,0.5)]"
            >
              <Plus size={13} />
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Card 1: Total Income Overview */}
          <div className="flex flex-col justify-between rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl sm:p-8 lg:col-span-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-mist">
                  Total Income
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint/10 text-mint">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <h3 className="mt-3 font-mono text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
                {inr(totalIncome)}
              </h3>
              <p className="mt-1 text-xs text-mist">
                {monthConfig.monthName} · Verified cash inflows
              </p>

              {/* Incomes Source Breakdown */}
              <div className="mt-6 space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-mist/80">
                  Income Streams
                </span>
                {monthConfig.incomes.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-surface-2/40 px-3 py-2.5 transition-colors hover:bg-surface-2/70"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white/95">{item.name}</p>
                      <p className="font-mono text-[10px] text-mist">{item.category}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-mint tabular-nums">
                      +{inr(item.amount)}
                    </span>
                  </div>
                ))}

                {custom.history
                  .filter((tx) => tx.type === "income")
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-xl border border-mint/20 bg-mint/5 px-3 py-2.5"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{tx.name}</p>
                        <p className="font-mono text-[10px] text-mint">Added {tx.timestamp}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-mint tabular-nums">
                        +{inr(tx.amount)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-6 border-t border-line/80 pt-4 text-[11px] text-mist flex items-center justify-between">
              <span>Campus Direct Deposit</span>
              <span className="font-semibold text-white">Active</span>
            </div>
          </div>

          {/* Card 2: Center Circular Gauge & Net Position */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-surface-1 to-surface-2/80 p-8 shadow-2xl backdrop-blur-xl lg:col-span-6 text-center">
            {/* Ambient Radial Spotlight */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${ringColor}22 0%, transparent 65%)`,
              }}
            />

            {/* Status Kicker */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-ink/60 px-3.5 py-1.5 text-xs text-mist backdrop-blur">
              {isOverBudget ? (
                <>
                  <AlertTriangle size={14} className="text-alert" />
                  <span className="font-semibold text-alert">Budget Exceeded by {inr(Math.abs(remainingBalance))}</span>
                </>
              ) : isHighSpend ? (
                <>
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span className="text-white">Caution: Approaching monthly limit</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} className="text-mint" />
                  <span className="text-white">Pacing Smoothly · {clampedRatio.toFixed(1)}% of Income Used</span>
                </>
              )}
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative my-4 flex items-center justify-center">
              <svg width={size} height={size} className="rotate-[-90deg]">
                {/* Background Track */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#1F2E27"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Active Dynamic Progress Ring */}
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={ringColor}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    filter: `drop-shadow(0 0 16px ${ringColor}66)`,
                  }}
                />
              </svg>

              {/* Center Content Inside Gauge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="font-mono text-[11px] uppercase tracking-widest text-mist">
                  {remainingBalance >= 0 ? "Saved / Unspent" : "Deficit"}
                </span>
                <motion.p
                  key={remainingBalance}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`mt-1 font-mono text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl ${
                    remainingBalance >= 0 ? "text-white" : "text-alert"
                  }`}
                >
                  {remainingBalance >= 0 ? `+${inr(remainingBalance)}` : `-${inr(Math.abs(remainingBalance))}`}
                </motion.p>
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  <span className="font-mono font-bold tabular-nums" style={{ color: ringColor }}>
                    {spentRatio.toFixed(1)}%
                  </span>
                  <span className="text-mist">spent</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar below Gauge */}
            <div className="mt-4 grid w-full grid-cols-2 gap-4 border-t border-line/80 pt-6 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-line/60 bg-ink/50 p-3.5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-mist">Monthly Income</p>
                <p className="mt-1 font-mono text-base font-bold text-mint tabular-nums">
                  {inr(totalIncome)}
                </p>
              </div>

              <div className="rounded-2xl border border-line/60 bg-ink/50 p-3.5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-mist">Total Expenses</p>
                <p className="mt-1 font-mono text-base font-bold text-white tabular-nums">
                  {inr(totalExpenses)}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-2xl border border-line/60 bg-ink/50 p-3.5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-mist">Daily Safe Pace</p>
                <p className="mt-1 font-mono text-base font-bold text-white tabular-nums">
                  {dailyAllowance > 0 ? `${inr(dailyAllowance)}/day` : "₹0/day"}
                </p>
                <p className="text-[10px] text-mist/70 mt-0.5">
                  {daysLeft} days remaining
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Total Expenses Breakdown */}
          <div className="flex flex-col justify-between rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl sm:p-8 lg:col-span-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-mist">
                  Total Expenses
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-alert/10 text-alert">
                  <ArrowDownRight size={18} />
                </span>
              </div>
              <h3 className="mt-3 font-mono text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
                {inr(totalExpenses)}
              </h3>
              <p className="mt-1 text-xs text-mist">
                Across {monthConfig.expenses.length} core categories
              </p>

              {/* Expense Categories Bar Breakdown */}
              <div className="mt-6 space-y-3.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-mist/80">
                  Category Distribution
                </span>
                {monthConfig.expenses.map((cat) => {
                  const pct = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-white/90">{cat.name}</span>
                        <span className="font-mono text-mist tabular-nums">{inr(cat.amount)}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: cat.color || "#00E599",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {custom.history
                  .filter((tx) => tx.type === "expense")
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-xl border border-alert/20 bg-alert/5 px-3 py-2"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{tx.name}</p>
                        <p className="font-mono text-[10px] text-alert">{tx.category} · {tx.timestamp}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-alert tabular-nums">
                        -{inr(tx.amount)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-6 border-t border-line/80 pt-4 text-[11px] text-mist flex items-center justify-between">
              <span>Automatic Categorization</span>
              <span className="font-semibold text-mint">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface-1/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <h3 className="font-heading text-2xl font-bold text-white">
                {addType === "income" ? "Log New Income" : "Add Student Expense"}
              </h3>
              <p className="mt-1 text-xs text-mist">
                Instantly recalculate your monthly progress bar and remaining daily allowance.
              </p>

              {/* Type Switcher */}
              <div className="mt-5 flex rounded-xl border border-line bg-ink/60 p-1">
                <button
                  type="button"
                  onClick={() => setAddType("expense")}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                    addType === "expense" ? "bg-mint text-ink shadow-sm" : "text-mist hover:text-white"
                  }`}
                >
                  Expense (-)
                </button>
                <button
                  type="button"
                  onClick={() => setAddType("income")}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                    addType === "income" ? "bg-mint text-ink shadow-sm" : "text-mist hover:text-white"
                  }`}
                >
                  Income (+)
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-mist">Item Description</label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder={addType === "expense" ? "e.g. Campus Coffee, Textbooks" : "e.g. Freelance Design, Tutoring"}
                    className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm text-white placeholder-mist/60 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-mist">Amount (₹ INR)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 font-mono text-sm text-white placeholder-mist/60 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-mist">Category</label>
                  <select
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                    className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm text-white outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                  >
                    {addType === "expense" ? (
                      <>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Housing">Housing & Hostel</option>
                        <option value="Academics">Academics & Tech</option>
                        <option value="Transport">Transport</option>
                        <option value="Lifestyle">Lifestyle & Entertainment</option>
                        <option value="Personal Care">Personal Care</option>
                      </>
                    ) : (
                      <>
                        <option value="Campus Job">Campus Job</option>
                        <option value="Freelance">Freelance / Gig</option>
                        <option value="Allowance">Allowance</option>
                        <option value="Scholarship">Scholarship / Grant</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-mist hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-mint px-5 py-2.5 font-heading text-xs font-semibold text-ink shadow-[0_0_20px_rgba(0,229,153,0.3)] hover:shadow-[0_0_32px_rgba(0,229,153,0.5)] transition-all"
                  >
                    {addType === "income" ? "Add Income" : "Record Expense"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

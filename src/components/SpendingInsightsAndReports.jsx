import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Search,
  CheckCircle2,
  Trash2,
  Plus,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Download,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { Reveal, Tag } from "./anim";
import { inr } from "../lib/format";

const CATEGORY_COLORS = {
  "Food & Dining": "#34D399",
  Housing: "#60A5FA",
  Academics: "#A78BFA",
  Transport: "#FBBF24",
  Lifestyle: "#F472B6",
  Utilities: "#38BDF8",
  Healthcare: "#FB7185",
  Savings: "#4ADE80",
  Other: "#94A3B8",
};

export default function SpendingInsightsAndReports() {
  const {
    expenses,
    totalIncome,
    totalExpenses,
    remainingBalance,
    runway,
    unusualExpenses,
    deleteExpense,
    addExpense,
    exportCSV,
    printReport,
  } = useExpenses();

  const [activeTab, setActiveTab] = useState("insights"); // 'insights' | 'reports' | 'predictions'
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dismissedAlerts, setDismissedAlerts] = useState({});

  // Quick add form state for table
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("Food & Dining");
  const [newType, setNewType] = useState("expense");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);

  // Printable view modal
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Category breakdown calculation
  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses
      .filter((e) => e.type === "expense" || !e.type)
      .forEach((e) => {
        const cat = e.category || "Other";
        totals[cat] = (totals[cat] || 0) + Number(e.amount);
      });
    return Object.entries(totals)
      .map(([name, amount]) => ({
        name,
        amount,
        color: CATEGORY_COLORS[name] || "#94A3B8",
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpenses]);

  // Monthly Comparison Stats
  const monthlyComparison = useMemo(() => {
    const currentSpend = totalExpenses;
    const previousSpend = 22500;
    const diff = currentSpend - previousSpend;
    const pctChange = previousSpend > 0 ? Math.round((diff / previousSpend) * 100) : 0;

    return {
      currentSpend,
      previousSpend,
      diff,
      pctChange,
      isBetter: diff <= 0,
    };
  }, [totalExpenses]);

  // Spending Predictions based on current burn rate & date in month
  const spendingPrediction = useMemo(() => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = 31;
    const daysLeft = Math.max(daysInMonth - dayOfMonth, 1);

    const expenseItems = expenses.filter((e) => e.type === "expense" || !e.type);
    const avgDailyRate =
      expenseItems.length > 0 && dayOfMonth > 0
        ? Math.round(totalExpenses / dayOfMonth)
        : Math.round(totalExpenses / 10);

    const projectedTotal = totalExpenses + avgDailyRate * daysLeft;
    const projectedSavings = totalIncome - projectedTotal;

    const suggestedDailyCap =
      remainingBalance > 0 && daysLeft > 0 ? Math.floor(remainingBalance / daysLeft) : 0;

    return {
      avgDailyRate,
      projectedTotal,
      projectedSavings,
      suggestedDailyCap,
      daysLeft,
      burnRateStatus:
        avgDailyRate > 900 ? "high" : avgDailyRate > 500 ? "moderate" : "conservative",
    };
  }, [expenses, totalExpenses, totalIncome, remainingBalance]);

  // Filtered transactions for the report table
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
      const matchesType =
        typeFilter === "all" || (typeFilter === "expense" ? e.type !== "income" : e.type === "income");
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [expenses, searchQuery, categoryFilter, typeFilter]);

  const handleAddNewTransaction = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || Number(newAmount) <= 0) return;

    await addExpense({
      title: newTitle.trim(),
      amount: Number(newAmount),
      category: newType === "income" ? "Income" : newCategory,
      type: newType,
      date: newDate || new Date().toISOString().split("T")[0],
    });

    setNewTitle("");
    setNewAmount("");
    setShowAddForm(false);
  };

  const activeUnusual = unusualExpenses.filter((e) => !dismissedAlerts[e.id]);

  return (
    <section id="insights-reports" className="relative overflow-hidden py-24 md:py-32">
      {/* Background ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(0,229,153,0.06),transparent_75%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Tag>Smart Analytics · Hackathon Ready</Tag>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Spending Insights & <span className="font-display italic text-mint">Reports.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-4 text-base leading-relaxed text-mist md:text-lg">
              Understand your campus cash flow with real-time category breakdowns, automated anomaly
              detection, end-of-month predictions, and one-click CSV & PDF export.
            </p>
          </Reveal>
        </div>

        {/* Tab switcher */}
        <Reveal delay={0.24}>
          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-2xl border border-line bg-surface-1/90 p-1.5 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setActiveTab("insights")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                  activeTab === "insights"
                    ? "bg-mint text-ink shadow-[0_4px_20px_rgba(0,229,153,0.3)]"
                    : "text-mist hover:text-white"
                }`}
              >
                <PieChart size={16} />
                Visual Insights & Trends
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("predictions")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                  activeTab === "predictions"
                    ? "bg-mint text-ink shadow-[0_4px_20px_rgba(0,229,153,0.3)]"
                    : "text-mist hover:text-white"
                }`}
              >
                <Sparkles size={16} />
                AI Predictions & Runway
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("reports")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                  activeTab === "reports"
                    ? "bg-mint text-ink shadow-[0_4px_20px_rgba(0,229,153,0.3)]"
                    : "text-mist hover:text-white"
                }`}
              >
                <FileSpreadsheet size={16} />
                Expense Ledger & Export
              </button>
            </div>
          </div>
        </Reveal>

        {/* TAB 1: VISUAL INSIGHTS & ANOMALIES */}
        {activeTab === "insights" && (
          <div className="mt-10 space-y-8">
            {/* Unusual Expenses Alert Banner (if any) */}
            {activeUnusual.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-3xl border border-alert/30 bg-alert/10 p-5 md:p-6 backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-alert/20 text-alert">
                    <ShieldAlert size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-heading text-base font-bold text-white">
                        Unusual Expense Anomaly Detected
                      </h3>
                      <span className="rounded-full bg-alert/20 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase text-alert">
                        {activeUnusual.length} Anomalies Flagged
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-mist sm:text-sm">
                      We noticed purchases that exceed 2.5× your typical category average. Double-check these to
                      prevent budget drain:
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {activeUnusual.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-alert/20 bg-ink/60 px-3.5 py-2.5 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-white truncate max-w-[140px]">{item.title}</p>
                            <p className="text-[11px] text-mist">
                              {item.category} · {item.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-alert">{inr(item.amount)}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setDismissedAlerts((prev) => ({ ...prev, [item.id]: true }))
                              }
                              title="Acknowledge alert"
                              className="rounded-lg p-1 text-mist hover:bg-surface-2 hover:text-white"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Metrics Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-mist">Monthly Outflow</span>
                  <span className="rounded-lg bg-alert/10 p-2 text-alert">
                    <TrendingDown size={16} />
                  </span>
                </div>
                <p className="mt-3 font-mono text-2xl font-bold text-white sm:text-3xl">
                  {inr(totalExpenses)}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <span
                    className={
                      monthlyComparison.isBetter
                        ? "font-semibold text-mint"
                        : "font-semibold text-alert"
                    }
                  >
                    {monthlyComparison.pctChange > 0 ? "+" : ""}
                    {monthlyComparison.pctChange}%
                  </span>
                  <span className="text-mist">vs last month ({inr(monthlyComparison.previousSpend)})</span>
                </div>
              </div>

              <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-mist">Monthly Inflow</span>
                  <span className="rounded-lg bg-mint/10 p-2 text-mint">
                    <TrendingUp size={16} />
                  </span>
                </div>
                <p className="mt-3 font-mono text-2xl font-bold text-white sm:text-3xl">
                  {inr(totalIncome)}
                </p>
                <p className="mt-2 text-xs text-mist">Stipend + Allowance + Tutoring</p>
              </div>

              <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-mist">Remaining Pocket Money</span>
                  <span className="rounded-lg bg-sky/10 p-2 text-sky">
                    <Calendar size={16} />
                  </span>
                </div>
                <p className="mt-3 font-mono text-2xl font-bold text-mint sm:text-3xl">
                  {inr(remainingBalance)}
                </p>
                <p className="mt-2 text-xs text-mist">
                  {Math.round((remainingBalance / (totalIncome || 1)) * 100)}% of income remaining
                </p>
              </div>

              <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-mist">Daily Burn Rate</span>
                  <span className="rounded-lg bg-amber-400/10 p-2 text-amber-400">
                    <Clock size={16} />
                  </span>
                </div>
                <p className="mt-3 font-mono text-2xl font-bold text-white sm:text-3xl">
                  {inr(spendingPrediction.avgDailyRate)}
                  <span className="text-xs font-normal text-mist"> / day</span>
                </p>
                <p className="mt-2 text-xs text-mist">
                  Safe cap: <span className="font-semibold text-mint">{inr(spendingPrediction.suggestedDailyCap)}/day</span>
                </p>
              </div>
            </div>

            {/* Visual Category Breakdown & Bar Charts */}
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Category Breakdown Bars */}
              <div className="rounded-3xl border border-line bg-surface-1/90 p-6 sm:p-8 backdrop-blur-xl lg:col-span-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
                      Category Breakdown
                    </h3>
                    <p className="text-xs text-mist">Live distribution across semester expenses</p>
                  </div>
                  <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-mist">
                    {categoryTotals.length} categories
                  </span>
                </div>

                {/* Progress bar visualizer */}
                <div className="mt-6 flex h-4 w-full overflow-hidden rounded-full bg-surface-2 p-0.5">
                  {categoryTotals.map((cat) => (
                    <div
                      key={cat.name}
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                      title={`${cat.name}: ${cat.percentage}%`}
                      className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                    />
                  ))}
                </div>

                {/* Category List */}
                <div className="mt-6 space-y-3.5">
                  {categoryTotals.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-white">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-mist">{cat.percentage}%</span>
                        <span className="w-20 text-right font-mono font-bold text-white">
                          {inr(cat.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Comparison Shift Card */}
              <div className="flex flex-col justify-between rounded-3xl border border-line bg-surface-1/90 p-6 sm:p-8 backdrop-blur-xl lg:col-span-5">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
                    Monthly Spending Shift
                  </h3>
                  <p className="text-xs text-mist">Comparison against previous month baseline</p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-line bg-surface-2/60 p-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-mist">October 2026 (Current)</span>
                        <span className="font-mono font-bold text-white">{inr(totalExpenses)}</span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink">
                        <div
                          className="h-full bg-mint rounded-full"
                          style={{ width: `${Math.min((totalExpenses / 30000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-line bg-surface-2/60 p-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-mist">September 2026 (Last Month)</span>
                        <span className="font-mono font-bold text-white">
                          {inr(monthlyComparison.previousSpend)}
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink">
                        <div
                          className="h-full bg-sky rounded-full"
                          style={{
                            width: `${Math.min((monthlyComparison.previousSpend / 30000) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-line bg-surface-2/60 p-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-mist">November 2026 (Projected)</span>
                        <span className="font-mono font-bold text-white">
                          {inr(spendingPrediction.projectedTotal)}
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink">
                        <div
                          className="h-full bg-purple rounded-full"
                          style={{
                            width: `${Math.min((spendingPrediction.projectedTotal / 30000) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-mint/20 bg-mint/5 p-4 text-xs text-mist">
                  <div className="flex items-center gap-2 font-semibold text-mint">
                    <Sparkles size={14} />
                    <span>AI Coach Insight</span>
                  </div>
                  <p className="mt-1 leading-relaxed">
                    You are currently spending <strong>{Math.abs(monthlyComparison.pctChange)}%</strong>{" "}
                    {monthlyComparison.isBetter ? "less" : "more"} than last month. Keep your dining hall visits
                    consistent to maintain this trend!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI SPENDING PREDICTIONS & RUNWAY */}
        {activeTab === "predictions" && (
          <div className="mt-10 space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Runway Card */}
              <div className="rounded-3xl border border-line bg-surface-1/90 p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <Tag>Runway Estimate</Tag>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-xs font-bold uppercase ${
                      runway.status === "safe"
                        ? "bg-mint/15 text-mint"
                        : runway.status === "warning"
                        ? "bg-amber-400/15 text-amber-400"
                        : "bg-alert/15 text-alert"
                    }`}
                  >
                    {runway.status}
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-xl font-bold text-white">
                  Pocket Money Runway
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-extrabold text-white">
                    {runway.days}
                  </span>
                  <span className="text-base text-mist font-medium">days remaining</span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-mist">{runway.message}</p>

                <div className="mt-6 rounded-2xl border border-line bg-surface-2/60 p-4 text-xs">
                  <p className="text-mist">Calculated from your historical spend of</p>
                  <p className="mt-1 font-mono text-lg font-bold text-white">
                    {inr(runway.dailyBurn)} <span className="text-xs text-mist font-normal">/ day</span>
                  </p>
                </div>
              </div>

              {/* End-of-Month Spend Prediction */}
              <div className="rounded-3xl border border-line bg-surface-1/90 p-6 sm:p-8 backdrop-blur-xl">
                <Tag>Predictive Modeling</Tag>
                <h3 className="mt-5 font-heading text-xl font-bold text-white">
                  Projected End-of-Month Spend
                </h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-extrabold text-mint">
                    {inr(spendingPrediction.projectedTotal)}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-mist">
                  Based on {spendingPrediction.daysLeft} days left in the current cycle at your current pace of{" "}
                  {inr(spendingPrediction.avgDailyRate)}/day.
                </p>

                <div className="mt-6 space-y-2 rounded-2xl border border-line bg-surface-2/60 p-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-mist">Projected Monthly Savings:</span>
                    <span className="font-mono font-bold text-mint">
                      {inr(Math.max(spendingPrediction.projectedSavings, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mist">Remaining Inflow Buffer:</span>
                    <span className="font-mono font-semibold text-white">
                      {Math.round(
                        (Math.max(spendingPrediction.projectedSavings, 0) / (totalIncome || 1)) * 100
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Safe Daily Spending Cap */}
              <div className="rounded-3xl border border-line bg-surface-1/90 p-6 sm:p-8 backdrop-blur-xl">
                <Tag>Budget Target</Tag>
                <h3 className="mt-5 font-heading text-xl font-bold text-white">
                  Recommended Daily Cap
                </h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-extrabold text-sky">
                    {inr(spendingPrediction.suggestedDailyCap)}
                  </span>
                  <span className="text-xs text-mist font-medium">/ day</span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-mist">
                  Spending under this target ensures your current ₹{remainingBalance.toLocaleString()} pocket
                  money lasts cleanly until the next allowance date.
                </p>

                <div className="mt-6 rounded-2xl border border-sky/20 bg-sky/5 p-4 text-xs text-mist">
                  <p className="text-white font-medium">Pro-Tip for Weekend Spends:</p>
                  <p className="mt-1 leading-relaxed">
                    Save ₹300/day during weekday mess meals to unlock an extra ₹1,500 for your weekend cafe
                    hangout without hurting your runway.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXPENSE REPORTS & LEDGER (CSV + PDF/PRINTABLE) */}
        {activeTab === "reports" && (
          <div className="mt-10 space-y-6">
            {/* Action Bar: Export Buttons & Search */}
            <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface-1/90 p-5 sm:p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1 sm:flex-initial">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full rounded-full border border-line bg-ink py-2 pl-10 pr-4 text-xs text-white placeholder:text-mist/60 focus:border-mint focus:outline-none"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-full border border-line bg-ink px-4 py-2 text-xs text-white focus:border-mint focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Housing">Housing</option>
                  <option value="Academics">Academics</option>
                  <option value="Transport">Transport</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Savings">Savings</option>
                </select>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-full border border-line bg-ink px-4 py-2 text-xs text-white focus:border-mint focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="expense">Expenses Only</option>
                  <option value="income">Income Only</option>
                </select>
              </div>

              {/* Action Buttons: Add, Export CSV, Print/PDF */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-2 text-xs font-semibold text-white transition-all hover:border-mint/50 hover:text-mint"
                >
                  <Plus size={14} />
                  Add Transaction
                </button>

                <button
                  type="button"
                  onClick={exportCSV}
                  className="flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-4 py-2 text-xs font-semibold text-mint transition-all hover:bg-mint hover:text-ink"
                >
                  <Download size={14} />
                  Export CSV
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition-all hover:bg-mist"
                >
                  <Printer size={14} />
                  Print / PDF Report
                </button>
              </div>
            </div>

            {/* Quick Add Form Drawer */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddNewTransaction}
                  className="overflow-hidden rounded-3xl border border-line bg-surface-1/90 p-6 backdrop-blur-xl"
                >
                  <h4 className="font-heading text-sm font-bold text-white mb-4">
                    Record New Campus Transaction
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-mist">Title / Merchant</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Campus Xerox, Mess card"
                        className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-xs text-white focus:border-mint focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-mist">Amount (₹)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder="e.g. 450"
                        className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-xs text-white focus:border-mint focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-mist">Type</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-xs text-white focus:border-mint focus:outline-none"
                      >
                        <option value="expense">Expense (-)</option>
                        <option value="income">Income (+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-mist">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-xs text-white focus:border-mint focus:outline-none"
                      >
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Housing">Housing</option>
                        <option value="Academics">Academics</option>
                        <option value="Transport">Transport</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Savings">Savings</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-mist">Date</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-xs text-white focus:border-mint focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-mist hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-mint px-5 py-2 text-xs font-semibold text-ink hover:opacity-90 shadow-lg"
                    >
                      Save Transaction
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Transaction Ledger Table */}
            <div className="overflow-hidden rounded-3xl border border-line bg-surface-1/90 shadow-2xl backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-line bg-surface-2/70 text-[11px] font-mono uppercase tracking-wider text-mist">
                    <tr>
                      <th className="py-3.5 pl-6 pr-4">Description</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Date</th>
                      <th className="px-4 py-3.5">Type</th>
                      <th className="px-4 py-3.5 text-right">Amount</th>
                      <th className="py-3.5 pl-4 pr-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-xs text-mist">
                          No transactions found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map((e) => {
                        const isIncome = e.type === "income";
                        return (
                          <tr
                            key={e.id}
                            className="transition-colors hover:bg-surface-2/40 group"
                          >
                            <td className="py-3.5 pl-6 pr-4">
                              <p className="font-semibold text-white">{e.title}</p>
                              {e.notes && (
                                <p className="text-[11px] text-mist truncate max-w-xs">{e.notes}</p>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                                style={{
                                  backgroundColor: `${CATEGORY_COLORS[e.category] || "#94A3B8"}22`,
                                  color: CATEGORY_COLORS[e.category] || "#94A3B8",
                                }}
                              >
                                {e.category}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-xs text-mist">
                              {e.date || "2026-10-10"}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`font-mono text-[11px] font-bold uppercase ${
                                  isIncome ? "text-mint" : "text-mist"
                                }`}
                              >
                                {isIncome ? "Inflow (+)" : "Outflow (-)"}
                              </span>
                            </td>
                            <td
                              className={`px-4 py-3.5 text-right font-mono font-bold ${
                                isIncome ? "text-mint" : "text-white"
                              }`}
                            >
                              {isIncome ? "+" : "-"}
                              {inr(e.amount)}
                            </td>
                            <td className="py-3.5 pl-4 pr-6 text-right">
                              <button
                                type="button"
                                onClick={() => deleteExpense(e.id)}
                                title="Delete transaction"
                                className="opacity-70 group-hover:opacity-100 rounded-lg p-1.5 text-mist hover:bg-alert/15 hover:text-alert transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="flex flex-wrap items-center justify-between border-t border-line bg-surface-2/40 px-6 py-4 text-xs text-mist">
                <div>
                  Showing <strong>{filteredExpenses.length}</strong> of{" "}
                  <strong>{expenses.length}</strong> transactions
                </div>
                <div className="flex items-center gap-6 font-mono">
                  <span>
                    Net:{" "}
                    <strong
                      className={remainingBalance >= 0 ? "text-mint" : "text-alert"}
                    >
                      {inr(remainingBalance)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRINTABLE / PDF REPORT MODAL */}
      <AnimatePresence>
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-line bg-surface-1 p-8 shadow-2xl text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xl font-bold text-white">
                      Penny<span className="text-mint">Wise</span>
                    </span>
                    <span className="rounded-full bg-mint/20 px-2 py-0.5 text-[10px] font-mono font-bold text-mint uppercase">
                      Official Statement
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-mist">
                    Monthly Student Expense & Budget Report · October 2026
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={printReport}
                    className="flex items-center gap-2 rounded-xl bg-mint px-4 py-2 text-xs font-semibold text-ink hover:opacity-90 shadow-md"
                  >
                    <Printer size={14} />
                    Print to PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPrintModal(false)}
                    className="rounded-xl border border-line px-3 py-2 text-xs text-mist hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-line bg-surface-2/60 p-4 font-mono text-center">
                <div>
                  <p className="text-[11px] text-mist uppercase">Total Inflow</p>
                  <p className="mt-1 text-base font-bold text-mint">{inr(totalIncome)}</p>
                </div>
                <div className="border-x border-line">
                  <p className="text-[11px] text-mist uppercase">Total Outflow</p>
                  <p className="mt-1 text-base font-bold text-alert">{inr(totalExpenses)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-mist uppercase">Net Balance</p>
                  <p className="mt-1 text-base font-bold text-white">{inr(remainingBalance)}</p>
                </div>
              </div>

              {/* Ledger Preview */}
              <div className="mt-6">
                <h5 className="font-heading text-xs font-bold text-mist uppercase tracking-wider mb-3">
                  Transaction Summary ({expenses.length} Records)
                </h5>
                <div className="max-h-60 overflow-y-auto divide-y divide-line/60 rounded-xl border border-line bg-ink/50 text-xs">
                  {expenses.map((e) => (
                    <div key={e.id} className="flex items-center justify-between px-4 py-2.5">
                      <div>
                        <p className="font-medium text-white">{e.title}</p>
                        <p className="text-[11px] text-mist">
                          {e.category} · {e.date}
                        </p>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          e.type === "income" ? "text-mint" : "text-white"
                        }`}
                      >
                        {e.type === "income" ? "+" : "-"}
                        {inr(e.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign-off */}
              <div className="mt-6 border-t border-line pt-4 text-[11px] text-mist flex justify-between">
                <span>Generated by PennyWise AI Student Financial Platform</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

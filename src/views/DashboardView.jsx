import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles,
  ChevronRight,
  CreditCard,
  Target,
  CheckCircle2,
  Clock,
  PieChart,
  ShoppingBag,
  Home,
  BookOpen,
  Bus,
  Tv,
  Zap,
  HeartPulse,
  Tag as TagIcon,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { inr } from "../lib/format";

const CATEGORY_ICONS = {
  "Food & Dining": ShoppingBag,
  Housing: Home,
  Academics: BookOpen,
  Transport: Bus,
  Lifestyle: Tv,
  Utilities: Zap,
  Healthcare: HeartPulse,
  Savings: Target,
  Income: TrendingUp,
  Other: TagIcon,
};

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

export default function DashboardView({ onNavigate, onOpenAddModal, onContributeGoal }) {
  const {
    expenses,
    budgets,
    savingsGoals,
    recurringBills,
    totalIncome,
    totalExpenses,
    remainingBalance,
    runway,
    unusualExpenses,
    toggleRecurringPaid,
    currency,
  } = useExpenses();

  // Overall budget computation
  const overallBudget = useMemo(() => {
    return budgets.find((b) => b.category === "Overall") || { limit: 25000 };
  }, [budgets]);

  const budgetLimit = overallBudget.limit;
  const budgetUsagePercent = budgetLimit > 0 ? Math.round((totalExpenses / budgetLimit) * 100) : 0;
  const remainingBudget = Math.max(budgetLimit - totalExpenses, 0);

  // Category breakdown calculation for mini chart
  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses
      .filter((e) => e.type === "expense" || !e.type)
      .forEach((e) => {
        const cat = e.category || "Other";
        map[cat] = (map[cat] || 0) + Number(e.amount);
      });
    return Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        color: CATEGORY_COLORS[name] || "#94A3B8",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpenses]);

  // Recent 5 transactions
  const recentTransactions = useMemo(() => {
    return expenses.slice(0, 5);
  }, [expenses]);

  // Upcoming recurring bills (sorted by due day)
  const upcomingBills = useMemo(() => {
    return [...recurringBills].sort((a, b) => a.dueDay - b.dueDay).slice(0, 4);
  }, [recurringBills]);

  // Top active goal
  const primaryGoal = savingsGoals[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner & Quick Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Financial Dashboard
          </h1>
          <p className="mt-1 text-xs text-mist sm:text-sm">
            Campus cash flow summary for October 2026 · Semester Pacing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate("ai-insights")}
            className="flex items-center gap-1.5 rounded-xl border border-mint/40 bg-mint/10 px-3.5 py-2 text-xs font-semibold text-mint transition-all hover:bg-mint hover:text-ink"
          >
            <Sparkles size={14} />
            Ask AI Coach
          </button>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-mint px-4 py-2 text-xs font-semibold text-ink shadow-lg shadow-mint/20 transition-all hover:opacity-95"
          >
            <Plus size={14} />
            Record Expense
          </button>
        </div>
      </div>

      {/* Budget Threshold Alerts Bar (if > 70%) */}
      {budgetUsagePercent >= 70 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between rounded-2xl border p-4 text-xs backdrop-blur-xl ${
            budgetUsagePercent >= 100
              ? "border-alert/40 bg-alert/15 text-white"
              : budgetUsagePercent >= 90
              ? "border-amber-400/40 bg-amber-400/15 text-white"
              : "border-sky/40 bg-sky/15 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold ${
                budgetUsagePercent >= 100
                  ? "bg-alert/30 text-alert"
                  : budgetUsagePercent >= 90
                  ? "bg-amber-400/30 text-amber-300"
                  : "bg-sky/30 text-sky"
              }`}
            >
              <AlertTriangle size={16} />
            </span>
            <div>
              <p className="font-semibold">
                {budgetUsagePercent >= 100
                  ? "Budget Exceeded (100%+)"
                  : budgetUsagePercent >= 90
                  ? "Critical Budget Warning (90%+ Spent)"
                  : "Budget Alert: 70% Limit Reached"}
              </p>
              <p className="text-[11px] text-mist">
                You've spent {inr(totalExpenses, currency)} of your {inr(budgetLimit, currency)} overall monthly
                cap with {runway.days} days left in your cycle.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("budgets")}
            className="hidden sm:inline-flex items-center gap-1 font-semibold text-mint hover:underline"
          >
            Adjust Budget <ChevronRight size={14} />
          </button>
        </motion.div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <div className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-mint/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mist">Remaining Balance</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint/15 text-mint">
              <Wallet size={16} />
            </span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-white sm:text-3xl">
            {inr(remainingBalance, currency)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-mist">
            <span>Pocket runway</span>
            <span
              className={`font-mono font-semibold ${
                runway.status === "safe"
                  ? "text-mint"
                  : runway.status === "warning"
                  ? "text-amber-400"
                  : "text-alert"
              }`}
            >
              {runway.days} days ({runway.status})
            </span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-mint/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mist">Total Inflow</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint/15 text-mint">
              <ArrowDownRight size={16} />
            </span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-mint sm:text-3xl">
            {inr(totalIncome, currency)}
          </p>
          <p className="mt-2 text-xs text-mist">Stipend, allowance & tutoring</p>
        </div>

        {/* Monthly Expenses */}
        <div className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-alert/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mist">Total Outflow</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-alert/15 text-alert">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-white sm:text-3xl">
            {inr(totalExpenses, currency)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-mist">
            <span>Daily burn rate</span>
            <span className="font-mono font-semibold text-white">
              {inr(runway.dailyBurn, currency)}/day
            </span>
          </div>
        </div>

        {/* Remaining Budget & Usage */}
        <div className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-sky/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mist">Budget Remaining</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky/15 text-sky">
              <Calendar size={16} />
            </span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-white sm:text-3xl">
            {inr(remainingBudget, currency)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-mist">Usage pace</span>
            <span
              className={`font-mono font-semibold ${
                budgetUsagePercent > 100
                  ? "text-alert"
                  : budgetUsagePercent >= 80
                  ? "text-amber-400"
                  : "text-mint"
              }`}
            >
              {budgetUsagePercent}% of cap
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Breakdown (Left 7 cols) vs Sidebar Widgets (Right 5 cols) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Spending Breakdown & Recent Transactions */}
        <div className="space-y-8 lg:col-span-7">
          {/* Category Spending Meter & Visualization */}
          <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-white sm:text-lg">
                  Spending by Category
                </h2>
                <p className="text-xs text-mist">Live distribution across semester expenses</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("ai-insights")}
                className="flex items-center gap-1 text-xs font-semibold text-mint hover:underline"
              >
                Deep Insights <ChevronRight size={14} />
              </button>
            </div>

            {/* Segmented bar */}
            <div className="mt-5 flex h-3.5 w-full overflow-hidden rounded-full bg-surface-2 p-0.5">
              {categoryBreakdown.map((cat) => (
                <div
                  key={cat.name}
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                  title={`${cat.name}: ${cat.percentage}%`}
                  className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
                />
              ))}
            </div>

            {/* Category breakdown rows */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categoryBreakdown.slice(0, 6).map((cat) => {
                const IconComponent = CATEGORY_ICONS[cat.name] || TagIcon;
                return (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between rounded-2xl border border-line/60 bg-surface-2/40 p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
                      >
                        <IconComponent size={14} />
                      </span>
                      <span className="font-medium text-white truncate max-w-[100px]">
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white">
                        {inr(cat.amount, currency)}
                      </span>
                      <span className="ml-1 text-[11px] font-mono text-mist">
                        ({cat.percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-white sm:text-lg">
                  Recent Transactions
                </h2>
                <p className="text-xs text-mist">Latest logs with category classification</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("transactions")}
                className="flex items-center gap-1 text-xs font-semibold text-mint hover:underline"
              >
                View All Ledger <ChevronRight size={14} />
              </button>
            </div>

            <div className="mt-4 divide-y divide-line/60">
              {recentTransactions.map((tx) => {
                const IconComponent = CATEGORY_ICONS[tx.category] || TagIcon;
                const isIncome = tx.type === "income";
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3.5 transition-colors hover:bg-surface-2/30 px-2 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isIncome ? "bg-mint/15 text-mint" : "bg-surface-2 text-mist"
                        }`}
                      >
                        <IconComponent size={16} />
                      </span>
                      <div>
                        <p className="font-semibold text-white text-xs sm:text-sm">{tx.title}</p>
                        <p className="text-[11px] text-mist">
                          {tx.category} · {tx.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-xs sm:text-sm font-bold ${
                        isIncome ? "text-mint" : "text-white"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {inr(tx.amount, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Bills, Goals, AI Insights */}
        <div className="space-y-8 lg:col-span-5">
          {/* AI Financial Coach Snapshot */}
          <div className="overflow-hidden rounded-3xl border border-mint/30 bg-gradient-to-b from-surface-1 via-surface-1 to-surface-2/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint text-ink font-bold">
                  <Sparkles size={14} />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-mint font-semibold">
                  PennyWise AI Coach
                </span>
              </div>
              <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-mono text-mint">
                Gemini Active
              </span>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-white sm:text-sm">
              "You're currently spending <strong>{inr(runway.dailyBurn, currency)}/day</strong>. If you cap
              dining out to ₹350 on weekdays, your runway extends by <strong>6 extra days</strong>."
            </p>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-line text-xs">
              <span className="text-mist">Have questions on your budget?</span>
              <button
                type="button"
                onClick={() => onNavigate("ai-insights")}
                className="font-semibold text-mint hover:underline"
              >
                Chat Now →
              </button>
            </div>
          </div>

          {/* Upcoming Recurring Bills */}
          <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-base font-bold text-white">Upcoming Bills</h3>
                <p className="text-xs text-mist">Monthly campus recurring subscriptions</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("savings-goals")}
                className="text-xs font-semibold text-mint hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingBills.map((bill) => {
                const isPaid = bill.status === "paid";
                return (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between rounded-2xl border border-line/60 bg-surface-2/40 p-3.5 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{bill.name}</p>
                      <p className="text-[11px] text-mist">
                        Due Day {bill.dueDay} of month · {bill.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white">
                        {inr(bill.amount, currency)}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleRecurringPaid(bill.id)}
                        className={`rounded-xl px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition-all ${
                          isPaid
                            ? "bg-mint/15 text-mint border border-mint/30"
                            : "bg-surface-2 text-mist hover:text-white border border-line"
                        }`}
                      >
                        {isPaid ? "Paid ✓" : "Mark Paid"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Savings Goal Progress */}
          {primaryGoal && (
            <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-white">Featured Goal</h3>
                  <p className="text-xs text-mist">Target lock-in</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("savings-goals")}
                  className="text-xs font-semibold text-mint hover:underline"
                >
                  All Goals
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-line bg-surface-2/50 p-4">
                <div className="flex items-center justify-between text-xs">
                  <p className="font-semibold text-white">{primaryGoal.name}</p>
                  <span className="font-mono text-mint font-bold">
                    {Math.round((primaryGoal.currentAmount / primaryGoal.targetAmount) * 100)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-ink">
                  <div
                    className="h-full bg-mint rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (primaryGoal.currentAmount / primaryGoal.targetAmount) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-mono text-mist">
                    {inr(primaryGoal.currentAmount, currency)} of {inr(primaryGoal.targetAmount, currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onContributeGoal?.(primaryGoal)}
                    className="rounded-lg bg-mint/20 px-2.5 py-1 text-[11px] font-semibold text-mint hover:bg-mint hover:text-ink transition-all"
                  >
                    + Deposit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

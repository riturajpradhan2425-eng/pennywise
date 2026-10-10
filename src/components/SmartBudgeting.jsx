import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Flame,
  Calendar,
  Zap,
  TrendingDown,
  Edit2,
  Trash2,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { Reveal, Tag } from "./anim";
import { inr } from "../lib/format";

export default function SmartBudgeting() {
  const { budgets, expenses, runway, remainingBalance, addBudget, updateBudget } = useExpenses();

  const [periodFilter, setPeriodFilter] = useState("all"); // 'all' | 'monthly' | 'weekly'
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("Food & Dining");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [budgetPeriod, setBudgetPeriod] = useState("monthly");

  // Filter budgets
  const filteredBudgets = budgets.filter((b) => {
    if (periodFilter === "all") return true;
    return b.period === periodFilter;
  });

  // Calculate actual spent per category/budget
  const getBudgetSpent = (b) => {
    if (b.category === "Overall") {
      return expenses
        .filter((e) => e.type === "expense" || !e.type)
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    }
    return expenses
      .filter((e) => (e.type === "expense" || !e.type) && e.category === b.category)
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    if (!budgetLimit || Number(budgetLimit) <= 0) return;

    await addBudget({
      name: budgetName.trim() || `${budgetCategory} Budget`,
      category: budgetCategory,
      limit: Number(budgetLimit),
      period: budgetPeriod,
    });

    setBudgetName("");
    setBudgetLimit("");
    setShowAddBudgetModal(false);
  };

  return (
    <section id="smart-budgeting" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_40%,rgba(0,229,153,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Tag>Guardrails & Pacing</Tag>
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Smart Budgets &{" "}
            <em className="font-display font-light italic text-mint">Pocket Runway.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-mist md:text-lg">
            Automated alerts at 70%, 90%, and 100% threshold limits, paired with historical runway projections so you never run dry before allowance day.
          </p>
        </Reveal>

        {/* Feature 4: Pocket Money Runway Card */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-surface-1 via-surface-2/70 to-surface-1 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-mint flex items-center gap-1.5">
                <Flame size={14} className="text-mint" />
                Pocket Money Runway Estimator
              </span>
              <h3 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                {runway.days} Days of Cash Left
              </h3>
              <p className="text-xs sm:text-sm text-mist leading-relaxed">
                {runway.message} Based on your current burn rate of{" "}
                <strong className="text-white font-mono">{inr(runway.dailyBurn)}/day</strong> and{" "}
                <strong className="text-mint font-mono">{inr(remainingBalance)}</strong> remaining balance.
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono font-semibold text-[11px] ${
                    runway.status === "safe"
                      ? "bg-mint/15 text-mint border border-mint/30"
                      : runway.status === "warning"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-alert/15 text-alert border border-alert/30"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  Status: {runway.status.toUpperCase()}
                </span>
                <span className="text-mist">Calculated from 30-day velocity</span>
              </div>
            </div>

            {/* Visual Runway Meter */}
            <div className="lg:col-span-7 rounded-2xl border border-line/80 bg-ink/60 p-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-white">Daily Burn Velocity</span>
                <span className="font-mono font-bold text-mint">{inr(runway.dailyBurn)}/day</span>
              </div>

              {/* Progress Bar with target markers */}
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    runway.days > 20
                      ? "bg-mint shadow-[0_0_16px_rgba(0,229,153,0.5)]"
                      : runway.days > 10
                      ? "bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.5)]"
                      : "bg-alert shadow-[0_0_16px_rgba(255,91,91,0.5)]"
                  }`}
                  style={{ width: `${Math.min(Math.max((runway.days / 30) * 100, 10), 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-mist">
                <span>0 Days (Dry)</span>
                <span>15 Days (Midterm)</span>
                <span>30 Days (Full Month)</span>
              </div>

              {/* Actionable Runway Extension Tip */}
              <div className="mt-2 rounded-xl border border-mint/20 bg-mint/5 p-3 text-xs text-white/90 flex items-center justify-between">
                <span>💡 Reduce dining out by ₹150/day</span>
                <span className="font-mono font-bold text-mint">+4 Days Runway</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Smart Budgets Section */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            {/* Filter Tabs */}
            <div className="flex rounded-2xl border border-line bg-surface-1/80 p-1">
              {[
                ["all", "All Budgets"],
                ["monthly", "Monthly Limits"],
                ["weekly", "Weekly Limits"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriodFilter(key)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    periodFilter === key
                      ? "bg-mint text-ink shadow-sm"
                      : "text-mist hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddBudgetModal(true)}
              className="flex items-center gap-1.5 rounded-full bg-mint px-5 py-2.5 font-heading text-xs font-semibold text-ink shadow-[0_0_20px_rgba(0,229,153,0.3)] hover:shadow-[0_0_32px_rgba(0,229,153,0.5)] transition-all"
            >
              <Plus size={14} />
              <span>Create New Budget</span>
            </button>
          </div>

          {/* Budgets Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {filteredBudgets.map((b) => {
              const spent = getBudgetSpent(b);
              const pct = (spent / b.limit) * 100;
              const isOver = pct >= 100;
              const is90 = pct >= 90 && !isOver;
              const is70 = pct >= 70 && !is90 && !isOver;

              let alertBadge = {
                label: "Safe Pace (<70%)",
                cls: "bg-mint/10 text-mint border-mint/20",
                icon: CheckCircle2,
              };

              if (isOver) {
                alertBadge = {
                  label: "100% Exceeded",
                  cls: "bg-alert/15 text-alert border-alert/30",
                  icon: ShieldAlert,
                };
              } else if (is90) {
                alertBadge = {
                  label: "90% Alert Warning",
                  cls: "bg-red-400/15 text-red-400 border-red-400/30",
                  icon: AlertTriangle,
                };
              } else if (is70) {
                alertBadge = {
                  label: "70% Caution Warning",
                  cls: "bg-amber-400/15 text-amber-400 border-amber-400/30",
                  icon: AlertTriangle,
                };
              }

              const Icon = alertBadge.icon;

              return (
                <div
                  key={b.id}
                  className="flex flex-col justify-between rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-mint/30"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-mist">
                          {b.category} · {b.period}
                        </span>
                        <h4 className="font-heading text-base font-bold text-white mt-0.5">
                          {b.name}
                        </h4>
                      </div>
                    </div>

                    {/* Threshold Alert Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[10px] font-semibold mb-4 ${alertBadge.cls}`}
                    >
                      <Icon size={12} />
                      <span>{alertBadge.label}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-mist">
                          {inr(spent)} of {inr(b.limit)}
                        </span>
                        <span
                          className={`font-bold tabular-nums ${
                            isOver ? "text-alert" : is90 ? "text-amber-400" : "text-white"
                          }`}
                        >
                          {pct.toFixed(0)}%
                        </span>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-ink">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isOver
                              ? "bg-alert shadow-[0_0_12px_rgba(255,91,91,0.5)]"
                              : is90
                              ? "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                              : is70
                              ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                              : "bg-mint shadow-[0_0_12px_rgba(0,229,153,0.4)]"
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-line/60 pt-3 flex justify-between items-center text-[11px] text-mist">
                    <span>{isOver ? "Overspend" : "Remaining"}</span>
                    <span className="font-mono font-semibold text-white">
                      {isOver ? inr(spent - b.limit) : inr(b.limit - spent)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Budget Modal */}
      <AnimatePresence>
        {showAddBudgetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBudgetModal(false)}
              className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface-1/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <h3 className="font-heading text-2xl font-bold text-white">Create Smart Budget</h3>
              <p className="mt-1 text-xs text-mist">
                PennyWise will track expenses and issue notifications at 70%, 90%, and 100% capacity.
              </p>

              <form onSubmit={handleCreateBudget} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-mist">Budget Name</label>
                  <input
                    type="text"
                    required
                    value={budgetName}
                    onChange={(e) => setBudgetName(e.target.value)}
                    placeholder="e.g. Campus Cafes & Canteen"
                    className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm text-white placeholder-mist/60 outline-none focus:border-mint"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-mist">Category</label>
                  <select
                    value={budgetCategory}
                    onChange={(e) => setBudgetCategory(e.target.value)}
                    className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm text-white outline-none focus:border-mint"
                  >
                    <option value="Overall">Overall Monthly Total</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Housing">Housing</option>
                    <option value="Academics">Academics</option>
                    <option value="Transport">Transport</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Groceries">Groceries</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-mist">Limit (₹)</label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={budgetLimit}
                      onChange={(e) => setBudgetLimit(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-mint"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-mist">Cycle</label>
                    <select
                      value={budgetPeriod}
                      onChange={(e) => setBudgetPeriod(e.target.value)}
                      className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm text-white outline-none focus:border-mint"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBudgetModal(false)}
                    className="rounded-xl px-4 py-2 text-xs text-mist hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-mint px-5 py-2.5 font-heading text-xs font-semibold text-ink shadow-[0_0_20px_rgba(0,229,153,0.3)] hover:shadow-[0_0_32px_rgba(0,229,153,0.5)]"
                  >
                    Activate Budget
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

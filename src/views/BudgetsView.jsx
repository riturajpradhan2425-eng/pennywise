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
  Trash2,
  Edit2,
  Clock,
  TrendingDown,
  X,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { inr } from "../lib/format";
import ConfirmDialog from "../components/modals/ConfirmDialog";

const CATEGORIES = [
  "Overall",
  "Food & Dining",
  "Housing",
  "Academics",
  "Transport",
  "Lifestyle",
  "Utilities",
  "Healthcare",
  "Savings",
];

export default function BudgetsView() {
  const {
    budgets,
    expenses,
    runway,
    remainingBalance,
    addBudget,
    updateBudget,
    deleteBudget,
    currency,
  } = useExpenses();

  const [periodFilter, setPeriodFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState(null);

  // Form states
  const [budgetName, setBudgetName] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("Food & Dining");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [budgetPeriod, setBudgetPeriod] = useState("monthly");

  const filteredBudgets = budgets.filter((b) => {
    if (periodFilter === "all") return true;
    return b.period === periodFilter;
  });

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

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setBudgetName("");
    setBudgetCategory("Food & Dining");
    setBudgetLimit("");
    setBudgetPeriod("monthly");
    setShowAddModal(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBudget(b);
    setBudgetName(b.name);
    setBudgetCategory(b.category);
    setBudgetLimit(String(b.limit));
    setBudgetPeriod(b.period || "monthly");
    setShowAddModal(true);
  };

  const handleSubmitBudget = async (e) => {
    e.preventDefault();
    const limitNum = parseFloat(budgetLimit);
    if (isNaN(limitNum) || limitNum <= 0) return;

    if (editingBudget) {
      await updateBudget(editingBudget.id, {
        name: budgetName.trim() || `${budgetCategory} Budget`,
        category: budgetCategory,
        limit: limitNum,
        period: budgetPeriod,
      });
    } else {
      await addBudget({
        name: budgetName.trim() || `${budgetCategory} Budget`,
        category: budgetCategory,
        limit: limitNum,
        period: budgetPeriod,
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Smart Budgets & Runway
          </h1>
          <p className="mt-1 text-xs text-mist sm:text-sm">
            Set proactive guardrails with 70%, 90%, and 100% pacing thresholds.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-mint px-4 py-2 text-xs font-semibold text-ink shadow-lg shadow-mint/20 hover:opacity-95"
        >
          <Plus size={14} />
          Create Budget Guardrail
        </button>
      </div>

      {/* Pocket Money Runway Spotlight */}
      <div className="rounded-3xl border border-line bg-gradient-to-r from-surface-1 via-surface-2/60 to-surface-1 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 space-y-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-mint flex items-center gap-1.5">
              <Clock size={14} />
              Pocket Money Runway
            </span>
            <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
              Burn Rate Prediction
            </h2>
            <p className="text-xs leading-relaxed text-mist">
              Based on your historical spending across mess, rent, and outings, here is how many days
              your current {inr(remainingBalance, currency)} balance will sustain you.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface-1 p-4">
              <span className="text-[11px] font-mono uppercase text-mist">Runway Left</span>
              <p className="mt-1 font-mono text-3xl font-extrabold text-white">
                {runway.days} <span className="text-sm font-normal text-mist">days</span>
              </p>
              <span
                className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
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

            <div className="rounded-2xl border border-line bg-surface-1 p-4">
              <span className="text-[11px] font-mono uppercase text-mist">Daily Burn Rate</span>
              <p className="mt-1 font-mono text-2xl font-bold text-white">
                {inr(runway.dailyBurn, currency)}
              </p>
              <span className="mt-2 text-[11px] text-mist block">Calculated average</span>
            </div>

            <div className="rounded-2xl border border-line bg-surface-1 p-4">
              <span className="text-[11px] font-mono uppercase text-mist">Safe Daily Cap</span>
              <p className="mt-1 font-mono text-2xl font-bold text-mint">
                {inr(Math.floor(remainingBalance / Math.max(runway.days, 1)), currency)}
              </p>
              <span className="mt-2 text-[11px] text-mist block">Target spending pace</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["all", "monthly", "weekly"].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriodFilter(p)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all ${
              periodFilter === p
                ? "bg-mint text-ink font-bold shadow-md shadow-mint/20"
                : "border border-line bg-surface-1 text-mist hover:text-white"
            }`}
          >
            {p === "all" ? "All Guardrails" : `${p} Budgets`}
          </button>
        ))}
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBudgets.map((b) => {
          const spent = getBudgetSpent(b);
          const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
          const isOver = percent >= 100;
          const isCritical = percent >= 90 && !isOver;
          const isWarning = percent >= 70 && !isCritical && !isOver;

          return (
            <div
              key={b.id}
              className={`relative overflow-hidden rounded-3xl border p-6 shadow-xl backdrop-blur-xl transition-all ${
                isOver
                  ? "border-alert/50 bg-alert/5"
                  : isCritical
                  ? "border-amber-400/40 bg-amber-400/5"
                  : isWarning
                  ? "border-sky/40 bg-sky/5"
                  : "border-line bg-surface-1/90"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-white">{b.name}</h3>
                  <p className="text-xs text-mist">
                    {b.category} · {b.period || "monthly"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(b)}
                    className="rounded-lg p-1.5 text-mist hover:bg-surface-2 hover:text-white"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteBudgetId(b.id)}
                    className="rounded-lg p-1.5 text-mist hover:bg-alert/15 hover:text-alert"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress Numbers */}
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-mono text-mist uppercase">Spent so far</span>
                  <p className="font-mono text-xl font-bold text-white">
                    {inr(spent, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-mist uppercase">Limit</span>
                  <p className="font-mono text-base text-mist font-semibold">
                    {inr(b.limit, currency)}
                  </p>
                </div>
              </div>

              {/* Progress Bar with 70%, 90% Markers */}
              <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver
                      ? "bg-alert"
                      : isCritical
                      ? "bg-amber-400"
                      : isWarning
                      ? "bg-sky"
                      : "bg-mint"
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>

              {/* Threshold status badge */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <span
                  className={`font-mono font-bold ${
                    isOver
                      ? "text-alert"
                      : isCritical
                      ? "text-amber-400"
                      : isWarning
                      ? "text-sky"
                      : "text-mint"
                  }`}
                >
                  {percent}% used
                </span>

                <span className="text-mist">
                  {isOver
                    ? "Limit Exceeded"
                    : isCritical
                    ? "Critical (90%+)"
                    : isWarning
                    ? "Warning (70%+)"
                    : "Within Budget"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Budget Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-ink/80 backdrop-blur-md"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-line bg-surface-1 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="font-heading text-base font-bold text-white">
                  {editingBudget ? "Edit Budget Limit" : "New Budget Guardrail"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-full p-1 text-mist hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitBudget} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-mist">Budget Name</label>
                  <input
                    type="text"
                    required
                    value={budgetName}
                    onChange={(e) => setBudgetName(e.target.value)}
                    placeholder="e.g. Monthly Mess Card, Weekend Outings"
                    className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-mist">Category</label>
                  <select
                    value={budgetCategory}
                    onChange={(e) => setBudgetCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase text-mist">
                      Limit ({currency})
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={budgetLimit}
                      onChange={(e) => setBudgetLimit(e.target.value)}
                      placeholder="e.g. 5000"
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm font-mono text-white focus:border-mint focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-mist">Cycle</label>
                    <select
                      value={budgetPeriod}
                      onChange={(e) => setBudgetPeriod(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2 border-t border-line pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-mist hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-mint px-5 py-2 text-xs font-semibold text-ink"
                  >
                    {editingBudget ? "Update" : "Save Budget"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteBudgetId)}
        title="Delete Budget"
        message="Are you sure you want to delete this budget guardrail?"
        confirmLabel="Yes, Delete"
        onConfirm={() => {
          if (deleteBudgetId) {
            deleteBudget(deleteBudgetId);
            setDeleteBudgetId(null);
          }
        }}
        onClose={() => setDeleteBudgetId(null)}
      />
    </div>
  );
}

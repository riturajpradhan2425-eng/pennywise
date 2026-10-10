import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  Trash2,
  TrendingUp,
  X,
  Check,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { inr } from "../lib/format";
import ConfirmDialog from "../components/modals/ConfirmDialog";

export default function SavingsGoalsView() {
  const {
    savingsGoals,
    recurringBills,
    contributeToGoal,
    addSavingsGoal,
    deleteSavingsGoal,
    addRecurringBill,
    toggleRecurringPaid,
    deleteRecurringBill,
    currency,
  } = useExpenses();

  // Modals & form state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [goalCategory, setGoalCategory] = useState("Tech");

  // Contribution modal
  const [contributeGoal, setContributeGoal] = useState(null);
  const [contribAmount, setContribAmount] = useState("");

  // Recurring bill modal
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [recName, setRecName] = useState("");
  const [recAmount, setRecAmount] = useState("");
  const [recDueDay, setRecDueDay] = useState("15");
  const [recCategory, setRecCategory] = useState("Utilities");

  // Deletion modals
  const [deleteGoalId, setDeleteGoalId] = useState(null);
  const [deleteBillId, setDeleteBillId] = useState(null);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!goalName.trim() || !goalTarget) return;

    await addSavingsGoal({
      name: goalName.trim(),
      targetAmount: Number(goalTarget),
      currentAmount: Number(goalCurrent || 0),
      deadline: goalDeadline || "2026-12-31",
      category: goalCategory,
    });

    setGoalName("");
    setGoalTarget("");
    setGoalCurrent("");
    setGoalDeadline("");
    setShowGoalModal(false);
  };

  const handleContributeSubmit = async (e) => {
    e.preventDefault();
    const val = Number(contribAmount);
    if (!val || val <= 0 || !contributeGoal) return;

    await contributeToGoal(contributeGoal.id, val);
    setContribAmount("");
    setContributeGoal(null);
  };

  const handleCreateRecurring = async (e) => {
    e.preventDefault();
    if (!recName.trim() || !recAmount) return;

    await addRecurringBill({
      name: recName.trim(),
      amount: Number(recAmount),
      dueDay: Number(recDueDay),
      period: "Monthly",
      category: recCategory,
      status: "due",
    });

    setRecName("");
    setRecAmount("");
    setShowRecurringModal(false);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Savings Goals & Recurring Bills
          </h1>
          <p className="mt-1 text-xs text-mist sm:text-sm">
            Fund semester milestones and manage recurring campus subscriptions before due dates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowRecurringModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3.5 py-2 text-xs font-semibold text-white hover:border-mint/50"
          >
            <Plus size={14} />
            Add Recurring Bill
          </button>
          <button
            type="button"
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-mint px-4 py-2 text-xs font-semibold text-ink shadow-lg shadow-mint/20 hover:opacity-95"
          >
            <Plus size={14} />
            Create Savings Goal
          </button>
        </div>
      </div>

      {/* SECTION 1: SAVINGS GOALS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Target size={18} className="text-mint" />
            Active Savings Goals
          </h2>
          <span className="text-xs text-mist font-mono">{savingsGoals.length} goals</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savingsGoals.map((g) => {
            const percent = Math.min(
              Math.round((g.currentAmount / (g.targetAmount || 1)) * 100),
              100
            );
            const remaining = Math.max(g.targetAmount - g.currentAmount, 0);

            return (
              <div
                key={g.id}
                className="relative overflow-hidden rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl transition-all hover:border-mint/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-base font-bold text-white">{g.name}</h3>
                    <p className="text-xs text-mist flex items-center gap-1 mt-0.5">
                      <Calendar size={12} />
                      Deadline: {g.deadline}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteGoalId(g.id)}
                    className="rounded-lg p-1.5 text-mist hover:bg-alert/15 hover:text-alert"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="mt-5 flex items-baseline justify-between font-mono">
                  <div>
                    <span className="text-[11px] text-mist uppercase">Current Deposit</span>
                    <p className="text-xl font-bold text-mint">{inr(g.currentAmount, currency)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-mist uppercase">Target</span>
                    <p className="text-sm font-semibold text-white">
                      {inr(g.targetAmount, currency)}
                    </p>
                  </div>
                </div>

                {/* Progress Meter */}
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full bg-mint rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-mint">{percent}% Achieved</span>
                  <button
                    type="button"
                    onClick={() => {
                      setContributeGoal(g);
                      setContribAmount("");
                    }}
                    className="rounded-xl bg-mint px-3 py-1.5 font-semibold text-ink shadow-md shadow-mint/15 hover:opacity-90 transition-all"
                  >
                    + Contribute
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: RECURRING BILLS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <CreditCard size={18} className="text-sky" />
            Recurring Subscriptions & Utilities
          </h2>
          <span className="text-xs text-mist font-mono">{recurringBills.length} active bills</span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-surface-1/90 shadow-xl backdrop-blur-xl">
          <div className="divide-y divide-line/60">
            {recurringBills.map((b) => {
              const isPaid = b.status === "paid";
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-4 sm:p-5 transition-colors hover:bg-surface-2/40"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isPaid ? "bg-mint/15 text-mint" : "bg-amber-400/15 text-amber-400"
                      }`}
                    >
                      {isPaid ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm">{b.name}</p>
                      <p className="text-xs text-mist">
                        Due Day {b.dueDay} of each month · {b.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-white">
                      {inr(b.amount, currency)}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleRecurringPaid(b.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                        isPaid
                          ? "bg-mint/15 text-mint border border-mint/30"
                          : "bg-surface-2 text-white border border-line hover:border-mint"
                      }`}
                    >
                      {isPaid ? "Paid ✓" : "Mark Paid"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteBillId(b.id)}
                      className="rounded-lg p-1.5 text-mist hover:bg-alert/15 hover:text-alert"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CREATE SAVINGS GOAL MODAL */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-ink/80 backdrop-blur-md"
              onClick={() => setShowGoalModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-line bg-surface-1 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="font-heading text-base font-bold text-white">New Savings Goal</h3>
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="rounded-full p-1 text-mist hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-mist">Goal Title</label>
                  <input
                    type="text"
                    required
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g. Coding Laptop, Vacation, Deposit"
                    className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase text-mist">Target ({currency})</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      placeholder="e.g. 50000"
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm font-mono text-white focus:border-mint focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-mist">Current ({currency})</label>
                    <input
                      type="number"
                      min="0"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                      placeholder="e.g. 10000"
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm font-mono text-white focus:border-mint focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase text-mist">Deadline</label>
                    <input
                      type="date"
                      value={goalDeadline}
                      onChange={(e) => setGoalDeadline(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-mist">Category</label>
                    <select
                      value={goalCategory}
                      onChange={(e) => setGoalCategory(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                    >
                      <option value="Tech">Tech Upgrade</option>
                      <option value="Travel">Holiday / Travel</option>
                      <option value="Safety">Emergency Buffer</option>
                      <option value="Education">Course / Certification</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2 border-t border-line pt-3">
                  <button
                    type="button"
                    onClick={() => setShowGoalModal(false)}
                    className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-mist hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-mint px-5 py-2 text-xs font-semibold text-ink"
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTRIBUTE DEPOSIT MODAL */}
      <AnimatePresence>
        {contributeGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-ink/80 backdrop-blur-md"
              onClick={() => setContributeGoal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl border border-line bg-surface-1 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="font-heading text-base font-bold text-white">
                  Deposit to {contributeGoal.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setContributeGoal(null)}
                  className="rounded-full p-1 text-mist hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleContributeSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-mist">
                    Deposit Amount ({currency})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    autoFocus
                    value={contribAmount}
                    onChange={(e) => setContribAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="mt-1 w-full rounded-xl border border-line bg-ink px-4 py-2.5 font-mono text-base text-white focus:border-mint focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-mist">
                    This will log a savings transfer in your transaction ledger.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setContributeGoal(null)}
                    className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-mist hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-mint px-5 py-2 text-xs font-semibold text-ink"
                  >
                    Confirm Deposit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE RECURRING BILL MODAL */}
      <AnimatePresence>
        {showRecurringModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-ink/80 backdrop-blur-md"
              onClick={() => setShowRecurringModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-line bg-surface-1 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="font-heading text-base font-bold text-white">New Recurring Bill</h3>
                <button
                  type="button"
                  onClick={() => setShowRecurringModal(false)}
                  className="rounded-full p-1 text-mist hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateRecurring} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-mist">Service / Bill Name</label>
                  <input
                    type="text"
                    required
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    placeholder="e.g. Campus Fiber, Gym Pass, Spotify"
                    className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase text-mist">Amount ({currency})</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={recAmount}
                      onChange={(e) => setRecAmount(e.target.value)}
                      placeholder="e.g. 699"
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm font-mono text-white focus:border-mint focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-mist">Due Day (1-31)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="31"
                      value={recDueDay}
                      onChange={(e) => setRecDueDay(e.target.value)}
                      placeholder="e.g. 15"
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm font-mono text-white focus:border-mint focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-mist">Category</label>
                  <select
                    value={recCategory}
                    onChange={(e) => setRecCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                  >
                    <option value="Utilities">Utilities & Wi-Fi</option>
                    <option value="Lifestyle">Entertainment & Subscriptions</option>
                    <option value="Housing">Hostel & Rent</option>
                    <option value="Healthcare">Gym & Health</option>
                    <option value="Academics">Academic Tools</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end gap-2 border-t border-line pt-3">
                  <button
                    type="button"
                    onClick={() => setShowRecurringModal(false)}
                    className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-mist hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-mint px-5 py-2 text-xs font-semibold text-ink"
                  >
                    Save Bill
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATIONS */}
      <ConfirmDialog
        isOpen={Boolean(deleteGoalId)}
        title="Delete Savings Goal"
        message="Are you sure you want to remove this goal from your dashboard?"
        confirmLabel="Yes, Delete"
        onConfirm={() => {
          if (deleteGoalId) {
            deleteSavingsGoal(deleteGoalId);
            setDeleteGoalId(null);
          }
        }}
        onClose={() => setDeleteGoalId(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteBillId)}
        title="Delete Recurring Bill"
        message="Are you sure you want to delete this recurring subscription?"
        confirmLabel="Yes, Delete"
        onConfirm={() => {
          if (deleteBillId) {
            deleteRecurringBill(deleteBillId);
            setDeleteBillId(null);
          }
        }}
        onClose={() => setDeleteBillId(null)}
      />
    </div>
  );
}

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
  Bell,
  Check,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { Reveal, Tag } from "./anim";
import { inr } from "../lib/format";

export default function SavingsAndRecurring() {
  const { savingsGoals, recurringBills, contributeToGoal, addSavingsGoal, addRecurringBill, toggleRecurringPaid } = useExpenses();

  // Goals state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [contributeGoalId, setContributeGoalId] = useState(null);
  const [contribAmount, setContribAmount] = useState("");

  // Recurring state
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [recName, setRecName] = useState("");
  const [recAmount, setRecAmount] = useState("");
  const [recDueDay, setRecDueDay] = useState("15");
  const [recCategory, setRecCategory] = useState("Utilities");

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!goalName.trim() || !goalTarget) return;

    await addSavingsGoal({
      name: goalName.trim(),
      targetAmount: Number(goalTarget),
      currentAmount: Number(goalCurrent || 0),
      deadline: goalDeadline || "2026-12-31",
      category: "Personal",
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
    if (!val || val <= 0 || !contributeGoalId) return;

    await contributeToGoal(contributeGoalId, val);
    setContribAmount("");
    setContributeGoalId(null);
  };

  const handleCreateRecurring = async (e) => {
    e.preventDefault();
    if (!recName.trim() || !recAmount) return;

    await addRecurringBill({
      name: recName.trim(),
      amount: Number(recAmount),
      dueDay: Number(recDueDay),
      category: recCategory,
      period: "Monthly",
      status: "due",
    });

    setRecName("");
    setRecAmount("");
    setShowRecurringModal(false);
  };

  return (
    <section id="savings-and-bills" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(45%_35%_at_50%_50%,rgba(0,229,153,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Tag>Future & Subscriptions</Tag>
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Savings Goals &{" "}
            <em className="font-display font-light italic text-mint">Recurring Subscriptions.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-mist md:text-lg">
            Lock in funds for semester tech upgrades and holiday trips while staying ahead of campus Wi-Fi and gym due dates.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Column 1: Savings Goals (Feature 5) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint/15 text-mint">
                  <Target size={16} />
                </span>
                <h3 className="font-heading text-xl font-bold text-white">Active Savings Goals</h3>
              </div>

              <button
                type="button"
                onClick={() => setShowGoalModal(true)}
                className="flex items-center gap-1.5 rounded-full border border-line bg-surface-1/90 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:border-mint/50 hover:bg-surface-2"
              >
                <Plus size={13} className="text-mint" />
                <span>New Goal</span>
              </button>
            </div>

            <div className="space-y-4">
              {savingsGoals.map((g) => {
                const pct = Math.min(Math.round(((g.currentAmount || 0) / g.targetAmount) * 100), 100);
                const remaining = Math.max(g.targetAmount - (g.currentAmount || 0), 0);

                return (
                  <div
                    key={g.id}
                    className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl sm:p-6 transition-all hover:border-mint/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-mint uppercase tracking-wider">
                            Target: {g.deadline || "End of Year"}
                          </span>
                        </div>
                        <h4 className="font-heading text-lg font-bold text-white">{g.name}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setContributeGoalId(g.id)}
                          className="rounded-full bg-mint/15 border border-mint/30 px-3.5 py-1.5 text-xs font-semibold text-mint hover:bg-mint hover:text-ink transition-all"
                        >
                          + Contribute
                        </button>
                      </div>
                    </div>

                    {/* Progress details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-end text-xs font-mono">
                        <div>
                          <span className="text-xl font-bold text-white tabular-nums">{inr(g.currentAmount || 0)}</span>
                          <span className="text-mist"> / {inr(g.targetAmount)}</span>
                        </div>
                        <span className="text-mint font-bold tabular-nums text-sm">{pct}% Reached</span>
                      </div>

                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink">
                        <motion.div
                          className="h-full rounded-full bg-mint shadow-[0_0_12px_rgba(0,229,153,0.4)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-mist pt-1">
                        <span>Remaining: {inr(remaining)}</span>
                        <span>{pct >= 100 ? "Goal Complete! 🎉" : "On track"}</span>
                      </div>
                    </div>

                    {/* Inline Quick Contribution Form */}
                    {contributeGoalId === g.id && (
                      <form
                        onSubmit={handleContributeSubmit}
                        className="mt-4 border-t border-line/80 pt-3 flex items-center gap-2"
                      >
                        <input
                          type="number"
                          min="1"
                          required
                          value={contribAmount}
                          onChange={(e) => setContribAmount(e.target.value)}
                          placeholder="Amount to deposit (₹)"
                          className="flex-1 rounded-xl border border-line bg-ink px-3 py-2 text-xs font-mono text-white outline-none focus:border-mint"
                        />
                        <button
                          type="button"
                          onClick={() => contributeGoalId === g.id && setContribAmount("500")}
                          className="rounded-lg bg-surface-2 px-2.5 py-2 text-[11px] font-mono text-mist hover:text-white"
                        >
                          +₹500
                        </button>
                        <button
                          type="button"
                          onClick={() => contributeGoalId === g.id && setContribAmount("1000")}
                          className="rounded-lg bg-surface-2 px-2.5 py-2 text-[11px] font-mono text-mist hover:text-white"
                        >
                          +₹1000
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl bg-mint px-4 py-2 font-heading text-xs font-semibold text-ink"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setContributeGoalId(null)}
                          className="text-xs text-mist hover:text-white px-2"
                        >
                          Cancel
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Recurring Bills & Subscriptions (Feature 7) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint/15 text-mint">
                  <CreditCard size={16} />
                </span>
                <h3 className="font-heading text-xl font-bold text-white">Recurring Expenses</h3>
              </div>

              <button
                type="button"
                onClick={() => setShowRecurringModal(true)}
                className="flex items-center gap-1.5 rounded-full border border-line bg-surface-1/90 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:border-mint/50 hover:bg-surface-2"
              >
                <Plus size={13} className="text-mint" />
                <span>Add Bill</span>
              </button>
            </div>

            <div className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between px-2 text-[11px] font-mono text-mist uppercase tracking-wider">
                <span>Subscription</span>
                <span>Due Cycle & Action</span>
              </div>

              {recurringBills.map((r) => {
                const isPaid = r.status === "paid";
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-2xl border border-line/60 bg-surface-2/40 p-3.5 transition-colors hover:bg-surface-2/70"
                  >
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-white">{r.name}</h4>
                      <p className="font-mono text-xs font-bold text-mint tabular-nums mt-0.5">
                        {r.amount > 0 ? inr(r.amount) : "Free (Student Tier)"}
                        <span className="text-[10px] text-mist font-normal"> /mo</span>
                      </p>
                      <p className="text-[10px] text-mist mt-0.5">Due on {r.dueDay}th of each month</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRecurringPaid(r.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold font-mono transition-all ${
                        isPaid
                          ? "bg-mint/15 text-mint border border-mint/30"
                          : "bg-surface-1 border border-line text-mist hover:text-white hover:border-mint/50"
                      }`}
                    >
                      {isPaid ? <Check size={13} /> : <Clock size={13} />}
                      <span>{isPaid ? "Paid" : "Mark Paid"}</span>
                    </button>
                  </div>
                );
              })}

              <div className="mt-4 border-t border-line/80 pt-4 px-2 flex justify-between items-center text-xs">
                <span className="text-mist">Total Monthly Subscriptions</span>
                <span className="font-mono font-bold text-white">
                  {inr(recurringBills.reduce((acc, curr) => acc + curr.amount, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: New Savings Goal */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoalModal(false)}
              className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface-1/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <h3 className="font-heading text-2xl font-bold text-white">Set a Savings Target</h3>
              <p className="mt-1 text-xs text-mist">
                Track your progress towards campus essentials, new gadgets, or semester savings.
              </p>

              <form onSubmit={handleCreateGoal} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-mist">Goal Title</label>
                  <input
                    type="text"
                    required
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g. New iPad for Notes & Sketching"
                    className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm text-white placeholder-mist/60 outline-none focus:border-mint"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-mist">Target Goal (₹)</label>
                    <input
                      type="number"
                      required
                      min="500"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      placeholder="e.g. 35000"
                      className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-mint"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-mist">Initial Saved (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-mint"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-mist">Target Deadline</label>
                  <input
                    type="date"
                    required
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-mint"
                  />
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoalModal(false)}
                    className="rounded-xl px-4 py-2 text-xs text-mist hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-mint px-5 py-2.5 font-heading text-xs font-semibold text-ink shadow-[0_0_20px_rgba(0,229,153,0.3)] hover:shadow-[0_0_32px_rgba(0,229,153,0.5)]"
                  >
                    Create Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: New Recurring Bill */}
      <AnimatePresence>
        {showRecurringModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRecurringModal(false)}
              className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface-1/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <h3 className="font-heading text-2xl font-bold text-white">Track Recurring Subscription</h3>
              <p className="mt-1 text-xs text-mist">
                Avoid surprise bank deductions with automated due-date countdowns.
              </p>

              <form onSubmit={handleCreateRecurring} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-mist">Subscription Name</label>
                  <input
                    type="text"
                    required
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    placeholder="e.g. Netflix, Hostel Mess Card, Gym"
                    className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm text-white placeholder-mist/60 outline-none focus:border-mint"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-mist">Monthly Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={recAmount}
                      onChange={(e) => setRecAmount(e.target.value)}
                      placeholder="e.g. 499"
                      className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-mint"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-mist">Due Day of Month (1-31)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="31"
                      value={recDueDay}
                      onChange={(e) => setRecDueDay(e.target.value)}
                      className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-mint"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-mist">Category</label>
                  <select
                    value={recCategory}
                    onChange={(e) => setRecCategory(e.target.value)}
                    className="w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm text-white outline-none focus:border-mint"
                  >
                    <option value="Utilities">Utilities & Wi-Fi</option>
                    <option value="Lifestyle">Entertainment & Streaming</option>
                    <option value="Healthcare">Gym & Fitness</option>
                    <option value="Housing">Hostel & Rent</option>
                    <option value="Academics">Software & Subscriptions</option>
                  </select>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRecurringModal(false)}
                    className="rounded-xl px-4 py-2 text-xs text-mist hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-mint px-5 py-2.5 font-heading text-xs font-semibold text-ink shadow-[0_0_20px_rgba(0,229,153,0.3)] hover:shadow-[0_0_32px_rgba(0,229,153,0.5)]"
                  >
                    Add Subscription
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

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  UserCheck,
  X,
  Share2,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { inr } from "../lib/format";
import ConfirmDialog from "../components/modals/ConfirmDialog";

export default function GroupExpensesView() {
  const { groupExpenses, addGroupExpense, settleGroupMember, deleteGroupExpense, currency } =
    useExpenses();

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteGrpId, setDeleteGrpId] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidBy, setPaidBy] = useState("You");
  const [category, setCategory] = useState("Food & Dining");
  const [memberNames, setMemberNames] = useState("You, Rohan, Sameer");

  // Summary Metrics
  const summary = useMemo(() => {
    let totalGroupSpent = 0;
    let youPaid = 0;
    let owedToYou = 0;
    let youOwe = 0;

    groupExpenses.forEach((item) => {
      totalGroupSpent += Number(item.amount);
      const isPayerYou = item.paidBy.toLowerCase() === "you";

      item.members.forEach((m) => {
        const isMemberYou = m.name.toLowerCase() === "you";
        if (isPayerYou && !isMemberYou && !m.settled) {
          owedToYou += Number(m.share);
        }
        if (!isPayerYou && isMemberYou && !m.settled) {
          youOwe += Number(m.share);
        }
      });
    });

    return { totalGroupSpent, owedToYou, youOwe, netBalance: owedToYou - youOwe };
  }, [groupExpenses]);

  const handleCreateGroupExpense = async (e) => {
    e.preventDefault();
    const amt = parseFloat(totalAmount);
    if (!title.trim() || isNaN(amt) || amt <= 0) return;

    // Parse member names
    const names = memberNames
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    if (names.length === 0) return;

    const perPerson = Math.round((amt / names.length) * 100) / 100;
    const members = names.map((name) => ({
      name,
      share: perPerson,
      settled: name.toLowerCase() === paidBy.toLowerCase(),
    }));

    await addGroupExpense({
      title: title.trim(),
      amount: amt,
      paidBy: paidBy.trim() || "You",
      category,
      date: new Date().toISOString().split("T")[0],
      members,
      status: "pending",
    });

    setTitle("");
    setTotalAmount("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Group Expenses & Roommate Splits
          </h1>
          <p className="mt-1 text-xs text-mist sm:text-sm">
            Split hostel rent, mess bills, weekend outings, and hackathon snacks without the awkward math.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-mint px-4 py-2 text-xs font-semibold text-ink shadow-lg shadow-mint/20 hover:opacity-95"
        >
          <Plus size={14} />
          Split New Bill
        </button>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl">
          <span className="text-xs font-medium text-mist">Total Group Spending</span>
          <p className="mt-2 font-mono text-2xl font-bold text-white sm:text-3xl">
            {inr(summary.totalGroupSpent, currency)}
          </p>
          <p className="mt-1.5 text-xs text-mist">Across dorm and group events</p>
        </div>

        <div className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl">
          <span className="text-xs font-medium text-mist">Owed to You</span>
          <p className="mt-2 font-mono text-2xl font-bold text-mint sm:text-3xl">
            {inr(summary.owedToYou, currency)}
          </p>
          <p className="mt-1.5 text-xs text-mist">Roommates need to pay you back</p>
        </div>

        <div className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl">
          <span className="text-xs font-medium text-mist">You Owe Others</span>
          <p className="mt-2 font-mono text-2xl font-bold text-alert sm:text-3xl">
            {inr(summary.youOwe, currency)}
          </p>
          <p className="mt-1.5 text-xs text-mist">Unsettled shares you need to pay</p>
        </div>

        <div className="rounded-3xl border border-line bg-surface-1/90 p-5 shadow-xl backdrop-blur-xl">
          <span className="text-xs font-medium text-mist">Your Net Position</span>
          <p
            className={`mt-2 font-mono text-2xl font-bold sm:text-3xl ${
              summary.netBalance >= 0 ? "text-mint" : "text-alert"
            }`}
          >
            {summary.netBalance >= 0 ? "+" : ""}
            {inr(summary.netBalance, currency)}
          </p>
          <p className="mt-1.5 text-xs text-mist">
            {summary.netBalance >= 0 ? "You are owed more" : "You have pending payables"}
          </p>
        </div>
      </div>

      {/* Shared Bills List */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Users size={18} className="text-mint" />
          Active Shared Bills
        </h2>

        {groupExpenses.length === 0 ? (
          <div className="rounded-3xl border border-line bg-surface-1 p-12 text-center">
            <p className="font-heading text-base font-bold text-white">No group bills yet</p>
            <p className="mt-1 text-xs text-mist">
              Tap "Split New Bill" to split hostel rent, groceries, or study group dinner.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {groupExpenses.map((bill) => {
              const allSettled = bill.members.every((m) => m.settled);

              return (
                <div
                  key={bill.id}
                  className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl transition-all hover:border-mint/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading text-base font-bold text-white">{bill.title}</h3>
                      <p className="text-xs text-mist">
                        {bill.category} · Paid by <strong className="text-white">{bill.paidBy}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          allSettled
                            ? "bg-mint/15 text-mint"
                            : "bg-amber-400/15 text-amber-300"
                        }`}
                      >
                        {allSettled ? "Settled ✓" : "Pending"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDeleteGrpId(bill.id)}
                        className="rounded-lg p-1 text-mist hover:text-alert"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between border-b border-line pb-3">
                    <span className="text-xs text-mist">Total Bill</span>
                    <span className="font-mono text-lg font-bold text-white">
                      {inr(bill.amount, currency)}
                    </span>
                  </div>

                  {/* Roommates split breakdown */}
                  <div className="mt-4 space-y-2.5">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-mist">
                      Split Breakdown ({bill.members.length} members)
                    </p>

                    {bill.members.map((m) => (
                      <div
                        key={m.name}
                        className="flex items-center justify-between rounded-xl border border-line/50 bg-surface-2/40 px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                              m.settled ? "bg-mint/20 text-mint" : "bg-surface-2 text-mist"
                            }`}
                          >
                            {m.settled ? "✓" : "•"}
                          </span>
                          <span className="font-medium text-white">{m.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white">
                            {inr(m.share, currency)}
                          </span>

                          <button
                            type="button"
                            onClick={() => settleGroupMember(bill.id, m.name)}
                            className={`rounded-lg px-2 py-0.5 text-[10px] font-mono font-bold uppercase transition-all ${
                              m.settled
                                ? "bg-mint/20 text-mint hover:bg-alert/15 hover:text-alert"
                                : "bg-surface-2 text-mist hover:text-white border border-line hover:border-mint"
                            }`}
                            title={m.settled ? "Click to toggle unsettled" : "Click to mark settled"}
                          >
                            {m.settled ? "Settled" : "Mark Paid"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE GROUP EXPENSE MODAL */}
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
                <h3 className="font-heading text-base font-bold text-white">Split Shared Bill</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-full p-1 text-mist hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateGroupExpense} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-mist">Bill Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Wi-Fi bill, Domino's study dinner"
                    className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase text-mist">
                      Total ({currency})
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="e.g. 1800"
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm font-mono text-white focus:border-mint focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-mist">Paid By</label>
                    <input
                      type="text"
                      required
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                      placeholder="e.g. You or Rohan"
                      className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-mist">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Utilities">Utilities & Wi-Fi</option>
                    <option value="Housing">Hostel / Rent</option>
                    <option value="Transport">Cab / Travel</option>
                    <option value="Academics">Project Supplies</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-mist">
                    Roommates / Members (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={memberNames}
                    onChange={(e) => setMemberNames(e.target.value)}
                    placeholder="e.g. You, Rohan, Sameer"
                    className="mt-1 w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-white focus:border-mint focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-mist">
                    The total amount will be split equally across everyone listed.
                  </p>
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
                    Create Split
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteGrpId)}
        title="Delete Shared Bill"
        message="Are you sure you want to remove this shared expense?"
        confirmLabel="Yes, Delete"
        onConfirm={() => {
          if (deleteGrpId) {
            deleteGroupExpense(deleteGrpId);
            setDeleteGrpId(null);
          }
        }}
        onClose={() => setDeleteGrpId(null)}
      />
    </div>
  );
}

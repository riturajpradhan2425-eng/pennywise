import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Edit2, AlertCircle } from "lucide-react";
import { useExpenses } from "../../context/ExpenseContext";

const CATEGORIES = [
  "Food & Dining",
  "Housing",
  "Academics",
  "Transport",
  "Lifestyle",
  "Utilities",
  "Healthcare",
  "Savings",
  "Other",
];

export default function TransactionModal({ isOpen, onClose, initialData = null }) {
  const { addExpense, editExpense, currency } = useExpenses();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food & Dining");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setAmount(initialData.amount ? String(initialData.amount) : "");
      setType(initialData.type || "expense");
      setCategory(initialData.category || "Food & Dining");
      setDate(initialData.date || new Date().toISOString().split("T")[0]);
      setNotes(initialData.notes || "");
    } else {
      setTitle("");
      setAmount("");
      setType("expense");
      setCategory("Food & Dining");
      setDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please provide a title or merchant name.");
      return;
    }

    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await editExpense(initialData.id, {
          title: title.trim(),
          amount: numAmt,
          type,
          category: type === "income" ? "Income" : category,
          date,
          notes: notes.trim(),
        });
      } else {
        await addExpense({
          title: title.trim(),
          amount: numAmt,
          type,
          category: type === "income" ? "Income" : category,
          date,
          notes: notes.trim(),
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-surface-1 p-6 shadow-2xl md:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint/15 text-mint">
                {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {isEditing ? "Edit Transaction" : "New Transaction"}
                </h3>
                <p className="text-xs text-mist">
                  {isEditing ? "Modify existing transaction details" : "Record campus income or expense"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-mist transition-colors hover:bg-surface-2 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-alert/30 bg-alert/10 px-3.5 py-2.5 text-xs text-alert">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Inflow vs Outflow Type Selector */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-mist">Type</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    type === "expense"
                      ? "border border-alert/40 bg-alert/15 text-alert"
                      : "border border-line bg-surface-2/60 text-mist hover:text-white"
                  }`}
                >
                  <span>Outflow (Expense)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    type === "income"
                      ? "border border-mint/40 bg-mint/15 text-mint"
                      : "border border-line bg-surface-2/60 text-mist hover:text-white"
                  }`}
                >
                  <span>Inflow (Income)</span>
                </button>
              </div>
            </div>

            {/* Title / Merchant */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-mist">
                Description / Merchant
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Campus Cafeteria, Xerox, Stipend"
                className="mt-1.5 w-full rounded-xl border border-line bg-ink px-4 py-2.5 text-sm text-white placeholder:text-mist/50 focus:border-mint focus:outline-none"
              />
            </div>

            {/* Amount and Category Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-mist">
                  Amount ({currency})
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-mist">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-line bg-ink py-2.5 pl-8 pr-4 text-sm font-mono text-white focus:border-mint focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-mist">
                  Category
                </label>
                <select
                  disabled={type === "income"}
                  value={type === "income" ? "Income" : category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-sm text-white focus:border-mint focus:outline-none disabled:opacity-60"
                >
                  {type === "income" ? (
                    <option value="Income">Income / Allowance</option>
                  ) : (
                    CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Date and Notes */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-mist">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-sm text-white focus:border-mint focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-mist">
                  Notes / Tag (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Split with Rohan, Midterm prep"
                  className="mt-1.5 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-sm text-white placeholder:text-mist/50 focus:border-mint focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-line px-4 py-2.5 text-xs font-semibold text-mist transition-colors hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-xs font-semibold text-ink shadow-lg shadow-mint/20 transition-all hover:opacity-95 disabled:opacity-50"
              >
                {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Transaction"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Download,
  Printer,
  Trash2,
  Edit2,
  Eye,
  Camera,
  ShoppingBag,
  Home,
  BookOpen,
  Bus,
  Tv,
  Zap,
  HeartPulse,
  Target,
  TrendingUp,
  Tag as TagIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  X,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { inr } from "../lib/format";
import AIReceiptScanner from "../components/AIReceiptScanner";
import ConfirmDialog from "../components/modals/ConfirmDialog";

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

const CATEGORIES = [
  "All Categories",
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

export default function TransactionsView({ onOpenAddModal, onEditTransaction }) {
  const {
    expenses,
    deleteExpense,
    exportCSV,
    printReport,
    totalIncome,
    totalExpenses,
    remainingBalance,
    currency,
  } = useExpenses();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("all"); // 'all' | 'expense' | 'income'
  const [sortBy, setSortBy] = useState("date-desc"); // 'date-desc' | 'date-asc' | 'amt-desc' | 'amt-asc'
  const [groupByDate, setGroupByDate] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [viewTx, setViewTx] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtered & Sorted Expenses
  const filteredAndSorted = useMemo(() => {
    let result = expenses.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        e.title?.toLowerCase().includes(q) ||
        e.notes?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === "All Categories" || e.category === selectedCategory;

      const matchType =
        selectedType === "all" ||
        (selectedType === "expense" ? e.type !== "income" : e.type === "income");

      return matchSearch && matchCategory && matchType;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === "date-asc") {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      if (sortBy === "amt-desc") {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortBy === "amt-asc") {
        return Number(a.amount) - Number(b.amount);
      }
      return 0;
    });

    return result;
  }, [expenses, searchQuery, selectedCategory, selectedType, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  // Grouping by Date
  const groupedByDateEntries = useMemo(() => {
    if (!groupByDate) return null;
    const groups = {};
    paginatedItems.forEach((item) => {
      const d = item.date || "Unknown Date";
      if (!groups[d]) groups[d] = [];
      groups[d].push(item);
    });
    return Object.entries(groups);
  }, [paginatedItems, groupByDate]);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteExpense(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Transactions & Ledger
          </h1>
          <p className="mt-1 text-xs text-mist sm:text-sm">
            Complete campus spending log with automated classification, search, and exports.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowScanner(!showScanner)}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              showScanner
                ? "border-mint bg-mint text-ink"
                : "border-mint/40 bg-mint/10 text-mint hover:bg-mint hover:text-ink"
            }`}
          >
            <Camera size={14} />
            {showScanner ? "Hide Scanner" : "Scan Receipt"}
          </button>

          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:border-mint/50"
          >
            <Download size={14} />
            CSV
          </button>

          <button
            type="button"
            onClick={printReport}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:border-mint/50"
          >
            <Printer size={14} />
            Print
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-mint px-4 py-2 text-xs font-semibold text-ink shadow-lg shadow-mint/20 transition-all hover:opacity-95"
          >
            <Plus size={14} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Embedded AI Receipt Scanner Drawer */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-3xl border border-mint/30 bg-surface-1/95 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                <Camera size={16} className="text-mint" />
                Multimodal AI Receipt Scanner
              </h3>
              <button
                type="button"
                onClick={() => setShowScanner(false)}
                className="text-xs text-mist hover:text-white"
              >
                Close Scanner ✕
              </button>
            </div>
            <AIReceiptScanner />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-1/90 p-4 shadow-xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by merchant, note..."
              className="w-full rounded-xl border border-line bg-ink py-2 pl-9 pr-4 text-xs text-white placeholder:text-mist/50 focus:border-mint focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-line bg-ink px-3 py-2 text-xs text-white focus:border-mint focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <div className="inline-flex rounded-xl border border-line bg-ink p-1">
            <button
              type="button"
              onClick={() => {
                setSelectedType("all");
                setCurrentPage(1);
              }}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedType === "all" ? "bg-surface-2 text-white" : "text-mist hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedType("expense");
                setCurrentPage(1);
              }}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedType === "expense" ? "bg-alert/20 text-alert" : "text-mist hover:text-white"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedType("income");
                setCurrentPage(1);
              }}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedType === "income" ? "bg-mint/20 text-mint" : "text-mist hover:text-white"
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Right Sort & View Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-mist">
            <ArrowUpDown size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-line bg-ink px-2.5 py-1.5 text-xs text-white focus:border-mint focus:outline-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amt-desc">Highest Amount</option>
              <option value="amt-asc">Lowest Amount</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setGroupByDate(!groupByDate)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              groupByDate
                ? "border-mint/40 bg-mint/10 text-mint"
                : "border-line bg-ink text-mist hover:text-white"
            }`}
          >
            {groupByDate ? "Date Grouped ✓" : "Flat List"}
          </button>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="overflow-hidden rounded-3xl border border-line bg-surface-1/90 shadow-2xl backdrop-blur-xl">
        {filteredAndSorted.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-heading text-base font-bold text-white">No transactions found</p>
            <p className="mt-1 text-xs text-mist">
              Try adjusting your search criteria or add a new transaction above.
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="mt-4 rounded-xl bg-mint px-4 py-2 text-xs font-semibold text-ink"
            >
              + Record Transaction
            </button>
          </div>
        ) : groupByDate && groupedByDateEntries ? (
          <div className="divide-y divide-line/60">
            {groupedByDateEntries.map(([dateString, items]) => {
              const dayTotal = items.reduce(
                (sum, curr) => (curr.type === "income" ? sum + curr.amount : sum - curr.amount),
                0
              );
              return (
                <div key={dateString} className="p-4 sm:p-5">
                  {/* Date Header */}
                  <div className="flex items-center justify-between pb-3 text-xs">
                    <span className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-mist">
                      <Calendar size={13} className="text-mint" />
                      {dateString}
                    </span>
                    <span
                      className={`font-mono text-xs font-semibold ${
                        dayTotal >= 0 ? "text-mint" : "text-mist"
                      }`}
                    >
                      Net {dayTotal >= 0 ? "+" : ""}
                      {inr(dayTotal, currency)}
                    </span>
                  </div>

                  {/* Items for this date */}
                  <div className="space-y-2">
                    {items.map((tx) => {
                      const IconComponent = CATEGORY_ICONS[tx.category] || TagIcon;
                      const isIncome = tx.type === "income";
                      return (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between rounded-2xl border border-line/40 bg-surface-2/30 p-3.5 transition-all hover:border-mint/30 hover:bg-surface-2/60"
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
                              <p className="font-semibold text-white text-xs sm:text-sm">
                                {tx.title}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-mist">
                                <span>{tx.category}</span>
                                {tx.notes && <span>· {tx.notes}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span
                              className={`font-mono text-xs sm:text-sm font-bold ${
                                isIncome ? "text-mint" : "text-white"
                              }`}
                            >
                              {isIncome ? "+" : "-"}
                              {inr(tx.amount, currency)}
                            </span>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setViewTx(tx)}
                                title="View Details"
                                className="rounded-lg p-1.5 text-mist hover:bg-surface-2 hover:text-white"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => onEditTransaction(tx)}
                                title="Edit"
                                className="rounded-lg p-1.5 text-mist hover:bg-surface-2 hover:text-mint"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteId(tx.id)}
                                title="Delete"
                                className="rounded-lg p-1.5 text-mist hover:bg-alert/15 hover:text-alert"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-line bg-surface-2/70 text-[11px] font-mono uppercase tracking-wider text-mist">
                <tr>
                  <th className="py-3.5 pl-6 pr-4">Description</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5 text-right">Amount</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {paginatedItems.map((tx) => {
                  const isIncome = tx.type === "income";
                  return (
                    <tr key={tx.id} className="transition-colors hover:bg-surface-2/40">
                      <td className="py-3.5 pl-6 pr-4 font-semibold text-white">
                        <p>{tx.title}</p>
                        {tx.notes && <p className="text-[11px] font-normal text-mist">{tx.notes}</p>}
                      </td>
                      <td className="px-4 py-3.5 text-mist">{tx.category}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-mist">{tx.date}</td>
                      <td className="px-4 py-3.5 font-mono text-[11px] uppercase">
                        <span className={isIncome ? "text-mint font-bold" : "text-mist"}>
                          {isIncome ? "Inflow" : "Outflow"}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right font-mono font-bold ${
                          isIncome ? "text-mint" : "text-white"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {inr(tx.amount, currency)}
                      </td>
                      <td className="py-3.5 pl-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewTx(tx)}
                            className="rounded-lg p-1.5 text-mist hover:bg-surface-2 hover:text-white"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditTransaction(tx)}
                            className="rounded-lg p-1.5 text-mist hover:bg-surface-2 hover:text-mint"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(tx.id)}
                            className="rounded-lg p-1.5 text-mist hover:bg-alert/15 hover:text-alert"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Ledger Footer & Pagination */}
        <div className="flex flex-wrap items-center justify-between border-t border-line bg-surface-2/40 px-6 py-4 text-xs text-mist">
          <div>
            Showing <strong>{paginatedItems.length}</strong> of <strong>{filteredAndSorted.length}</strong>{" "}
            records (Page {currentPage} of {totalPages})
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="rounded-lg border border-line p-1.5 text-mist hover:text-white disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-xs text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="rounded-lg border border-line p-1.5 text-mist hover:text-white disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* View Transaction Details Modal */}
      <AnimatePresence>
        {viewTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-ink/80 backdrop-blur-md"
              onClick={() => setViewTx(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-line bg-surface-1 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="font-heading text-base font-bold text-white">Transaction Details</h3>
                <button
                  type="button"
                  onClick={() => setViewTx(null)}
                  className="rounded-full p-1 text-mist hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="font-mono uppercase text-mist">Title / Merchant</span>
                  <p className="mt-0.5 text-sm font-semibold text-white">{viewTx.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono uppercase text-mist">Amount</span>
                    <p className="mt-0.5 text-base font-bold font-mono text-mint">
                      {inr(viewTx.amount, currency)}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono uppercase text-mist">Type</span>
                    <p className="mt-0.5 font-semibold text-white uppercase">{viewTx.type || "expense"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono uppercase text-mist">Category</span>
                    <p className="mt-0.5 font-medium text-white">{viewTx.category}</p>
                  </div>
                  <div>
                    <span className="font-mono uppercase text-mist">Date</span>
                    <p className="mt-0.5 font-mono text-white">{viewTx.date}</p>
                  </div>
                </div>
                {viewTx.notes && (
                  <div>
                    <span className="font-mono uppercase text-mist">Notes</span>
                    <p className="mt-0.5 text-white">{viewTx.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = viewTx;
                    setViewTx(null);
                    onEditTransaction(toEdit);
                  }}
                  className="rounded-xl border border-line px-3.5 py-1.5 text-xs font-semibold text-white hover:border-mint"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setViewTx(null)}
                  className="rounded-xl bg-mint px-4 py-1.5 text-xs font-semibold text-ink"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction from your ledger? Your remaining balance will be updated automatically."
        confirmLabel="Yes, Delete"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}

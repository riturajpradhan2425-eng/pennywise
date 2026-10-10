import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  KeyRound,
  RotateCcw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Coins,
  Save,
  Download,
  School,
  Sparkles,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../context/ExpenseContext";
import { inr } from "../lib/format";
import ConfirmDialog from "../components/modals/ConfirmDialog";

const CURRENCIES = [
  { symbol: "₹", name: "Indian Rupee (INR)", code: "INR" },
  { symbol: "$", name: "US Dollar (USD)", code: "USD" },
  { symbol: "€", name: "Euro (EUR)", code: "EUR" },
  { symbol: "£", name: "British Pound (GBP)", code: "GBP" },
];

export default function ProfileSettingsView() {
  const { user, userProfile, openAuthModal, signOutUser, resetPassword } = useAuth();
  const {
    currency,
    setCurrency,
    monthlyAllowance,
    setMonthlyAllowance,
    resetAllData,
    exportCSV,
    exportPDF,
    printReport,
  } = useExpenses();

  const [allowanceInput, setAllowanceInput] = useState(String(monthlyAllowance || 32500));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);

  const displayName =
    user?.displayName || userProfile?.displayName || user?.email?.split("@")[0] || "College Student";

  const handleSavePreferences = (e) => {
    e.preventDefault();
    const val = Number(allowanceInput);
    if (!isNaN(val) && val > 0) {
      setMonthlyAllowance(val);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleResetData = () => {
    resetAllData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleSendResetPassword = async () => {
    if (user?.email) {
      try {
        await resetPassword(user.email);
        setResetPasswordSent(true);
        setTimeout(() => setResetPasswordSent(false), 4000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Account & App Settings
        </h1>
        <p className="mt-1 text-xs text-mist sm:text-sm">
          Customize currency preferences, pocket money baseline, and security credentials.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint font-heading text-2xl font-bold text-ink shadow-lg shadow-mint/20">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-white sm:text-xl">
                  {displayName}
                </h2>
                <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-mono font-bold text-mint uppercase">
                  {user ? "Cloud Synced" : "Guest Mode"}
                </span>
              </div>
              <p className="text-xs text-mist">{user?.email || "Local student profile"}</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-mist font-medium">
                <School size={14} className="text-mint" />
                <span>Computer Science & Engineering · Class of 2027</span>
              </div>
            </div>
          </div>

          <div>
            {user ? (
              <button
                type="button"
                onClick={signOutUser}
                className="flex items-center gap-2 rounded-xl border border-alert/30 bg-alert/10 px-4 py-2 text-xs font-semibold text-alert hover:bg-alert hover:text-white transition-all"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal({ initialMode: "signin" })}
                className="flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-xs font-semibold text-ink shadow-lg shadow-mint/20 hover:opacity-95"
              >
                <User size={14} />
                Sign In / Sync Cloud
              </button>
            )}
          </div>
        </div>

        {user && (
          <div className="mt-6 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-mist">Firebase Account Security:</span>
            <button
              type="button"
              onClick={handleSendResetPassword}
              className="flex items-center gap-1.5 font-semibold text-mint hover:underline"
            >
              <KeyRound size={14} />
              Send Password Reset Email
            </button>
            {resetPasswordSent && (
              <span className="text-mint font-medium">Reset email dispatched!</span>
            )}
          </div>
        )}
      </div>

      {/* Financial Preferences Form */}
      <form
        onSubmit={handleSavePreferences}
        className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl sm:p-8 space-y-6"
      >
        <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
          <Coins size={18} className="text-mint" />
          Financial & Currency Preferences
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Currency Selection */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-mist">
              Preferred Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-ink px-4 py-2.5 text-sm text-white focus:border-mint focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Allowance Baseline */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-mist">
              Monthly Allowance / Pocket Money Baseline ({currency})
            </label>
            <input
              type="number"
              min="1000"
              value={allowanceInput}
              onChange={(e) => setAllowanceInput(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-ink px-4 py-2.5 text-sm font-mono text-white focus:border-mint focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="flex items-center gap-1.5 text-xs text-mint font-semibold">
              <CheckCircle2 size={16} /> Preferences saved!
            </span>
          ) : (
            <span className="text-xs text-mist">
              Changes apply instantly across runway calculations.
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-mint px-5 py-2 text-xs font-semibold text-ink shadow-md shadow-mint/20 hover:opacity-95"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </form>

      {/* Data Management & Backups */}
      <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl sm:p-8 space-y-6">
        <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
          <Download size={18} className="text-sky" />
          Data Ledgers & Backups
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface-2/40 p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-sm text-white">Export Transaction Ledger (CSV)</h4>
              <p className="mt-1 text-xs text-mist leading-relaxed">
                Download your entire spending history as a spreadsheet for Excel, Google Sheets, or tax records.
              </p>
            </div>
            <button
              type="button"
              onClick={exportCSV}
              className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-mint/40 bg-mint/10 px-4 py-2 text-xs font-semibold text-mint hover:bg-mint hover:text-ink transition-all"
            >
              <Download size={14} />
              Download .CSV
            </button>
          </div>

          <div className="rounded-2xl border border-line bg-surface-2/40 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-mint/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mint">
                  Report
                </span>
              </div>
              <h4 className="mt-1.5 font-semibold text-sm text-white">Financial Statement (PDF)</h4>
              <p className="mt-1 text-xs text-mist leading-relaxed">
                Download an official formatted statement showing inflow, expenses, budgets, savings goals, and runway.
              </p>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={exportPDF}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-mint/40 bg-mint/10 px-3 py-2 text-xs font-semibold text-mint hover:bg-mint hover:text-ink transition-all"
              >
                <FileText size={14} />
                Generate Live PDF
              </button>
              <a
                href="/PennyWise_Financial_Report.pdf"
                download="PennyWise_Financial_Report.pdf"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3 py-2 text-xs font-semibold text-white hover:border-mint transition-all"
              >
                <Download size={14} />
                Sample PDF
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-sky/40 bg-sky/5 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-sky/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky">
                  Full Codebase
                </span>
              </div>
              <h4 className="mt-1.5 font-semibold text-sm text-white">Complete App Source (.ZIP)</h4>
              <p className="mt-1 text-xs text-mist leading-relaxed">
                Download the complete codebase archive including all React components, views, context, Tailwind setup, and configuration.
              </p>
            </div>
            <a
              href="/pennywise-app.zip"
              download="pennywise-app.zip"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-sky px-4 py-2 text-xs font-semibold text-ink shadow-md shadow-sky/20 hover:opacity-95 transition-all text-center"
            >
              <Download size={14} />
              Download .ZIP (310 KB)
            </a>
          </div>
        </div>

        {/* Danger Zone: Reset Sample Data */}
        <div className="rounded-2xl border border-alert/30 bg-alert/5 p-5 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-white flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-alert" />
                Reset Sample Data
              </h4>
              <p className="mt-1 text-xs text-mist">
                Restore the default campus expenses, budgets, and goals if you'd like a fresh start.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-alert/40 bg-alert/15 px-4 py-2 text-xs font-semibold text-alert hover:bg-alert hover:text-white transition-all self-start sm:self-center"
            >
              <RotateCcw size={14} />
              Reset All
            </button>
          </div>
          {resetSuccess && (
            <p className="mt-2 text-xs font-semibold text-mint">
              Sample data successfully re-initialized!
            </p>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetModalOpen}
        title="Reset All Campus Data"
        message="This will reset your expenses, budgets, savings goals, and shared bills back to the original semester template. Are you sure you want to proceed?"
        confirmLabel="Reset Data"
        onConfirm={handleResetData}
        onClose={() => setResetModalOpen(false)}
      />
    </div>
  );
}

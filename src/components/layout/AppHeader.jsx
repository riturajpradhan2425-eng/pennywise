import { useState } from "react";
import {
  Menu,
  X,
  Plus,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  Layers,
  ArrowRight,
  Download,
  FileText,
} from "lucide-react";
import { Logo } from "../Logo";
import { useAuth } from "../../context/AuthContext";
import { useExpenses } from "../../context/ExpenseContext";

export default function AppHeader({
  activeView,
  viewTitles,
  onOpenAddModal,
  onOpenMobileMenu,
  isLandingMode,
  onToggleLandingMode,
  onNavigate,
}) {
  const { user, userProfile, openAuthModal, signOutUser } = useAuth();
  const { exportPDF } = useExpenses();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayName =
    user?.displayName || userProfile?.displayName || user?.email?.split("@")[0] || "Student";

  const currentTitle = viewTitles[activeView] || "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-surface-1/90 px-4 sm:px-6 backdrop-blur-xl">
      {/* Left: Mobile Menu & Current Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-xl border border-line p-2 text-mist transition-colors hover:text-white md:hidden"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-heading text-sm sm:text-base font-bold text-white">
            {currentTitle}
          </span>
          <span className="hidden sm:inline-block text-xs text-mist">· October 2026</span>
        </div>
      </div>

      {/* Right: Actions, Mode Switcher & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Toggle between App Portal and Marketing Showcase */}
        <button
          type="button"
          onClick={onToggleLandingMode}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3 py-1.5 text-xs font-semibold text-mist hover:border-mint hover:text-white transition-all"
          title={isLandingMode ? "Switch to Dashboard App" : "View Landing & Pitch Presentation"}
        >
          <Layers size={14} className="text-mint" />
          <span className="hidden sm:inline">
            {isLandingMode ? "Open App Dashboard" : "Landing Pitch"}
          </span>
        </button>

        {/* Quick Download PDF */}
        <button
          type="button"
          onClick={exportPDF}
          className="hidden md:flex items-center gap-1.5 rounded-xl border border-line bg-surface-2/80 px-3 py-1.5 text-xs font-semibold text-mist hover:border-mint/50 hover:text-white transition-all"
          title="Download official PDF financial statement"
        >
          <FileText size={14} className="text-mint" />
          <span>Statement PDF</span>
        </button>

        {/* Quick Download ZIP */}
        <a
          href="/pennywise-app.zip"
          download="pennywise-app.zip"
          className="hidden lg:flex items-center gap-1.5 rounded-xl border border-line bg-surface-2/80 px-3 py-1.5 text-xs font-semibold text-mist hover:border-sky/50 hover:text-white transition-all"
          title="Download complete project source ZIP"
        >
          <Download size={14} className="text-sky" />
          <span>ZIP</span>
        </a>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="hidden sm:flex items-center gap-1.5 rounded-xl bg-mint px-3.5 py-1.5 text-xs font-semibold text-ink shadow-sm hover:opacity-95"
        >
          <Plus size={14} />
          <span>Add Expense</span>
        </button>

        {/* User Account / Auth */}
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 p-1.5 pr-2.5 text-xs font-medium text-white hover:border-mint/50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-mint font-heading text-[11px] font-bold text-ink">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="hidden md:inline max-w-[100px] truncate">{displayName}</span>
              <ChevronDown size={12} className="text-mist" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 z-30 mt-2 w-48 rounded-2xl border border-line bg-surface-1 p-1.5 shadow-2xl backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-line mb-1">
                    <p className="text-[10px] font-mono uppercase text-mist">Signed In As</p>
                    <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onNavigate("settings");
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white hover:bg-surface-2"
                  >
                    <User size={14} className="text-mint" />
                    Account Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      exportPDF();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-mint hover:bg-surface-2"
                  >
                    <FileText size={14} className="text-mint" />
                    Download Statement (PDF)
                  </button>

                  <a
                    href="/pennywise-app.zip"
                    download="pennywise-app.zip"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-sky hover:bg-surface-2"
                  >
                    <Download size={14} className="text-sky" />
                    Download Project ZIP
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      signOutUser();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-alert hover:bg-alert/10"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal({ initialMode: "signin" })}
            className="rounded-xl border border-line bg-surface-2/80 px-3 py-1.5 text-xs font-semibold text-white hover:border-mint hover:text-mint transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

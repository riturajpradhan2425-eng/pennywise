import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { scrollToId } from "../lib/scroll";
import { MintButton } from "./anim";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../context/ExpenseContext";
import { LogOut, FileSpreadsheet, ChevronDown, PieChart, LayoutDashboard, Download, FileText } from "lucide-react";

const LINKS = [
  ["The Problem", "#problem"],
  ["Demo", "#demo"],
  ["Budget", "#budget-overview"],
  ["AI Coach", "#ai-coach"],
  ["Receipt Scanner", "#receipt-scanner"],
  ["Smart Budgets", "#smart-budgeting"],
  ["Goals & Bills", "#savings-and-bills"],
  ["Insights & Reports", "#insights-reports"],
];

export default function Nav({ onOpenApp }) {
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const { user, userProfile, openAuthModal, signOutUser } = useAuth();
  const { exportCSV, exportPDF } = useExpenses();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const displayName = user?.displayName || userProfile?.displayName || user?.email?.split("@")[0] || "Student";

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      data-testid="site-nav"
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-surface-1/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <a
          href="#top"
          onClick={scrollToId("#top")}
          data-testid="nav-logo-link"
          className="flex items-center gap-2.5"
        >
          <Logo />
          <span className="font-heading text-lg font-bold tracking-tight text-white">
            Penny<span className="text-mint">Wise</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 xl:flex">
          {LINKS.map(([label, hash]) => (
            <a
              key={hash}
              href={hash}
              onClick={scrollToId(hash)}
              data-testid={`nav-link-${hash.slice(1)}`}
              className="group relative text-xs font-medium text-mist transition-colors hover:text-white 2xl:text-sm"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-mint transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 rounded-full border border-line bg-surface-1/90 py-1.5 pl-2 pr-3.5 text-xs text-white transition-all hover:border-mint/50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint font-heading text-xs font-bold text-ink">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[110px] truncate font-medium">{displayName}</span>
                <ChevronDown size={14} className="text-mist" />
              </button>

              <AnimatePresence>
                {userDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-surface-1/95 p-1.5 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="px-3 py-2 border-b border-line mb-1">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-mist">Signed in</p>
                        <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdown(false);
                          if (onOpenApp) onOpenApp();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-surface-2 hover:text-mint"
                      >
                        <LayoutDashboard size={14} className="text-mint" />
                        Open Dashboard App
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdown(false);
                          exportCSV();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-surface-2 hover:text-mint"
                      >
                        <FileSpreadsheet size={14} className="text-mint" />
                        Export Transactions (CSV)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdown(false);
                          exportPDF();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-mint transition-colors hover:bg-surface-2"
                      >
                        <FileText size={14} className="text-mint" />
                        Download Statement (PDF)
                      </button>

                      <a
                        href="/pennywise-app.zip"
                        download="pennywise-app.zip"
                        onClick={() => setUserDropdown(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-sky transition-colors hover:bg-surface-2"
                      >
                        <Download size={14} className="text-sky" />
                        Download Project ZIP (.zip)
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdown(false);
                          signOutUser();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-alert transition-colors hover:bg-alert/10"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal({ initialMode: "signin" })}
              className="rounded-full border border-line bg-surface-1/60 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-mint/50 hover:text-mint"
            >
              Sign In
            </button>
          )}

          <MintButton
            testid="nav-cta-start"
            onClick={onOpenApp || scrollToId("#demo")}
            className="!px-4.5 !py-2 !text-xs sm:!px-5 sm:!py-2.5 sm:!text-sm"
          >
            Launch Dashboard
          </MintButton>
        </div>
      </div>
    </motion.header>
  );
}

import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Sparkles,
  Target,
  Users,
  Settings,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../Logo";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "budgets", label: "Budgets", icon: PieChart },
  { id: "ai-insights", label: "AI Coach", icon: Sparkles },
  { id: "savings-goals", label: "Goals", icon: Target },
  { id: "group-expenses", label: "Splits", icon: Users },
  { id: "settings", label: "Profile", icon: Settings },
];

export default function MobileNav({
  activeView,
  onSelectView,
  onOpenAddModal,
  isDrawerOpen,
  onCloseDrawer,
  onToggleLandingMode,
}) {
  const { user, openAuthModal, signOutUser } = useAuth();

  return (
    <>
      {/* Bottom Floating Bar on Mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface-1/95 p-2 backdrop-blur-2xl md:hidden">
        <div className="flex items-center justify-around">
          <button
            type="button"
            onClick={() => onSelectView("dashboard")}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-semibold transition-colors ${
              activeView === "dashboard" ? "text-mint" : "text-mist hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView("transactions")}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-semibold transition-colors ${
              activeView === "transactions" ? "text-mint" : "text-mist hover:text-white"
            }`}
          >
            <Receipt size={18} />
            <span>Ledger</span>
          </button>

          {/* Quick Center Add Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="-mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-ink shadow-lg shadow-mint/30 transition-transform active:scale-95"
          >
            <Plus size={22} />
          </button>

          <button
            type="button"
            onClick={() => onSelectView("budgets")}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-semibold transition-colors ${
              activeView === "budgets" ? "text-mint" : "text-mist hover:text-white"
            }`}
          >
            <PieChart size={18} />
            <span>Budgets</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView("ai-insights")}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-semibold transition-colors ${
              activeView === "ai-insights" ? "text-mint" : "text-mist hover:text-white"
            }`}
          >
            <Sparkles size={18} />
            <span>AI Coach</span>
          </button>
        </div>
      </nav>

      {/* Slide-out Drawer for All Pages */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseDrawer}
              className="fixed inset-0 bg-ink/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="relative flex h-full w-4/5 max-w-xs flex-col justify-between border-r border-line bg-surface-1 p-5 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div className="flex items-center gap-2">
                    <Logo size={24} />
                    <span className="font-heading text-lg font-bold text-white">
                      Penny<span className="text-mint">Wise</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onCloseDrawer}
                    className="rounded-lg p-1 text-mist hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectView(item.id);
                          onCloseDrawer();
                        }}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-surface-2 text-white border border-line shadow-sm"
                            : "text-mist hover:bg-surface-2/60 hover:text-white"
                        }`}
                      >
                        <span className={isActive ? "text-mint" : "text-mist"}>
                          <Icon size={18} />
                        </span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom */}
              <div className="space-y-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => {
                    onCloseDrawer();
                    onToggleLandingMode();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl border border-line bg-surface-2 p-2.5 text-xs font-medium text-white"
                >
                  <ExternalLink size={14} className="text-mint" />
                  <span>View Landing / Pitch Page</span>
                </button>

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      onCloseDrawer();
                      signOutUser();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-alert/30 bg-alert/10 py-2.5 text-xs font-semibold text-alert"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onCloseDrawer();
                      openAuthModal({ initialMode: "signin" });
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-mint py-2.5 text-xs font-semibold text-ink"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

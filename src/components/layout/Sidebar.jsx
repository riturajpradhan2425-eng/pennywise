import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Sparkles,
  Target,
  Users,
  Settings,
  Plus,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Logo } from "../Logo";
import { useExpenses } from "../../context/ExpenseContext";
import { useAuth } from "../../context/AuthContext";
import { inr } from "../../lib/format";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "budgets", label: "Budgets & Runway", icon: PieChart },
  { id: "ai-insights", label: "AI Insights", icon: Sparkles },
  { id: "savings-goals", label: "Savings Goals", icon: Target },
  { id: "group-expenses", label: "Group Expenses", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  activeView,
  onSelectView,
  onOpenAddModal,
  isCollapsed,
  setIsCollapsed,
  onToggleLandingMode,
}) {
  const { runway, remainingBalance, currency } = useExpenses();
  const { user, userProfile, openAuthModal, signOutUser } = useAuth();

  const displayName =
    user?.displayName || userProfile?.displayName || user?.email?.split("@")[0] || "Student";

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 hidden flex-col justify-between border-r border-line bg-surface-1/95 p-4 backdrop-blur-2xl transition-all duration-300 md:flex ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top: Logo & Nav items */}
      <div className="space-y-6">
        {/* Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div
            onClick={() => onSelectView("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <Logo size={28} />
            {!isCollapsed && (
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                Penny<span className="text-mint">Wise</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-1 text-mist transition-colors hover:bg-surface-2 hover:text-white"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Quick Add CTA */}
        <div>
          <button
            type="button"
            onClick={onOpenAddModal}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-mint py-2.5 text-xs font-semibold text-ink shadow-lg shadow-mint/20 transition-all hover:opacity-95 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
            title="Record Transaction"
          >
            <Plus size={16} />
            {!isCollapsed && <span>New Transaction</span>}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-surface-2 text-white border border-line shadow-sm"
                    : "text-mist hover:bg-surface-2/60 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={item.label}
              >
                <span
                  className={
                    isActive
                      ? "text-mint"
                      : "text-mist transition-colors group-hover:text-white"
                  }
                >
                  <Icon size={18} />
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Runway Snapshot & User Account */}
      <div className="space-y-3 pt-4 border-t border-line">
        {/* Runway Mini Card (if expanded) */}
        {!isCollapsed && (
          <div className="rounded-2xl border border-line bg-surface-2/40 p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-mist">Pocket Runway</span>
              <span
                className={`font-mono text-[10px] font-bold uppercase ${
                  runway.status === "safe"
                    ? "text-mint"
                    : runway.status === "warning"
                    ? "text-amber-400"
                    : "text-alert"
                }`}
              >
                {runway.days}d left
              </span>
            </div>
            <p className="mt-1 font-mono font-bold text-white text-sm">
              {inr(remainingBalance, currency)}
            </p>
          </div>
        )}

        {/* Link back to marketing showcase */}
        <button
          type="button"
          onClick={onToggleLandingMode}
          className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] font-medium text-mist hover:text-white hover:bg-surface-2/40 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="View Landing & Pitch Presentation"
        >
          <ExternalLink size={13} />
          {!isCollapsed && <span>Landing / Pitch Page</span>}
        </button>

        {/* User Account / Auth Status */}
        <div
          className={`flex items-center gap-2.5 rounded-2xl bg-surface-2/50 p-2 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => onSelectView("settings")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-mint font-heading text-xs font-bold text-ink"
            title={displayName}
          >
            {displayName.charAt(0).toUpperCase()}
          </button>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-mist truncate">
                {user ? user.email : "Local session"}
              </p>
            </div>
          )}

          {!isCollapsed && user && (
            <button
              type="button"
              onClick={signOutUser}
              className="p-1 text-mist hover:text-alert"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

import { useState } from "react";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";
import MobileNav from "./MobileNav";
import DashboardView from "../../views/DashboardView";
import TransactionsView from "../../views/TransactionsView";
import BudgetsView from "../../views/BudgetsView";
import AIInsightsView from "../../views/AIInsightsView";
import SavingsGoalsView from "../../views/SavingsGoalsView";
import GroupExpensesView from "../../views/GroupExpensesView";
import ProfileSettingsView from "../../views/ProfileSettingsView";
import TransactionModal from "../modals/TransactionModal";

const VIEW_TITLES = {
  dashboard: "Dashboard Overview",
  transactions: "Transactions & Ledger",
  budgets: "Smart Budgets & Runway",
  "ai-insights": "AI Financial Coach & Insights",
  "savings-goals": "Savings Goals & Bills",
  "group-expenses": "Group Expenses & Splits",
  settings: "Profile & Settings",
};

export default function AppLayout({ isLandingMode, onToggleLandingMode }) {
  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Transaction Modal State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const handleOpenAddModal = () => {
    setEditingTx(null);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-ink font-sans text-white antialiased selection:bg-mint selection:text-ink">
      <div className="grain pointer-events-none fixed inset-0" aria-hidden="true" />

      {/* Desktop Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenAddModal={handleOpenAddModal}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onToggleLandingMode={onToggleLandingMode}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Sticky App Header */}
        <AppHeader
          activeView={activeView}
          viewTitles={VIEW_TITLES}
          onOpenAddModal={handleOpenAddModal}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          isLandingMode={isLandingMode}
          onToggleLandingMode={onToggleLandingMode}
          onNavigate={setActiveView}
        />

        {/* View Page Content */}
        <main className="flex-1 px-4 py-8 sm:px-8 max-w-7xl mx-auto w-full">
          {activeView === "dashboard" && (
            <DashboardView
              onNavigate={setActiveView}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {activeView === "transactions" && (
            <TransactionsView
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
            />
          )}

          {activeView === "budgets" && <BudgetsView />}

          {activeView === "ai-insights" && <AIInsightsView />}

          {activeView === "savings-goals" && <SavingsGoalsView />}

          {activeView === "group-expenses" && <GroupExpensesView />}

          {activeView === "settings" && <ProfileSettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation & Drawer */}
      <MobileNav
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenAddModal={handleOpenAddModal}
        isDrawerOpen={isMobileDrawerOpen}
        onCloseDrawer={() => setIsMobileDrawerOpen(false)}
        onToggleLandingMode={onToggleLandingMode}
      />

      {/* Universal Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        initialData={editingTx}
      />
    </div>
  );
}

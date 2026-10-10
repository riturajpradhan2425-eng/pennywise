import { useEffect, useState, Component } from "react";
import Lenis from "lenis";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import AppLayout from "./components/layout/AppLayout";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Validation from "./components/Validation";
import Demo from "./components/Demo";
import MonthlyBudgetOverview from "./components/MonthlyBudgetOverview";
import AICoach from "./components/AICoach";
import AIReceiptScanner from "./components/AIReceiptScanner";
import SmartBudgeting from "./components/SmartBudgeting";
import SavingsAndRecurring from "./components/SavingsAndRecurring";
import SpendingInsightsAndReports from "./components/SpendingInsightsAndReports";
import Features from "./components/Features";
import Comparison from "./components/Comparison";
import TechStack from "./components/TechStack";
import Roadmap from "./components/Roadmap";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { err: false };
  }
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    if (this.state.err) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink font-sans text-mist">
          Something went wrong. Refresh to try again.
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Mode state: 'app' (Fintech dashboard with sidebar & 7 views) or 'landing' (pitch page)
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("pennywise_view_mode") || "app";
  });

  useEffect(() => {
    localStorage.setItem("pennywise_view_mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === "landing") {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      window.__lenis = lenis;
      let raf;
      const loop = (t) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
        window.__lenis = null;
      };
    }
  }, [viewMode]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "app" ? "landing" : "app"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ExpenseProvider>
          {viewMode === "app" ? (
            /* Organized Fintech Dashboard App Shell */
            <AppLayout
              isLandingMode={false}
              onToggleLandingMode={toggleViewMode}
            />
          ) : (
            /* Landing Page / Pitch Showcase */
            <div className="bg-ink font-sans text-white antialiased selection:bg-mint selection:text-ink">
              <div className="grain pointer-events-none fixed inset-0" aria-hidden="true" />
              <Nav onOpenApp={() => setViewMode("app")} />
              <main>
                <Hero />
                <Problem />
                <Validation />
                <Demo />
                <MonthlyBudgetOverview />
                <AICoach />
                <AIReceiptScanner />
                <SmartBudgeting />
                <SavingsAndRecurring />
                <SpendingInsightsAndReports />
                <Features />
                <Comparison />
                <TechStack />
                <Roadmap />
              </main>
              <Footer />

              {/* Floating Return to App Button */}
              <div className="fixed bottom-6 right-6 z-40">
                <button
                  type="button"
                  onClick={() => setViewMode("app")}
                  className="flex items-center gap-2 rounded-2xl bg-mint px-5 py-3 text-xs font-bold text-ink shadow-2xl shadow-mint/30 transition-transform hover:scale-105 active:scale-95"
                >
                  <span>🚀 Open App Dashboard</span>
                </button>
              </div>
            </div>
          )}

          {/* Authentication Modal */}
          <AuthModal />
        </ExpenseProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

import { useState } from "react";
import { Sparkles, PieChart, ShieldAlert, Camera } from "lucide-react";
import AICoach from "../components/AICoach";
import SpendingInsightsAndReports from "../components/SpendingInsightsAndReports";
import AIReceiptScanner from "../components/AIReceiptScanner";

export default function AIInsightsView() {
  const [activeTab, setActiveTab] = useState("coach"); // 'coach' | 'insights' | 'scanner'

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            AI Financial Insights & Coach
          </h1>
          <p className="mt-1 text-xs text-mist sm:text-sm">
            Powered by Gemini · Real spending history analysis, advice, and OCR scanning.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex rounded-2xl border border-line bg-surface-1 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("coach")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "coach"
                ? "bg-mint text-ink shadow-md shadow-mint/20"
                : "text-mist hover:text-white"
            }`}
          >
            <Sparkles size={14} />
            AI Coach
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("insights")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "insights"
                ? "bg-mint text-ink shadow-md shadow-mint/20"
                : "text-mist hover:text-white"
            }`}
          >
            <PieChart size={14} />
            Spending Insights
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("scanner")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "scanner"
                ? "bg-mint text-ink shadow-md shadow-mint/20"
                : "text-mist hover:text-white"
            }`}
          >
            <Camera size={14} />
            Receipt Scanner
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "coach" && (
        <div className="rounded-3xl border border-line bg-surface-1/90 p-2 shadow-2xl backdrop-blur-xl">
          <AICoach />
        </div>
      )}

      {activeTab === "insights" && (
        <div className="rounded-3xl border border-line bg-surface-1/90 p-2 shadow-2xl backdrop-blur-xl">
          <SpendingInsightsAndReports />
        </div>
      )}

      {activeTab === "scanner" && (
        <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-2xl backdrop-blur-xl">
          <AIReceiptScanner />
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Loader2,
  TrendingDown,
  ShieldCheck,
  Lightbulb,
  Coffee,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { Reveal, Tag } from "./anim";
import { inr } from "../lib/format";

const QUICK_PROMPTS = [
  "Where did most of my money go this month?",
  "How can I stretch my pocket money for 15 more days?",
  "Analyze my Food & Dining vs. Grocery spending",
  "Give me 3 realistic tips to save ₹3,000 this month",
];

export default function AICoach() {
  const { coachChatHistory, askAICoach, expenses, remainingBalance, runway } = useExpenses();
  const [inputQuestion, setInputQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputQuestion.trim() || asking) return;
    const q = inputQuestion.trim();
    setInputQuestion("");
    setAsking(true);
    await askAICoach(q);
    setAsking(false);
  };

  const handleQuickPrompt = async (prompt) => {
    if (asking) return;
    setAsking(true);
    await askAICoach(prompt);
    setAsking(false);
  };

  // Top spending category
  const topCategory = expenses
    .filter((e) => e.type === "expense" || !e.type)
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});

  const sortedCats = Object.entries(topCategory).sort((a, b) => b[1] - a[1]);
  const primaryExpenseCat = sortedCats[0] || ["Food & Dining", 0];

  return (
    <section id="ai-coach" className="relative overflow-hidden py-24 md:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_45%,rgba(0,229,153,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Tag>Gemini AI Intelligence</Tag>
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Meet Your Personal{" "}
            <em className="font-display font-light italic text-mint">AI Financial Coach.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-mist md:text-lg">
            Powered by Gemini. Analyzes your real campus spending patterns, flags budget leaks, and guides your savings without lecturing you.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Quick Insights Cards */}
          <div className="space-y-4 lg:col-span-4">
            {/* Coach Summary Card */}
            <div className="rounded-3xl border border-line bg-surface-1/90 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint/15 text-mint shadow-[0_0_16px_rgba(0,229,153,0.3)]">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">Live Student Snapshot</h3>
                  <p className="font-mono text-[10px] text-mist">Real-time expense telemetry</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-2xl border border-line bg-surface-2/40 p-3.5">
                  <div className="flex justify-between items-center text-mist mb-1">
                    <span>Pocket Balance</span>
                    <span className="font-mono font-bold text-mint">{inr(remainingBalance)}</span>
                  </div>
                  <div className="flex justify-between items-center text-mist">
                    <span>Estimated Runway</span>
                    <span className="font-mono font-bold text-white">{runway.days} Days Remaining</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface-2/40 p-3.5">
                  <p className="text-mist text-[11px] mb-1">Largest Variable Expense</p>
                  <p className="font-heading text-sm font-semibold text-white">
                    {primaryExpenseCat[0]} ({inr(primaryExpenseCat[1])})
                  </p>
                  <p className="text-[11px] text-mist/80 mt-1">
                    Tip: Preparing 2 more campus meals at hostel can save ~₹1,200/month.
                  </p>
                </div>

                <div className="rounded-2xl border border-mint/20 bg-mint/5 p-3.5 flex items-start gap-2.5">
                  <Lightbulb size={16} className="text-mint shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-white/90">
                    Your subscriptions total ₹818/mo. Verify that campus Wi-Fi split is shared equally with flatmates.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Question Chips */}
            <div className="rounded-3xl border border-line bg-surface-1/80 p-5 shadow-lg">
              <p className="font-mono text-[11px] uppercase tracking-wider text-mist mb-3 flex items-center gap-1.5">
                <HelpCircle size={13} className="text-mint" />
                Ask One-Click Questions
              </p>
              <div className="space-y-2">
                {QUICK_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={asking}
                    onClick={() => handleQuickPrompt(p)}
                    className="w-full text-left rounded-xl border border-line/60 bg-surface-2/40 p-2.5 text-xs text-white/85 transition-all hover:border-mint/50 hover:bg-surface-2 hover:text-mint disabled:opacity-50"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Chat Stream */}
          <div className="flex flex-col rounded-3xl border border-line bg-surface-1/90 shadow-2xl backdrop-blur-xl lg:col-span-8 overflow-hidden h-[540px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-line bg-surface-2/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-mint font-heading text-ink font-bold shadow-[0_0_20px_rgba(0,229,153,0.4)]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-white">PennyWise AI Coach</h4>
                  <p className="font-mono text-[10px] text-mint flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
                    Online · Analyzing your October cash flow
                  </p>
                </div>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {coachChatHistory.map((msg) => {
                const isCoach = msg.sender === "coach";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isCoach ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed sm:text-sm ${
                        isCoach
                          ? "border border-line bg-surface-2/70 text-white/95 shadow-md"
                          : "bg-mint text-ink font-medium shadow-[0_0_20px_rgba(0,229,153,0.25)]"
                      }`}
                    >
                      {isCoach && (
                        <div className="flex items-center gap-1.5 mb-1.5 font-mono text-[10px] uppercase tracking-wider text-mint">
                          <Sparkles size={11} />
                          <span>AI Financial Coach</span>
                        </div>
                      )}
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                  </motion.div>
                );
              })}

              {asking && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2/70 px-4 py-3 text-xs text-mist">
                    <Loader2 size={15} className="animate-spin text-mint" />
                    <span>Analyzing your transaction logs and crunching numbers...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="border-t border-line bg-surface-2/40 p-4">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="Ask a question about your budget, meal plans, or saving goals..."
                  disabled={asking}
                  className="w-full rounded-2xl border border-line bg-ink/80 py-3.5 pl-4 pr-14 text-xs text-white placeholder-mist/60 outline-none transition-colors focus:border-mint focus:ring-1 focus:ring-mint disabled:opacity-60 sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={asking || !inputQuestion.trim()}
                  className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-ink shadow-[0_0_16px_rgba(0,229,153,0.3)] transition-all hover:shadow-[0_0_24px_rgba(0,229,153,0.5)] disabled:opacity-40"
                  aria-label="Send message"
                >
                  {asking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

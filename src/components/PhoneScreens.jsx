import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Delete, Home, PieChart, Plus } from "lucide-react";
import { Logo } from "./Logo";
import { inr } from "../lib/format";

export function PhoneHome({ extra }) {
  const cats = [
    ["Food & Dining", 2350],
    ["Transport", 760],
    ["Shopping", 1230],
    ["Entertainment", 820],
    ["Study Materials", 650],
  ];
  return (
    <div className="p-5 pt-12">
      <div>
        <p className="font-heading text-lg font-bold text-white">Hi, Alex</p>
        <p className="text-xs text-mist">Here's your overview</p>
      </div>

      <div className="mt-4 rounded-2xl border border-mint/25 bg-gradient-to-br from-surface-2 to-surface-1 p-4 shadow-[0_0_28px_rgba(0,229,153,0.12)]">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mist">Total Balance</p>
            <p className="mt-1 font-mono text-[26px] font-bold leading-none text-white">{inr(12540)}</p>
          </div>
          <span className="rounded-full bg-mint/15 px-2 py-1 font-mono text-[9px] text-mint">This Month</span>
        </div>
        <div className="mt-4 flex items-center justify-between font-mono text-[10px]">
          <span className="text-white/80">{inr(8000)} left of {inr(15000)}</span>
          <span className="text-mint">53% used</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "53%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-mint"
          />
        </div>
      </div>

      <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-mist">Spending by Category</p>
      <div className="mt-2 space-y-2">
        {cats.map(([name, v]) => (
          <div key={name} data-testid={`phone-cat-${name.split(" ")[0].toLowerCase()}`} className="flex items-center justify-between rounded-xl bg-surface-1 px-3 py-2">
            <span className="text-[11px] text-white/85">{name}</span>
            <span className="font-mono text-[11px] font-bold text-white">{inr(v)}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-mist">Recent Transactions</p>
      {extra.length === 0 ? (
        <div className="mt-2 rounded-xl border border-dashed border-line p-4 text-center">
          <p className="text-[11px] leading-snug text-mist">
            Nothing yet — tap <span className="font-bold text-mint">+</span> to add your first expense.
          </p>
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          {extra.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              data-testid={`phone-tx-${i}`}
              className={`flex items-center justify-between rounded-xl px-3 py-2 ${i === 0 ? "border border-mint/30 bg-mint/10" : "bg-surface-1"}`}
            >
              <span className="text-[11px] text-white/85">{t.name}</span>
              <span className="font-mono text-[11px] font-bold text-mint">-{inr(t.amount)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

const CATS = ["Food & Dining", "Transport", "Shopping", "Bills & Utilities", "Entertainment", "Study Materials"];

export function PhoneAdd({ onSave }) {
  const [amt, setAmt] = useState("");
  const [cat, setCat] = useState("Food & Dining");
  const [saved, setSaved] = useState(false);

  const press = (k) => {
    if (k === "del") return setAmt((a) => a.slice(0, -1));
    if (k === ".") return setAmt((a) => (a.includes(".") ? a : a === "" ? "0." : a + "."));
    setAmt((a) => (a === "0" ? k : a.length >= 7 ? a : a + k));
  };
  const valid = parseFloat(amt || "0") > 0;

  const save = () => {
    if (!valid) return;
    setSaved(true);
    setTimeout(() => {
      onSave({ id: Date.now(), name: cat, amount: parseFloat(amt) });
      setAmt("");
      setSaved(false);
    }, 550);
  };

  return (
    <div className="flex h-full flex-col p-5 pt-12">
      <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-mist">Add Expense</p>
      <motion.p
        key={amt}
        initial={{ scale: 0.96, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        data-testid="phone-add-amount"
        className="mt-2 text-center font-mono text-4xl font-bold text-white"
      >
        {inr(amt || 0)}
      </motion.p>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {CATS.map((c) => (
          <button
            key={c}
            data-testid={`phone-category-pill-${c.split(" ")[0].toLowerCase()}`}
            onClick={() => setCat(c)}
            className={`rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
              cat === c
                ? "border-mint bg-mint/15 font-semibold text-mint"
                : "border-line bg-surface-1 text-mist hover:border-mint/50 hover:text-mint"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2" data-testid="phone-numpad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"].map((k) => (
          <button
            key={k}
            data-testid={`phone-key-${k}`}
            onClick={() => press(k)}
            className="flex h-12 items-center justify-center rounded-xl bg-surface-1 font-mono text-base font-bold text-white transition-colors hover:bg-surface-2 active:bg-mint/20 active:text-mint"
          >
            {k === "del" ? <Delete size={16} /> : k}
          </button>
        ))}
      </div>

      <motion.button
        data-testid="phone-save-expense"
        onClick={save}
        disabled={!valid}
        whileTap={valid ? { scale: 0.97 } : {}}
        className={`mt-3 rounded-full py-3 font-heading text-sm font-bold transition-colors ${
          saved
            ? "bg-white text-ink"
            : valid
              ? "bg-mint text-ink shadow-[0_0_24px_rgba(0,229,153,0.4)]"
              : "cursor-not-allowed bg-surface-2 text-mist"
        }`}
      >
        {saved ? "Saved!" : "Save Expense"}
      </motion.button>
    </div>
  );
}

export function PhoneInsights() {
  const SEGS = [
    ["Food & Dining", 38, "#00E599"],
    ["Transport", 25, "#6BF0BE"],
    ["Shopping", 15, "#2FBF8F"],
    ["Entertainment", 12, "#A3FFD6"],
    ["Bills & Utilities", 10, "#1F6F54"],
  ];
  let cum = 0;
  return (
    <div className="p-5 pt-12">
      <p className="font-heading text-sm font-bold text-white">This Month</p>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mist">Spending by Category</p>
      <div className="relative mx-auto mt-4 h-40 w-40">
        <svg viewBox="0 0 36 36" className="h-full w-full">
          {SEGS.map(([n, v, c]) => {
            const off = 25 - cum;
            cum += v;
            return (
              <circle
                key={n}
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke={c}
                strokeWidth="5"
                strokeDasharray={`${v} ${100 - v}`}
                strokeDashoffset={off}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-mist">This Month</p>
          <p className="font-mono text-sm font-bold text-white">100%</p>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {SEGS.map(([n, v, c]) => (
          <div key={n} data-testid={`phone-insight-${n.split(" ")[0].toLowerCase()}`} className="flex items-center justify-between rounded-xl bg-surface-1 px-3 py-2">
            <span className="flex items-center gap-2 text-[11px] text-white/85">
              <span className="h-2 w-2 rounded-full" style={{ background: c }} />
              {n}
            </span>
            <span className="font-mono text-[11px] font-bold text-white">{v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PhoneAlerts() {
  return (
    <div className="flex h-full flex-col p-5 pt-12">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mist">9:41 · Monday, May 6</p>
      <div className="mt-4 rounded-2xl border border-line bg-surface-1 p-4">
        <div className="flex items-center gap-2">
          <Logo size={18} />
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-mist">PennyWise · now</span>
        </div>
        <p className="mt-2.5 font-heading text-[13px] font-bold text-white" data-testid="phone-alert-title">
          Budget Alert
        </p>
        <p className="mt-1 text-[11px] leading-snug text-mist">
          You've used 90% of your Food &amp; Dining budget.
        </p>
      </div>

      <div className="relative mx-auto mt-8 flex h-24 w-24 items-center justify-center">
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-mint/20" />
        <span className="absolute inset-0 rounded-full bg-mint/10" />
        <Bell size={30} className="relative text-mint" />
      </div>
      <p className="mt-4 text-center text-[11px] leading-snug text-mist">
        Real-time warnings when spending nears its limits.
      </p>

      <div className="mt-auto flex items-center justify-between rounded-xl bg-surface-1 px-4 py-3">
        <span className="text-[11px] text-white/85">Smart Budget Alerts</span>
        <span className="flex h-5 w-9 items-center rounded-full bg-mint px-0.5">
          <span className="h-4 w-4 translate-x-3.5 rounded-full bg-ink" />
        </span>
      </div>
    </div>
  );
}

export function TabBar({ screen, setScreen }) {
  const tabs = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "add", icon: Plus, label: "Add" },
    { id: "insights", icon: PieChart, label: "Insights" },
    { id: "alerts", icon: Bell, label: "Alerts" },
  ];
  return (
    <div className="relative z-10 flex items-center justify-around border-t border-line bg-surface-1/95 px-2 py-2 backdrop-blur">
      {tabs.map((t) => {
        const active = screen === t.id;
        if (t.id === "add") {
          return (
            <button
              key={t.id}
              data-testid="phone-tab-add"
              aria-label="Add expense"
              onClick={() => setScreen("add")}
              className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-mint text-ink shadow-[0_0_24px_rgba(0,229,153,0.5)] transition-transform hover:scale-105 active:scale-95"
            >
              <Plus size={22} strokeWidth={2.5} />
            </button>
          );
        }
        return (
          <button
            key={t.id}
            data-testid={`phone-tab-${t.id}`}
            onClick={() => setScreen(t.id)}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors ${
              active ? "text-mint" : "text-mist hover:text-white"
            }`}
          >
            <t.icon size={18} />
            <span className="text-[8px] font-medium">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

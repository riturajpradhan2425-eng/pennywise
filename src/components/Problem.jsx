import { motion } from "framer-motion";
import { Coffee, ShoppingBag, TrendingUp, ReceiptText, Wallet, EyeOff, PieChart, AlertCircle } from "lucide-react";
import { Reveal, Tag } from "./anim";

const DAYS = [
  { icon: Coffee, label: "Day 1", note: "A coffee here. A snack there.", tint: "text-mist" },
  { icon: ShoppingBag, label: "Day 10", note: "Still feels like nothing.", tint: "text-mist" },
  { icon: TrendingUp, label: "Day 20", note: "Wait… where did it go?", tint: "text-mint" },
  { icon: ReceiptText, label: "Month End", note: "Much more than you expected.", tint: "text-alert", hot: true },
];

const ISSUES = [
  { icon: Wallet, text: "Limited pocket money meets rising living costs" },
  { icon: EyeOff, text: "Small, untracked purchases add up unnoticed" },
  { icon: PieChart, text: "Hard to budget for essentials like food, transport, and social life" },
  { icon: AlertCircle, text: "Leads to stress and poor financial decisions" },
];

export default function Problem() {
  return (
    <section id="problem" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <Tag>The Problem</Tag>
          <h2 className="mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-6xl">
            College expenses creep up{" "}
            <em className="font-display font-light italic text-mint">faster than you realize.</em>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-5" delay={0.05}>
            <div
              data-testid="problem-image-card"
              className="group relative h-full min-h-[340px] overflow-hidden rounded-2xl border border-line"
            >
              <img
                src="https://images.unsplash.com/44/fN6hZMWqRHuFET5YoApH_StBalmainCoffee.jpg?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Coffee and a pile of receipts"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mint">Month End</p>
                <p className="mt-2 font-display text-2xl font-light italic leading-snug text-white md:text-3xl">
                  "Much more than you expected."
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 content-start gap-6 sm:grid-cols-2 md:col-span-7">
            {DAYS.map((d, i) => (
              <Reveal key={d.label} delay={0.08 * i}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  data-testid={`problem-day-card-${i}`}
                  className={`h-full rounded-2xl border p-7 transition-colors ${
                    d.hot
                      ? "border-alert/40 bg-gradient-to-br from-surface-2 to-[#241417] hover:border-alert/70"
                      : "border-line bg-surface-1 hover:border-mint/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <d.icon size={22} className={d.tint} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className={`mt-8 font-heading text-xl font-semibold ${d.hot ? "text-alert" : "text-white"}`}>
                    {d.label}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist">{d.note}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-8">
          {ISSUES.map((it, i) => (
            <Reveal key={i} delay={0.06 * i}>
              <div
                data-testid={`problem-issue-${i}`}
                className="flex h-full items-start gap-3.5 rounded-2xl border border-line bg-surface-1/60 p-5"
              >
                <it.icon size={18} className="mt-0.5 shrink-0 text-mint" />
                <p className="text-sm leading-relaxed text-white/85">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

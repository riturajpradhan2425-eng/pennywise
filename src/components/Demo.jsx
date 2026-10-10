import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import { Reveal, Tag } from "./anim";
import { PhoneHome, PhoneAdd, PhoneInsights, PhoneAlerts, TabBar } from "./PhoneScreens";

const STEPS = [
  ["01", "See your spending and budget at a glance"],
  ["02", "Add expenses in seconds with smart categories"],
  ["03", "Understand where your money goes with clear insights"],
  ["04", "Get timely alerts to stay on track"],
];

export default function Demo() {
  const [screen, setScreen] = useState("dashboard");
  const [txs, setTxs] = useState([]);

  const save = (t) => {
    setTxs((x) => [t, ...x]);
    setScreen("dashboard");
  };

  return (
    <section id="demo" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_50%,rgba(0,229,153,0.07),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Tag>Product Experience</Tag>
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-6xl">
            Track. Understand.{" "}
            <em className="font-display font-light italic text-mint">Take control.</em>
          </h2>
          <p className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 text-base text-mist md:text-lg">
            <MousePointerClick size={18} className="shrink-0 text-mint" />
            All in a few taps — go ahead, tap through the real thing.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="order-2 hidden flex-col gap-3 lg:order-1 lg:col-span-3 lg:flex">
            {STEPS.map(([n, s], i) => (
              <Reveal key={n} delay={0.08 * i}>
                <div data-testid={`demo-step-${n}`} className="flex items-start gap-4 rounded-2xl border border-transparent p-4 transition-colors hover:border-line hover:bg-surface-1/60">
                  <span className="font-mono text-xs font-bold text-mint">{n}</span>
                  <p className="text-sm leading-relaxed text-white/85">{s}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="order-1 flex justify-center lg:order-2 lg:col-span-6" y={40}>
            <div
              data-testid="phone-demo"
              className="relative flex h-[640px] w-[300px] flex-col overflow-hidden rounded-[3rem] border-[10px] border-[#1F2E27] bg-ink shadow-[0_40px_120px_rgba(0,229,153,0.14)] sm:w-[320px]"
            >
              <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#1F2E27]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={screen}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="no-scrollbar min-h-0 flex-1 overflow-y-auto"
                >
                  {screen === "dashboard" && <PhoneHome extra={txs} />}
                  {screen === "add" && <PhoneAdd onSave={save} />}
                  {screen === "insights" && <PhoneInsights />}
                  {screen === "alerts" && <PhoneAlerts />}
                </motion.div>
              </AnimatePresence>
              <TabBar screen={screen} setScreen={setScreen} />
            </div>
          </Reveal>

          <Reveal className="order-3 lg:col-span-3" delay={0.15}>
            <div className="rounded-2xl border border-line bg-surface-1/60 p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mint">Live demo</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-mist">
                <li>Tap <span className="font-bold text-white">+</span>, punch in an amount, pick a category and save — it lands on your dashboard.</li>
                <li>Swipe through <span className="text-white">Insights</span> for the category donut.</li>
                <li>Peek at <span className="text-white">Alerts</span> to see a real budget warning.</li>
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-mist/70">
                Built exactly from our pitch deck screens — dashboard, add expense, insights and alerts.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
          {STEPS.map(([n, s], i) => (
            <Reveal key={n} delay={0.05 * i}>
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-1/60 p-4">
                <span className="font-mono text-xs font-bold text-mint">{n}</span>
                <p className="text-sm leading-relaxed text-white/85">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

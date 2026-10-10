import { motion } from "framer-motion";
import { Zap, BellRing, Sparkles, Users, Coffee, AlertTriangle } from "lucide-react";
import { Reveal, Tag } from "./anim";

function Card({ className = "", icon: Icon, title, copy, children, testid }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      data-testid={testid}
      className={`group h-full rounded-2xl border border-line bg-surface-1 p-7 transition-[border-color,box-shadow] duration-300 hover:border-mint/50 hover:shadow-[0_0_40px_rgba(0,229,153,0.12)] ${className}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint/10 text-mint transition-colors group-hover:bg-mint group-hover:text-ink">
        <Icon size={20} />
      </div>
      <h3 className="mt-5 font-heading text-xl font-semibold text-white md:text-2xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist md:text-base">{copy}</p>
      {children}
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <Tag>Key Features</Tag>
          <h2 className="mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-6xl">
            Everything you need to manage money{" "}
            <em className="font-display font-light italic text-mint">smarter, simpler, stress-free.</em>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7">
            <Card
              testid="feature-tracking"
              icon={Zap}
              title="Quick Expense Tracking"
              copy="Effortless daily purchase logging and categorization."
            >
              <div className="mt-6 flex items-center justify-between rounded-xl border border-line bg-surface-2 p-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint/15 text-mint">
                    <Coffee size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">Coffee</p>
                    <p className="text-[11px] text-mist">Today · just logged</p>
                  </div>
                </div>
                <span className="rounded-full bg-mint/15 px-3 py-1 text-[11px] font-medium text-mint">Food &amp; Dining</span>
                <span className="font-mono text-sm font-bold text-white">-₹25.00</span>
              </div>
            </Card>
          </Reveal>

          <Reveal className="md:col-span-5" delay={0.08}>
            <Card
              testid="feature-alerts"
              icon={BellRing}
              title="Smart Budget Alerts"
              copy="Real-time warnings when spending nears limits."
            >
              <div className="mt-6 rounded-xl border border-line bg-surface-2 p-3.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-mist">Food &amp; Dining</span>
                  <span className="flex items-center gap-1 font-bold text-alert">
                    <AlertTriangle size={11} /> 90% used
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink">
                  <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-mint to-alert" />
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal className="md:col-span-5" delay={0.05}>
            <Card
              testid="feature-ai"
              icon={Sparkles}
              title="AI Saving Assistant"
              copy="Personalized saving tips based on your habits."
            >
              <div className="mt-6 rounded-xl border border-line bg-surface-2 p-3.5">
                <p className="text-[11px] font-medium text-mint">Saving tip for you</p>
                <div className="mt-2 space-y-1.5">
                  <div className="h-2 w-4/5 rounded-full bg-line" />
                  <div className="h-2 w-3/5 rounded-full bg-line" />
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal className="md:col-span-7" delay={0.12}>
            <Card
              testid="feature-splitter"
              icon={Users}
              title="Group Expense Splitter"
              copy="Easily share and settle costs with roommates and friends."
            >
              <div className="mt-6 flex items-center justify-between rounded-xl border border-line bg-surface-2 p-3.5">
                <div className="flex -space-x-2">
                  {["A", "R", "S"].map((c) => (
                    <span key={c} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface-2 bg-mint/20 font-mono text-xs font-bold text-mint">
                      {c}
                    </span>
                  ))}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface-2 bg-surface-2 font-mono text-xs text-mist">+2</span>
                </div>
                <span className="rounded-full bg-mint/15 px-3 py-1 text-[11px] font-medium text-mint">Split evenly</span>
                <span className="font-mono text-xs font-bold text-white">Settle in a tap</span>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

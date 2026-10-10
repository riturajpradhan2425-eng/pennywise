import { ArrowRight, Cpu, Database, Layout, Server } from "lucide-react";
import { Reveal, Tag } from "./anim";

const STACK = [
  { icon: Layout, name: "React.js", desc: "User & mobile app — responsive UI for a seamless experience" },
  { icon: Server, name: "Node.js + Express", desc: "API layer — handles requests, authentication, and business logic" },
  { icon: Database, name: "PostgreSQL / Firebase", desc: "Stores expenses, budgets, and user data" },
  { icon: Cpu, name: "AI Insights Engine", desc: "Generates smart financial insights and personalized suggestions" },
];

const FLOW = ["Expense entry", "Categorization", "Budget calculation", "AI suggestions"];

const MARQUEE = ["React.js", "Node.js", "Express", "PostgreSQL", "Firebase", "AI Insights Engine"];

function MarqueeSet() {
  return (
    <div className="flex shrink-0 items-center">
      {MARQUEE.map((m) => (
        <span key={m} className="flex items-center">
          <span className="text-outline whitespace-nowrap px-6 font-heading text-5xl font-bold uppercase tracking-tight md:text-7xl">
            {m}
          </span>
          <span className="h-2.5 w-2.5 rotate-45 bg-mint/50" />
        </span>
      ))}
    </div>
  );
}

export default function TechStack() {
  return (
    <section id="stack" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <Tag>Technology &amp; Feasibility</Tag>
          <h2 className="mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-6xl">
            A scalable, modern stack built for{" "}
            <em className="font-display font-light italic text-mint">speed, reliability, real-time insights.</em>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center gap-3" data-testid="tech-flow">
            {FLOW.map((f, i) => (
              <div key={f} className="flex items-center gap-3">
                <span className="rounded-full border border-line bg-surface-1 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-white/85">
                  {f}
                </span>
                {i < FLOW.length - 1 && <ArrowRight size={16} className="text-mint" />}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((s, i) => (
            <Reveal key={s.name} delay={0.06 * i}>
              <div
                data-testid={`tech-stack-${i}`}
                className="group h-full rounded-2xl border border-line bg-surface-1 p-6 transition-colors hover:border-mint/50"
              >
                <s.icon size={22} className="text-mint" />
                <p className="mt-5 font-heading text-lg font-semibold text-white">{s.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-mist">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal delay={0.1}>
        <div className="marquee mt-20 flex w-full overflow-hidden border-y border-line bg-surface-1/40 py-8" data-testid="tech-marquee">
          <div className="marquee-track flex w-max">
            <MarqueeSet />
            <div aria-hidden="true">
              <MarqueeSet />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

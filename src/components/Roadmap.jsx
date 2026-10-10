import { Repeat, ScanLine, BellRing } from "lucide-react";
import { Reveal, Tag } from "./anim";

const STEPS = [
  "Problem validation",
  "UI prototype",
  "Core expense tracking",
  "Budget alerts",
  "User testing",
  "AI integration",
];

const IMPACT = [
  "Empower students with stronger financial awareness",
  "Build better saving habits and cut impulsive spending",
  "Promote financial independence and confidence",
  "Continuously evolving to support every stage of student life",
];

const FUTURE = [
  { icon: Repeat, label: "Recurring expense detection" },
  { icon: ScanLine, label: "Receipt scanning" },
  { icon: BellRing, label: "Smart push reminders" },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <Tag>Our path to building PennyWise</Tag>
              <h2 className="mt-6 font-heading text-4xl font-bold tracking-tight text-white md:text-6xl">
                Roadmap
              </h2>
            </Reveal>

            <div className="relative mt-12">
              <span className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-mint/60 via-line to-transparent" />
              <div className="space-y-8">
                {STEPS.map((s, i) => (
                  <Reveal key={s} delay={0.06 * i}>
                    <div data-testid={`roadmap-step-${i + 1}`} className="group flex items-center gap-6">
                      <span
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold transition-colors ${
                          i === STEPS.length - 1
                            ? "border-mint bg-mint text-ink shadow-[0_0_24px_rgba(0,229,153,0.5)]"
                            : "border-line bg-surface-1 text-mint group-hover:border-mint/60"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-heading text-xl font-semibold text-white transition-colors group-hover:text-mint md:text-2xl">
                        {s}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <div
                data-testid="impact-card"
                className="relative overflow-hidden rounded-2xl border border-line"
              >
                <img
                  src="https://images.unsplash.com/photo-1758270704763-22072a90d3b6?crop=entropy&cs=srgb&fm=jpg&q=85"
                  alt="College students in a lecture hall"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/40 to-transparent" />
                <div className="absolute bottom-0 p-7">
                  <Tag>Social Impact &amp; Future Scope</Tag>
                  <p className="mt-3 font-display text-2xl font-light italic leading-snug text-white md:text-3xl">
                    Financial confidence for every stage of student life.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-6 space-y-3">
              {IMPACT.map((it, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <div data-testid={`impact-point-${i}`} className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface-1 p-5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                    <p className="text-sm leading-relaxed text-white/85">{it}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15}>
              <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
                What's next <span className="text-mint">· growing with student needs</span>
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {FUTURE.map((f, i) => (
                  <div
                    key={f.label}
                    data-testid={`future-${i}`}
                    className="rounded-2xl border border-dashed border-line bg-surface-1/50 p-5 transition-colors hover:border-mint/60"
                  >
                    <f.icon size={18} className="text-mint" />
                    <p className="mt-3 text-sm font-medium leading-snug text-white/85">{f.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

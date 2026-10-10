import { Check, X } from "lucide-react";
import { Reveal, Tag } from "./anim";

const ROWS = [
  ["Focus", "Time-consuming and error-prone", "Generic categories for everyone", "Tailored budgets for college students"],
  ["Experience", "Spreadsheets and scattered notes", "Simple tracking with limited features", "Smart and effortless expense tracking"],
  ["Insights", "No real insights, just raw data", "No personalized advice", "AI-driven insights and personalized guidance"],
  ["Made for students", "Not built for student life", "No group splitting or student-specific tools", "Built for student life with shared expenses"],
];

export default function Comparison() {
  return (
    <section id="compare" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <Tag>What Makes Us Different?</Tag>
          <h2 className="mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-6xl">
            Not another tracker.{" "}
            <em className="font-display font-light italic text-mint">Built for student life.</em>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 overflow-x-auto" data-testid="comparison-table">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-[1fr_1.1fr_1.1fr_1.3fr] gap-px overflow-hidden rounded-2xl border border-line bg-line">
                <div className="bg-surface-1 p-5" />
                <div className="bg-surface-1 p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">Manual Tracking</p>
                </div>
                <div className="bg-surface-1 p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">Basic Trackers</p>
                </div>
                <div className="relative bg-surface-2 p-5">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-mint shadow-[0_0_16px_rgba(0,229,153,0.7)]" />
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-mint">PennyWise</p>
                </div>

                {ROWS.map(([label, a, b, c], i) => (
                  <div key={i} className="contents">
                    <div className="flex items-center bg-surface-1 p-5">
                      <p className="font-heading text-sm font-semibold text-white">{label}</p>
                    </div>
                    <div className="flex items-start gap-2.5 bg-surface-1 p-5">
                      <X size={14} className="mt-0.5 shrink-0 text-alert/70" />
                      <p className="text-sm leading-relaxed text-mist">{a}</p>
                    </div>
                    <div className="flex items-start gap-2.5 bg-surface-1 p-5">
                      <X size={14} className="mt-0.5 shrink-0 text-alert/70" />
                      <p className="text-sm leading-relaxed text-mist">{b}</p>
                    </div>
                    <div className="flex items-start gap-2.5 bg-surface-2 p-5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-mint/15">
                        <Check size={12} className="text-mint" />
                      </span>
                      <p className="text-sm font-medium leading-relaxed text-white">{c}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

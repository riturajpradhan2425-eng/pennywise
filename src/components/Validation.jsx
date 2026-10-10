import { motion } from "framer-motion";
import { Reveal, Tag, CountUp, EASE } from "./anim";

const TRACKS = [
  ["Manually in notes", 34],
  ["Mental tracking", 26],
  ["Excel / spreadsheets", 19],
  ["Budgeting apps", 13],
  ["Other", 8],
];

const ASKED = [
  "Monthly budget amount",
  "How they track spending",
  "Frequency of unexpected expenses",
  "Biggest budgeting challenges",
];

const QUOTES = [
  { q: "I never know where my money actually goes.", a: "2nd year student" },
  { q: "Unexpected expenses always throw me off.", a: "3rd year student" },
  { q: "Tracking feels tedious, so I usually just guess.", a: "1st year student" },
];

export default function Validation() {
  return (
    <section id="validation" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <Tag>Validate the Problem</Tag>
          <h2 className="mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight text-white md:text-6xl">
            We asked real students{" "}
            <em className="font-display font-light italic text-mint">before building anything.</em>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist md:text-lg">
            We talked to real students to understand their money struggles before building a solution.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-5" delay={0.05}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-surface-1 p-8">
              <p className="font-display text-6xl font-light italic text-mint md:text-7xl">
                <CountUp to={15} />–<CountUp to={30} />
              </p>
              <p className="mt-3 font-heading text-lg font-semibold text-white">
                college students surveyed &amp; interviewed
              </p>
              <div className="mt-8 border-t border-line pt-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">We asked about</p>
                <ul className="mt-4 space-y-3">
                  {ASKED.map((a, i) => (
                    <li key={i} data-testid={`validation-asked-${i}`} className="flex items-center gap-3 text-sm text-white/85">
                      <span className="h-1 w-1 rounded-full bg-mint" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-7" delay={0.1}>
            <div className="h-full rounded-2xl border border-line bg-surface-1/60 p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
                How students track spending <span className="text-mint/70">(demo / illustrative)</span>
              </p>
              <div className="mt-8 space-y-6">
                {TRACKS.map(([label, v], i) => (
                  <div key={label} data-testid={`validation-bar-${i}`}>
                    <div className="mb-2 flex items-baseline justify-between">
                      <p className="text-sm font-medium text-white/85">{label}</p>
                      <p className="font-mono text-lg font-bold text-mint">
                        <CountUp to={v} suffix="%" />
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${v}%` }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.09 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#0a7a56] to-mint"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3 md:mt-8">
          {QUOTES.map((qt, i) => (
            <Reveal key={i} delay={0.07 * i}>
              <figure
                data-testid={`validation-quote-${i}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-surface-1 p-7 transition-colors hover:border-mint/50"
              >
                <blockquote className="font-display text-xl font-light italic leading-snug text-white">
                  "{qt.q}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
                  <span className="h-px w-6 bg-mint/50" /> {qt.a}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

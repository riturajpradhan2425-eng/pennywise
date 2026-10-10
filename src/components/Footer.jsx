import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "./Logo";
import { MintButton } from "./anim";
import { scrollToId } from "../lib/scroll";

const LINES = [
  { t: "Your money.", c: "text-white font-heading font-bold" },
  { t: "Your choices.", c: "text-white font-heading font-bold" },
  { t: "Your future.", c: "text-mint font-display font-light italic" },
];

const LINKS = [
  ["The Problem", "#problem"],
  ["Validation", "#validation"],
  ["Demo", "#demo"],
  ["Budget", "#budget-overview"],
  ["AI Coach", "#ai-coach"],
  ["Receipt Scanner", "#receipt-scanner"],
  ["Smart Budgets", "#smart-budgeting"],
  ["Goals & Bills", "#savings-and-bills"],
  ["Insights & Reports", "#insights-reports"],
  ["Roadmap", "#roadmap"],
];

export default function Footer() {
  const reduce = useReducedMotion();
  return (
    <footer className="relative overflow-hidden border-t border-line pt-24 md:pt-32">
      <div className="absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_100%,rgba(0,229,153,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <h2 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
          {LINES.map((l, i) => (
            <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                className={`block ${l.c}`}
                initial={reduce ? false : { y: "112%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.13 }}
              >
                {l.t}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-12 flex justify-center"
        >
          <MintButton testid="footer-cta-start" onClick={scrollToId("#demo")}>
            Start Tracking
          </MintButton>
        </motion.div>

        <div className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-line py-8 md:flex-row">
          <a href="#top" onClick={scrollToId("#top")} data-testid="footer-logo-link" className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="font-heading text-base font-bold text-white">
              Penny<span className="text-mint">Wise</span>
            </span>
          </a>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {LINKS.map(([label, hash]) => (
              <a
                key={hash}
                href={hash}
                onClick={scrollToId(hash)}
                data-testid={`footer-link-${hash.slice(1)}`}
                className="text-xs font-medium text-mist transition-colors hover:text-mint"
              >
                {label}
              </a>
            ))}
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
            Spend smarter · Save better · Stress less
          </p>
        </div>
      </div>
    </footer>
  );
}

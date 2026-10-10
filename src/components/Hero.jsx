import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { MaskedLines, MintButton, GhostButton, Tag } from "./anim";
import { scrollToId } from "../lib/scroll";

const WAVES =
  "https://images.unsplash.com/photo-1655841439659-0afc60676b70?crop=entropy&cs=srgb&fm=jpg&q=85";

function Chip({ className = "", delay = "0s", children, testid }) {
  return (
    <motion.div
      data-testid={testid}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute hidden xl:block ${className}`}
    >
      <div
        className="animate-float rounded-2xl border border-line bg-surface-1/80 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        style={{ animationDelay: delay }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute -inset-y-16 inset-x-0">
        <img src={WAVES} alt="" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_38%,rgba(0,229,153,0.14),transparent_70%)]" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex justify-center"
        >
          <Tag>PennyWise · Smart Expense Tracker for College Students</Tag>
        </motion.div>

        <h1 className="mx-auto max-w-5xl font-heading text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-7xl lg:text-8xl">
          <MaskedLines
            lineClass="pb-[0.06em] -mb-[0.06em]"
            lines={[
              <span key="l1">
                Spend <em className="font-display font-light italic text-mint">smarter.</em>
              </span>,
              <span key="l2">
                Save <em className="font-display font-light italic text-mint">better.</em>
              </span>,
              <span key="l3">
                Stress <em className="font-display font-light italic text-mint">less.</em>
              </span>,
            ]}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-mist md:text-lg"
        >
          The all-in-one expense tracker built for students — know where your money goes,
          set budgets that stick, and never fear month end again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MintButton testid="hero-cta-start" onClick={scrollToId("#ai-coach")}>
            Ask AI Financial Coach
          </MintButton>
          <GhostButton testid="hero-cta-demo" onClick={scrollToId("#demo")}>
            Try the live demo
          </GhostButton>
        </motion.div>
      </motion.div>

      <Chip testid="hero-chip-balance" className="left-[5%] top-[24%] -rotate-2" delay="0s">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Total Balance</p>
        <p className="mt-1 font-mono text-2xl font-bold text-white">₹12,540</p>
        <p className="mt-0.5 text-xs text-mist">This Month</p>
      </Chip>

      <Chip testid="hero-chip-budget" className="right-[5%] top-[32%] rotate-2" delay="0.9s">
        <div className="flex items-center justify-between gap-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Budget</p>
          <p className="font-mono text-[10px] text-mint">53% used</p>
        </div>
        <p className="mt-1 font-mono text-sm font-bold text-white">₹8,000 left of ₹15,000</p>
        <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-[53%] rounded-full bg-mint" />
        </div>
      </Chip>

      <Chip testid="hero-chip-alert" className="bottom-[16%] left-[9%] rotate-1" delay="1.6s">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-alert" />
          <div>
            <p className="font-heading text-xs font-semibold text-white">Budget Alert</p>
            <p className="mt-0.5 max-w-[220px] text-xs leading-snug text-mist">
              You've used 90% of your Food &amp; Dining budget.
            </p>
          </div>
        </div>
      </Chip>

      <motion.button
        data-testid="hero-scroll-cue"
        onClick={scrollToId("#problem")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-mist transition-colors hover:text-mint"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span animate={reduce ? {} : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown size={16} />
        </motion.span>
      </motion.button>
    </section>
  );
}

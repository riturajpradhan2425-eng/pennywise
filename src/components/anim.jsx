import { motion, useInView, animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const EASE = [0.16, 1, 0.3, 1];

export function Reveal({ children, delay = 0, y = 24, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Tag({ children }) {
  return (
    <span className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-mint">
      <span className="h-px w-8 bg-mint/60" />
      {children}
    </span>
  );
}

export function MintButton({ children, onClick, testid, className = "" }) {
  return (
    <motion.button
      data-testid={testid}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`rounded-full bg-mint px-7 py-3.5 font-heading text-sm font-semibold text-ink shadow-[0_0_32px_rgba(0,229,153,0.35)] transition-shadow hover:shadow-[0_0_56px_rgba(0,229,153,0.6)] ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function GhostButton({ children, onClick, testid, className = "" }) {
  return (
    <motion.button
      data-testid={testid}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`rounded-full border border-line bg-surface-1/60 px-7 py-3.5 font-heading text-sm font-semibold text-white backdrop-blur transition-colors hover:border-mint/60 hover:text-mint ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function CountUp({ to, suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const c = animate(0, to, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  );
}

export function MaskedLines({ lines, className = "", lineClass = "" }) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
          <motion.span
            className={`block will-change-transform ${lineClass}`}
            initial={reduce ? false : { y: "112%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.12 + i * 0.13 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

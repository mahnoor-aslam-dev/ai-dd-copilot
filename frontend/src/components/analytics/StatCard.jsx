import { useEffect, useRef, useState } from 'react';

export default function StatCard({ label, value, suffix = '', delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start;
          const duration = 1000;
          function step(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setDisplay(Math.floor(progress * numericValue * 10) / 10);
            if (progress < 1) requestAnimationFrame(step);
            else setDisplay(numericValue);
          }
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [numericValue]);

  return (
    <div
      ref={ref}
      className="reveal rounded-xl border border-white/[0.06] bg-ink2/50 p-5"
      style={{ animationDelay: `${delay}s` }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim2">{label}</p>
      <p className="mt-2 font-display text-4xl italic text-goldbright">
        {display}{suffix}
      </p>
    </div>
  );
}
import { useEffect, useRef, useState } from 'react';

function useCountUp(target, active) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let val = 0;
    let raf;
    const step = () => {
      val += target / 40;
      if (val < target) { setValue(Math.floor(val)); raf = requestAnimationFrame(step); }
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return value;
}

export default function BentoFeatures() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const pages = useCountUp(48200, inView);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="product" className="relative border-b border-white/[0.08] px-6 py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-indigo-500 opacity-10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <span className="text-[11px] font-mono uppercase tracking-wide text-sky-400">Architecture</span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">One pipeline, four stages</h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <div ref={ref} className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-white/[0.16] hover:bg-white/[0.05] lg:col-span-2 lg:row-span-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" /></svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Document Intelligence</h3>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-zinc-400">
              Extracts and structures contracts, financials, and filings — including scanned or mixed Urdu-English documents. Every page becomes searchable, citable text.
            </p>
            <div className="mt-6 flex items-baseline gap-2 border-t border-white/[0.1] pt-4">
              <span className="font-mono text-2xl font-semibold text-white">{pages.toLocaleString()}</span>
              <span className="text-[12px] text-zinc-400">pages processed this month</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-white/[0.16] hover:bg-white/[0.05]">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
            </div>
            <h3 className="mt-4 font-semibold">Risk Flagging</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">Two-layer detection — rule-based and AI — against Companies Act 2017 patterns.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-white/[0.16] hover:bg-white/[0.05]">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <h3 className="mt-4 font-semibold">Ask Anything</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">Query the case in plain English — every answer cites the exact clause it came from.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-white/[0.16] hover:bg-white/[0.05] sm:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                </div>
                <h3 className="mt-4 font-semibold">Reporting</h3>
                <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-zinc-400">Export a structured summary — flagged clauses, verified items, open questions.</p>
              </div>
              <span className="hidden shrink-0 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-zinc-400 sm:block">1-click export</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
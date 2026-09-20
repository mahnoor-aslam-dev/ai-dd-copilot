import { useState } from 'react';

const questions = [
  { q: 'Non-compete in the lease?', a: 'Section 14.2 restricts operating a competing business within 2km for 12 months post-termination — broader than typical for this sector.', source: 'Lease_Agreement.pdf §14.2' },
  { q: 'Total outstanding liability?', a: 'Across the 3 financial documents, disclosed liabilities total approximately PKR 42.3M, including a PKR 8M contingent liability from a pending tax dispute.', source: 'Financial_Statement_2025.pdf, Note 17' },
];

export default function LiveDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="demo" className="border-t border-white/[0.06] px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-gold">ask it something</p>
        <h2 className="mt-3 text-center font-display text-3xl italic text-parchment">Try a real case, sample documents</h2>

        <div className="mt-9 rounded-2xl border border-white/[0.06] bg-ink2/60">
          <div className="border-b border-white/[0.06] px-5 py-3 font-mono text-[10.5px] text-dim2">3 documents · Textile Co. Acquisition</div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {questions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`rounded-full border px-3.5 py-1.5 font-mono text-[11.5px] transition-colors ${
                    i === selected ? 'border-gold text-goldbright' : 'border-white/[0.08] text-dim hover:text-parchment'
                  }`}
                >
                  {item.q}
                </button>
              ))}
            </div>
            <div className="mt-5 min-h-[110px] rounded-lg border border-white/[0.06] bg-ink/50 p-4">
              {selected === null ? (
                <p className="text-[13px] text-dim">Choose a question above.</p>
              ) : (
                <>
                  <p className="text-[13px] leading-relaxed text-parchment/90">{questions[selected].a}</p>
                  <div className="mt-3 inline-block rounded-full bg-moss/10 px-2.5 py-1 font-mono text-[10px] text-moss">{questions[selected].source}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
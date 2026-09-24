// export default function WorkExcerpt() {
//   return (
//     <section id="work" className="border-t border-white/[0.06] px-6 py-20">
//       <div className="mx-auto max-w-2xl">
//         <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-gold">an excerpt, as Diligent sees it</p>
//         <div className="mt-8 rounded-2xl border border-white/[0.06] bg-ink2/60 p-7 sm:p-9">
//           <p className="font-mono text-[10px] uppercase tracking-wide text-dim2">Lease_Agreement.pdf — clause 14.2</p>
//           <p className="mt-4 font-display text-[19px] italic leading-relaxed text-parchment">
//             "Tenant is restricted from operating a competing business within a two-kilometre radius for twelve months following termination."
//           </p>
//           <div className="mt-5 flex items-start gap-3 rounded-lg border-l-2 border-flag/60 bg-flag/[0.06] py-3 pl-4">
//             <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flag" />
//             <p className="text-[13px] text-dim">Wider than market norm for this sector — worth renegotiating before signing.</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useEffect, useRef, useState } from 'react';

const examples = [
  {
    doc: 'Lease_Agreement.pdf — Clause 14.2',
    quote: '"Tenant is restricted from operating a competing business within a two-kilometre radius for twelve months following termination."',
    flag: 'Wider than market norm for this sector — worth renegotiating before signing.',
    type: 'risk',
  },
  {
    doc: 'Vendor_Supply_Agreement.pdf — Clause 3.2',
    quote: '"This Agreement shall automatically renew for successive one (1) year terms unless notice is given ninety (90) days in advance."',
    flag: 'Auto-renewal clause — confirm the notice window is tracked before it locks in another year.',
    type: 'risk',
  },
  {
    doc: 'Financial_Statement_2025.pdf — Note 17',
    quote: '"A contingent liability of PKR 8,000,000 relating to a pending FBR dispute has not been provisioned for."',
    flag: 'Disclosed and quantified — counsel assesses the risk of an unfavourable outcome as remote.',
    type: 'clean',
  },
  {
    doc: 'Board_Resolution.pdf — Section 4',
    quote: '"Director Asad Rahman holds a 12% shareholding in the counterparty and has declared his interest."',
    flag: 'Related-party conflict properly disclosed and the director abstained from the vote.',
    type: 'clean',
  },
];

function ClauseCard({ example, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const isRisk = example.type === 'risk';

  return (
    <div ref={ref} className="relative pl-10 sm:pl-14">
      {/* Timeline dot */}
      <span
        className={`absolute left-[11px] top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 transition-all duration-500 sm:left-[15px] ${
          visible ? (isRisk ? 'border-flag bg-flag scale-100' : 'border-moss bg-moss scale-100') : 'scale-0 border-white/20'
        }`}
      />

      <div
        className={`rounded-2xl border border-white/[0.06] bg-ink2/60 p-6 transition-all duration-700 sm:p-7 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
        style={{ transitionDelay: visible ? `${index * 60}ms` : '0ms' }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-dim2">{example.doc}</p>
          <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${isRisk ? 'bg-flag/10 text-flag' : 'bg-moss/10 text-moss'}`}>
            {isRisk ? 'Flagged' : 'Verified'}
          </span>
        </div>
        <p className="mt-3 font-display text-[16px] font-bold leading-relaxed text-parchment sm:text-[18px]">
          {example.quote}
        </p>
        <div
          className={`mt-4 flex items-start gap-3 rounded-lg border-l-2 py-3 pl-4 ${
            isRisk ? 'border-flag/60 bg-flag/[0.06]' : 'border-moss/60 bg-moss/[0.06]'
          }`}
        >
          <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${isRisk ? 'bg-flag' : 'bg-moss'}`} />
          <p className="text-[13px] text-dim">{example.flag}</p>
        </div>
      </div>
    </div>
  );
}

export default function WorkExcerpt() {
  return (
    <section id="work" className="border-t border-white/[0.06] px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-gold">an excerpt, as Diligent sees it</p>
        <h2 className="mx-auto mt-3 max-w-md text-center font-display text-2xl font-bold text-parchment sm:text-3xl">
          Every clause, checked. <span className="grad-text">Every risk, explained.</span>
        </h2>

        <div className="relative mt-14">
          {/* Vertical timeline line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gradient-to-b from-goldbright/40 via-white/[0.08] to-gold/40 sm:left-[21px]" />

          <div className="space-y-8">
            {examples.map((example, i) => (
              <ClauseCard key={example.doc} example={example} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
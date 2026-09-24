// import { Link } from 'react-router-dom';

// export default function Hero() {
//   return (
//     <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
//       <div className="mx-auto max-w-3xl text-center">
//         <p className="reveal r1 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">an instrument for due diligence</p>
//        <h1 className="reveal r2 mt-6 font-display text-[3.8rem] italic leading-[0.95] text-parchment sm:text-[7.5rem]">
//   Read every clause.<br />Miss nothing.
// </h1>
//         <p className="reveal r3 mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-dim">
//           Diligent studies contracts, filings, and statements the way a senior partner would — patiently, thoroughly, and it shows you exactly where it looked.
//         </p>
//         <div className="reveal r4 mt-10 flex items-center justify-center gap-4">
//           <Link to="/signup" className="rounded-full bg-gold px-6 py-3 font-mono text-[13px] font-medium text-ink transition-transform hover:scale-[1.03]">
//             Begin a Case →
//           </Link>
//           <a href="#demo" className="font-mono text-[13px] text-dim underline decoration-dim/30 underline-offset-4 hover:text-parchment transition-colors">
//             Watch it Read
//           </a>
//         </div>
//       </div>

//       <div className="reveal r5 relative mx-auto mt-20 flex max-w-4xl justify-center">
//         <div className="relative">
//           <div className="glow-pulse pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-20 blur-[90px]" />

//           <div className="seal-in relative flex h-40 w-40 items-center justify-center rounded-full border-2 border-gold/70 sm:h-48 sm:w-48">
//             <div className="flex h-[86%] w-[86%] items-center justify-center rounded-full border border-dashed border-gold/40">
//               <div className="text-center">
//                 <p className="font-display text-4xl italic text-goldbright sm:text-5xl">82%</p>
//                 <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-dim">reviewed</p>
//               </div>
//             </div>
//           </div>

//           <div className="reveal r6 absolute -right-4 -top-2 rounded-lg border border-flag/40 bg-flag/10 px-3 py-1.5 sm:-right-16">
//             <p className="font-mono text-[10px] uppercase tracking-wide text-flag">2 flagged</p>
//           </div>
//           <div className="reveal r6 absolute -bottom-2 -left-4 rounded-lg border border-moss/40 bg-moss/10 px-3 py-1.5 sm:-left-16" style={{ animationDelay: '.8s' }}>
//             <p className="font-mono text-[10px] uppercase tracking-wide text-moss">6 verified</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-28 pt-20 text-center sm:pt-28">
      <div className="reveal r1 mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] text-dim">
        <span className="h-1.5 w-1.5 rounded-full bg-moss" />
        Trusted by deal teams across Pakistan
      </div>

      <h1 className="reveal r2 mx-auto mt-8 max-w-3xl font-display text-[2.6rem] font-black leading-[1.05] tracking-tight sm:text-[4.2rem]">
        Due diligence<br />
        <span className="grad-text">without the guesswork</span>
      </h1>

      <p className="reveal r3 mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-dim">
        Diligent reads every contract, flags what's risky, and answers your questions with the receipts to back it up. No more late nights re-reading clause 14.2.
      </p>

      <div className="reveal r4 mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/signup"
          className="rounded-full bg-gradient-to-r from-goldbright to-gold px-7 py-3.5 text-[14px] font-semibold text-ink transition-transform hover:scale-[1.03]"
        >
          Start a case, free
        </Link>
        <a href="#demo" className="rounded-full border border-white/10 px-7 py-3.5 text-[14px] font-medium text-parchment transition-colors hover:bg-white/5">
          Watch it work →
        </a>
      </div>

      {/* Product visual */}
      <div className="reveal r5 relative mx-auto mt-20 max-w-3xl">
        <div className="rounded-2xl border border-white/[0.08] bg-ink2/70 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="rounded-xl border border-white/[0.06] bg-ink3/60 p-6 text-left sm:p-8">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              </div>
              <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-dim2">case #014</span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="grad-text font-display text-2xl font-bold">82%</p>
                <p className="mt-1 text-[11px] text-dim">reviewed</p>
              </div>
              <div className="rounded-lg border border-flag/20 bg-flag/[0.06] p-4">
                <p className="font-display text-2xl font-bold text-flag">2</p>
                <p className="mt-1 text-[11px] text-dim">flags raised</p>
              </div>
              <div className="rounded-lg border border-moss/20 bg-moss/[0.06] p-4">
                <p className="font-display text-2xl font-bold text-moss">6</p>
                <p className="mt-1 text-[11px] text-dim">verified clean</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-wide text-dim2">§14.2 — flagged</p>
              <p className="mt-1.5 text-[13px] text-white/90">Non-compete radius exceeds market terms for this sector.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="reveal r1 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">an instrument for due diligence</p>
       <h1 className="reveal r2 mt-6 font-display text-[3.8rem] italic leading-[0.95] text-parchment sm:text-[7.5rem]">
  Read every clause.<br />Miss nothing.
</h1>
        <p className="reveal r3 mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-dim">
          Diligent studies contracts, filings, and statements the way a senior partner would — patiently, thoroughly, and it shows you exactly where it looked.
        </p>
        <div className="reveal r4 mt-10 flex items-center justify-center gap-4">
          <Link to="/signup" className="rounded-full bg-gold px-6 py-3 font-mono text-[13px] font-medium text-ink transition-transform hover:scale-[1.03]">
            Begin a Case →
          </Link>
          <a href="#demo" className="font-mono text-[13px] text-dim underline decoration-dim/30 underline-offset-4 hover:text-parchment transition-colors">
            Watch it Read
          </a>
        </div>
      </div>

      <div className="reveal r5 relative mx-auto mt-20 flex max-w-4xl justify-center">
        <div className="relative">
          <div className="glow-pulse pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-20 blur-[90px]" />

          <div className="seal-in relative flex h-40 w-40 items-center justify-center rounded-full border-2 border-gold/70 sm:h-48 sm:w-48">
            <div className="flex h-[86%] w-[86%] items-center justify-center rounded-full border border-dashed border-gold/40">
              <div className="text-center">
                <p className="font-display text-4xl italic text-goldbright sm:text-5xl">82%</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-dim">reviewed</p>
              </div>
            </div>
          </div>

          <div className="reveal r6 absolute -right-4 -top-2 rounded-lg border border-flag/40 bg-flag/10 px-3 py-1.5 sm:-right-16">
            <p className="font-mono text-[10px] uppercase tracking-wide text-flag">2 flagged</p>
          </div>
          <div className="reveal r6 absolute -bottom-2 -left-4 rounded-lg border border-moss/40 bg-moss/10 px-3 py-1.5 sm:-left-16" style={{ animationDelay: '.8s' }}>
            <p className="font-mono text-[10px] uppercase tracking-wide text-moss">6 verified</p>
          </div>
        </div>
      </div>
    </section>
  );
}
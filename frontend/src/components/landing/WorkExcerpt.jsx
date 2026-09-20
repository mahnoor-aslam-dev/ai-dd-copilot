export default function WorkExcerpt() {
  return (
    <section id="work" className="border-t border-white/[0.06] px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-gold">an excerpt, as Diligent sees it</p>
        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-ink2/60 p-7 sm:p-9">
          <p className="font-mono text-[10px] uppercase tracking-wide text-dim2">Lease_Agreement.pdf — clause 14.2</p>
          <p className="mt-4 font-display text-[19px] italic leading-relaxed text-parchment">
            "Tenant is restricted from operating a competing business within a two-kilometre radius for twelve months following termination."
          </p>
          <div className="mt-5 flex items-start gap-3 rounded-lg border-l-2 border-flag/60 bg-flag/[0.06] py-3 pl-4">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flag" />
            <p className="text-[13px] text-dim">Wider than market norm for this sector — worth renegotiating before signing.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
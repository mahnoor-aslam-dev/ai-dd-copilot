import DashboardLayout from '../components/DashboardLayout';

const faqs = [
  {
    q: 'What file types can I upload?',
    a: 'Currently PDF and DOCX files, up to 10MB each. We recommend text-based PDFs — scanned images work but may extract less accurately.',
  },
  {
    q: 'How long does processing take?',
    a: 'Most documents finish in 15–60 seconds, depending on length. You\'ll see the status change from Queued → Processing → Ready in real time.',
  },
  {
    q: 'How does "Ask Anything" work?',
    a: 'Your question is matched against the most relevant sections of your uploaded documents, and the AI answers using only that content — with the source cited underneath.',
  },
  {
    q: 'What do the risk flags mean?',
    a: 'High = worth addressing before signing. Moderate = review and understand the implication. Low = informational, rarely a dealbreaker on its own.',
  },
  {
    q: 'Is my data private?',
    a: 'Your documents and cases are only visible to your account. We recommend not uploading anything beyond what\'s needed for the review.',
  },
];

export default function Help() {
  return (
    <DashboardLayout>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">guidance</p>
      <h1 className="mt-2 font-display text-4xl italic text-parchment">Help</h1>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-dim">
        A short guide to getting the most out of Diligent.
      </p>

      {/* How it works */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { step: '01', title: 'Start a case', body: 'Give it a name — one per deal or review.' },
          { step: '02', title: 'Upload documents', body: 'Contracts, financials, filings — PDF or DOCX.' },
          { step: '03', title: 'Review and ask', body: 'Check flagged risks, then ask anything about the case.' },
        ].map((s) => (
          <div key={s.step} className="rounded-xl border border-white/[0.06] bg-ink2/50 p-5">
            <p className="font-mono text-[11px] text-gold">{s.step}</p>
            <p className="mt-2 font-display text-lg italic text-parchment">{s.title}</p>
            <p className="mt-1.5 text-[13px] text-dim">{s.body}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim2">frequently asked</p>
        <div className="mt-4 space-y-2">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-lg border border-white/[0.06] bg-ink2/50 px-4 py-3">
              <summary className="cursor-pointer list-none text-[13.5px] font-medium text-parchment marker:content-none">
                <span className="mr-2 inline-block text-gold transition-transform group-open:rotate-45">+</span>
                {f.q}
              </summary>
              <p className="mt-2 pl-5 text-[13px] leading-relaxed text-dim">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-10 rounded-xl border border-gold/30 bg-gold/[0.05] p-6">
        <p className="font-display text-xl italic text-parchment">Still stuck?</p>
        <p className="mt-2 text-[13.5px] text-dim">Reach out and we'll help you sort it out.</p>
        <a href="mailto:support@diligent.app" className="mt-3 inline-block font-mono text-[12px] text-goldbright underline underline-offset-4">
          support@diligent.app
        </a>
      </div>
    </DashboardLayout>
  );
}
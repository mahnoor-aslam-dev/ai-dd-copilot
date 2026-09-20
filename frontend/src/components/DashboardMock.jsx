import { FileText, ShieldCheck } from 'lucide-react';
import TiltCard from './TiltCard';

export default function DashboardMock() {
  return (
    <div className="relative">
      {/* Glow blobs */}
      <div className="blob pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo/25 blur-3xl" />
      <div className="blob pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/20 blur-3xl" style={{ animationDelay: '-5s' }} />
      <div className="blob pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/15 blur-3xl" style={{ animationDelay: '-9s' }} />

      <TiltCard className="relative w-[340px]" style={{ transformStyle: 'preserve-3d' }}>
        <div className="rounded-2xl border border-border bg-surface/80 p-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-text-dim">Case #014</p>
              <p className="mt-0.5 text-sm font-medium text-text">Textile Co. Acquisition</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/10 px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
              </span>
              <span className="text-[10px] font-medium text-emerald">Live</span>
            </div>
          </div>

          {/* Document rows */}
          <div className="mt-4 space-y-2.5">
            {[
              { name: 'Lease_Agreement.pdf', status: 'flagged' },
              { name: 'Financial_Statement.pdf', status: 'clean' },
              { name: 'Vendor_Supply_Agreement.pdf', status: 'flagged' },
              { name: 'Board_Resolution.pdf', status: 'clean' },
            ].map((doc) => (
              <div key={doc.name} className="flex items-center justify-between rounded-lg bg-surface-raised/60 px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <FileText size={14} className="text-text-dim" />
                  <span className="text-xs text-text">{doc.name}</span>
                </div>
                {doc.status === 'flagged' ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-flag" />
                ) : (
                  <ShieldCheck size={13} className="text-emerald" />
                )}
              </div>
            ))}
          </div>

          {/* Progress ring */}
          <div className="mt-5 flex items-center gap-4 border-t border-border pt-4">
            <div className="relative h-14 w-14 shrink-0">
              <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90">
                <defs>
                  <linearGradient id="dash-ring" x1="0" y1="0" x2="56" y2="56">
                    <stop offset="0" stopColor="#22D3EE" />
                    <stop offset="1" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
                <circle
                  cx="28" cy="28" r="24" stroke="url(#dash-ring)" strokeWidth="5" strokeLinecap="round" fill="none"
                  strokeDasharray="150.8" strokeDashoffset="27"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-text">82%</div>
            </div>
            <div>
              <p className="text-xs text-text-dim">2 clauses flagged</p>
              <p className="text-xs text-text-dim">6 verified clean</p>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Floating Q&A chip */}
      <div className="pop-in absolute -bottom-6 -left-10 max-w-[200px] rounded-xl border border-indigo/30 bg-surface px-4 py-3 shadow-2xl" style={{ animationDelay: '0.6s' }}>
        <div className="mb-1 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo" />
          <span className="text-[10px] font-medium uppercase tracking-wide text-indigo">Ask anything</span>
        </div>
        <p className="text-xs leading-snug text-text">"Any pending litigation?"</p>
      </div>
    </div>
  );
}
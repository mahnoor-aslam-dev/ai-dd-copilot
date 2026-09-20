import { useState } from 'react';
import { FileSearch, ShieldAlert, MessageSquareText, ScrollText } from 'lucide-react';

const tabs = [
  { id: 'ingest', icon: FileSearch, label: 'Document Intelligence', title: 'Every contract, read in seconds', description: 'Drop in PDFs and Word files — leases, share purchase agreements, financial statements. Diligent extracts and structures the content automatically, even across scanned or mixed Urdu-English documents.', stat: '~4 sec', statLabel: 'per page processed', color: 'cyan' },
  { id: 'risk', icon: ShieldAlert, label: 'Risk Flagging', title: 'Red flags, surfaced automatically', description: 'Missing termination clauses, unusual indemnity terms, gaps against the Companies Act 2017 — Diligent checks every document against known risk patterns.', stat: '2 layers', statLabel: 'rule-based + AI review', color: 'flag' },
  { id: 'qa', icon: MessageSquareText, label: 'Ask Anything', title: 'Query the entire case, not one file', description: '"Is there pending litigation against this vendor?" Ask in plain English and get an answer sourced directly from your documents — with the exact clause cited.', stat: '100%', statLabel: 'answers cited to source', color: 'indigo' },
  { id: 'report', icon: ScrollText, label: 'Reporting', title: 'Compliance reporting, one click away', description: 'When the review is done, export a structured summary — flagged clauses, verified items, and open questions — ready for your deal team.', stat: '1 click', statLabel: 'to export a case summary', color: 'emerald' },
];

export default function Features() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active);

  return (
    <section id="product" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-lg">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">What it does</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">One workspace for the whole review</h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                    isActive ? 'border-indigo/50 bg-indigo/10 text-text' : 'border-border text-text-dim hover:border-text-dim/40 hover:text-text hover:-translate-y-0.5'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-indigo' : ''} />
                  <span className="whitespace-nowrap text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-sm sm:p-10">
            <h3 className="font-display text-2xl font-semibold text-text sm:text-3xl">{current.title}</h3>
            <p className="mt-4 max-w-lg text-text-dim">{current.description}</p>
            <div className="mt-8 inline-flex items-baseline gap-2 border-t border-border pt-6">
              <span className={`font-display text-3xl font-semibold text-${current.color}`}>{current.stat}</span>
              <span className="text-sm text-text-dim">{current.statLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
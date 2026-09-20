import { useState } from 'react';

const allDocs = [
  { name: 'Lease_Agreement.pdf', type: 'Lease', status: 'flagged', pages: 12, scanned: '2 min ago' },
  { name: 'Financial_Statement_2025.pdf', type: 'Financial', status: 'clean', pages: 34, scanned: '5 min ago' },
  { name: 'Vendor_Supply_Agreement.pdf', type: 'Contract', status: 'flagged', pages: 8, scanned: '6 min ago' },
  { name: 'Board_Resolution.pdf', type: 'Corporate', status: 'clean', pages: 3, scanned: '8 min ago' },
];

export default function DocumentTable() {
  const [filter, setFilter] = useState('all');
  const counts = { all: allDocs.length, flagged: allDocs.filter(d => d.status === 'flagged').length, clean: allDocs.filter(d => d.status === 'clean').length };
  const tabs = [['all', 'All'], ['flagged', 'Flagged'], ['clean', 'Verified']];
  const filtered = filter === 'all' ? allDocs : allDocs.filter(d => d.status === filter);

  return (
    <section id="pipeline" className="border-b border-white/[0.08] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wide text-sky-400">Live case</span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Textile Co. Acquisition — Case #014</h2>
          </div>
          <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  filter === key ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {label} <span className="font-mono text-[11px] opacity-60">{counts[key]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.08]">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] uppercase tracking-wide text-zinc-400">
                <th className="px-4 py-3 font-medium">Document</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Pages</th>
                <th className="px-4 py-3 font-medium">Last scanned</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.name} className="border-b border-white/[0.08] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{d.type}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] ${d.status === 'flagged' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-400">{d.pages}</td>
                  <td className="px-4 py-3 font-mono text-zinc-400">{d.scanned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
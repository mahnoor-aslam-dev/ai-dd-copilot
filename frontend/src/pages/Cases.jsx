import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCases } from '../api/cases';
import { getAnalytics } from '../api/analytics';
import DashboardLayout from '../components/DashboardLayout';

const SORT_OPTIONS = [
  { key: 'recent', label: 'Most Recent' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'name', label: 'Name (A–Z)' },
  { key: 'flags', label: 'Most Flagged' },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [summaryMap, setSummaryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    Promise.all([getCases(), getAnalytics()])
      .then(([casesRes, analyticsRes]) => {
        setCases(casesRes.data);
        const map = {};
        analyticsRes.data.casesSummary.forEach((c) => { map[c.id] = c; });
        setSummaryMap(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalDocs = Object.values(summaryMap).reduce((sum, c) => sum + Number(c.total_docs), 0);
  const totalFlags = Object.values(summaryMap).reduce((sum, c) => sum + Number(c.total_flags), 0);

  const filteredCases = useMemo(() => {
    let list = cases.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
    switch (sortBy) {
      case 'oldest':
        list = [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'name':
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'flags':
        list = [...list].sort((a, b) => (Number(summaryMap[b.id]?.total_flags) || 0) - (Number(summaryMap[a.id]?.total_flags) || 0));
        break;
      default: // recent
        list = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return list;
  }, [cases, search, sortBy, summaryMap]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-[13px] text-dim">Loading cases…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="reveal r1 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">overview</p>
          <h1 className="reveal r2 mt-2 font-display text-5xl italic text-parchment">Your Cases</h1>
          <p className="reveal r3 mt-2 max-w-md text-[13.5px] text-dim">
            {cases.length === 0
              ? 'Nothing here yet — start your first case below.'
              : `${cases.length} case${cases.length === 1 ? '' : 's'} · ${totalDocs} document${totalDocs === 1 ? '' : 's'} · ${totalFlags} flag${totalFlags === 1 ? '' : 's'} raised`}
          </p>
        </div>
        <Link
          to="/cases/new"
          className="reveal r2 rounded-full border border-gold/50 bg-gold/10 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-goldbright transition-colors hover:bg-gold/20"
        >
          + New Case
        </Link>
      </div>

      {/* Search + sort controls */}
      {cases.length > 0 && (
        <div className="reveal mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: '.15s' }}>
          <div className="relative flex-1 min-w-[200px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dim2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cases by name…"
              className="w-full rounded-full border border-white/[0.08] bg-ink2/60 py-2.5 pl-10 pr-4 text-[13px] text-parchment placeholder:text-dim2 focus:border-gold focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-1 rounded-full border border-white/[0.06] p-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-wide transition-colors ${
                  sortBy === opt.key ? 'bg-gold text-ink' : 'text-dim hover:text-parchment'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {cases.length === 0 ? (
        <div className="reveal mt-10 rounded-2xl border border-dashed border-white/[0.1] px-6 py-20 text-center" style={{ animationDelay: '.2s' }}>
          <p className="font-display text-3xl italic text-parchment">No cases yet</p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] text-dim">
            A case holds everything for one review — contracts, filings, and the questions you ask about them.
          </p>
          <Link to="/cases/new" className="mt-6 inline-block rounded-full bg-gold px-6 py-2.5 font-mono text-[12px] font-bold uppercase tracking-wide text-ink">
            + Begin your first case
          </Link>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="reveal mt-10 rounded-2xl border border-dashed border-white/[0.1] px-6 py-16 text-center" style={{ animationDelay: '.2s' }}>
          <p className="text-[13px] text-dim">No cases match "{search}".</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((c, i) => {
            const summary = summaryMap[c.id] || { total_docs: 0, ready_docs: 0, total_flags: 0 };
            const total = Number(summary.total_docs);
            const ready = Number(summary.ready_docs);
            const flags = Number(summary.total_flags);
            const pct = total > 0 ? Math.round((ready / total) * 100) : 0;
            const circumference = 2 * Math.PI * 22;
            const offset = circumference - (pct / 100) * circumference;

            return (
              <Link
                key={c.id}
                to={`/cases/${c.id}`}
                className="reveal group flex flex-col rounded-2xl border border-white/[0.06] bg-ink2/50 p-5 transition-all hover:-translate-y-0.5 hover:border-gold/30 hover:bg-ink2/80"
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-dim2">#{String(c.id).padStart(3, '0')}</p>
                    <p className="mt-1 truncate font-display text-2xl italic text-parchment group-hover:text-goldbright transition-colors">
                      {c.title}
                    </p>
                  </div>
                  <div className="relative h-12 w-12 shrink-0">
                    <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
                      <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
                      <circle
                        cx="24" cy="24" r="22" stroke="#7A9B76" strokeWidth="4" fill="none"
                        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[9.5px] text-parchment">{pct}%</div>
                  </div>
                </div>

                {c.description && (
                  <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-dim">{c.description}</p>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3.5 mt-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10.5px] text-dim">
                      {total} doc{total === 1 ? '' : 's'}
                    </span>
                    {flags > 0 && (
                      <span className="flex items-center gap-1 font-mono text-[10.5px] text-flag">
                        <span className="h-1.5 w-1.5 rounded-full bg-flag" /> {flags} flagged
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-dim2">{timeAgo(c.created_at)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../api/analytics';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/analytics/StatCard';
import SeverityDonut from '../components/analytics/SeverityDonut';
import StatusBars from '../components/analytics/StatusBars';
import ActivityTimeline from '../components/analytics/ActivityTimeline';

const RANGE_OPTIONS = [
  { key: '7', label: '7 days' },
  { key: '30', label: '30 days' },
  { key: 'all', label: 'All time' },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const statusColor = {
  uploaded: 'text-dim2',
  processing: 'text-goldbright',
  processed: 'text-moss',
  failed: 'text-flag',
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [range, setRange] = useState('30');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  function loadAnalytics() {
    setLoading(true);
    setLoadError(false);
    getAnalytics()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }

  const cutoffDate = useMemo(() => {
    if (range === 'all') return null;
    const d = new Date();
    d.setDate(d.getDate() - Number(range));
    return d;
  }, [range]);

  const filteredActivity = useMemo(() => {
    if (!data) return [];
    return data.recentActivity
      .filter((a) => !cutoffDate || new Date(a.created_at) >= cutoffDate)
      .filter((a) => {
        const q = search.toLowerCase();
        return !q || a.filename.toLowerCase().includes(q) || a.case_title.toLowerCase().includes(q);
      });
  }, [data, cutoffDate, search]);

  const filteredTimelineDays = range === '7' ? 7 : 30;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-[13px] text-dim">Loading analytics…</div>
      </DashboardLayout>
    );
  }

  if (loadError || !data) {
    return (
      <DashboardLayout>
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
          <p className="text-[13px] text-dim">Couldn't load analytics — is the server running?</p>
          <button
            onClick={loadAnalytics}
            className="rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 font-mono text-[11.5px] text-goldbright hover:bg-gold/20 transition-colors"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const severityCounts = { high: 0, moderate: 0, low: 0 };
  data.flagsBySeverity.forEach((row) => {
    severityCounts[row.severity] = Number(row.count);
  });

  const maxFlagType = Math.max(...data.flagsByType.map((f) => Number(f.count)), 1);

  return (
    <DashboardLayout>
      {/* Header + range filter */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="reveal r1 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">insight</p>
          <h1 className="reveal r2 mt-2 font-display text-5xl italic text-parchment">Analytics</h1>
          <p className="reveal r3 mt-2 max-w-md text-[13.5px] text-dim">
            A summary of every case, document, and flag across your account.
          </p>
        </div>
        <div className="reveal r2 flex gap-1 rounded-full border border-white/[0.06] p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setRange(opt.key)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11.5px] transition-colors ${
                range === opt.key ? 'bg-gold text-ink' : 'text-dim hover:text-parchment'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total cases" value={data.totalCases} delay={0.05} />
        <StatCard label="Documents processed" value={data.totalDocuments} delay={0.12} />
        <StatCard label="Flags raised" value={data.totalFlags} delay={0.19} />
        <StatCard label="Avg flags / case" value={data.avgFlagsPerCase} delay={0.26} />
      </div>

      {/* Donut + status bars */}
      <div className="reveal mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2" style={{ animationDelay: '.3s' }}>
        <div className="rounded-xl border border-white/[0.06] bg-ink2/50 p-6">
          <p className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim2">risk severity</p>
          {data.totalFlags === 0 ? (
            <p className="py-10 text-center text-[13px] text-dim">No flags raised yet.</p>
          ) : (
            <SeverityDonut high={severityCounts.high} moderate={severityCounts.moderate} low={severityCounts.low} />
          )}
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-ink2/50 p-6">
          <p className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim2">document pipeline</p>
          {data.totalDocuments === 0 ? (
            <p className="py-10 text-center text-[13px] text-dim">No documents uploaded yet.</p>
          ) : (
            <StatusBars data={data.documentsByStatus} />
          )}
        </div>
      </div>

      {/* Timeline + top risk patterns */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="reveal rounded-xl border border-white/[0.06] bg-ink2/50 p-6" style={{ animationDelay: '.36s' }}>
          <p className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim2">
            cases created — last {filteredTimelineDays} days
          </p>
          <ActivityTimeline data={data.casesTimeline} days={filteredTimelineDays} />
        </div>

        <div className="reveal rounded-xl border border-white/[0.06] bg-ink2/50 p-6" style={{ animationDelay: '.42s' }}>
          <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim2">top risk patterns</p>
          {data.flagsByType.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-dim">Nothing flagged yet.</p>
          ) : (
            <div className="space-y-3">
              {data.flagsByType.map((f) => (
                <div key={f.flag_type}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="truncate font-mono text-[11px] text-dim">{f.flag_type.replace(/_/g, ' ')}</span>
                    <span className="font-mono text-[11px] text-parchment">{f.count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gold transition-all duration-700"
                      style={{ width: `${(f.count / maxFlagType) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Case health grid */}
      <div className="reveal mt-6" style={{ animationDelay: '.48s' }}>
        <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim2">case health</p>
        {data.casesSummary.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.1] p-10 text-center">
            <p className="text-[13px] text-dim">No cases yet — start one to see its health here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.casesSummary.map((c) => {
              const total = Number(c.total_docs);
              const ready = Number(c.ready_docs);
              const pct = total > 0 ? Math.round((ready / total) * 100) : 0;
              const circumference = 2 * Math.PI * 26;
              const offset = circumference - (pct / 100) * circumference;
              return (
                <Link
                  key={c.id}
                  to={`/cases/${c.id}`}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-ink2/50 p-4 transition-colors hover:bg-ink2/80"
                >
                  <div className="relative h-16 w-16 shrink-0">
                    <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
                      <circle
                        cx="32" cy="32" r="26" stroke="#E8A93B" strokeWidth="5" fill="none"
                        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-parchment">{pct}%</div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg italic text-parchment">{c.title}</p>
                    <p className="mt-0.5 font-mono text-[10.5px] text-dim2">
                      {total} doc{total === 1 ? '' : 's'} · {c.total_flags} flag{Number(c.total_flags) === 1 ? '' : 's'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent activity feed with search */}
      <div className="reveal mt-6" style={{ animationDelay: '.54s' }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim2">recent activity</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search by file or case…"
            className="rounded-full border border-white/[0.08] bg-ink px-4 py-1.5 font-mono text-[11.5px] text-parchment placeholder:text-dim2 focus:border-gold focus:outline-none transition-colors"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          {filteredActivity.length === 0 ? (
            <p className="p-8 text-center text-[13px] text-dim">No activity matches this filter.</p>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {filteredActivity.map((a) => (
                <Link
                  key={a.id}
                  to={`/cases/${a.case_id}`}
                  className="flex items-center justify-between gap-4 bg-ink2/30 px-5 py-3 transition-colors hover:bg-ink2/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-parchment">{a.filename}</p>
                    <p className="mt-0.5 truncate font-mono text-[10.5px] text-dim2">{a.case_title}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`font-mono text-[10.5px] ${statusColor[a.upload_status] || 'text-dim'}`}>
                      {a.upload_status}
                    </span>
                    <span className="font-mono text-[10.5px] text-dim2">{timeAgo(a.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
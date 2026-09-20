import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCases } from '../api/cases';
import { getAnalytics } from '../api/analytics';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Overview() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCases(), getAnalytics()])
      .then(([casesRes, analyticsRes]) => {
        setCases(casesRes.data);
        setAnalytics(analyticsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  const totalDocs = analytics?.totalDocuments || 0;
  const readyDocs = analytics?.casesSummary?.reduce((sum, c) => sum + Number(c.ready_docs), 0) || 0;
  const inProgressDocs = totalDocs - readyDocs;
  const donutTotal = totalDocs || 1;
  const readyPct = (readyDocs / donutTotal) * 100;
  const circumference = 2 * Math.PI * 60;

  const quickActions = [
    { to: '/cases/new', label: 'New Case', icon: 'plus' },
    { to: cases[0] ? `/cases/${cases[0].id}` : '/cases/new', label: 'Upload Document', icon: 'upload' },
    { to: '/cases', label: 'All Cases', icon: 'folder' },
    { to: '/rules', label: 'Rules', icon: 'shield' },
  ];

  const icons = {
    plus: <path d="M12 5v14M5 12h14" />,
    upload: <><path d="M12 13v8M8.5 16.5 12 13l3.5 3.5" /><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" /></>,
    folder: <path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
    shield: <path d="M12 2 4 5v6c0 5.5 3.5 9.5 8 11 4.5-1.5 8-5.5 8-11V5z" />,
  };

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div>
        <p className="reveal r1 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">welcome back</p>
        <h1 className="reveal r2 mt-2 font-display text-5xl italic text-parchment">Hello, {firstName}!</h1>
        <p className="reveal r3 mt-2 max-w-lg text-[13.5px] text-dim">
          {loading
            ? 'Loading your workspace…'
            : cases.length === 0
            ? 'You have no cases yet — start your first one below.'
            : `You have ${cases.length} case${cases.length === 1 ? '' : 's'} on record, ${totalDocs} document${totalDocs === 1 ? '' : 's'} reviewed.`}
        </p>
      </div>

      {/* Quick actions row */}
      <div className="reveal mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4" style={{ animationDelay: '.15s' }}>
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="group flex flex-col items-center gap-2.5 rounded-xl border border-white/[0.06] bg-ink2/50 px-4 py-6 text-center transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-ink2/80"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors group-hover:bg-gold/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {icons[action.icon]}
              </svg>
            </span>
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-parchment">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Progress ring + recent uploads */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
        {/* Review progress donut */}
        <div className="reveal rounded-xl border border-white/[0.06] bg-ink2/50 p-6" style={{ animationDelay: '.25s' }}>
          <p className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim2">Review Progress</p>
          <div className="flex flex-col items-center">
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                <circle cx="70" cy="70" r="60" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
                <circle
                  cx="70" cy="70" r="60" stroke="#7A9B76" strokeWidth="12" fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (readyPct / 100) * circumference}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl italic text-parchment">{Math.round(readyPct)}%</span>
                <span className="font-mono text-[9px] uppercase tracking-wide text-dim2">ready</span>
              </div>
            </div>
            <div className="mt-5 w-full space-y-2">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="h-2 w-2 rounded-full bg-moss" /><span className="text-dim">Ready</span>
                <span className="ml-auto font-mono text-parchment">{readyDocs}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="h-2 w-2 rounded-full bg-gold" /><span className="text-dim">In progress</span>
                <span className="ml-auto font-mono text-parchment">{inProgressDocs}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="h-2 w-2 rounded-full bg-flag" /><span className="text-dim">Flags raised</span>
                <span className="ml-auto font-mono text-parchment">{analytics?.totalFlags || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent uploads */}
        <div className="reveal rounded-xl border border-white/[0.06] bg-ink2/50 p-6" style={{ animationDelay: '.3s' }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim2">Recent Uploads</p>
            <Link to="/analytics" className="font-mono text-[10.5px] text-gold hover:underline">view all →</Link>
          </div>

          {loading ? (
            <p className="py-10 text-center text-[13px] text-dim">Loading…</p>
          ) : !analytics || analytics.recentActivity.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/[0.1] py-10 text-center">
              <p className="text-[13px] text-dim">No documents uploaded yet.</p>
              <Link to="/cases/new" className="mt-3 inline-block rounded-full bg-gold px-4 py-1.5 font-mono text-[11px] text-ink">
                + start a case
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {analytics.recentActivity.slice(0, 4).map((doc) => (
                <Link
                  key={doc.id}
                  to={`/cases/${doc.case_id}`}
                  className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-ink/40 p-3.5 transition-colors hover:bg-ink/70"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] text-parchment">{doc.filename}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-dim2">{doc.case_title} · {timeAgo(doc.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status strip */}
      <div className="reveal mt-6 rounded-xl border border-white/[0.06] bg-ink2/50 p-5" style={{ animationDelay: '.4s' }}>
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-moss" />
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-parchment">Workspace status — active</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Cases', value: analytics?.totalCases ?? '—', color: 'text-gold' },
            { label: 'Documents Reviewed', value: totalDocs, color: 'text-moss' },
            { label: 'Flags Raised', value: analytics?.totalFlags ?? '—', color: 'text-flag' },
            { label: 'Answers Cited', value: '100%', color: 'text-goldbright' },
          ].map((tile) => (
            <div key={tile.label} className="rounded-lg bg-ink/50 px-3 py-3 text-center">
              <p className={`font-display text-xl italic ${tile.color}`}>{tile.value}</p>
              <p className="mt-1 font-mono text-[9.5px] uppercase tracking-wide text-dim2">{tile.label}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
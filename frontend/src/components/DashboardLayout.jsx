import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCases } from '../api/cases';
import AmbientAtmosphere from './AmbientAtmosphere';
import Logo from './Logo';

const navItems = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/cases', label: 'All Cases' },
  { to: '/rules', label: 'Rules' },
  { to: '/help', label: 'Help' },
];

export default function DashboardLayout({ children }) {
  const { user, logoutUser } = useAuth();
  const { id: activeCaseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCases(); }, []);

  async function loadCases() {
    try {
      const res = await getCases();
      setCases(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSignOut() {
    logoutUser();
    navigate('/');
  }

  return (
    <div className="relative min-h-screen bg-ink">
      <AmbientAtmosphere />
      <div className="relative z-10">
        <header className="border-b border-white/[0.06] bg-ink/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <Link to="/dashboard"><Logo /></Link>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-dim">{user?.name}</span>
              <button
                onClick={handleSignOut}
                className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-dim hover:text-goldbright transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl">
          <aside className="hidden w-64 shrink-0 border-r border-white/[0.06] px-3 py-6 lg:block">
            <Link
              to="/cases/new"
              className="mb-6 block w-full rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-goldbright transition-colors hover:bg-gold/20"
            >
              + New Case
            </Link>

            {/* Primary nav */}
            <nav className="mb-6 space-y-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block rounded-lg px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                      isActive ? 'bg-gold/10 text-goldbright' : 'text-dim hover:bg-ink2/60 hover:text-parchment'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mb-2 h-px bg-white/[0.06]" />

            <p className="mb-2 mt-4 px-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-dim2">Recent Cases</p>
            <div className="space-y-1">
              {loading ? (
                <p className="px-2 text-[13px] text-dim">Loading…</p>
              ) : cases.length === 0 ? (
                <p className="px-2 text-[13px] text-dim">No cases yet</p>
              ) : (
                cases.slice(0, 6).map((c) => {
                  const isActive = String(c.id) === activeCaseId;
                  return (
                    <Link
                      key={c.id}
                      to={`/cases/${c.id}`}
                      className={`block rounded-lg border-l-2 px-3 py-2.5 transition-colors ${
                        isActive ? 'border-gold bg-gold/[0.06]' : 'border-transparent hover:bg-ink2/60'
                      }`}
                    >
                      <p className={`truncate text-[13px] ${isActive ? 'text-parchment' : 'text-dim'}`}>{c.title}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-dim2">#{String(c.id).padStart(3, '0')}</p>
                    </Link>
                  );
                })
              )}
            </div>
          </aside>

          <main className="flex-1 px-6 py-6 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
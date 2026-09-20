import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    logoutUser();
    navigate('/');
  }

  return (
    <header className="relative z-20 border-b border-white/[0.06] bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/"><Logo /></Link>

        {!user ? (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              <a href="#work" className="font-mono text-[12px] text-dim hover:text-parchment transition-colors">The Work</a>
              <a href="#demo" className="font-mono text-[12px] text-dim hover:text-parchment transition-colors">Demo</a>
            </nav>
            <div className="hidden items-center gap-5 md:flex">
              <Link to="/login" className="font-mono text-[12px] text-dim hover:text-parchment transition-colors">Sign In</Link>
              <Link
                to="/signup"
                className="rounded-full border border-gold/60 bg-gold/10 px-4 py-1.5 font-mono text-[12px] text-goldbright transition-colors hover:bg-gold/20"
              >
                Begin a Case
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="font-mono text-[12px] text-dim">{user.name}</span>
            <button onClick={handleSignOut} className="font-mono text-[12px] text-dim hover:text-parchment transition-colors">
              sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, signup } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import AmbientAtmosphere from '../components/AmbientAtmosphere';
import Logo from '../components/Logo';

export default function Auth() {
  const location = useLocation();
  const [mode, setMode] = useState(location.pathname === '/signup' ? 'signup' : 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  function switchMode(m) {
    setMode(m);
    setError('');
    setName(''); setEmail(''); setPassword('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (mode === 'signup' && !name.trim()) return setError('Full name is required.');

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await signup(name, email, password);
        switchMode('signin');
      } else {
        const res = await login(email, password);
        loginUser(res.data.user, res.data.token);
        navigate('/cases');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-ink">
      <AmbientAtmosphere />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <Link to="/" className="mx-auto"><Logo /></Link>

        <p className="reveal r1 mt-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-gold">welcome</p>
        <h1 className="reveal r2 mt-3 text-center font-display text-6xl italic text-parchment">
          {mode === 'signin' ? 'Sign in' : 'Begin a case'}
        </h1>
        <p className="reveal r3 mt-2 text-center text-[13px] text-dim">
          {mode === 'signin' ? 'Pick up your review where you left off.' : 'Create an account to start your first case.'}
        </p>

        <form onSubmit={handleSubmit} className="reveal r4 mt-9 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-wide text-dim2">Full name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-white/[0.08] bg-transparent py-2.5 text-[14px] text-parchment placeholder:text-dim2 focus:border-gold focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-wide text-dim2">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-white/[0.08] bg-transparent py-2.5 text-[14px] text-parchment placeholder:text-dim2 focus:border-gold focus:outline-none transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-wide text-dim2">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-white/[0.08] bg-transparent py-2.5 text-[14px] text-parchment placeholder:text-dim2 focus:border-gold focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="rounded-lg border border-flag/30 bg-flag/10 px-3.5 py-2.5 text-[13px] text-flag">{error}</p>}

          <button
            type="submit" disabled={isSubmitting}
            className="w-full rounded-full bg-gold py-3 font-mono text-[13px] font-medium text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {isSubmitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="reveal r5 mt-7 text-center font-mono text-[12px] text-dim">
          {mode === 'signin' ? (
            <>No account? <button type="button" onClick={() => switchMode('signup')} className="text-gold underline underline-offset-4">Begin one</button></>
          ) : (
            <>Already have an account? <button type="button" onClick={() => switchMode('signin')} className="text-gold underline underline-offset-4">Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
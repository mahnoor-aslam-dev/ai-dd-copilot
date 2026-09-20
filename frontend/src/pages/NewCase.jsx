import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCase } from '../api/cases';
import DashboardLayout from '../components/DashboardLayout';

export default function NewCase() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('Case title is required.');

    setIsSubmitting(true);
    try {
      const res = await createCase(title, description);
      navigate(`/cases/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create case.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg">
        <p className="reveal r1 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">new case</p>
        <h1 className="reveal r2 mt-2 font-display text-5xl italic text-parchment">Begin a case</h1>
        <p className="reveal r3 mt-3 text-[13.5px] text-dim">
          Give it a name — you'll upload documents next.
        </p>

        <form onSubmit={handleSubmit} className="reveal r4 mt-9 space-y-6">
          <div>
            <label className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-wide text-dim2">Case title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-white/[0.08] bg-transparent py-2.5 text-[15px] text-parchment placeholder:text-dim2 focus:border-gold focus:outline-none transition-colors"
              placeholder="e.g. Textile Co. Acquisition"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-wide text-dim2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none border-b border-white/[0.08] bg-transparent py-2.5 text-[14px] text-parchment placeholder:text-dim2 focus:border-gold focus:outline-none transition-colors"
              placeholder="What is this due diligence review for?"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-flag/30 bg-flag/10 px-3.5 py-2.5 text-[13px] text-flag">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-gold px-6 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {isSubmitting ? 'Creating…' : 'Create Case'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="font-mono text-[12px] uppercase tracking-[0.1em] text-dim hover:text-parchment transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
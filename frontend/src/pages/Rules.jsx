import { useEffect, useState } from 'react';
import { getRules } from '../api/rules';
import DashboardLayout from '../components/DashboardLayout';

const severityBorder = {
  high: 'border-flag/60 bg-flag/[0.05]',
  moderate: 'border-gold/60 bg-gold/[0.05]',
  low: 'border-moss/60 bg-moss/[0.05]',
};

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRules()
      .then((res) => setRules(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">reference</p>
      <h1 className="mt-2 font-display text-4xl italic text-parchment">What Diligent checks for</h1>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-dim">
        Every document is checked against these rule-based patterns, plus a separate AI review that catches
        unusual or context-specific risks these rules don't cover.
      </p>

      <div className="mt-8">
        {loading ? (
          <p className="text-[13px] text-dim">Loading…</p>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className={`rounded-lg border-l-2 py-3 pl-4 pr-4 ${severityBorder[rule.severity] || severityBorder.low}`}>
                <span className="font-mono text-[10px] uppercase tracking-wide text-dim">{rule.severity} risk</span>
                <p className="mt-1 text-[13.5px] text-parchment/90">{rule.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 rounded-xl border border-white/[0.06] bg-ink2/50 p-6">
        <p className="font-display text-xl italic text-parchment">Beyond the rules</p>
        <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-dim">
          Diligent also runs an AI-based review on every document to catch risks that don't match a fixed
          pattern — unusual payment terms, one-sided penalties, or vague obligations. These appear in your
          case's Risk Flags tab labeled as AI-detected, alongside the rule-based flags above.
        </p>
      </div>
    </DashboardLayout>
  );
}
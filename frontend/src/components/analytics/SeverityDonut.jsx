export default function SeverityDonut({ high = 0, moderate = 0, low = 0 }) {
  const total = high + moderate + low;
  const r = 70;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { value: high, color: '#C4544A', label: 'High' },
    { value: moderate, color: '#E8A93B', label: 'Moderate' },
    { value: low, color: '#7A9B76', label: 'Low' },
  ];

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="14" fill="none" />
          {total === 0
            ? null
            : segments.map((seg, i) => {
                if (seg.value === 0) return null;
                const fraction = seg.value / total;
                const dash = fraction * circumference;
                const offset = -((cumulative / total) * circumference);
                cumulative += seg.value;
                return (
                  <circle
                    key={seg.label}
                    cx="80" cy="80" r={r}
                    stroke={seg.color}
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                );
              })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl italic text-parchment">{total}</span>
          <span className="font-mono text-[9px] uppercase tracking-wide text-dim2">flags total</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="w-20 text-[13px] text-dim">{seg.label}</span>
            <span className="font-mono text-[12px] text-parchment">{seg.value}</span>
            <span className="font-mono text-[11px] text-dim2">
              {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
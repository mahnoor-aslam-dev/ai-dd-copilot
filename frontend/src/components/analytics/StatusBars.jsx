const statusMeta = {
  uploaded: { label: 'Queued', color: '#8A7A6F' },
  processing: { label: 'Processing', color: '#E8A93B' },
  processed: { label: 'Ready', color: '#7A9B76' },
  failed: { label: 'Failed', color: '#C4544A' },
};

export default function StatusBars({ data = [] }) {
  const total = data.reduce((sum, d) => sum + Number(d.count), 0);

  return (
    <div className="space-y-4">
      {Object.keys(statusMeta).map((key) => {
        const entry = data.find((d) => d.upload_status === key);
        const count = entry ? Number(entry.count) : 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        const meta = statusMeta[key];
        return (
          <div key={key}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[11px] text-dim">{meta.label}</span>
              <span className="font-mono text-[11px] text-parchment">{count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: meta.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default function ActivityTimeline({ data = [], days = 30 }) {
  const today = new Date();
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const match = data.find((row) => row.day.slice(0, 10) === key);
    buckets.push({ date: key, count: match ? Number(match.count) : 0 });
  }

  const max = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="flex h-32 items-end gap-[3px]">
      {buckets.map((b, i) => (
        <div
          key={b.date}
          className="reveal flex-1 rounded-t-sm bg-gold/70 transition-all hover:bg-goldbright"
          style={{
            height: `${Math.max((b.count / max) * 100, 3)}%`,
            animationDelay: `${i * 0.015}s`,
          }}
          title={`${b.date}: ${b.count} case${b.count === 1 ? '' : 's'}`}
        />
      ))}
    </div>
  );
}
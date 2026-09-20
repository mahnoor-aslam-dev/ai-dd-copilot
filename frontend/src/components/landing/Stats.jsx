export default function Stats() {
  const stats = [
    { value: '10×', label: 'faster than manual review' },
    { value: '39+', label: 'risk patterns checked' },
    { value: '100%', label: 'answers cited to source' },
  ];
  return (
    <section className="border-t border-white/[0.06] px-6 py-16">
      <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-white/[0.06] text-center">
        {stats.map((s) => (
          <div key={s.label} className="px-4">
            <p className="font-display text-3xl italic text-goldbright">{s.value}</p>
            <p className="mt-1 font-mono text-[10.5px] text-dim">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
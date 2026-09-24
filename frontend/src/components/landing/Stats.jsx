// export default function Stats() {
//   const stats = [
//     { value: '10×', label: 'faster than manual review' },
//     { value: '39+', label: 'risk patterns checked' },
//     { value: '100%', label: 'answers cited to source' },
//   ];
//   return (
//     <section className="border-t border-white/[0.06] px-6 py-16">
//       <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-white/[0.06] text-center">
//         {stats.map((s) => (
//           <div key={s.label} className="px-4">
//             <p className="font-display text-3xl italic text-goldbright">{s.value}</p>
//             <p className="mt-1 font-mono text-[10.5px] text-dim">{s.label}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
import { useEffect, useRef, useState } from 'react';

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start;
    let raf;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function StatItem({ target, suffix, label, delay }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const value = useCountUp(target, active);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setActive(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref}>
      <p className="grad-text font-display text-3xl font-black sm:text-4xl">
        {value}{suffix}
      </p>
      <p className="mt-1 text-[11px] text-dim">{label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="border-t border-white/[0.06] px-6 py-16">
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-8 text-center">
        <StatItem target={10} suffix="×" label="faster than manual review" delay={0} />
        <StatItem target={39} suffix="+" label="risk patterns checked" delay={100} />
        <StatItem target={100} suffix="%" label="answers cited to source" delay={200} />
      </div>
    </section>
  );
}
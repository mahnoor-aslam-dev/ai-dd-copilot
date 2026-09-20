export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.05) 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      <div className="absolute -left-32 -top-40 h-[520px] w-[520px] animate-[drift1_18s_ease-in-out_infinite] rounded-full bg-indigo-600 opacity-[0.16] blur-[110px]" />
      <div className="absolute -right-24 top-1/4 h-[480px] w-[480px] animate-[drift2_22s_ease-in-out_infinite] rounded-full bg-cyan-500 opacity-[0.14] blur-[110px]" />
      <div className="absolute bottom-[-160px] left-1/3 h-[460px] w-[460px] animate-[drift3_20s_ease-in-out_infinite] rounded-full bg-emerald-500 opacity-[0.10] blur-[110px]" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 90% 60% at 50% 0%, transparent 40%, #000000 100%)' }}
      />
    </div>
  );
}
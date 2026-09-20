export default function AmbientAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="grain absolute inset-0" />
      <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gold opacity-[0.07] blur-[140px]" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 100% 70% at 50% 0%, transparent 30%, #010102 100%)' }}
      />
    </div>
  );
}
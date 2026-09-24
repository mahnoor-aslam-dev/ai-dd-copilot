// export default function AmbientAtmosphere() {
//   return (
//     <div className="pointer-events-none fixed inset-0 z-0">
//       <div className="grain absolute inset-0" />
//       <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gold opacity-[0.07] blur-[140px]" />
//       <div
//         className="absolute inset-0"
//         style={{ background: 'radial-gradient(ellipse 100% 70% at 50% 0%, transparent 30%, #010102 100%)' }}
//       />
//     </div>
//   );
// }

export default function AmbientAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="grid-fade absolute inset-0" />
      <div className="glow1 absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-goldbright opacity-[0.10] blur-[130px]" />
      <div className="glow2 absolute right-1/4 top-20 h-[450px] w-[450px] rounded-full bg-gold opacity-[0.10] blur-[130px]" />
    </div>
  );
}
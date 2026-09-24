// export default function Logo() {
//   return (
//     <div className="flex items-center gap-2.5">
//       <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/50 text-gold">
//         <span className="font-display text-[15px] italic">D</span>
//       </span>
//       <span className="font-display text-[19px] italic text-parchment">Diligent</span>
//     </div>
//   );
// }

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-goldbright to-gold">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0C" strokeWidth="3">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="font-display text-[15px] font-bold tracking-tight text-parchment">Diligent</span>
    </div>
  );
}
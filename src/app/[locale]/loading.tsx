export default function Loading() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-10 h-10">
          <span className="absolute inset-0 rounded-full border border-gold/20" />
          <span className="absolute inset-0 rounded-full border-t-2 border-gold-bright animate-spin" />
          <span className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-gold-bright animate-pulse" />
        </div>
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ivory/50">
          Loading
        </span>
      </div>
    </div>
  );
}

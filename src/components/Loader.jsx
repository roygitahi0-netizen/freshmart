export default function Loader({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-market-green">
      <div className="w-9 h-9 border-2 border-market-green/20 border-t-market-green rounded-full animate-spin" />
      <p className="text-sm font-mono uppercase tracking-widest text-market-green/60">{label}</p>
    </div>
  );
}

export default function PublicLoading() {
  return <div className="min-h-screen bg-[#050914] px-5 py-16 text-slate-50" aria-busy="true" aria-label="Đang tải CV">
    <div className="mx-auto max-w-6xl space-y-8"><div className="h-10 w-48 animate-pulse rounded-full bg-white/10" /><div className="h-24 max-w-3xl animate-pulse rounded-3xl bg-white/10" /><div className="grid gap-5 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-56 animate-pulse rounded-3xl bg-white/5" />)}</div></div>
  </div>;
}

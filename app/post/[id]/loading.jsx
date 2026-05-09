export default function LoadingSharedPost() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top,#f2fffd_0%,#eff8ff_40%,#ffffff_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl animate-pulse space-y-6">
        <div className="h-4 w-32 rounded-full bg-slate-200" />
        <div className="rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded-full bg-slate-200" />
              <div className="h-3 w-28 rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-[92%] rounded-full bg-slate-100" />
            <div className="h-4 w-[76%] rounded-full bg-slate-100" />
          </div>
          <div className="mt-6 h-72 rounded-[1.75rem] bg-slate-200" />
        </div>
      </div>
    </main>
  );
}

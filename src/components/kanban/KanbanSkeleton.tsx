export function KanbanSkeleton() {
  return (
    <div className="flex h-fit min-w-[272px] max-w-[272px] flex-col rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="px-4 py-3">
        <div className="animate-pulse">
          <div className="h-4 w-28 rounded bg-zinc-200" />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-3 pb-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-zinc-100 bg-white p-3"
          >
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-zinc-200" />
              <div className="h-4 w-full rounded bg-zinc-200" />
              <div className="h-4 w-3/4 rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
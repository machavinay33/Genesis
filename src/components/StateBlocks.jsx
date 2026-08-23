export function LoadingBlock({ label = 'Loading data' }) {
  return (
    <div className="flex items-center gap-3 py-16 text-steel">
      <span className="h-2 w-2 animate-ping rounded-full bg-genesis" />
      <span className="font-mono text-xs uppercase tracking-widest2">{label}…</span>
    </div>
  )
}

export function ErrorBlock({ message = 'Could not load this data.' }) {
  return (
    <div className="border border-genesis/30 bg-genesis/5 px-5 py-4 text-sm text-genesis-glow">
      <p className="font-mono text-xs uppercase tracking-widest2 text-genesis">Connection error</p>
      <p className="mt-2 text-bone/80">{message}</p>
      <p className="mt-1 text-steel">
        If you just deployed this site, confirm the Supabase schema has been run and your environment
        variables are set.
      </p>
    </div>
  )
}

export function EmptyBlock({ message = 'Nothing here yet.' }) {
  return (
    <div className="border hairline border-dashed px-5 py-10 text-center">
      <p className="font-mono text-xs uppercase tracking-widest2 text-steel2">{message}</p>
    </div>
  )
}

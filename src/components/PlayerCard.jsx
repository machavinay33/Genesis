function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PlayerCard({ player }) {
  return (
    <div className="group border hairline bg-char/60 p-5 transition-colors hover:border-genesis/50">
      <div className="hud-frame mx-auto aspect-square w-full max-w-[220px] overflow-hidden bg-char2">
        <span className="hud-tr" />
        <span className="hud-bl" />
        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={player.full_name || player.ign}
            className="h-full w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-steel2">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
            <span className="font-mono text-[10px] uppercase tracking-widest2">Photo pending</span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="font-display text-3xl uppercase leading-none tracking-wide text-bone">
          {player.ign}
        </p>
        <p className="mt-1 text-sm text-steel">{player.full_name}</p>

        <div className="mt-4 flex items-center justify-between border-t hairline pt-3 font-mono text-[11px] uppercase tracking-wide text-steel2">
          <span>{player.role || 'Roster'}</span>
          <span>Joined {formatDate(player.join_date)}</span>
        </div>
      </div>
    </div>
  )
}

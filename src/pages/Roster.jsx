import { useEffect, useState } from 'react'
import { getTeamInfo, listActivePlayers } from '../lib/data'
import SectionHeading from '../components/SectionHeading.jsx'
import PlayerCard from '../components/PlayerCard.jsx'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '../components/StateBlocks.jsx'

export default function Roster() {
  const [players, setPlayers] = useState([])
  const [team, setTeam] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    Promise.all([listActivePlayers(), getTeamInfo()])
      .then(([p, t]) => {
        if (!alive) return
        setPlayers(p)
        setTeam(t)
        setStatus('ready')
      })
      .catch((e) => {
        console.error(e)
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <SectionHeading
        eyebrow="Active Squad"
        title="Player Roster"
        description="Current players competing for Genesis Esports in BGMI. Each callsign links to a portrait once uploaded from the admin panel."
      />

      {/* Reserved space for a full squad photo — set from Admin ▸ Team Info ▸ Squad photo */}
      <div className="hud-frame mb-14 flex min-h-[220px] w-full items-center justify-center border border-dashed hairline bg-char/40 md:min-h-[340px]">
        <span className="hud-tr" />
        <span className="hud-bl" />
        {team?.squad_photo_url ? (
          <img src={team.squad_photo_url} alt="Genesis Esports full squad" className="h-full w-full object-cover" />
        ) : (
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest2 text-steel2">Squad photo reserved</p>
            <p className="mt-1 text-sm text-steel">Upload the full team photo from Admin → Team Info</p>
          </div>
        )}
      </div>

      {status === 'loading' && <LoadingBlock label="Loading roster" />}
      {status === 'error' && <ErrorBlock />}
      {status === 'ready' && players.length === 0 && <EmptyBlock message="No active players listed yet." />}
      {status === 'ready' && players.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {players.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      )}
    </div>
  )
}

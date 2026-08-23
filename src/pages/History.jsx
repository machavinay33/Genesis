import { useEffect, useState } from 'react'
import { listAll, listFormerPlayers, TABLES } from '../lib/data'
import { formatDate } from '../lib/format'
import SectionHeading from '../components/SectionHeading.jsx'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '../components/StateBlocks.jsx'

export default function History() {
  const [timeline, setTimeline] = useState([])
  const [former, setFormer] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    Promise.all([listAll(TABLES.timeline, 'event_date'), listFormerPlayers()])
      .then(([tl, fp]) => {
        if (!alive) return
        setTimeline(tl)
        setFormer(fp)
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

  if (status === 'loading') return <div className="mx-auto max-w-7xl px-5 py-16 md:px-8"><LoadingBlock label="Loading timeline" /></div>
  if (status === 'error') return <div className="mx-auto max-w-7xl px-5 py-16 md:px-8"><ErrorBlock /></div>

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <SectionHeading
        eyebrow="Roster Log"
        title="Recorded Timeline"
        description="Every logged roster and staff change since the organization was founded."
      />

      {timeline.length === 0 ? (
        <EmptyBlock message="No timeline events logged yet." />
      ) : (
        <ol className="mb-20 border-l hairline">
          {timeline.map((ev) => (
            <li key={ev.id} className="relative pb-8 pl-8 last:pb-0">
              <span className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-genesis" />
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-genesis">{formatDate(ev.event_date)}</p>
              <p className="mt-1 text-sm leading-relaxed text-bone/85">{ev.description}</p>
            </li>
          ))}
        </ol>
      )}

      <SectionHeading eyebrow="Alumni" title="Former Players" />
      {former.length === 0 ? (
        <EmptyBlock message="No former players logged yet." />
      ) : (
        <div className="overflow-x-auto border hairline">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b hairline bg-char2 font-mono text-[11px] uppercase tracking-widest2 text-steel">
                <th className="px-4 py-3">Player ID</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Period with Genesis</th>
                <th className="px-4 py-3">Next Team / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-bone/85">
              {former.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-bone">{p.ign}</td>
                  <td className="px-4 py-3">{p.full_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-steel">
                    {formatDate(p.join_date)} – {formatDate(p.leave_date)}
                  </td>
                  <td className="px-4 py-3">{p.next_team_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

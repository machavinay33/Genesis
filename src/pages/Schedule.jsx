import { useEffect, useState } from 'react'
import { listAll, TABLES } from '../lib/data'
import { formatDate, tierLabel } from '../lib/format'
import SectionHeading from '../components/SectionHeading.jsx'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '../components/StateBlocks.jsx'

export default function Schedule() {
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    listAll(TABLES.upcoming, 'start_date')
      .then((rows) => {
        if (!alive) return
        setEvents(rows)
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

  if (status === 'loading') return <div className="mx-auto max-w-7xl px-5 py-16 md:px-8"><LoadingBlock label="Loading schedule" /></div>
  if (status === 'error') return <div className="mx-auto max-w-7xl px-5 py-16 md:px-8"><ErrorBlock /></div>

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <SectionHeading
        eyebrow="Next Up"
        title="Upcoming Schedule"
        description="Tournaments and scrim blocks Genesis Esports is currently listed for."
      />

      {events.length === 0 ? (
        <EmptyBlock message="No upcoming tournaments listed yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {events.map((e) => (
            <div key={e.id} className="border hairline bg-char/50 p-6">
              <p className="eyebrow mb-2">{tierLabel(e.tier)}</p>
              <p className="font-display text-3xl uppercase leading-tight text-bone">{e.name}</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest2 text-genesis">
                {formatDate(e.start_date)}
                {e.end_date ? ` – ${formatDate(e.end_date)}` : ''}
              </p>
              {e.notes && <p className="mt-3 text-sm leading-relaxed text-steel">{e.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

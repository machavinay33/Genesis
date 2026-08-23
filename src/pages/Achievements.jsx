import { useEffect, useState } from 'react'
import { listAll, TABLES } from '../lib/data'
import { formatUSD, formatDate, tierLabel } from '../lib/format'
import SectionHeading from '../components/SectionHeading.jsx'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '../components/StateBlocks.jsx'

export default function Achievements() {
  const [placements, setPlacements] = useState([])
  const [results, setResults] = useState([])
  const [awards, setAwards] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    Promise.all([
      listAll(TABLES.placements, 'order_index'),
      listAll(TABLES.achievements, 'date', false),
      listAll(TABLES.awards, 'date', false),
    ])
      .then(([pl, res, aw]) => {
        if (!alive) return
        setPlacements(pl)
        setResults(res)
        setAwards(aw)
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

  if (status === 'loading') return <div className="mx-auto max-w-7xl px-5 py-16 md:px-8"><LoadingBlock label="Loading results" /></div>
  if (status === 'error') return <div className="mx-auto max-w-7xl px-5 py-16 md:px-8"><ErrorBlock /></div>

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <SectionHeading
        eyebrow="Scoreboard"
        title="Tournament Results"
        description="Placement summary across event tiers, notable tournament finishes, and individual MVP awards."
      />

      {/* Placement summary */}
      <div className="mb-16 overflow-x-auto border hairline">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b hairline bg-char2 font-mono text-[11px] uppercase tracking-widest2 text-steel">
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">1st</th>
              <th className="px-4 py-3">2nd</th>
              <th className="px-4 py-3">3rd</th>
              <th className="px-4 py-3">Top 3</th>
              <th className="px-4 py-3">Results</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {placements.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6"><EmptyBlock message="No placement data yet." /></td></tr>
            )}
            {placements.map((row) => (
              <tr key={row.id} className={row.tier === 'Total' ? 'bg-genesis/5 font-semibold text-genesis' : 'text-bone/85'}>
                <td className="px-4 py-3">{row.tier}</td>
                <td className="stat-tick px-4 py-3">{row.first}</td>
                <td className="stat-tick px-4 py-3">{row.second}</td>
                <td className="stat-tick px-4 py-3">{row.third}</td>
                <td className="stat-tick px-4 py-3">{row.top3}</td>
                <td className="stat-tick px-4 py-3">{row.results}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notable results */}
      <SectionHeading eyebrow="Match Log" title="Notable Placements" />
      {results.length === 0 ? (
        <EmptyBlock message="No tournament results logged yet." />
      ) : (
        <div className="mb-16 divide-y divide-line border-y hairline">
          {results.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="text-sm text-bone">{r.tournament}</p>
                <p className="font-mono text-[11px] uppercase tracking-widest2 text-steel2">
                  {formatDate(r.date)} · {tierLabel(r.tier)}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span className="stat-tick text-lg text-genesis">{r.place}</span>
                <span className="stat-tick text-sm text-steel">{formatUSD(r.prize)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Individual awards */}
      <SectionHeading eyebrow="Standouts" title="Individual Awards" />
      {awards.length === 0 ? (
        <EmptyBlock message="No individual awards logged yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((a) => (
            <div key={a.id} className="border hairline bg-char/50 p-5">
              <p className="eyebrow mb-2">{a.award}</p>
              <p className="font-display text-3xl uppercase text-bone">{a.player}</p>
              <p className="mt-1 text-sm text-steel">{a.tournament}</p>
              <div className="mt-4 flex items-center justify-between border-t hairline pt-3 font-mono text-[11px] uppercase tracking-wide text-steel2">
                <span>{formatDate(a.date)}</span>
                <span className="text-genesis">{formatUSD(a.prize)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeamInfo, listActivePlayers, listAll, TABLES } from '../lib/data'
import { formatUSD, formatDate, tierLabel } from '../lib/format'
import SectionHeading from '../components/SectionHeading.jsx'
import StatStrip from '../components/StatStrip.jsx'
import PlayerCard from '../components/PlayerCard.jsx'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '../components/StateBlocks.jsx'
import logo from '../assets/genesis-logo.png'

export default function Home() {
  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])
  const [totals, setTotals] = useState(null)
  const [recent, setRecent] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const [t, p, placements, ach] = await Promise.all([
          getTeamInfo(),
          listActivePlayers(),
          listAll(TABLES.placements, 'order_index'),
          listAll(TABLES.achievements, 'date', false),
        ])
        if (!alive) return
        setTeam(t)
        setPlayers(p.slice(0, 5))
        setTotals(placements.find((row) => row.tier === 'Total') || null)
        setRecent(ach.slice(0, 4))
        setStatus('ready')
      } catch (e) {
        console.error(e)
        if (alive) setStatus('error')
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [])

  const foundedYear = team?.created_date ? new Date(team.created_date).getFullYear() : '2023'

  const stats = [
    { label: 'Total Winnings', value: team ? formatUSD(team.total_winnings) : '—' },
    { label: 'Top-3 Finishes', value: totals ? totals.top3 : '—' },
    { label: 'Results Logged', value: totals ? totals.results : '—' },
    { label: 'Founded', value: foundedYear },
  ]

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b hairline bg-void">
        <div className="absolute inset-0 bg-grid-fade bg-grid opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]" />
        <div className="absolute inset-0 bg-hero-glow" />
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-16 w-[420px] opacity-[0.07] md:w-[560px]"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
          <p className="eyebrow mb-5">India · Asia Region · PUBG Mobile / BGMI</p>
          <h1 className="font-display text-7xl uppercase leading-[0.86] tracking-wide text-bone sm:text-8xl md:text-9xl">
            Genesis
            <br />
            <span className="text-genesis text-outline">Esports</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-steel md:text-lg">
            {team?.hero_tagline ||
              'A competitive BGMI roster built on rotations, discipline and end-zone control. Every drop is a decision.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/roster"
              className="border border-genesis bg-genesis px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-void transition-colors hover:bg-genesis-glow"
            >
              View Roster
            </Link>
            <Link
              to="/achievements"
              className="border hairline px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-bone transition-colors hover:border-genesis hover:text-genesis"
            >
              Tournament Results
            </Link>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-14 md:px-8">
          {status === 'loading' && <LoadingBlock label="Pulling live team stats" />}
          {status === 'error' && <ErrorBlock message="Could not reach Supabase for team stats." />}
          {status === 'ready' && <StatStrip stats={stats} />}
        </div>
      </section>

      {/* ROSTER PREVIEW */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Active Squad"
            title="Current Roster"
            description="The five players currently competing under the Genesis banner."
          />
          <Link to="/roster" className="mb-10 font-mono text-xs uppercase tracking-widest2 text-genesis hover:text-genesis-glow">
            Full roster →
          </Link>
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
      </section>

      {/* RECENT RESULTS */}
      <section className="border-t hairline bg-char/40">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading
            eyebrow="Scoreboard"
            title="Recent Results"
            description="Latest logged tournament placements, most recent first."
          />

          {status === 'loading' && <LoadingBlock label="Loading results" />}
          {status === 'error' && <ErrorBlock />}
          {status === 'ready' && recent.length === 0 && <EmptyBlock message="No results logged yet." />}
          {status === 'ready' && recent.length > 0 && (
            <div className="divide-y divide-line border-y hairline">
              {recent.map((r) => (
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
        </div>
      </section>
    </div>
  )
}

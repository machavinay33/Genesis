import { Link } from 'react-router-dom'

const CARDS = [
  { to: '/admin/team-info', title: 'Team Info', desc: 'Name, location, winnings, squad photo, social link.' },
  { to: '/admin/roster', title: 'Roster & Former Players', desc: 'Active players, photos, and alumni history.' },
  { to: '/admin/staff', title: 'Organization Staff', desc: 'Manager, CEO, COO and other staff records.' },
  { to: '/admin/placements', title: 'Placement Summary', desc: 'Win counts per event tier (A/B/C/Total).' },
  { to: '/admin/achievements', title: 'Tournament Results', desc: 'Notable placements with prize amounts.' },
  { to: '/admin/awards', title: 'Individual Awards', desc: 'MVP and other player-level awards.' },
  { to: '/admin/timeline', title: 'Recorded Timeline', desc: 'Dated log of roster and staff changes.' },
  { to: '/admin/upcoming', title: 'Upcoming Schedule', desc: 'Tournaments the team is currently listed for.' },
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink">Dashboard</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/60">
        Everything shown on the public Genesis Esports site is edited from here. Changes go live immediately.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="border border-ink/10 bg-white p-5 transition-colors hover:border-genesis">
            <p className="font-display text-2xl uppercase text-ink">{c.title}</p>
            <p className="mt-1 text-sm text-ink/60">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

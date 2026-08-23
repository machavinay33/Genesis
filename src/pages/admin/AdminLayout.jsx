import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import logo from '../../assets/genesis-logo.png'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/team-info', label: 'Team Info' },
  { to: '/admin/roster', label: 'Roster & Former Players' },
  { to: '/admin/staff', label: 'Organization Staff' },
  { to: '/admin/placements', label: 'Placement Summary' },
  { to: '/admin/achievements', label: 'Tournament Results' },
  { to: '/admin/awards', label: 'Individual Awards' },
  { to: '/admin/timeline', label: 'Recorded Timeline' },
  { to: '/admin/upcoming', label: 'Upcoming Schedule' },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `block border-l-2 px-4 py-2.5 text-sm transition-colors ${
      isActive ? 'border-genesis bg-genesis/10 text-ink font-semibold' : 'border-transparent text-ink/60 hover:bg-ink/5'
    }`

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <button className="mr-1 text-xl lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">≡</button>
          <img src={logo} alt="" className="h-8 w-auto" />
          <span className="font-display text-xl uppercase tracking-wide">
            Genesis <span className="text-genesis">Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" target="_blank" className="text-xs font-semibold uppercase tracking-wide text-ink/60 hover:text-genesis">
            View live site ↗
          </Link>
          <button
            onClick={signOut}
            className="border border-ink/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-genesis hover:text-genesis"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className={`w-64 shrink-0 border-r border-ink/10 bg-white py-6 lg:block ${open ? 'block' : 'hidden'}`}>
          <nav>
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

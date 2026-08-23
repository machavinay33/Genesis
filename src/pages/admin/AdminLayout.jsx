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
    <div className="min-h-screen w-full overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-40 flex min-h-16 w-full items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            className="mr-0.5 shrink-0 p-1 text-xl leading-none lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle admin menu"
            aria-expanded={open}
            aria-controls="admin-navigation"
          >
            {open ? '×' : '≡'}
          </button>
          <img src={logo} alt="" className="h-8 w-auto shrink-0" />
          <span className="truncate font-display text-lg uppercase tracking-wide sm:text-xl">
            Genesis <span className="text-genesis">Admin</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link to="/" target="_blank" className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-ink/60 hover:text-genesis sm:text-xs">
            View live site ↗
          </Link>
          <button
            onClick={signOut}
            className="whitespace-nowrap border border-ink/20 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide hover:border-genesis hover:text-genesis sm:px-3 sm:text-xs"
          >
            Sign out
          </button>
        </div>
      </header>

      {open && <button className="fixed inset-x-0 bottom-0 top-16 z-20 bg-ink/20 lg:hidden" onClick={() => setOpen(false)} aria-label="Close admin menu" />}

      <div className="mx-auto flex w-full max-w-7xl">
        <aside
          id="admin-navigation"
          className={`fixed bottom-0 left-0 top-16 z-30 w-72 max-w-[calc(100vw-1rem)] overflow-y-auto border-r border-ink/10 bg-white py-6 shadow-xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:h-auto lg:w-64 lg:max-w-none lg:shrink-0 lg:overflow-visible lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <nav>
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 w-full flex-1 overflow-x-hidden px-4 py-6 sm:px-5 sm:py-8 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

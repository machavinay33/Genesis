import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/genesis-logo.png'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/roster', label: 'Roster' },
  { to: '/achievements', label: 'Results' },
  { to: '/history', label: 'Timeline' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/organization', label: 'Organization' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors ${
      isActive ? 'text-genesis' : 'text-bone/70 hover:text-bone'
    }`

  return (
    <header className="sticky top-0 z-50 border-b hairline bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="Genesis Esports crest" className="h-10 w-auto drop-shadow-[0_0_12px_rgba(255,101,1,0.35)]" />
          <span className="font-display text-2xl leading-none tracking-wide text-bone">
            GENESIS <span className="text-genesis">ESPORTS</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="flex h-9 w-9 items-center justify-center border hairline text-bone md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="font-mono text-lg">{open ? '×' : '≡'}</span>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t hairline bg-void px-5 py-4 md:hidden">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `border-b border-line py-3 text-base ${isActive ? 'text-genesis' : 'text-bone/80'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
